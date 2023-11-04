import type { ClassList, Signal } from "@builder.io/qwik";
import { component$ } from "@builder.io/qwik";

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
