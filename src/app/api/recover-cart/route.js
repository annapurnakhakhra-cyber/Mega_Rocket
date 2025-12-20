// app/api/recover-cart/route.js

import { gql } from "@apollo/client";
import client from "@/lib/shopify-client";

// Simple email validation
const isValidEmail = (email) =>
  typeof email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// GraphQL Query for abandoned checkout
const GET_ABANDONED_CHECKOUT_DETAILS = gql`
  query GetAbandonedCheckout($id: ID!) {
    node(id: $id) {
      ... on AbandonedCheckout {
        id
        createdAt
        abandonedCheckoutUrl
        email
        customer {
          email
          firstName
          lastName
        }
        lineItems(first: 10) {
          edges {
            node {
              id
              title
              quantity
              originalUnitPriceSet {
                shopMoney {
                  amount
                  currencyCode
                }
              }
            }
          }
        }
        totalPriceSet {
          shopMoney {
            amount
            currencyCode
          }
        }
      }
    }
  }
`;

/**
 * Safe helper to build items list lines
 */
function formatItems(edges = [], fallbackCurrency = "INR") {
  if (!Array.isArray(edges)) return [];
  return edges.map((edge) => {
    const item = edge?.node || {};
    const qty = item.quantity ?? 1;
    const price = item.originalUnitPriceSet?.shopMoney?.amount ?? "0";
    const cur = item.originalUnitPriceSet?.shopMoney?.currencyCode ?? fallbackCurrency;
    const title = item.title ?? "Item";
    const priceNum = Number(price) || 0;
    return `- ${title} x ${qty} (${cur} ${priceNum.toFixed(2)})`;
  });
}

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { checkoutId, email: customEmail, subject, message } = body || {};

    if (!checkoutId) {
      return Response.json(
        {
          success: false,
          error: "checkoutId is required in request body.",
          suggestion: 'Example: {"checkoutId":"123456","email":"user@example.com"}',
        },
        { status: 400 }
      );
    }

    // --- Fetch abandoned checkout from Shopify ---
    let checkoutEmail = customEmail && isValidEmail(customEmail) ? customEmail : null;
    let customerName = "Customer";
    let checkoutRecoveryUrl = null;
    let itemsList = [];
    let totalAmount = 0;
    let currency = "INR";

    try {
      const idToSend = checkoutId.startsWith("gid://")
        ? checkoutId
        : `gid://shopify/AbandonedCheckout/${checkoutId}`;

      const { data } = await client.query({
        query: GET_ABANDONED_CHECKOUT_DETAILS,
        variables: { id: idToSend },
        fetchPolicy: "network-only",
      });

      const checkout = data?.node;
      if (!checkout) {
        return Response.json(
          { success: false, error: "Abandoned checkout not found.", suggestion: "Check checkoutId" },
          { status: 404 }
        );
      }

      // derive email if not provided
      if (!checkoutEmail) {
        if (checkout.email && isValidEmail(checkout.email)) {
          checkoutEmail = checkout.email;
        } else if (checkout.customer?.email && isValidEmail(checkout.customer.email)) {
          checkoutEmail = checkout.customer.email;
        }
      }

      // name
      const first = checkout.customer?.firstName ?? "";
      const last = checkout.customer?.lastName ?? "";
      const fullName = `${first} ${last}`.trim();
      customerName = fullName || "Customer";

      checkoutRecoveryUrl = checkout.abandonedCheckoutUrl || null;
      itemsList = formatItems(checkout.lineItems?.edges || [], currency);
      totalAmount = Number(checkout.totalPriceSet?.shopMoney?.amount ?? 0);
      currency = checkout.totalPriceSet?.shopMoney?.currencyCode || currency;
    } catch (shopErr) {
      console.error("Shopify query error:", shopErr);
      // If Shopify query fails we still allow a provided email to proceed.
    }

    // require email now
    if (!checkoutEmail || !isValidEmail(checkoutEmail)) {
      return Response.json(
        {
          success: false,
          error: "No valid email found or provided.",
          suggestion:
            'Provide an "email" in the request body or ensure the abandoned checkout has a valid email in Shopify.',
        },
        { status: 400 }
      );
    }

    // --- Prepare email content ---
    const storeDomain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || "your-store.myshopify.com";
    const finalRecoveryUrl = checkoutRecoveryUrl || `https://${storeDomain}/checkouts/${checkoutId}/recover`;
    const emailSubject = subject || `Complete your purchase — ${customerName}`;
    const emailBody =
      message ||
      `Hi ${customerName},

We noticed you left items in your cart worth ${currency} ${Number(totalAmount || 0).toFixed(2)}:

${itemsList.length ? itemsList.join("\n") : "Your selected items await in your cart."}

Complete your purchase here: ${finalRecoveryUrl}

Thanks,
The Store Team`;

    // --- Setup Nodemailer transport ---
    const nodemailer = await import("nodemailer");

    let transporter;
    let usingTestAccount = false;
    let testPreviewUrl = null;

    const SMTP_USER = process.env.SMTP_USER?.trim();
    const SMTP_PASS = process.env.SMTP_PASS?.trim();
    const SMTP_HOST = process.env.SMTP_HOST?.trim() || "smtp.gmail.com";
    const SMTP_PORT = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 587;
    const SMTP_SECURE = typeof process.env.SMTP_SECURE !== "undefined" ? process.env.SMTP_SECURE === "true" : false;
    const SMTP_SERVICE = process.env.SMTP_SERVICE?.trim(); // optional service name like "gmail"

    if (SMTP_USER && SMTP_PASS) {
      // use real SMTP credentials
      const transportConfig = SMTP_SERVICE
        ? { service: SMTP_SERVICE, auth: { user: SMTP_USER, pass: SMTP_PASS } }
        : {
            host: SMTP_HOST,
            port: SMTP_PORT,
            secure: SMTP_SECURE,
            auth: { user: SMTP_USER, pass: SMTP_PASS },
          };

      transporter = nodemailer.default.createTransport(transportConfig);

      // verify credentials (fail fast with actionable message)
      try {
        await transporter.verify();
      } catch (verifyErr) {
        console.error("SMTP verify error:", verifyErr);
        return Response.json(
          {
            success: false,
            error: `SMTP verification failed: ${verifyErr?.message || String(verifyErr)}`,
            suggestion:
              "Check SMTP_USER and SMTP_PASS, ensure provider allows SMTP. For Gmail, enable 2FA and use an App Password.",
          },
          { status: 500 }
        );
      }
    } else {
      // No SMTP credentials — create a Nodemailer test account (ethereal)
      usingTestAccount = true;
      const testAccount = await nodemailer.default.createTestAccount();
      transporter = nodemailer.default.createTransport({
        host: testAccount.smtp.host,
        port: testAccount.smtp.port,
        secure: testAccount.smtp.secure,
        auth: { user: testAccount.user, pass: testAccount.pass },
      });
    }

    // --- Send email ---
    const mailOptions = {
      from: `"Store Team" <${SMTP_USER || "no-reply@example.com"}>`,
      to: checkoutEmail,
      subject: emailSubject,
      text: emailBody,
      html: emailBody.replace(/\n/g, "<br>"),
    };

    let info;
    try {
      info = await transporter.sendMail(mailOptions);
    } catch (sendErr) {
      console.error("Error sending email:", sendErr);
      return Response.json(
        {
          success: false,
          error: `Failed to send email: ${sendErr?.message || String(sendErr)}`,
          suggestion:
            "If you expected a real email, ensure SMTP_USER and SMTP_PASS are set and correct. For Gmail use App Password.",
        },
        { status: 500 }
      );
    }

    if (usingTestAccount) {
      // generate preview URL for Ethereal
      testPreviewUrl = nodemailer.default.getTestMessageUrl(info) || null;
    }

    // --- Success response ---
    return Response.json({
      success: true,
      message: usingTestAccount
        ? "Email sent via Nodemailer test account (Ethereal). Use previewUrl to view."
        : "Recovery email sent successfully.",
      data: {
        to: checkoutEmail,
        subject: emailSubject,
        recoveryUrl: finalRecoveryUrl,
        total: `${currency} ${Number(totalAmount || 0).toFixed(2)}`,
        itemsCount: itemsList.length,
        messageId: info?.messageId || null,
        previewUrl: testPreviewUrl, // null when real SMTP used
        usingTestAccount,
      },
    });
  } catch (err) {
    console.error("Unhandled recover-cart error:", err);
    return Response.json(
      {
        success: false,
        error: err?.message || String(err),
        suggestion: "Check server logs and ensure Shopify client is configured.",
      },
      { status: 500 }
    );
  }
}
