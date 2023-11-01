import { Form, Link, routeAction$, z, zod$ } from "@builder.io/qwik-city";
import { LuciaError } from "lucia";
import type { D1Database } from "@cloudflare/workers-types";
import { component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import clsx from "clsx";
import { initializeLucia } from "~/utils/session";

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
  const inputRef = useSignal<HTMLInputElement>();
  const loginUser = useLoginUser();

  useVisibleTask$(() => {
    if (!inputRef.value) return;

    inputRef.value.focus();
  });

  return (
    <section class="px-auto flex h-full flex-1 flex-col items-center justify-center space-y-2">
      <Form action={loginUser} class="w-80 space-y-2">
        <p class="flex flex-col space-y-1">
          <label class="mabry leading-none text-brand-blue" for="username">
            Usuario
          </label>
          <input
            class="mabry border-2 border-brand-blue bg-brand-stone px-1 py-3 text-brand-blue outline-4 focus-visible:outline focus-visible:outline-brand-red md:hover:bg-brand-blueHover"
            type="text"
            ref={inputRef}
            id="username"
            name="username"
            aria-invalid={
              loginUser.value?.fieldErrors?.username ||
              (loginUser.value?.failed && loginUser.value.message)
                ? "true"
                : undefined
            }
            aria-errormessage="username-error"
          />
          <span
            id="username-error"
            class={clsx([
              "mabry text-brand-red underline decoration-brand-blue decoration-dotted decoration-2 underline-offset-1",
              loginUser.value?.fieldErrors?.username ||
              (loginUser.value?.failed && loginUser.value.message)
                ? "visible"
                : "invisible",
            ])}
          >
            {(loginUser.value?.fieldErrors?.username ||
              (loginUser.value?.failed && loginUser.value.message)) ??
              "Olga"}
          </span>
        </p>
        <p class="flex flex-col space-y-1">
          <label class="mabry leading-none text-brand-blue" for="password">
            Contraseña
          </label>
          <input
            class="mabry border-2 border-brand-blue bg-brand-stone px-1 py-3 text-brand-blue outline-4 focus-visible:outline focus-visible:outline-brand-red md:hover:bg-brand-blueHover"
            type="password"
            id="password"
            name="password"
            aria-invalid={
              loginUser.value?.fieldErrors?.username ? "true" : undefined
            }
            aria-errormessage="username-error"
          />
          <span
            id="password-error"
            class={clsx([
              "mabry text-brand-red underline decoration-brand-blue decoration-dotted decoration-2 underline-offset-1",
              loginUser.value?.fieldErrors?.password ? "visible" : "invisible",
            ])}
          >
            {loginUser.value?.fieldErrors?.password ?? "Olga"}
          </span>
        </p>
        <button
          type="submit"
          class="mabry w-full border-2 border-brand-red bg-brand-red px-4 py-2 text-2xl text-brand-stone outline-4 focus-visible:outline focus-visible:outline-brand-blue md:hover:bg-brand-stone md:hover:text-brand-red"
        >
          Ingresar
        </button>
      </Form>
      <p class="wabry w-80 text-end font-medium text-brand-blue">
        Aún no tenés cuenta?{" "}
        <Link
          class="text-brand-blue underline decoration-brand-red decoration-dotted decoration-2 underline-offset-1 outline-4 transition-all duration-100 focus-visible:outline focus-visible:outline-brand-blue md:hover:underline-offset-4"
          href="/join"
        >
          Registrate
        </Link>
      </p>
    </section>
  );
});
