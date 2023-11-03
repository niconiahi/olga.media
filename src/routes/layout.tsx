import type { ClassList, Signal } from "@builder.io/qwik";
import { component$, Slot, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import {
  Form,
  Link,
  routeAction$,
  routeLoader$,
  useLocation,
} from "@builder.io/qwik-city";
import clsx from "clsx";
import { getDb } from "~/utils/db";
import { getEnv } from "~/utils/env";
import { getUser, createAuth } from "~/utils/session";

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

export const HamburgerIcon = component$<{
  class: ClassList | Signal<ClassList>;
}>((props) => {
  return (
    <svg
      class={props.class}
      aria-hidden="true"
      viewBox="0 0 14 14"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1 7H13"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="square"
        stroke-linejoin="round"
      />
      <path
        d="M1 1H13"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="square"
        stroke-linejoin="round"
      />
      <path
        d="M1 13H13"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="square"
        stroke-linejoin="round"
      />
    </svg>
  );
});

export const LogoutIcon = component$<{
  class: ClassList | Signal<ClassList>;
}>((props) => {
  return (
    <svg
      class={clsx(["fill-transparant", props.class])}
      aria-hidden="true"
      viewBox="0 0 16 16"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5.66667 15H2.55556C2.143 15 1.74733 14.8361 1.45561 14.5444C1.16389 14.2527 1 13.857 1 13.4444V2.55556C1 2.143 1.16389 1.74733 1.45561 1.45561C1.74733 1.16389 2.143 1 2.55556 1H5.66667"
        class="fill-transparent"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M11.1111 11.8889L15 8L11.1111 4.11111"
        class="fill-transparent"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M15 8H5.66663"
        class="fill-transparent"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
});

export const LoginIcon = component$<{ class: ClassList | Signal<ClassList> }>(
  (props) => {
    return (
      <svg
        class={clsx(["fill-transparant", props.class])}
        viewBox="0 0 16 16"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          class="fill-transparent"
          d="M10.3334 1H13.4445C13.857 1 14.2527 1.16389 14.5444 1.45561C14.8362 1.74733 15 2.143 15 2.55556V13.4444C15 13.857 14.8362 14.2527 14.5444 14.5444C14.2527 14.8361 13.857 15 13.4445 15H10.3334"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          class="fill-transparent"
          d="M6.44446 11.8889L10.3333 8L6.44446 4.11111"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M10.3333 8H1"
          class="fill-transparent"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    );
  },
);

export const OlgaIcon = component$<{ class: ClassList | Signal<ClassList> }>(
  (props) => {
    return (
      <svg
        viewBox="0 0 112 118"
        class={props.class}
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M80.572 0.38452C80.9651 0.363148 81.3581 0.341776 82.3258 0.524756C83.7651 0.653115 84.6297 0.57712 85.4943 0.501125C86.068 0.967648 86.6416 1.43417 87.3704 2.33348C87.5254 2.76627 87.8201 3.08586 87.8201 3.08586L88.2548 3.06218C88.2548 3.06218 88.4346 3.19016 88.4873 3.49881C88.5399 3.80747 88.8615 4.10084 88.8615 4.10084L89.2951 4.05633C89.8218 4.55882 90.3486 5.06131 91.0589 6.06478C91.6961 6.84029 92.1495 7.11482 92.603 7.38936C92.603 7.38936 92.611 7.3917 92.6414 7.66294C93.0806 8.18701 93.4893 8.43985 93.8981 8.69268C93.8981 8.69268 94.0666 8.80101 94.0823 9.06589C94.098 9.33077 94.3689 9.58738 94.3689 9.58738L94.7279 9.48299C94.7279 9.48299 94.9208 9.61302 94.982 9.9729C95.4742 10.5824 95.905 10.832 96.3359 11.0816C96.3359 11.0816 96.3346 11.1005 96.3718 11.3616C96.8146 11.8514 97.2202 12.0801 97.6259 12.3088C97.6259 12.3088 97.8552 12.4767 97.8669 12.7836C97.8787 13.0905 98.1212 13.3971 98.1212 13.3971L98.5125 13.3789C98.5125 13.3789 98.6264 13.5121 98.5451 13.8092C98.4593 14.4465 98.6061 14.6991 98.904 14.8641C98.931 23.2224 98.9579 31.5808 98.7291 40.5157C98.1566 41.8754 97.8401 42.6585 97.0986 43.5215C95.5244 43.569 94.3749 43.5367 93.0452 43.2957C91.6424 43.2223 90.4199 43.3574 88.7495 43.5559C84.9867 43.5794 81.6718 43.5395 78.2498 43.1438C77.9676 36.815 77.9091 30.8346 77.5398 24.8734C77.4412 23.283 76.3911 21.7513 75.477 19.9758C62.6541 19.6779 50.1322 19.5871 37.6101 19.5483C37.0619 19.5466 36.5122 20.0198 35.6772 20.3603C35.3675 21.0476 35.3437 21.6464 35.3599 22.6789C35.3615 29.6088 35.323 36.1049 35.0833 42.6699C34.6249 42.9066 34.498 43.144 34.0432 43.5342C27.1417 43.5537 20.6982 43.4897 14.2606 43.1131C13.9872 41.7812 13.7081 40.7619 13.429 39.7425C13.4125 31.4089 13.396 23.0753 13.6895 14.2058C14.2315 13.2531 14.4635 12.8362 14.6956 12.4193C14.6956 12.4193 14.7994 12.2602 15.0474 12.1881C15.5074 11.9902 15.6063 11.8044 15.5921 11.5586C15.5921 11.5586 15.6607 11.3901 15.9884 11.2933C16.6051 10.8047 16.894 10.4131 17.1829 10.0214C17.1829 10.0214 17.4236 9.69083 17.8714 9.52368C18.8693 8.66271 19.4193 7.96888 19.9694 7.27506C19.9694 7.27506 20.0919 7.39354 20.2676 7.263C20.5826 6.85016 20.7219 6.56786 20.8612 6.28556C20.8612 6.28556 21.1386 5.92416 21.4752 5.76995C22.0093 5.50178 22.0979 5.33134 22.0777 5.10444C22.3462 4.7958 22.6146 4.48716 23.2773 3.96022C23.873 3.62273 23.9651 3.44655 23.9478 3.2134C23.9478 3.2134 24.0642 3.01011 24.324 2.9163C24.7934 2.69827 24.8922 2.51459 24.8802 2.27145C24.8802 2.27145 24.9929 2.07718 25.2436 1.99748C25.7002 1.80756 25.7983 1.6359 25.7886 1.40282C25.8946 1.28702 26.0006 1.17123 26.7496 0.978277C42.8381 0.913268 58.2837 0.948192 73.7291 0.912671C76.0105 0.907425 78.2911 0.568868 80.572 0.38452Z"
          fill="#FF0044"
        />
        <path
          d="M97.3733 105.999C94.4713 108.973 91.5694 111.948 88.1539 115.125C87.4452 115.583 87.2501 115.838 87.055 116.094C87.055 116.094 87.0331 116.036 86.6642 116.051C83.397 116.363 80.5004 116.898 77.6002 116.917C60.4522 117.033 43.3034 117.029 26.1549 117.066C22.3752 113.435 18.4458 109.941 14.9065 106.09C13.8333 104.922 13.4482 102.773 13.4162 101.061C13.2606 92.7185 13.3315 84.3719 13.6509 75.5362C15.7178 75.0644 17.4561 75.0832 19.2656 75.2534C19.581 75.306 19.8253 75.2072 20.4844 75.0389C23.1234 74.8303 25.3474 74.6912 27.8632 74.6497C28.5544 74.6824 28.9539 74.6174 29.7274 74.6932C31.43 74.9374 32.7587 75.0409 34.167 75.4029C34.5701 76.7531 34.8935 77.8447 35.294 79.3612C35.3189 84.4214 35.2667 89.0568 34.9511 93.8871C35.1143 95.1877 35.5408 96.2934 35.9439 97.4298C35.9204 97.4605 35.9401 97.3859 36.1966 97.6776C49.2321 98.1106 62.0117 98.3322 74.7889 98.2369C75.7816 98.2295 77.512 96.0572 77.6062 94.7949C77.9489 90.1979 77.5659 85.5502 77.8247 80.9422C77.9366 78.9516 78.9468 77.0114 79.9811 74.9679C86.0493 74.9607 91.6851 75.034 97.3105 75.547C97.3244 85.9909 97.3488 95.995 97.3733 105.999Z"
          fill="#FF0044"
        />
        <path
          d="M97.3211 75.1072C91.6852 75.034 86.0493 74.9607 79.6394 74.8563C78.1521 74.9008 77.4389 74.9764 76.4457 74.9519C75.7785 74.8955 75.3913 74.9394 74.7992 74.8848C74.5944 74.7863 74.1439 74.7261 73.9599 74.6121C73.4615 74.4174 73.1978 74.4993 72.9291 74.6654C72.8736 74.587 73.0059 74.4474 72.7626 74.1452C61.1185 73.7132 49.7179 73.5709 38.3168 73.4944C37.8061 73.491 37.2914 74.0844 36.584 74.5022C36.1139 74.7337 35.8295 74.7581 35.2757 74.4078C33.128 74.2761 31.2408 74.4142 29.3535 74.5523C28.954 74.6174 28.5544 74.6824 27.691 74.371C20.5781 73.8455 13.9292 73.6832 7.27933 73.5859C6.93949 73.5809 6.59145 74.1347 6.24723 74.4284C4.28782 74.5364 2.32842 74.6444 0 74.7728C0 64.289 0 54.2301 0 43.6272C4.16032 43.6272 8.1352 43.6272 12.7626 43.6065C13.4152 43.5859 13.8567 43.6196 13.8567 43.6196L14.2548 43.4257C20.6983 43.4897 27.1418 43.5537 34.246 43.6296C35.2111 43.584 35.5155 43.5266 36.2548 43.5454C49.962 43.5708 63.2344 43.5199 76.7363 43.5421C77.4295 43.5768 77.8933 43.5382 78.357 43.4996C81.6719 43.5395 84.9867 43.5794 89.0667 43.6725C90.963 43.6519 92.0942 43.5781 93.2255 43.5043C94.3749 43.5367 95.5244 43.5691 97.3744 43.6322C98.4705 43.6 98.866 43.537 99.2614 43.474C103.408 43.6022 107.555 43.7304 111.651 44.4859C111.482 54.8708 111.364 64.6283 111.246 74.3858C107.431 74.5887 103.616 74.7917 99.1256 74.9374C98.0733 74.9558 97.6972 75.0315 97.3211 75.1072ZM41.4161 48.1224C39.2754 47.9438 37.1347 47.7652 34.7451 47.1263C32.9076 47.8319 31.0701 48.5375 28.6372 48.9112C23.0254 48.5992 17.412 48.1075 11.8033 48.1568C10.8954 48.1648 9.32553 50.5307 9.23551 51.8845C8.91877 56.6474 9.11056 61.4443 9.11569 66.2282C9.11907 69.3743 10.8568 70.5887 13.836 70.5513C17.5438 70.5047 21.2836 70.8293 24.9473 70.4269C26.6485 70.2401 28.2025 68.7152 30.415 67.7811C30.8065 67.7277 31.1981 67.6743 32.1841 68.0204C33.0499 68.8605 33.8884 70.3927 34.786 70.428C40.4375 70.6507 46.1022 70.5408 52.0176 70.5408C52.0176 68.0031 52.0176 65.9605 52.0176 63.7884C47.8578 64.6044 43.9938 65.3625 39.7057 66.2037C39.7057 63.0123 39.7998 60.7059 39.6821 58.4103C39.5319 55.4814 39.3771 52.6248 42.9384 50.6027C42.6926 49.8455 42.4469 49.0883 41.4161 48.1224ZM78.1994 72.3886C77.4496 72.1263 74.7992 76.5669 75.8221 65.3169C75.6694 63.3546 75.3369 61.6628 75.7798 59.3895C75.6292 58.864 75.9626 58.0444 75.6534 57.3074C75.6534 57.3074 75.726 57.0533 75.7798 56.0865C75.7468 55.441 75.7137 54.7956 75.6688 53.4652C76.1785 49.2192 74.1674 47.539 70.0412 47.7034C66.496 47.8447 62.9407 47.7158 59.3903 47.747C56.3801 47.7735 54.8416 49.3429 54.8277 52.3383C54.8063 56.9639 54.502 61.6255 55.0073 66.1958C55.1805 67.7619 57.3096 70.1898 58.7445 70.3415C63.4722 70.8412 68.3277 70.8141 73.0592 70.3006C75.2862 70.0588 77.1017 69.4972 79.5162 70.2774C81.2775 70.8466 84.6412 72.337 86.1082 68.0416C85.6802 66.8366 85.2523 65.6317 84.7494 64.2159C88.8003 64.2159 92.4709 64.2159 96.0332 64.2159C95.7165 66.5027 95.4666 68.307 95.1579 70.5353C97.558 70.5353 99.4065 70.9637 100.858 70.3901C101.887 69.9836 103.241 67.9462 102.972 67.112C101.207 61.6357 99.1241 56.2541 96.9394 50.9256C96.4416 49.7115 95.2068 48.0185 94.1934 47.9327C90.1345 47.5888 86.0293 47.7906 81.307 47.7906C81.307 57.9968 80.9884 60.7823 78.1994 72.3886Z"
          fill="#015FA0"
        />
        <path
          d="M26.4305 117.4C43.3033 117.029 60.4521 117.033 77.6001 116.917C80.5003 116.898 83.3969 116.363 86.6919 116.064C85.9903 116.738 84.892 118 83.7936 118C64.7645 118.003 45.7354 117.851 26.4305 117.4Z"
          fill="#FF0044"
        />
        <path
          d="M97.3105 75.547C97.6972 75.0315 98.0733 74.9558 98.7379 74.9292C99.0515 83.7516 99.1262 92.5254 99.0523 101.298C99.0402 102.732 98.3729 104.161 97.6909 105.796C97.3489 95.9949 97.3245 85.9908 97.3105 75.547Z"
          fill="#FF0044"
        />
        <path
          d="M80.1586 0.225586C78.291 0.568887 76.0104 0.907445 73.729 0.912691C58.2836 0.948212 42.8381 0.913288 26.9523 0.858315C27.4918 0.532615 28.4714 0.00442002 29.4516 0.00339124C46.2161 -0.014216 62.9807 0.0333806 80.1586 0.225586Z"
          fill="#FF0044"
        />
        <path
          d="M6.60319 74.5186C6.59145 74.1347 6.93948 73.5809 7.27932 73.5859C13.9292 73.6832 20.5781 73.8455 27.3993 74.2733C25.3475 74.6912 23.1234 74.8303 20.2663 74.9625C19.6333 74.9555 19.1943 75.102 19.1943 75.102C17.4561 75.0832 15.7179 75.0644 13.5447 75.1145C11.0596 74.9919 9.00937 74.8004 6.60319 74.5186Z"
          fill="#015FA0"
        />
        <path
          d="M111.64 74.2267C111.364 64.6283 111.482 54.8708 111.856 44.8229C112.086 54.3776 112.06 64.2226 111.64 74.2267Z"
          fill="#015FA0"
        />
        <path
          d="M14.2605 43.1131C14.2547 43.4257 13.8567 43.6195 13.8567 43.6195C13.8567 43.6195 13.4151 43.5859 13.2077 43.5088C13.0402 42.385 13.08 41.3383 13.2744 40.017C13.7081 40.7619 13.9872 41.7812 14.2605 43.1131Z"
          fill="#FF0044"
        />
        <path
          d="M99.242 43.1349C98.8658 43.537 98.4703 43.6 97.7991 43.5523C97.8399 42.6585 98.1565 41.8754 98.6938 40.9484C99.0172 41.4684 99.12 42.1321 99.242 43.1349Z"
          fill="#FF0044"
        />
        <path
          d="M19.7008 7.3389C19.4193 7.96891 18.8692 8.66273 18.03 9.39463C18.3046 8.75604 18.8684 8.07938 19.7008 7.3389Z"
          fill="#FF0044"
        />
        <path
          d="M85.21 0.3251C84.6297 0.577153 83.7651 0.653147 82.6201 0.55257C83.2018 0.300346 84.0638 0.224694 85.21 0.3251Z"
          fill="#FF0044"
        />
        <path
          d="M14.5025 12.4422C14.4634 12.8362 14.2314 13.2531 13.777 13.7776C13.8063 13.4118 14.0579 12.9384 14.5025 12.4422Z"
          fill="#FF0044"
        />
        <path
          d="M16.9321 10.0655C16.8939 10.4131 16.605 10.8047 16.064 11.2426C16.1017 10.8957 16.3915 10.5026 16.9321 10.0655Z"
          fill="#FF0044"
        />
        <path
          d="M96.2704 10.849C95.9052 10.832 95.4743 10.5824 95.0488 10.0682C95.4378 10.0744 95.8213 10.3453 96.2704 10.849Z"
          fill="#FF0044"
        />
        <path
          d="M97.5473 12.0891C97.2202 12.0801 96.8146 11.8514 96.3812 11.361C96.7253 11.356 97.097 11.6127 97.5473 12.0891Z"
          fill="#FF0044"
        />
        <path
          d="M92.5254 7.13888C92.1494 7.11485 91.696 6.84032 91.2202 6.28644C91.6146 6.30085 92.0312 6.59461 92.5254 7.13888Z"
          fill="#FF0044"
        />
        <path
          d="M93.8332 8.45644C93.4894 8.43986 93.0806 8.18702 92.6427 7.66684C92.9985 7.67305 93.3834 7.94662 93.8332 8.45644Z"
          fill="#FF0044"
        />
        <path
          d="M94.7023 9.34142C94.7279 9.48302 94.3689 9.5874 94.3689 9.5874C94.3689 9.5874 94.098 9.33079 94.1399 9.14783C94.3981 8.9353 94.5631 9.01361 94.7023 9.34142Z"
          fill="#FF0044"
        />
        <path
          d="M87.2916 116.014C87.2501 115.838 87.4452 115.583 87.8648 115.229C87.9022 115.398 87.7152 115.666 87.2916 116.014Z"
          fill="#FF0044"
        />
        <path
          d="M15.4251 11.5831C15.6062 11.8044 15.5073 11.9902 15.1336 12.1481C14.9418 11.9268 15.0372 11.7359 15.4251 11.5831Z"
          fill="#FF0044"
        />
        <path
          d="M98.5031 13.2224C98.5125 13.3789 98.1212 13.3971 98.1212 13.3971C98.1212 13.3971 97.8787 13.0905 97.9414 12.9046C98.2379 12.735 98.4011 12.8508 98.5031 13.2224Z"
          fill="#FF0044"
        />
        <path
          d="M98.9958 14.654C98.606 14.6991 98.4592 14.4465 98.5561 13.8961C98.9526 13.8474 99.099 14.1001 98.9958 14.654Z"
          fill="#FF0044"
        />
        <path
          d="M89.2426 3.8798C89.295 4.05636 88.8614 4.10087 88.8614 4.10087C88.8614 4.10087 88.5398 3.8075 88.5503 3.58927C88.831 3.36765 89.0408 3.47837 89.2426 3.8798Z"
          fill="#FF0044"
        />
        <path
          d="M25.6185 1.39793C25.7982 1.63593 25.7001 1.80758 25.3406 1.94088C25.1174 1.70198 25.2045 1.51166 25.6185 1.39793Z"
          fill="#FF0044"
        />
        <path
          d="M20.6282 6.35791C20.7218 6.56788 20.5825 6.85018 20.2076 7.20355C20.113 6.99315 20.2541 6.71169 20.6282 6.35791Z"
          fill="#FF0044"
        />
        <path
          d="M24.7054 2.28107C24.8922 2.51459 24.7934 2.69828 24.4237 2.85478C24.2012 2.62062 24.2902 2.42183 24.7054 2.28107Z"
          fill="#FF0044"
        />
        <path
          d="M23.78 3.21925C23.965 3.44656 23.873 3.62273 23.5184 3.76927C23.2961 3.54079 23.3784 3.35029 23.78 3.21925Z"
          fill="#FF0044"
        />
        <path
          d="M88.2146 2.88281C88.2548 3.06218 87.8201 3.08587 87.8201 3.08587C87.8201 3.08587 87.5254 2.76628 87.5472 2.54915C87.8382 2.34617 88.04 2.46998 88.2146 2.88281Z"
          fill="#FF0044"
        />
        <path
          d="M21.9171 5.11136C22.098 5.33137 22.0093 5.5018 21.6628 5.64056C21.4534 5.42039 21.5343 5.23803 21.9171 5.11136Z"
          fill="#FF0044"
        />
        <path
          d="M76.7362 43.5421C76.4746 37.3157 76.3982 31.1622 76.4334 25.0094C76.4465 22.7263 76.0853 21.1602 73.2276 21.1844C61.2143 21.2862 49.2 21.2643 37.1862 21.3193C36.7676 21.3213 36.3506 21.6595 35.6264 22.0431C35.3437 21.6464 35.3675 21.0476 36.1054 20.3751C49.8056 20.2652 62.7917 20.2289 75.7779 20.1927C76.3911 21.7513 77.4412 23.283 77.5397 24.8734C77.9091 30.8346 77.9676 36.815 78.2498 43.1438C77.8932 43.5381 77.4295 43.5767 76.7362 43.5421Z"
          fill="#FF0044"
        />
        <path
          d="M75.477 19.9758C62.7918 20.229 49.8056 20.2652 36.3914 20.2866C36.5122 20.0198 37.0619 19.5466 37.6101 19.5483C50.1322 19.5872 62.6542 19.6779 75.477 19.9758Z"
          fill="#FF0044"
        />
        <path
          d="M93.0451 43.2958C92.0942 43.5781 90.9629 43.6519 89.5145 43.6091C90.4198 43.3574 91.6423 43.2223 93.0451 43.2958Z"
          fill="#FF0044"
        />
        <path
          d="M35.0833 42.6699C35.5469 42.6763 35.6982 42.8487 35.7791 43.2938C35.5154 43.5266 35.211 43.584 34.7039 43.5461C34.4979 43.144 34.6249 42.9067 35.0833 42.6699Z"
          fill="#FF0044"
        />
        <path
          d="M36.1965 97.6776C48.0944 97.3858 60.2508 97.2634 72.4019 97.4623C75.9086 97.5197 76.9298 96.4097 76.7755 92.9964C76.5191 87.3227 76.7162 81.6286 76.7239 75.4976C77.4387 74.9765 78.152 74.9008 79.207 74.9367C78.9467 77.0114 77.9365 78.9516 77.8246 80.9422C77.5658 85.5502 77.9488 90.1979 77.606 94.7949C77.5119 96.0572 75.7815 98.2295 74.7888 98.2369C62.0116 98.3322 49.232 98.1106 36.1965 97.6776Z"
          fill="#FF0044"
        />
        <path
          d="M29.7274 74.6931C31.2407 74.4142 33.1279 74.276 35.2786 74.4972C35.5421 74.8565 35.5431 75.034 35.1756 75.0147C34.5679 75.045 34.3276 75.0947 34.0874 75.1443C32.7587 75.0409 31.43 74.9374 29.7274 74.6931Z"
          fill="#015FA0"
        />
        <path
          d="M34.951 93.8871C35.4226 94.7186 35.6308 95.745 35.9032 97.0853C35.5408 96.2934 35.1142 95.1877 34.951 93.8871Z"
          fill="#FF0044"
        />
        <path
          d="M34.1669 75.4029C34.3275 75.0947 34.5677 75.045 35.2739 75.0972C35.7398 75.199 35.9725 75.3096 35.9725 75.3096C35.8229 76.3376 35.6733 77.3657 35.3702 78.665C34.8933 77.8447 34.5699 76.7531 34.1669 75.4029Z"
          fill="#FF0044"
        />
        <path
          d="M19.2655 75.2534C19.1943 75.102 19.6332 74.9554 19.8514 75.0319C19.8253 75.2072 19.581 75.306 19.2655 75.2534Z"
          fill="#FF0044"
        />
        <path
          d="M75.7527 56.5699C73.2694 56.9388 70.8093 56.8752 68.3575 56.6968C65.2603 56.4715 64.5414 57.9323 65.4674 60.9384C66.998 61.1333 68.6275 61.3407 70.6831 61.6025C70.7933 62.7974 70.9116 64.08 71.0637 65.7295C67.2826 65.7295 63.8426 65.7295 60.1112 65.7295C60.1112 61.3554 60.1112 57.1186 60.1112 51.4876C64.2324 52.4306 68.0083 53.3343 71.8055 54.1371C72.8288 54.3535 75.8587 54.7784 77.2697 54.747C77.6553 55.3104 75.7466 55.441 75.7527 56.5699Z"
          fill="#015FA0"
        />
        <path
          d="M34.9297 53.8107C34.975 56.6915 34.788 59.6004 35.1329 62.4449C35.4578 65.124 34.1417 66.3065 31.7998 67.3852C31.198 67.6743 30.8065 67.7277 30.119 67.789C29.7896 66.7757 29.756 65.7545 30.1389 64.2101C30.7925 61.6217 31.2851 59.5466 31.2046 57.4939C31.0947 54.6889 32.1836 53.5237 34.9297 53.8107Z"
          fill="#015FA0"
        />
        <path
          d="M34.9233 53.4815C32.1835 53.5237 31.0947 54.6889 31.2046 57.4939C31.285 59.5466 30.7924 61.6218 30.2572 63.8441C29.8888 63.2566 29.8184 62.5119 29.9688 61.1071C30.0987 58.2975 30.0077 56.1479 29.9167 53.9983C29.864 53.5183 29.8112 53.0384 29.8983 52.1207C30.1062 51.4734 30.0589 51.2901 29.8963 51.1332C29.7345 50.718 29.5728 50.3027 29.3218 49.5653C31.07 48.5375 32.9075 47.8319 34.8695 47.3565C30.0258 49.3736 33.0625 51.2711 34.9233 53.4815Z"
          fill="#015FA0"
        />
        <path
          d="M72.7625 74.1452C61.2182 74.4944 49.4305 74.5415 37.2107 74.4942C37.2914 74.0844 37.8061 73.491 38.3168 73.4944C49.7178 73.5709 61.1185 73.7132 72.7625 74.1452Z"
          fill="#015FA0"
        />
        <path
          d="M42.74 50.8036C42.466 50.335 42.3903 49.6655 42.2578 48.6635C42.4467 49.0883 42.6925 49.8455 42.74 50.8036Z"
          fill="#015FA0"
        />
        <path
          d="M22.7853 65.0734C19.6797 65.4129 16.9963 65.7105 13.9769 66.0454C13.9769 61.354 13.9769 57.1161 13.9769 51.8069C17.7559 52.3539 23.2926 51.7968 24.2059 53.5894C25.7823 56.6836 26.81 61.5278 22.7853 65.0734Z"
          fill="#015FA0"
        />
        <path
          d="M29.8045 54.3767C30.0077 56.1479 30.0987 58.2975 30.0665 60.7429C29.8596 58.9442 29.7759 56.8496 29.8045 54.3767Z"
          fill="#015FA0"
        />
        <path
          d="M29.8309 51.3143C30.0588 51.2901 30.1061 51.4734 29.9793 51.7654C29.9204 51.8478 29.7657 51.4953 29.8309 51.3143Z"
          fill="#015FA0"
        />
        <path
          d="M87.9371 54.0506C92.3839 51.026 93.3538 51.8326 94.0589 58.9452C91.7935 58.9452 89.5528 58.9452 86.703 58.9452C87.1269 57.2462 87.481 55.8271 87.9371 54.0506Z"
          fill="#015FA0"
        />
      </svg>
    );
  },
);
