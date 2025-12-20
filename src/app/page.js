

"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronDown,
  ChevronUp,
  Star,
  Check,
  ArrowRight,
  Play,
  Zap,
  Shield,
  BarChart3,
  Package,
} from "lucide-react";

export default function ShiprocketLanding() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token"); // Adjust 'token' key if your auth token uses a different name (e.g., 'authToken')
    
    if (!token) {
      router.push("/auth/login"); // Redirect to login if no token
    } else {
      setIsAuthenticated(true); // Allow rendering if token exists
    }
    
    setIsLoading(false); // Hide loading after check
  }, [router]);

  // Show loading spinner while checking auth (prevents flash of content)
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  // If not authenticated, component won't render (redirect happens in useEffect)
  if (!isAuthenticated) {
    return null; // Or a fallback UI
  }

  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const features = [
    {
      icon: <Package className="w-8 h-8 text-purple-600" />,
      title: "Personalized checkout",
      description:
        "Align your checkout theme with your brand, configure shipping settings, minimise COD orders & customise prepaid methods to reduce drop-offs.",
    },
    {
      icon: <Shield className="w-8 h-8 text-purple-600" />,
      title: "Pre-Filled Addresses",
      description:
        "Help your customers skip long address forms, ensure high address accuracy & provide a seamless web and mobile experience.",
    },
    {
      icon: <Zap className="w-8 h-8 text-purple-600" />,
      title: "Ultimate Discount Engine",
      description:
        "Smart discount engine to generate over 10,000 unique possibilities and millions of coupon codes",
    },
    {
      icon: <BarChart3 className="w-8 h-8 text-purple-600" />,
      title: "Advanced Analytics",
      description:
        "Access detailed analytics & data insights with an integrated google analytics funnel for comprehensive tracking.",
    },
  ];

  const testimonials = [
    {
      name: "Divya Jain",
      role: "Founder, Jhakas.com",
      avatar: "DJ",
      content:
        "We have seen growth in Prepaid orders, it has increased by around 30%. Address accuracy is 90%. RTO reduced by 25%. The team is very supportive.",
    },
    {
      name: "Nikita Malhotra",
      role: "Co-founder, Winston",
      avatar: "NM",
      content:
        "Conversions increased by 30%. Best address pre-fill rate. RTO down by 20%. Super supportive team.",
    },
    {
      name: "Mihir Mittal",
      role: "Founder, The Hatke",
      avatar: "MM",
      content:
        "Address pre-fill is best in market. RTO down 25%. Conversions increased by 35%. Amazing product.",
    },
  ];

  const faqs = [
    {
      question: "How does Shiprocket Checkout prefill addresses?",
      answer:
        "Shiprocket pre-fills addresses based on 150M+ delivered customer data history.",
    },
    {
      question: "What is the address prefill rate?",
      answer: "Our pre-fill accuracy is 95% based on extensive delivery data.",
    },
    {
      question: "How long does integration take?",
      answer: "Integration takes 24–48 hours with full support.",
    },
    {
      question: "Do I need to change payment gateway?",
      answer:
        "No. Shiprocket Checkout works with your existing payment gateway.",
    },
    {
      question: "Are all payment modes supported?",
      answer:
        "Yes – UPI, COD, Cards, Net Banking, Wallets and all major options.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50">

      {/* HERO SECTION */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight text-gray-900">
                Convert in{" "}
                <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-green-600 bg-clip-text text-transparent">
                  40 Seconds
                </span>
              </h1>
              <p className="text-xl text-gray-600 max-w-lg">
                Conversions made easy, Shopping made fun
              </p>

              <button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition flex items-center space-x-2">
                <span>Get Started</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>

            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-6 transform rotate-3 hover:rotate-0 transition duration-300">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-black font-semibold">Cart details (6 items)</h3>
                    <span className="text-2xl font-bold text-green-600">₹500</span>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="flex items-center space-x-2">
                      <Check className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-green-700">
                        You saved ₹270 with instant discount!
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <Check className="w-4 h-4 text-green-600" />
                      <span>FIRSTBUY applied</span>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Deliver to</span>
                        <span className="font-medium">(+91) 810 734 4682</span>
                      </div>
                      <p>
                        Ravish Saini, 3rd & 4th floor, Erkay Square, Udyog Vihar Phase-I...
                      </p>
                    </div>
                  </div>

                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-20 bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-4xl font-bold text-gray-900 mb-16">
            Boost Conversion & <span className="text-purple-600">Grow</span>{" "}
            <span className="text-green-600">Business</span>
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((item, i) => (
              <div
                key={i}
                className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition"
              >
                <div className="p-3 bg-purple-50 w-fit rounded-lg">{item.icon}</div>
                <h3 className="mt-4 text-xl text-black font-semibold">{item.title}</h3>
                <p className="mt-2 text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-center text-black text-4xl font-bold mb-16">Our Pricing</h2>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Pro Plan */}
            <div className="relative bg-gradient-to-br from-purple-600 to-purple-800 p-8 rounded-2xl text-white">
              <div className="absolute top-4 right-4 bg-yellow-400 text-black px-3 py-1 rounded-full text-sm font-semibold">
                Recommended
              </div>

              <div className="space-y-6">
                <div>
                  <div className="text-3xl font-bold">2.5%</div>
                  <p className="text-sm opacity-90">+ GST per order (PG included)</p>
                  <p className="text-xl font-semibold">Pro Plan</p>
                </div>

                <div className="space-y-3">
                  {[
                    "Address Intelligence with Autofill Available",
                    "All Payment Options (UPI, COD, Cards, Wallet)",
                    "Expected Delivery Date Available",
                    "Discounts & Shipping Charges",
                    "Abandon Cart Message Integration",
                    "Dynamic Shipping Visibility",
                    "Custom COD Rules",
                  ].map((ft, i) => (
                    <div key={i} className="flex space-x-3">
                      <Check className="w-5 h-5 text-green-300" />
                      <p className="text-sm">{ft}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Standard Plan */}
            <div className="bg-gray-50 p-8 rounded-2xl border-2 border-gray-200">
              <div className="space-y-6">
                <div>
                  <div className="text-3xl text-black font-bold">2%</div>
                  <p className="text-sm text-gray-600">+ GST per order (PG excluded)</p>
                  <p className="text-xl text-black font-semibold">Standard Plan</p>
                </div>

                <div className="space-y-3">
                  {[
                    "Address Intelligence with Autofill Available",
                    "All Payment Options Available",
                    "Expected Delivery Date",
                    "Discounts & Shipping Charges",
                    "Abandon Cart Message Integration",
                    "Dynamic Shipping Visibility",
                    "Custom COD Rules",
                  ].map((ft, i) => (
                    <div key={i} className="flex space-x-3">
                      <Check className="w-5 h-5 text-green-600" />
                      <p className="text-sm text-gray-700">{ft}</p>
                    </div>
                  ))}
                </div>

                <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg text-sm text-blue-700">
                  Note: Your existing PG account will be used.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-center text-black text-4xl font-bold mb-16">Client Reviews</h2>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-gray-50 p-6 rounded-2xl shadow-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white flex items-center justify-center font-semibold">
                    {t.avatar}
                  </div>
                  <div>
                    <h4 className="font-semibold text-black">{t.name}</h4>
                    <p className="text-sm text-gray-600">{t.role}</p>
                  </div>
                </div>
                <p className="mt-4 text-sm text-gray-700">{t.content}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="max-w-4xl mx-auto px-4">

          <h2 className="text-4xl text-black font-bold mb-12">FAQs</h2>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white rounded-lg shadow">
                <button
                  onClick={() => toggleFaq(i)}
                  className="w-full p-6 flex justify-between items-center text-left hover:bg-gray-50"
                >
                  <span className="font-semibold text-black">{faq.question}</span>
                  {openFaq === i ? (
                    <ChevronUp className="w-5 h-5 text-black" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-black" />
                  )}
                </button>

                {openFaq === i && (
                  <div className="px-6 pb-6 text-gray-600">{faq.answer}</div>
                )}
              </div>
            ))}
          </div>

        </div>
      </section>

    </div>
  );
}