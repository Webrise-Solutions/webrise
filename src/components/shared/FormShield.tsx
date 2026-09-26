"use client";

import { useEffect, useId, useRef } from "react";
import { ATTRIBUTION_FIELD, ATTRIBUTION_STORAGE_KEY, captureAttribution } from "@/lib/attribution";
import { HONEYPOT_FIELD, RENDERED_AT_FIELD, SOURCE_PAGE_FIELD } from "@/lib/form-fields";

/**
 * The hidden half of every public form: spam signals plus attribution.
 *
 * The honeypot is a real input that no person can reach — off-screen, out of
 * the tab order, hidden from assistive tech, and with autocomplete off so a
 * password manager cannot fill it on someone's behalf. Anything that arrives
 * with it filled in was not typed by a human.
 *
 * rendered_at is the cheaper of the two signals and the weaker one: it is
 * client-supplied and therefore forgeable, so the server treats an impossibly
 * fast submission as a hint, never as proof. The IP throttle is the control
 * that actually holds.
 */
export function FormShield({ sourcePage }: { sourcePage?: string }) {
  const attribution = useRef<HTMLInputElement>(null);
  const renderedAt = useRef<HTMLInputElement>(null);
  // The `name` has to stay fixed for the server check, but the `id` cannot:
  // pages carry more than one shielded form now (any page's footer newsletter
  // plus the form on the page itself), and duplicate ids break the label
  // association and are invalid HTML.
  const honeypotId = useId();

  useEffect(() => {
    if (renderedAt.current) renderedAt.current.value = String(Date.now());

    if (!attribution.current) return;

    try {
      const stored = sessionStorage.getItem(ATTRIBUTION_STORAGE_KEY);
      // Falling back to a fresh capture covers the case where storage is
      // unavailable: worse attribution beats none.
      attribution.current.value = stored ?? JSON.stringify(captureAttribution());
    } catch {
      attribution.current.value = JSON.stringify(captureAttribution());
    }
  }, []);

  return (
    <>
      <div
        aria-hidden="true"
        className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden"
      >
        <label htmlFor={honeypotId}>Do not fill this in</label>
        <input
          id={honeypotId}
          type="text"
          name={HONEYPOT_FIELD}
          tabIndex={-1}
          autoComplete="off"
          defaultValue=""
        />
      </div>

      <input ref={renderedAt} type="hidden" name={RENDERED_AT_FIELD} defaultValue="" />
      <input ref={attribution} type="hidden" name={ATTRIBUTION_FIELD} defaultValue="" />
      {sourcePage ? (
        <input type="hidden" name={SOURCE_PAGE_FIELD} defaultValue={sourcePage} />
      ) : null}
    </>
  );
}
