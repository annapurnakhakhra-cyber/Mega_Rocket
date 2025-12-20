// src/lib/shopify-client.js

import { ApolloClient, InMemoryCache, HttpLink, ApolloLink } from '@apollo/client';
import { onError } from '@apollo/client/link/error';

// Ensure these environment variables are correctly set in .env.local
const SHOPIFY_STORE_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN;
const SHOPIFY_ADMIN_TOKEN = process.env.SHOPIFY_ADMIN_TOKEN;
const API_VERSION = '2024-04'; // Use a slightly older, proven stable version for better compatibility

let client;

if (!SHOPIFY_STORE_DOMAIN || !SHOPIFY_ADMIN_TOKEN) {
    // Defensive coding for missing environment variables
    const errorMsg = 'CRITICAL: Missing SHOPIFY_STORE_DOMAIN or SHOPIFY_ADMIN_TOKEN.';
    const suggestion = 'Check your .env.local file and restart the server.';
    
    console.error(`--- SHOPIFY CLIENT ERROR ---`);
    console.error(`[Admin Client]: ${errorMsg}`);
    console.error(`----------------------------`);
    
    client = {
      query: async () => {
        throw { success: false, error: errorMsg, suggestion, status: 500 }; 
      },
      mutate: async () => {
        throw { success: false, error: errorMsg, suggestion, status: 500 }; 
      }
    };
} else {
    // Configure the Admin API URL
    const httpLink = new HttpLink({
      uri: `https://${SHOPIFY_STORE_DOMAIN}/admin/api/${API_VERSION}/graphql.json`,
      headers: {
        // Use the Admin Access Token header
        'X-Shopify-Access-Token': SHOPIFY_ADMIN_TOKEN, 
        'Content-Type': 'application/json',
      },
    });

    const errorLink = onError(({ graphQLErrors, networkError }) => {
      if (graphQLErrors) {
        graphQLErrors.forEach(({ message, locations, path }) =>
          console.error(`[GraphQL Admin error]: Message: ${message}, Location: ${locations}, Path: ${path}`),
        );
      }
      if (networkError) {
        console.error(`[Network Admin error]: ${networkError}`);
      }
    });

    const link = ApolloLink.from([errorLink, httpLink]);

    client = new ApolloClient({
      link: link,
      cache: new InMemoryCache(),
      ssrMode: typeof window === 'undefined', 
    });
}

export default client;