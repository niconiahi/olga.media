import { component$, Slot, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import {
  Form,
  Link,
  routeAction$,
  routeLoader$,
  useLocation,
} from "@builder.io/qwik-city";
import clsx from "clsx";
import { HamburgerIcon } from "~/icons/hamburger";
import { LoginIcon } from "~/icons/login";
import { LogoutIcon } from "~/icons/logout";
import { OlgaIcon } from "~/icons/olga";
import { getDb } from "~/utils/db";
import { getEnv } from "~/utils/env";
import { getUser, createAuth } from "~/utils/session";

export const head: DocumentHead = {
  links: [
    {
      rel: "preload",
      href: "/fonts/BebasKai.ttf",
      as: "font",
      type: "font/ttf",
    },
    {
      rel: "preload",
      href: "/fonts/MabryPro-Medium.ttf",
      as: "font",
      type: "font/ttf",
    },
  ],
};

export const useUserId = routeLoader$(async (requestEvent) => {
  const db = getDb(requestEvent.platform);
  const user = await getUser(requestEvent, db);

  return { userId: user?.userId };
});

export const useLogout = routeAction$(async (_, requestEvent) => {
  const { error, headers, platform } = requestEvent;
  const env = getEnv(platform);
  const db = getDb(platform);
  const auth = createAuth(env, db);
  const authRequest = auth.handleRequest(requestEvent);
  const session = await authRequest.validate();
  if (!session) {
    throw error(401, "Unauthorized");
  }
  await auth.invalidateSession(session.sessionId);
  const sessionCookie = auth.createSessionCookie(null);
  headers.set("Set-Cookie", sessionCookie.serialize());
});

export default component$(() => {
  const location = useLocation();
  const logoRef = useSignal<HTMLInputElement>();
  const rankingRef = useSignal<HTMLAnchorElement>();
  const loginRef = useSignal<HTMLAnchorElement>();
  const cutsRef = useSignal<HTMLAnchorElement>();
  const logout = useLogout();
  const userId = useUserId();

  useVisibleTask$(({ track }) => {
    track(() => location.url.pathname);
    if (!rankingRef.value) return;

    if (location.url.pathname === "/ranking/") {
      rankingRef.value.blur();
    }
  });

  useVisibleTask$(({ track }) => {
    track(() => location.url.pathname);
    if (!logoRef.value) return;

    if (location.url.pathname === "/") {
      logoRef.value.blur();
    }
  });

  useVisibleTask$(({ track }) => {
    track(() => location.url.pathname);
    if (!cutsRef.value) return;

    if (location.url.pathname === "/cuts/") {
      cutsRef.value.blur();
    }
  });

  useVisibleTask$(({ track }) => {
    track(() => location.url.pathname);
    if (!loginRef.value) return;

    if (
      ["/login/", "/join/"].some(
        (pathname) => pathname === location.url.pathname,
      )
    ) {
      loginRef.value.blur();
    }
  });

  return (
    <>
      <header
        class={clsx([
          "pointer-events-none fixed left-0 right-0 flex items-center justify-between bg-transparent px-2 pt-2",
          ["/cuts/", "/"].some((pathname) => pathname === location.url.pathname)
            ? "md:pl-8 md:pr-7"
            : "md:px-8",
        ])}
      >
        <Link
          href="/"
          ref={logoRef}
          tabIndex={location.url.pathname === "/cuts/" ? -1 : 0}
          class={clsx([
            "pointer-events-auto flex items-center rounded-full border-2 border-solid border-brand-blue bg-brand-stone p-1.5 outline-4 outline-offset-0 focus-visible:outline focus-visible:outline-brand-red md:hover:bg-brand-blueHover",
            location.url.pathname === "/cuts" &&
              "md:-translate-x-0.5 md:-translate-y-1 md:border-brand-red md:shadow-brandBlue md:transition-all md:duration-100",
          ])}
        >
          <OlgaIcon class="h-9" />
        </Link>
        <nav class="hidden w-max md:block">
          <ul class="flex flex-row items-center space-x-2">
            <li
              class={clsx("flex", [
                location.url.pathname === "/cuts/" &&
                  "-translate-x-0.5 -translate-y-1 transition-transform duration-100",
              ])}
            >
              <Link
                class={clsx([
                  "mabry pointer-events-auto border-2 border-solid border-brand-blue bg-brand-stone px-4 py-[15px] text-lg text-brand-blue outline-4 outline-offset-0 hover:bg-brand-blueHover focus-visible:outline focus-visible:outline-brand-red md:py-2.5",
                  location.url.pathname === "/cuts/" &&
                    "border-brand-red text-brand-red shadow-brandBlue transition-shadow duration-100",
                ])}
                ref={cutsRef}
                tabIndex={location.url.pathname === "/cuts/" ? -1 : 0}
                href="/cuts"
              >
                Cortes
              </Link>
            </li>
            <li
              class={clsx("flex", [
                location.url.pathname === "/ranking/" &&
                  "-translate-x-0.5 -translate-y-1",
              ])}
            >
              <Link
                class={clsx([
                  "mabry pointer-events-auto border-2 border-solid border-brand-blue bg-brand-stone px-4 py-[15px] text-lg text-brand-blue outline-4 outline-offset-0 hover:bg-brand-blueHover focus-visible:outline focus-visible:outline-brand-red md:py-2.5",
                  location.url.pathname === "/ranking/" &&
                    "border-brand-red text-brand-red shadow-brandBlue transition-shadow duration-100",
                ])}
                tabIndex={location.url.pathname === "/ranking/" ? -1 : 0}
                ref={rankingRef}
                href="/ranking"
              >
                Ranking
              </Link>
            </li>
            {userId.value.userId ? (
              <li class="flex bg-red-500">
                <Form action={logout}>
                  <button
                    aria-label="Logout"
                    type="submit"
                    class="pointer-events-auto border-2 border-solid border-brand-blue bg-brand-stone p-2 outline-4 outline-offset-0 focus-visible:outline focus-visible:outline-brand-red md:hover:bg-brand-blueHover"
                  >
                    <span class="sr-only">Logout</span>
                    <LogoutIcon class="h-8 text-brand-blue" />
                  </button>
                </Form>
              </li>
            ) : (
              <li
                class={clsx("flex", [
                  ["/login/", "/join/"].some(
                    (pathname) => pathname === location.url.pathname,
                  ) && "-translate-x-0.5 -translate-y-1",
                ])}
              >
                <Link
                  href="/login"
                  ref={loginRef}
                  tabIndex={
                    ["/login/", "/join/"].some(
                      (pathname) => pathname === location.url.pathname,
                    )
                      ? -1
                      : 0
                  }
                  class={clsx(
                    [
                      "pointer-events-auto border-2 border-solid border-brand-blue bg-brand-stone p-2 outline-4 outline-offset-0 focus-visible:outline focus-visible:outline-brand-red md:hover:bg-brand-blueHover",
                    ],
                    ["/login/", "/join/"].some(
                      (pathname) => pathname === location.url.pathname,
                    ) &&
                      "border-brand-red shadow-brandBlue transition-shadow duration-100",
                  )}
                >
                  <LoginIcon
                    class={clsx([
                      "h-8 text-brand-blue",
                      ["/login/", "/join/"].some(
                        (pathname) => pathname === location.url.pathname,
                      ) && "text-brand-red",
                    ])}
                  />
                </Link>
              </li>
            )}
          </ul>
        </nav>
        <nav class="pointer-events-auto md:hidden">
          <ul class="flex items-center space-x-2">
            {userId.value.userId ? (
              <li class="flex">
                <Form action={logout}>
                  <button
                    aria-label="Logout"
                    type="submit"
                    class="pointer-events-auto border-2 border-solid border-brand-blue bg-brand-stone p-2 outline-4 outline-offset-0 focus-visible:outline focus-visible:outline-brand-red md:hover:bg-brand-blueHover"
                  >
                    <span class="sr-only">Logout</span>
                    <LogoutIcon class="h-8 text-brand-blue" />
                  </button>
                </Form>
              </li>
            ) : (
              <li class="flex">
                <Link
                  href="/login"
                  class="border-2 border-solid border-brand-blue bg-brand-stone p-2 outline-4 outline-offset-0 focus-visible:outline focus-visible:outline-brand-red md:hidden md:hover:bg-brand-blueHover"
                >
                  <span class="sr-only">Login</span>
                  <LoginIcon class="h-8 text-brand-blue" />
                </Link>
              </li>
            )}
            <li class="flex">
              <Link
                href="/navigate"
                class="border-2 border-solid border-brand-blue bg-brand-stone p-2 outline-4 outline-offset-0 focus-visible:outline focus-visible:outline-brand-red md:hidden md:hover:bg-brand-blueHover"
              >
                <span class="sr-only">Menu</span>
                <HamburgerIcon class="h-8 text-brand-blue" />
              </Link>
            </li>
          </ul>
        </nav>
      </header>
      <main class="mt-[60px] flex w-full flex-1 flex-col px-2 pb-3 pt-2 md:mx-auto md:max-w-3xl md:px-8 md:pb-8">
        <Slot />
      </main>
    </>
  );
});
