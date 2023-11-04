import { component$ } from "@builder.io/qwik";
import {
  QwikCityProvider,
  RouterOutlet,
  ServiceWorkerRegister,
} from "@builder.io/qwik-city";
import { useDocumentHead, useLocation } from "@builder.io/qwik-city";
import "~/styles/global.css";

export default component$(() => {
  return (
    <QwikCityProvider>
      <head>
        <meta charSet="utf-8" />
        <link rel="manifest" href="/manifest.json" />
        <Head />
        <ServiceWorkerRegister />
      </head>
      <body lang="en">
        <RouterOutlet />
        <RouteTransition />
      </body>
    </QwikCityProvider>
  );
});

export const RouteTransition = component$(() => {
  const location = useLocation();

  if (location.isNavigating)
    return (
      <div
        role="progressbar"
        class="route-transition fixed left-0 top-0 h-1.5 w-full bg-brand-blue"
      />
    );

  return null;
});

export const Head = component$(() => {
  const head = useDocumentHead();
  const loc = useLocation();

  return (
    <>
      <title>{head.title}</title>

      <link rel="canonical" href={loc.url.href} />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link rel="icon" type="image/svg+xml" href="/favicon.svg" />

      {head.meta.map((m) => (
        <meta key={m.key} {...m} />
      ))}

      {head.links.map((l) => (
        <link key={l.key} {...l} />
      ))}

      {head.styles.map((s) => (
        <style key={s.key} {...s.props} dangerouslySetInnerHTML={s.style} />
      ))}

      {head.scripts.map((s) => (
        <script key={s.key} {...s.props} dangerouslySetInnerHTML={s.script} />
      ))}
    </>
  );
});
