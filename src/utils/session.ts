import type { D1Database } from "@cloudflare/workers-types";
import { qwik } from "lucia/middleware";
import { d1 } from "@lucia-auth/adapter-sqlite";
import { lucia } from "lucia";
import type { RequestEventLoader } from "@builder.io/qwik-city";
import { z } from "@builder.io/qwik-city";

export const initializeLucia = (db: D1Database) => {
  const auth = lucia({
    env: "DEV",
    middleware: qwik(),
    adapter: d1(db, {
      user: "user",
      key: "user_key",
      session: "user_session",
    }),
  });
  return auth;
};

export async function getUser(
  requestEvent: RequestEventLoader<QwikCityPlatform>,
) {
  const { platform } = requestEvent;
  const env = platform.env as { DB: D1Database };
  const auth = initializeLucia(env.DB);
  const authRequest = auth.handleRequest(requestEvent);
  const session = await authRequest.validate();
  if (!session) {
    return null;
  }

  const result = userSchema.safeParse(session.user);
  if (!result.success) {
    throw new Error(result.error.toString());
  }
  const user = result.data;

  return user;
}

const userSchema = z.object({
  userId: z.string(),
});
