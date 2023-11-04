import type { ClassList, Signal } from "@builder.io/qwik";
import { component$ } from "@builder.io/qwik";
import clsx from "clsx";

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
