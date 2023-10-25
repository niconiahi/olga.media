import { Form, Link, routeAction$, z, zod$ } from "@builder.io/qwik-city";
import { LuciaError, lucia } from "lucia";
import { d1 } from "@lucia-auth/adapter-sqlite";
import type { D1Database } from "@cloudflare/workers-types";
import { component$ } from "@builder.io/qwik";

export const initializeLucia = (db: D1Database) => {
  const auth = lucia({
    env: "DEV",
    adapter: d1(db, {
      user: "user",
      key: "user_key",
      session: "user_session",
    }),
  });
  return auth;
};

export type Auth = ReturnType<typeof initializeLucia>;

export const useLoginUser = routeAction$(
  async ({ username, password }, { platform, redirect, headers, fail }) => {
    try {
      const env = platform.env as { DB: D1Database };
      const auth = initializeLucia(env.DB);
      const key = await auth.useKey(
        "username",
        username.toLowerCase(),
        password,
      );
      const session = await auth.createSession({
        userId: key.userId,
        attributes: {},
      });
      const sessionCookie = auth.createSessionCookie(session);
      headers.set("Set-Cookie", sessionCookie.serialize());
      throw redirect(302, "/");
    } catch (e) {
      if (
        e instanceof LuciaError &&
        (e.message === "AUTH_INVALID_KEY_ID" ||
          e.message === "AUTH_INVALID_PASSWORD")
      ) {
        return fail(400, { message: "Usuario y/o contraseña son incorrectos" });
      }
    }
  },
  zod$({
    username: z.string().min(1, "Ingresa un usuario"),
    password: z.string().min(1, "Ingresa una contraseña"),
  }),
);

export default component$(() => {
  const loginUser = useLoginUser();

  return (
    <section class="flex flex-col items-end space-y-2">
      <Form action={loginUser} class="w-80 space-y-2">
        <p class="flex flex-col space-y-1">
          <label class="mabry leading-none text-brand-blue" for="username">
            Usuario
          </label>
          <input
            class="mabry border-2 border-brand-blue px-1 py-2.5 text-brand-blue outline-4 focus-visible:outline focus-visible:outline-brand-red"
            type="text"
            id="username"
            name="username"
          />
        </p>
        <p class="flex flex-col space-y-1">
          <label class="mabry leading-none text-brand-blue" for="password">
            Contraseña
          </label>
          <input
            class="mabry border-2 border-brand-blue px-1 py-2.5 text-brand-blue outline-4 focus-visible:outline focus-visible:outline-brand-red"
            type="password"
            id="password"
            name="password"
          />
        </p>
        {loginUser.value?.failed && loginUser.value.message ? (
          <p class="mabry text-brand-red underline decoration-brand-blue decoration-dotted decoration-2 underline-offset-1">
            {loginUser.value.message}
          </p>
        ) : null}
        <button
          type="submit"
          class="mabry w-full bg-brand-red px-4 py-2 text-2xl text-brand-stone outline-4 focus-visible:outline focus-visible:outline-brand-blue"
        >
          Ingresar
        </button>
      </Form>
      <p class="wabry font-medium text-brand-blue">
        No tenés cuenta?{" "}
        <Link
          class="text-brand-red underline decoration-brand-blue decoration-dotted underline-offset-1 outline-4 focus-visible:outline focus-visible:outline-brand-blue"
          href="/join"
        >
          Creala
        </Link>
      </p>
    </section>
  );
});