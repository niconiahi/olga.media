import { z } from "@builder.io/qwik-city";

const envSchema = z.object({
  ENVIRONMENT: z.union([z.literal("development"), z.literal("production")]),
  GOOGLE_CLIENT_ID: z.string().min(1),
  GOOGLE_CLIENT_SECRET: z.string().min(1),
});

export function getEnv(platform: QwikCityPlatform) {
  const result = envSchema.safeParse(platform.env);
  if (!result.success) {
    throw new Error(result.error.toString());
  }
  const env = result.data;

  return env;
}

export type Env = ReturnType<typeof getEnv>;
