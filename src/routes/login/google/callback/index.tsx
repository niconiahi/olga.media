import type { RequestHandler } from "@builder.io/qwik-city";
import { OAuthRequestError } from "@lucia-auth/oauth";
import type { GoogleUserAuth } from "@lucia-auth/oauth/providers";
import type { Auth } from "lucia";
import { getDb } from "~/utils/db";
import { getEnv } from "~/utils/env";
import { createAuth, createGoogleAuth } from "~/utils/session";

export const onGet: RequestHandler = async (requestEvent) => {
  const { platform, cookie, redirect, query, error } = requestEvent;
  const env = getEnv(platform);
  const db = getDb(platform);
  const auth = createAuth(env, db);
  const authRequest = auth.handleRequest(requestEvent);
  const session = await authRequest.validate();
  if (session) {
    throw redirect(302, "/");
  }
  const googleAuth = createGoogleAuth(auth, env);
  const storedState = cookie.get("google_oauth_state");
  const code = query.get("code");
  const state = query.get("state");

  if (
    !storedState ||
    !state ||
    storedState.value !== state ||
    typeof code !== "string"
  ) {
    throw error(400, `expected Google's states to match but the don't`);
  }

  try {
    const googleUserAuth = await googleAuth.validateCallback(code);
    const user = await getUser(googleUserAuth);
    const session = await auth.createSession({
      userId: user.userId,
      attributes: {},
    });

    authRequest.setSession(session);
  } catch (e) {
    if (e instanceof OAuthRequestError) {
      throw error(400, `invalid code`);
    }
    throw error(500, `unkwown error while signing in with Google`);
  }

  throw redirect(302, "/");
};

async function getUser(googleUserAuth: GoogleUserAuth<Auth<any>>) {
  const { getExistingUser, createUser } = googleUserAuth;
  const existingUser = await getExistingUser();
  if (existingUser) return existingUser;
  const user = await createUser({
    attributes: {},
  });
  return user;
}
