import { z } from "zod";

/* oxlint-disable node/no-process-env */

const variables = {
  DATABASE_URL: process.env.DATABASE_URL,
  KLAVIYO_PRIVATE_KEY: process.env.KLAVIYO_PRIVATE_KEY,
  KLAVIYO_LIST_ID_NEWSLETTER: process.env.KLAVIYO_LIST_ID_NEWSLETTER,
  KLAVIYO_LIST_ID_OUT_OF_STOCK_NOTIFICATIONS: process.env.KLAVIYO_LIST_ID_OUT_OF_STOCK_NOTIFICATIONS,
  KLAVIYO_URL: process.env.KLAVIYO_URL,
  NEXT_PUBLIC_KLAVIYO_API_REVISION: process.env.NEXT_PUBLIC_KLAVIYO_API_REVISION,
  NEXT_PUBLIC_KLAVIYO_PUBLIC_KEY: process.env.NEXT_PUBLIC_KLAVIYO_PUBLIC_KEY,
  NEXT_PUBLIC_SERVER_URL: process.env.NEXT_PUBLIC_SERVER_URL,
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  NEXT_PUBLIC_VERCEL_URL: process.env.NEXT_PUBLIC_VERCEL_URL,
  PAYLOAD_PUBLIC_SERVER_URL: process.env.PAYLOAD_PUBLIC_SERVER_URL,
  PAYLOAD_SECRET: process.env.PAYLOAD_SECRET,
  PREVIEW_SECRET: process.env.PREVIEW_SECRET,
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
  STRIPE_WEBHOOKS_SIGNING_SECRET: process.env.STRIPE_WEBHOOKS_SIGNING_SECRET,
  VERCEL_PROJECT_PRODUCTION_URL: process.env.VERCEL_PROJECT_PRODUCTION_URL,
};

const sharedVariablesSchema = z.object({
  NEXT_PUBLIC_SERVER_URL: z.string(),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string(),
  NEXT_PUBLIC_VERCEL_URL: z.string().optional(),
});

const clientVariablesSchema = z.object({
  DATABASE_URL: z.string().optional(),
  NEXT_PUBLIC_KLAVIYO_API_REVISION: z.string(),
  NEXT_PUBLIC_KLAVIYO_PUBLIC_KEY: z.string(),
  PAYLOAD_PUBLIC_SERVER_URL: z.string().optional(),
  PAYLOAD_SECRET: z.string().optional(),
  PREVIEW_SECRET: z.string().optional(),
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOKS_SIGNING_SECRET: z.string().optional(),
  VERCEL_PROJECT_PRODUCTION_URL: z.string().optional(),
});

const serverVariablesSchema = z.object({
  DATABASE_URL: z.string(),
  KLAVIYO_PRIVATE_KEY: z.string(),
  KLAVIYO_LIST_ID_NEWSLETTER: z.string(),
  KLAVIYO_LIST_ID_OUT_OF_STOCK_NOTIFICATIONS: z.string(),
  KLAVIYO_URL: z.string(),
  PAYLOAD_PUBLIC_SERVER_URL: z.string().optional(),
  PAYLOAD_SECRET: z.string(),
  PREVIEW_SECRET: z.string().optional(),
  STRIPE_SECRET_KEY: z.string(),
  STRIPE_WEBHOOKS_SIGNING_SECRET: z.string(),
  VERCEL_PROJECT_PRODUCTION_URL: z.string().optional(),
});

const envSchema = z.intersection(
  sharedVariablesSchema,
  typeof window === "undefined" ? serverVariablesSchema : clientVariablesSchema,
);

export const env = envSchema.parse(variables);
