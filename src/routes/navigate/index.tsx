import { component$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";

export default component$(() => {
  return (
    <nav>
      <ul class="space-y-2">
        <li class="flex">
          <Link
            class="mabry w-full border-2 border-solid border-brand-blue px-4 py-2.5 text-center text-lg text-brand-blue outline-4 outline-offset-0 focus-visible:outline focus-visible:outline-brand-red"
            href="/cuts"
          >
            Cortes
          </Link>
        </li>
        <li class="flex">
          <Link
            class="mabry w-full border-2 border-solid border-brand-blue px-4 py-2.5 text-center text-lg text-brand-blue outline-4 outline-offset-0 focus-visible:outline focus-visible:outline-brand-red"
            href="/ranking"
          >
            Ranking
          </Link>
        </li>
      </ul>
    </nav>
  );
});
