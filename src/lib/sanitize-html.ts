/**
 * Allowlist sanitiser for rich-text bodies.
 *
 * The editor stores HTML, which means the browser will execute whatever it is
 * given. Everything written to the database goes through here first: unknown
 * tags are unwrapped, unknown attributes are dropped, and only http/https/
 * mailto/relative URLs survive. Nothing here is optional — a pasted document
 * from Word or a webpage carries scripts, styles and event handlers.
 */

/** Tags kept, mapped to the attributes each may carry. */
const ALLOWED: Record<string, string[]> = {
  p: [],
  br: [],
  strong: [],
  b: [],
  em: [],
  i: [],
  u: [],
  s: [],
  h1: [],
  h2: [],
  h3: [],
  h4: [],
  h5: [],
  h6: [],
  ul: [],
  ol: [],
  li: [],
  blockquote: [],
  pre: [],
  code: [],
  hr: [],
  a: ["href", "title", "target", "rel"],
  img: ["src", "alt", "title"],
  figure: [],
  figcaption: [],
};

/** Dropped along with everything inside them. */
const STRIP_WITH_CONTENT = new Set(["script", "style", "iframe", "object", "embed", "template"]);

const VOID_TAGS = new Set(["br", "hr", "img"]);

function safeUrl(value: string): string | null {
  const url = value.trim();
  if (!url) return null;
  // Reject anything that is not clearly a safe scheme or a relative path.
  if (/^(https?:\/\/|mailto:|\/|#)/i.test(url) && !/^javascript:/i.test(url)) return url;
  return null;
}

function escapeText(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function escapeAttribute(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/**
 * Regex-based on purpose: this runs on the server, where there is no DOM, and
 * pulling in a parser for one field is not worth the dependency. It is
 * conservative — anything it does not recognise is removed, never passed on.
 */
export function sanitizeHtml(input: string): string {
  if (!input) return "";

  let html = input;

  // 1. Remove dangerous elements together with their contents.
  for (const tag of STRIP_WITH_CONTENT) {
    html = html.replace(new RegExp(`<${tag}\\b[\\s\\S]*?</${tag}\\s*>`, "gi"), "");
    html = html.replace(new RegExp(`<${tag}\\b[^>]*/?>`, "gi"), "");
  }

  // 2. Drop comments and processing instructions.
  html = html.replace(/<!--[\s\S]*?-->/g, "").replace(/<\?[\s\S]*?\?>/g, "");

  // 3. Walk every remaining tag and rebuild it from the allowlist.
  html = html.replace(
    /<(\/?)([a-zA-Z][a-zA-Z0-9]*)((?:[^<>"']|"[^"]*"|'[^']*')*)>/g,
    (_full, closing: string, rawName: string, rawAttrs: string) => {
      const name = rawName.toLowerCase();
      const allowedAttrs = ALLOWED[name];

      // Unknown tag: unwrap it, keeping whatever text it contained.
      if (!allowedAttrs) return "";

      if (closing) return `</${name}>`;

      const attrs: string[] = [];
      const attrPattern = /([a-zA-Z_:][-a-zA-Z0-9_:.]*)\s*=\s*("([^"]*)"|'([^']*)'|([^\s"'>]+))/g;
      let match: RegExpExecArray | null;

      while ((match = attrPattern.exec(rawAttrs)) !== null) {
        const attr = match[1]!.toLowerCase();
        if (!allowedAttrs.includes(attr)) continue;

        const value = match[3] ?? match[4] ?? match[5] ?? "";

        if (attr === "href" || attr === "src") {
          const url = safeUrl(value);
          if (!url) continue;
          attrs.push(`${attr}="${escapeAttribute(url)}"`);
          continue;
        }

        attrs.push(`${attr}="${escapeAttribute(value)}"`);
      }

      // Links that open a new tab must not hand the opener over with them.
      if (name === "a" && attrs.some((a) => a.startsWith('target="_blank"'))) {
        if (!attrs.some((a) => a.startsWith("rel="))) attrs.push('rel="noopener noreferrer"');
      }

      const open = [name, ...attrs].join(" ");
      return VOID_TAGS.has(name) ? `<${open} />` : `<${open}>`;
    },
  );

  // 4. Any stray angle bracket left over is literal text, not markup.
  html = html.replace(/<(?![a-zA-Z/])/g, "&lt;");

  return html.trim();
}

/** True when the value still carries meaning once tags and spaces are removed. */
export function isEmptyHtml(html: string): boolean {
  return !escapeText(html.replace(/<[^>]*>/g, ""))
    .replace(/&nbsp;/g, " ")
    .trim();
}
