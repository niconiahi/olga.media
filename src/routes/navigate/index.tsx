import { component$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";

export default component$(() => {
  return (
    <nav class="flex h-full flex-col items-end justify-center space-y-2">
      <ul class="space-y-3">
        <li>
          <Link
            // eslint-disable-next-line prettier/prettier
            class="mabry px-4 py-2 text-lg text-brand-blue outline-4 outline-offset-0 hover:bg-brand-blueHover focus-visible:outline focus-visible:outline-brand-red"
            href="/"
          >
            Cortes
          </Link>
        </li>
        <li>
          <Link
            // eslint-disable-next-line prettier/prettier
            class="mabry px-4 py-2 text-lg text-brand-blue outline-4 outline-offset-0 hover:bg-brand-blueHover focus-visible:outline focus-visible:outline-brand-red"
            href="/ranking"
          >
            Ranking
          </Link>
        </li>
      </ul>
    </nav>
  );
});
