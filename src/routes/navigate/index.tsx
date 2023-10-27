import { component$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";

export default component$(() => {
  return (
    <nav>
      <ul class="space-y-2">
        <li class="flex">
          <Link
            // eslint-disable-next-line prettier/prettier
            class="mabry w-full text-center px-4 py-2.5 text-lg text-brand-blue outline-4 outline-offset-0 focus-visible:outline focus-visible:outline-brand-red border-2 border-solid border-brand-blue"
            href="/cuts"
          >
            Cortes
          </Link>
        </li>
        <li class="flex">
          <Link
            // eslint-disable-next-line prettier/prettier
            class="mabry text-center w-full px-4 py-2.5 text-lg text-brand-blue outline-4 outline-offset-0 focus-visible:outline focus-visible:outline-brand-red border-2 border-solid border-brand-blue"
            href="/ranking"
          >
            Ranking
          </Link>
        </li>
      </ul>
    </nav>
  );
});
