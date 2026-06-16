import { z } from "zod";

/* oxlint-disable node/no-process-env */

const variables = {
  BANKFUL_PASSWORD: process.env.BANKFUL_PASSWORD,
  BANKFUL_SANDBOX: process.env.BANKFUL_SANDBOX,
  BANKFUL_USERNAME: process.env.BANKFUL_USERNAME,
  DATABASE_URL: process.env.DATABASE_URL,
  KLAVIYO_PRIVATE_KEY: process.env.KLAVIYO_PRIVATE_KEY,
  KLAVIYO_LIST_ID_NEWSLETTER: process.env.KLAVIYO_LIST_ID_NEWSLETTER,
  // KLAVIYO_LIST_ID_OUT_OF_STOCK_NOTIFICATIONS: process.env.KLAVIYO_LIST_ID_OUT_OF_STOCK_NOTIFICATIONS,
  // KLAVIYO_URL: process.env.KLAVIYO_URL,
  NEXT_PUBLIC_BANKFUL_ENABLED: process.env.NEXT_PUBLIC_BANKFUL_ENABLED,
  NEXT_PUBLIC_KLAVIYO_API_REVISION: process.env.NEXT_PUBLIC_KLAVIYO_API_REVISION,
  NEXT_PUBLIC_KLAVIYO_PUBLIC_KEY: process.env.NEXT_PUBLIC_KLAVIYO_PUBLIC_KEY,
  NEXT_PUBLIC_SERVER_URL: process.env.NEXT_PUBLIC_SERVER_URL || `https://${process.env.VERCEL_URL}`,
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  NEXT_PUBLIC_TAGADAPAY_ENABLED: process.env.NEXT_PUBLIC_TAGADAPAY_ENABLED,
  NEXT_PUBLIC_VERCEL_URL: process.env.NEXT_PUBLIC_VERCEL_URL,
  TAGADAPAY_API_KEY: process.env.TAGADAPAY_API_KEY,
  TAGADAPAY_STORE_ID: process.env.TAGADAPAY_STORE_ID,
  PAYLOAD_PUBLIC_SERVER_URL: process.env.PAYLOAD_PUBLIC_SERVER_URL || `https://${process.env.VERCEL_URL}`,
  PAYLOAD_SECRET: process.env.PAYLOAD_SECRET,
  PREVIEW_SECRET: process.env.PREVIEW_SECRET,
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
  STRIPE_WEBHOOKS_SIGNING_SECRET: process.env.STRIPE_WEBHOOKS_SIGNING_SECRET,
  VERCEL_PROJECT_PRODUCTION_URL: process.env.VERCEL_PROJECT_PRODUCTION_URL,
};

const sharedVariablesSchema = z.object({
  NEXT_PUBLIC_BANKFUL_ENABLED: z.string().optional(),
  NEXT_PUBLIC_SERVER_URL: z.string().optional(),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string(),
  NEXT_PUBLIC_TAGADAPAY_ENABLED: z.string().optional(),
  NEXT_PUBLIC_VERCEL_URL: z.string().optional(),
});

const clientVariablesSchema = z.object({
  BANKFUL_PASSWORD: z.string().optional(),
  BANKFUL_SANDBOX: z.string().optional(),
  BANKFUL_USERNAME: z.string().optional(),
  DATABASE_URL: z.string().optional(),
  NEXT_PUBLIC_KLAVIYO_API_REVISION: z.string(),
  // NEXT_PUBLIC_KLAVIYO_PUBLIC_KEY: z.string(),
  PAYLOAD_PUBLIC_SERVER_URL: z.string().optional(),
  PAYLOAD_SECRET: z.string().optional(),
  PREVIEW_SECRET: z.string().optional(),
  RESEND_API_KEY: z.string().optional(),
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOKS_SIGNING_SECRET: z.string().optional(),
  TAGADAPAY_API_KEY: z.string().optional(),
  TAGADAPAY_STORE_ID: z.string().optional(),
  VERCEL_PROJECT_PRODUCTION_URL: z.string().optional(),
});

const serverVariablesSchema = z.object({
  BANKFUL_PASSWORD: z.string().optional(),
  BANKFUL_SANDBOX: z.string().optional(),
  BANKFUL_USERNAME: z.string().optional(),
  DATABASE_URL: z.string(),
  KLAVIYO_PRIVATE_KEY: z.string(),
  KLAVIYO_LIST_ID_NEWSLETTER: z.string(),
  // KLAVIYO_LIST_ID_OUT_OF_STOCK_NOTIFICATIONS: z.string(),
  // KLAVIYO_URL: z.string(),
  PAYLOAD_PUBLIC_SERVER_URL: z.string(),
  PAYLOAD_SECRET: z.string(),
  PREVIEW_SECRET: z.string().optional(),
  RESEND_API_KEY: z.string(),
  STRIPE_SECRET_KEY: z.string(),
  STRIPE_WEBHOOKS_SIGNING_SECRET: z.string(),
  TAGADAPAY_API_KEY: z.string().optional(),
  TAGADAPAY_STORE_ID: z.string().optional(),
  VERCEL_PROJECT_PRODUCTION_URL: z.string(),
});

const envSchema = z.intersection(
  sharedVariablesSchema,
  typeof window === "undefined" ? serverVariablesSchema : clientVariablesSchema,
);

export const env = envSchema.parse(variables);
