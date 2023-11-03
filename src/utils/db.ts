import type { D1Database } from "@cloudflare/workers-types";

export function getDb(platform: QwikCityPlatform) {
  const env = platform.env as { DB: D1Database };
  return env.DB;
}
