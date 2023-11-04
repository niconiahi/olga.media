import type { ClassList, Signal } from "@builder.io/qwik";
import { component$ } from "@builder.io/qwik";
import clsx from "clsx";

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
