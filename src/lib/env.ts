import { z } from "zod";

const envSchema = z.object({
  UPSTASH_REDIS_REST_URL: z.url(),
  UPSTASH_REDIS_REST_TOKEN: z.string(),

  NEXT_PUBLIC_APP_URL: z.url(),

  NODE_ENV: z.union([z.literal("development"), z.literal("production")]).default("development"),
});

const env = envSchema.parse(process.env);

export { env };
