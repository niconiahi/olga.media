import type { ClassList, Signal } from "@builder.io/qwik";
import { component$ } from "@builder.io/qwik";

export const HeartIcon = component$<{ class: ClassList | Signal<ClassList> }>(
  (props) => {
    return (
      <svg
        class={props.class}
        viewBox="0 0 16 14"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M13.9205 2.06089C13.5784 1.72455 13.1722 1.45775 12.7252 1.27572C12.2782 1.09369 11.799 1 11.3151 1C10.8312 1 10.3521 1.09369 9.90504 1.27572C9.45801 1.45775 9.05185 1.72455 8.70976 2.06089L7.99982 2.75857L7.28988 2.06089C6.5989 1.38184 5.66172 1.00035 4.68453 1.00035C3.70733 1.00035 2.77016 1.38184 2.07917 2.06089C1.38819 2.73994 1 3.66092 1 4.62124C1 5.58157 1.38819 6.50255 2.07917 7.1816L2.78911 7.87928L7.99982 13L13.2105 7.87928L13.9205 7.1816C14.2627 6.84543 14.5342 6.44628 14.7194 6.00697C14.9047 5.56765 15 5.09678 15 4.62124C15 4.14571 14.9047 3.67484 14.7194 3.23552C14.5342 2.79621 14.2627 2.39706 13.9205 2.06089Z"
          stroke="currentColor"
          stroke-width="1"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    );
  },
);
