import { component$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";

export default component$(() => {
  return (
    <nav>
      <ul class="space-y-3">
        <li>
          <Link
            class="mabry px-4 py-2 text-lg text-brand-blue outline-4 outline-offset-0 focus-visible:outline focus-visible:outline-brand-red"
            href="/"
          >
            Cortes
          </Link>
        </li>
        <li>
          <Link
            class="mabry px-4 py-2 text-lg text-brand-blue outline-4 outline-offset-0 focus-visible:outline focus-visible:outline-brand-red"
            href="/ranking"
          >
            Ranking
          </Link>
        </li>
      </ul>
    </nav>
  );
});
