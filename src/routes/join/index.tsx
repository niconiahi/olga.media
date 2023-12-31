import { Form, Link, routeAction$, z, zod$ } from "@builder.io/qwik-city";
import { LuciaError } from "lucia";
import { component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import clsx from "clsx";
import { createAuth } from "~/utils/session";
import { getEnv } from "~/utils/env";
import { getDb } from "~/utils/db";

export const useCreateUser = routeAction$(
  async ({ username, password }, { platform, redirect, headers, fail }) => {
    try {
      const env = getEnv(platform);
      const db = getDb(platform);
      const auth = createAuth(env, db);
      const user = await auth.createUser({
        key: {
          providerId: "username",
          providerUserId: username.toLowerCase(),
          password,
        },
        attributes: {
          username,
        },
      });
      const session = await auth.createSession({
        userId: user.userId,
        attributes: {},
      });
      const sessionCookie = auth.createSessionCookie(session);
      headers.set("Set-Cookie", sessionCookie.serialize());
      throw redirect(302, "/");
    } catch (e) {
      if (e instanceof LuciaError && e.message === "AUTH_DUPLICATE_KEY_ID") {
        return fail(400, {
          message: "Ya existe un usuario con este nombre",
        });
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
  const createUser = useCreateUser();

  useVisibleTask$(() => {
    if (!inputRef.value) return;

    inputRef.value.focus();
  });

  return (
    <section class="px-auto flex h-full flex-1 flex-col items-center justify-center space-y-2">
      <Form action={createUser} class="w-80 space-y-2 ">
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
              createUser.value?.fieldErrors?.username ||
              (createUser.value?.failed && createUser.value.message)
                ? "true"
                : undefined
            }
            aria-errormessage="username-error"
          />
          <span
            id="username-error"
            class={clsx([
              "mabry text-brand-red underline decoration-brand-blue decoration-dotted decoration-2 underline-offset-1",
              createUser.value?.fieldErrors?.username ||
              (createUser.value?.failed && createUser.value.message)
                ? "visible"
                : "invisible",
            ])}
          >
            {(createUser.value?.fieldErrors?.username ||
              (createUser.value?.failed && createUser.value.message)) ??
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
              createUser.value?.fieldErrors?.username ? "true" : undefined
            }
            aria-errormessage="username-error"
          />
          <span
            id="password-error"
            class={clsx([
              "mabry text-brand-red underline decoration-brand-blue decoration-dotted decoration-2 underline-offset-1",
              createUser.value?.fieldErrors?.password ? "visible" : "invisible",
            ])}
          >
            {createUser.value?.fieldErrors?.password ?? "Olga"}
          </span>
        </p>
        <button
          type="submit"
          class="mabry w-full border-2 border-brand-red bg-brand-red px-4 py-2 text-2xl text-brand-stone outline-4 focus-visible:outline focus-visible:outline-brand-blue md:hover:bg-brand-stone md:hover:text-brand-red"
        >
          Crear
        </button>
      </Form>
      <p class="wabry w-80 text-end font-medium text-brand-blue">
        Ya tenés cuenta?{" "}
        <Link
          class="text-brand-blue underline decoration-brand-red decoration-dotted decoration-2 underline-offset-1 outline-4 transition-all duration-100 focus-visible:outline focus-visible:outline-brand-blue md:hover:underline-offset-4"
          href="/login"
        >
          Ingresá
        </Link>
      </p>
    </section>
  );
});
