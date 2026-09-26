/**
 * Small markdown -> HTML renderer for the admin editor preview.
 *
 * Deliberately not a full CommonMark implementation: it covers what the
 * toolbar can produce, and nothing else. The order matters — every character
 * is HTML-escaped *first*, so nothing an author pastes (or an image URL
 * carries) can introduce markup or script into the preview.
 */

const ESCAPES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => ESCAPES[char] ?? char);
}

/** Only these schemes may appear in a rendered href or src. */
function safeUrl(url: string): string | null {
  const trimmed = url.trim();
  if (/^(https?:|mailto:|\/)/i.test(trimmed) && !/[\s"'<>]/.test(trimmed)) return trimmed;
  return null;
}

function inline(text: string): string {
  let out = escapeHtml(text);

  // Images before links: the syntax differs only by the leading "!".
  out = out.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (match, alt: string, url: string) => {
    const href = safeUrl(url);
    if (!href) return match;
    return `<img src="${href}" alt="${alt}" class="my-3 max-w-full rounded-lg border border-line-soft" />`;
  });

  out = out.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, label: string, url: string) => {
    const href = safeUrl(url);
    if (!href) return match;
    return `<a href="${href}" class="text-teal underline">${label}</a>`;
  });

  out = out.replace(
    /`([^`]+)`/g,
    '<code class="rounded bg-sand px-1 py-0.5 text-[0.9em]">$1</code>',
  );
  out = out.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  out = out.replace(/(^|[^*])\*([^*]+)\*/g, "$1<em>$2</em>");

  return out;
}

export function renderMarkdown(source: string): string {
  const lines = source.replace(/\r\n/g, "\n").split("\n");
  const html: string[] = [];
  let listType: "ul" | "ol" | null = null;
  let inCode = false;
  let paragraph: string[] = [];

  const closeParagraph = () => {
    if (paragraph.length) {
      html.push(`<p class="my-3 leading-relaxed">${inline(paragraph.join(" "))}</p>`);
      paragraph = [];
    }
  };

  const closeList = () => {
    if (listType) {
      html.push(`</${listType}>`);
      listType = null;
    }
  };

  for (const line of lines) {
    if (line.trim().startsWith("```")) {
      closeParagraph();
      closeList();
      html.push(
        inCode
          ? "</code></pre>"
          : '<pre class="my-3 overflow-x-auto rounded-lg bg-sand p-3 text-[13px]"><code>',
      );
      inCode = !inCode;
      continue;
    }

    if (inCode) {
      html.push(escapeHtml(line) + "\n");
      continue;
    }

    if (!line.trim()) {
      closeParagraph();
      closeList();
      continue;
    }

    const heading = /^(#{1,4})\s+(.*)$/.exec(line);
    if (heading) {
      closeParagraph();
      closeList();
      // "##" renders as h2 so it matches the toolbar's H2 button. Clamped at 2
      // because h1 belongs to the page title, never to body content.
      const level = Math.min(Math.max(heading[1]!.length, 2), 6);
      const size = level === 2 ? "text-[20px]" : level === 3 ? "text-[17px]" : "text-[15px]";
      html.push(
        `<h${level} class="mt-5 mb-2 ${size} font-semibold text-ink">${inline(heading[2]!)}</h${level}>`,
      );
      continue;
    }

    if (/^>\s?/.test(line)) {
      closeParagraph();
      closeList();
      html.push(
        `<blockquote class="my-3 border-l-2 border-teal pl-4 italic">${inline(line.replace(/^>\s?/, ""))}</blockquote>`,
      );
      continue;
    }

    if (/^(-{3,}|\*{3,})$/.test(line.trim())) {
      closeParagraph();
      closeList();
      html.push('<hr class="my-5 border-line-soft" />');
      continue;
    }

    const bullet = /^[-*]\s+(.*)$/.exec(line);
    const numbered = /^\d+\.\s+(.*)$/.exec(line);

    if (bullet || numbered) {
      closeParagraph();
      const wanted = bullet ? "ul" : "ol";
      if (listType !== wanted) {
        closeList();
        html.push(
          `<${wanted} class="my-3 ml-5 grid gap-1 ${wanted === "ul" ? "list-disc" : "list-decimal"}">`,
        );
        listType = wanted;
      }
      html.push(`<li>${inline((bullet ?? numbered)![1]!)}</li>`);
      continue;
    }

    paragraph.push(line);
  }

  closeParagraph();
  closeList();
  if (inCode) html.push("</code></pre>");

  return html.join("");
}
