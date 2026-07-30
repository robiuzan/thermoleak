import type { ReactNode } from "react";

/**
 * EmailOff — opts its children out of Cloudflare's "Email Address Obfuscation".
 *
 * thermoleak.co.il is proxied through Cloudflare, whose Scrape Shield feature rewrites every
 * address it finds in the served HTML: a `mailto:` anchor becomes
 * `/cdn-cgi/l/email-protection#<hex>` — a URL that returns **404** to crawlers and to any
 * visitor without JS — and a plain-text address becomes the English placeholder
 * "[email protected]" mid-Hebrew-sentence. Every page here carries the address, so every page
 * shipped a broken link.
 *
 * Cloudflare leaves alone whatever sits between its `email_off` / `email_on` markers. Those
 * have to be genuine HTML comments in the emitted output and JSX comments are compile-time
 * only, so each marker is written via dangerouslySetInnerHTML (a build-time constant string,
 * never user input). The carrier span is `display: contents` so it generates no box of its
 * own and cannot add a stray item to a flex or grid parent.
 */

function Marker({ html }: { html: string }) {
  return <span style={{ display: "contents" }} dangerouslySetInnerHTML={{ __html: html }} />;
}

export default function EmailOff({ children }: { children: ReactNode }) {
  return (
    <>
      <Marker html="<!--email_off-->" />
      {children}
      <Marker html="<!--email_on-->" />
    </>
  );
}
