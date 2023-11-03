import type { RequestHandler } from "@builder.io/qwik-city";
import { getDb } from "~/utils/db";
import { getEnv } from "~/utils/env";
import { createAuth, createGoogleAuth } from "~/utils/session";

export const onGet: RequestHandler = async (requestEvent) => {
  const { platform, cookie, redirect } = requestEvent;
  const db = getDb(platform);
  const env = getEnv(platform);
  const auth = createAuth(env, db);
  const authRequest = auth.handleRequest(requestEvent);
  const session = await authRequest.validate();
  if (session) {
    throw redirect(302, "/");
  }
  const googleAuth = createGoogleAuth(auth, env);
  const [url, state] = await googleAuth.getAuthorizationUrl();
  cookie.set("google_oauth_state", state, {
    httpOnly: true,
    secure: false,
    path: "/",
    maxAge: 60 * 60,
  });
  throw redirect(302, url.toString());
};
