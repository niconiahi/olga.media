import { qwik } from "lucia/middleware";
import { d1 } from "@lucia-auth/adapter-sqlite";
import { lucia } from "lucia";
import type { RequestEventLoader } from "@builder.io/qwik-city";
import { z } from "@builder.io/qwik-city";
import { google } from "@lucia-auth/oauth/providers";
import { getOrigin } from "~/utils/routes";
import type { Env } from "~/utils/env";
import { getEnv } from "~/utils/env";
import type { D1Database } from "@cloudflare/workers-types";

export const createAuth = (env: Env, db: D1Database) => {
  const auth = lucia({
    env: env.ENVIRONMENT === "development" ? "DEV" : "PROD",
    middleware: qwik(),
    adapter: d1(db, {
      user: "user",
      key: "user_key",
      session: "user_session",
    }),
  });
  return auth;
};

type Auth = ReturnType<typeof createAuth>;

export const createGoogleAuth = (auth: Auth, env: Env) => {
  return google(auth, {
    redirectUri: `${getOrigin(env)}/login/google/callback`,
    clientId: env.GOOGLE_CLIENT_ID,
    clientSecret: env.GOOGLE_CLIENT_SECRET,
  });
};

export async function getUser(
  requestEvent: RequestEventLoader<QwikCityPlatform>,
  db: D1Database,
) {
  const { platform } = requestEvent;
  const env = getEnv(platform);
  const auth = createAuth(env, db);
  const authRequest = auth.handleRequest(requestEvent);
  const session = await authRequest.validate();
  console.log("session:", session);
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
