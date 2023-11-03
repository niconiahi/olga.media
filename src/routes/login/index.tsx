// import { Form, Link, routeAction$, z, zod$ } from "@builder.io/qwik-city";
import { Link, routeAction$, z, zod$ } from "@builder.io/qwik-city";
import { LuciaError } from "lucia";
import type { ClassList, Signal } from "@builder.io/qwik";
import { component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
// import clsx from "clsx";
import { createAuth } from "~/utils/session";
import { getEnv } from "~/utils/env";
import { getDb } from "~/utils/db";

export const useLoginUser = routeAction$(
  async ({ username, password }, { platform, redirect, headers, fail }) => {
    try {
      const env = getEnv(platform);
      const db = getDb(platform);
      const auth = createAuth(env, db);
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
  // const loginUser = useLoginUser();

  useVisibleTask$(() => {
    if (!inputRef.value) return;

    inputRef.value.focus();
  });

  return (
    <section class="px-auto mx-auto flex h-full w-80 flex-1 flex-col items-end justify-center space-y-2">
      {/* <Form action={loginUser} class="w-full space-y-2">
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
      <p class="wabry text-end font-medium text-brand-blue">
        Aún no tenés cuenta?{" "}
        <Link
          class="text-brand-blue underline decoration-brand-red decoration-dotted decoration-2 underline-offset-1 outline-4 transition-all duration-100 focus-visible:outline focus-visible:outline-brand-blue md:hover:underline-offset-4"
          href="/join"
        >
          Registrate
        </Link>
      </p> */}
      <Link
        href="/login/google"
        class="mabry flex w-full flex-row items-center justify-center border-2 border-solid border-google-blue bg-google-blue py-2 text-2xl text-brand-stone outline-4 -outline-offset-1 focus-visible:outline focus-visible:outline-brand-red"
      >
        <GoogleIcon class="mr-2 h-6 w-6" />
        Ingresar con Google
      </Link>
    </section>
  );
});

export const GoogleIcon = component$<{ class: ClassList | Signal<ClassList> }>(
  (props) => {
    return (
      <svg
        class={props.class}
        aria-hidden="true"
        focusable="false"
        data-prefix="fab"
        data-icon="google"
        role="img"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 488 512"
      >
        <path
          fill="currentColor"
          d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
        />
      </svg>
    );
  },
);
