import { sanitizeHtml } from "@/lib/sanitize-html";

/**
 * Renders body HTML written in the admin editor.
 *
 * Sanitised again here even though the action already sanitised it on save:
 * rows can be edited outside the app, and the cost of a second pass is far
 * lower than the cost of trusting the database.
 */
export function Prose({ html, className = "" }: { html: string | null; className?: string }) {
  if (!html) return null;

  return (
    <div
      className={`wr-prose text-[clamp(1rem,0.97rem+0.15vw,1.0625rem)] leading-[1.75] text-muted-foreground ${className}`}
      dangerouslySetInnerHTML={{ __html: sanitizeHtml(html) }}
    />
  );
}
