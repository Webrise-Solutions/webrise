"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { EditorIcon, type EditorIconName } from "@/components/admin/editor-icons";
import { hintClass, labelClass } from "@/components/admin/fields";
import { uploadImage, type UploadBucket } from "@/actions/admin/upload";
import { renderMarkdown } from "@/lib/markdown";

const MAX_BYTES = 5 * 1024 * 1024;

/** A letter rendered in the style it applies, the way every editor draws these. */
type Letter = { char: string; style: "plain" | "bold" | "italic" | "underline" | "strike" };

type Tool =
  | { kind: "separator" }
  | {
      kind: "command";
      label: string;
      command: string;
      value?: string;
      icon?: EditorIconName;
      letter?: Letter;
      /** What marks this button as currently applied. */
      active?: { type: "state"; command: string } | { type: "block"; tag: string };
    }
  | {
      kind: "custom";
      label: string;
      icon?: EditorIconName;
      action: "link" | "unlink" | "image";
    };

const TOOLS: Tool[] = [
  {
    kind: "command",
    label: "Paragraph",
    letter: { char: "p", style: "plain" },
    command: "formatBlock",
    value: "p",
    active: { type: "block", tag: "P" },
  },
  { kind: "separator" },
  {
    kind: "command",
    label: "Bold",
    letter: { char: "b", style: "bold" },
    command: "bold",
    active: { type: "state", command: "bold" },
  },
  {
    kind: "command",
    label: "Italic",
    letter: { char: "i", style: "italic" },
    command: "italic",
    active: { type: "state", command: "italic" },
  },
  {
    kind: "command",
    label: "Underline",
    letter: { char: "u", style: "underline" },
    command: "underline",
    active: { type: "state", command: "underline" },
  },
  {
    kind: "command",
    label: "Strikethrough",
    letter: { char: "s", style: "strike" },
    command: "strikeThrough",
    active: { type: "state", command: "strikeThrough" },
  },
  { kind: "separator" },
  {
    kind: "command",
    label: "Bulleted list",
    icon: "listBullet",
    command: "insertUnorderedList",
    active: { type: "state", command: "insertUnorderedList" },
  },
  {
    kind: "command",
    label: "Numbered list",
    icon: "listOrdered",
    command: "insertOrderedList",
    active: { type: "state", command: "insertOrderedList" },
  },
  {
    kind: "command",
    label: "Quote",
    icon: "quote",
    command: "formatBlock",
    value: "blockquote",
    active: { type: "block", tag: "BLOCKQUOTE" },
  },
  {
    kind: "command",
    label: "Code block",
    icon: "code",
    command: "formatBlock",
    value: "pre",
    active: { type: "block", tag: "PRE" },
  },
  { kind: "separator" },
  { kind: "custom", label: "Insert link", icon: "link", action: "link" },
  { kind: "custom", label: "Remove link", icon: "unlink", action: "unlink" },
  { kind: "custom", label: "Insert image", icon: "image", action: "image" },
  { kind: "separator" },
  { kind: "command", label: "Horizontal rule", icon: "rule", command: "insertHorizontalRule" },
  { kind: "command", label: "Clear formatting", icon: "clear", command: "removeFormat" },
  { kind: "separator" },
  { kind: "command", label: "Undo", icon: "undo", command: "undo" },
  { kind: "command", label: "Redo", icon: "redo", command: "redo" },
];

const letterStyles: Record<Letter["style"], string> = {
  plain: "font-medium",
  bold: "font-bold",
  italic: "italic font-serif",
  underline: "underline underline-offset-2",
  strike: "line-through",
};

/**
 * Headings only. Paragraph is a separate button: it is the way *out* of a
 * heading, not another kind of heading, and mixing them in one menu made the
 * default body style look like a seventh heading level.
 */
const HEADINGS: { value: string; label: string }[] = [
  { value: "h1", label: "Heading 1" },
  { value: "h2", label: "Heading 2" },
  { value: "h3", label: "Heading 3" },
  { value: "h4", label: "Heading 4" },
  { value: "h5", label: "Heading 5" },
  { value: "h6", label: "Heading 6" },
];

/**
 * Bodies written before this editor existed are markdown. Convert them once, on
 * load, so old posts open as formatted content rather than raw syntax.
 */
function toHtml(value: string): string {
  if (!value.trim()) return "";
  const looksLikeHtml = /<(p|h[1-6]|ul|ol|li|blockquote|pre|img|a|strong|em|div|br)\b/i.test(value);
  return looksLikeHtml ? value : renderMarkdown(value);
}

/**
 * What-you-see-is-what-you-get body editor. Stores HTML, not markdown.
 *
 * Built on contentEditable + document.execCommand: deprecated, but still
 * implemented in every current browser and the only way to get this without a
 * rich-text dependency. Whatever it produces is re-sanitised on the server by
 * src/lib/sanitize-html.ts before it reaches the database.
 */
export function RichTextEditor({
  name,
  label,
  bucket,
  defaultValue,
  rows = 18,
}: {
  name: string;
  label: string;
  bucket: UploadBucket;
  defaultValue?: string | null;
  rows?: number;
}) {
  const editorRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [html, setHtml] = useState(() => toHtml(defaultValue ?? ""));
  const [active, setActive] = useState<Record<string, boolean>>({});
  const [heading, setHeading] = useState("");
  // Clicking the dropdown moves focus out of the editable region, which
  // collapses the selection; it is captured beforehand and restored on change.
  const savedRange = useRef<Range | null>(null);
  const [error, setError] = useState<string>();
  const [pending, startTransition] = useTransition();

  // Seeded once, imperatively: if React owned the children, the caret would
  // jump back to the start on every keystroke.
  useEffect(() => {
    const node = editorRef.current;
    if (node && !node.innerHTML) node.innerHTML = html || "<p><br /></p>";
  }, [html]);

  function sync() {
    if (editorRef.current) setHtml(editorRef.current.innerHTML);
  }

  // Counted from the rendered text, so markup never inflates the number.
  const words = html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;

  /** Reflects the caret's formatting in the toolbar. */
  function refreshActive() {
    const next: Record<string, boolean> = {};

    for (const tool of TOOLS) {
      if (tool.kind !== "command" || !tool.active) continue;
      try {
        next[tool.label] =
          tool.active.type === "state"
            ? document.queryCommandState(tool.active.command)
            : (document.queryCommandValue("formatBlock") || "").toUpperCase() === tool.active.tag;
      } catch {
        // Some states make these throw; unknown simply means "not active".
      }
    }

    setActive(next);

    try {
      const current = (document.queryCommandValue("formatBlock") || "").toLowerCase();
      // Blank whenever the caret is in a paragraph, a list or a quote, so the
      // menu never implies the text is a heading when it is not.
      setHeading(HEADINGS.some((h) => h.value === current) ? current : "");
    } catch {
      setHeading("");
    }
  }

  function rememberSelection() {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) savedRange.current = selection.getRangeAt(0);
  }

  function applyBlock(tag: string) {
    const selection = window.getSelection();
    if (savedRange.current && selection) {
      selection.removeAllRanges();
      selection.addRange(savedRange.current);
    }
    run("formatBlock", tag);
  }

  function run(command: string, value?: string) {
    editorRef.current?.focus();
    document.execCommand(command, false, value);
    sync();
    refreshActive();
  }

  function insertLink() {
    const url = window.prompt("Link URL", "https://");
    if (!url) return;
    run("createLink", url);
  }

  function handleFile(file: File | undefined) {
    if (!file) return;
    setError(undefined);

    if (file.size > MAX_BYTES) {
      setError(`That image is ${(file.size / 1024 / 1024).toFixed(1)}MB. The limit is 5MB.`);
      if (fileRef.current) fileRef.current.value = "";
      return;
    }

    const alt =
      window.prompt(
        "Alt text — describe the image for screen readers. Leave blank if it is purely decorative.",
        "",
      ) ?? "";

    const formData = new FormData();
    formData.set("file", file);
    formData.set("bucket", bucket);

    startTransition(async () => {
      const result = await uploadImage(formData);
      if ("error" in result) {
        setError(result.error);
      } else {
        editorRef.current?.focus();
        // insertImage cannot carry alt text, so the element is built by hand.
        document.execCommand(
          "insertHTML",
          false,
          `<img src="${result.url}" alt="${alt.replace(/"/g, "&quot;")}" />`,
        );
        sync();
      }
      if (fileRef.current) fileRef.current.value = "";
    });
  }

  return (
    <div>
      <span className={labelClass}>{label}</span>

      <div className="overflow-hidden rounded-xl border border-input-line bg-white transition-shadow focus-within:border-teal focus-within:ring-2 focus-within:ring-teal/15">
        <div className="flex flex-wrap items-center gap-px border-b border-line-soft bg-[linear-gradient(to_bottom,var(--offwhite),color-mix(in_oklch,var(--sand)_45%,var(--offwhite)))] px-2 py-1.5">
          <select
            aria-label="Heading level"
            value={heading}
            onMouseDown={rememberSelection}
            onFocus={rememberSelection}
            onChange={(event) => {
              if (event.target.value) applyBlock(event.target.value);
            }}
            className={`mr-1.5 h-8 cursor-pointer rounded-md border bg-white px-2 text-[13px] font-medium outline-none transition-colors focus:border-teal ${
              heading ? "border-teal text-teal" : "border-line text-ink hover:border-input-line"
            }`}
          >
            <option value="">Heading</option>
            {HEADINGS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <span className="mx-1.5 h-5 w-px bg-line" />

          {TOOLS.map((tool, index) => {
            if (tool.kind === "separator") {
              return <span key={`sep-${index}`} className="mx-1.5 h-5 w-px bg-line" />;
            }

            const isActive = tool.kind === "command" && active[tool.label];
            const onClick =
              tool.kind === "command"
                ? () => run(tool.command, tool.value)
                : tool.action === "link"
                  ? insertLink
                  : tool.action === "unlink"
                    ? () => run("unlink")
                    : () => fileRef.current?.click();

            return (
              <button
                key={tool.label}
                type="button"
                // Keeps the text selection alive while the button takes focus.
                onMouseDown={(event) => event.preventDefault()}
                onClick={onClick}
                disabled={tool.kind === "custom" && tool.action === "image" && pending}
                title={tool.label}
                aria-label={tool.label}
                aria-pressed={
                  tool.kind === "command" && tool.active ? Boolean(isActive) : undefined
                }
                className={`grid h-8 w-8 place-items-center rounded-md border transition-[background,border-color,color] duration-150 disabled:opacity-40 ${
                  isActive
                    ? "border-teal/40 bg-teal-soft text-teal"
                    : "border-transparent text-ink hover:border-line-soft hover:bg-white"
                }`}
              >
                {tool.icon ? (
                  <EditorIcon name={tool.icon} />
                ) : tool.kind === "command" && tool.letter ? (
                  <span className={`text-[15px] leading-none ${letterStyles[tool.letter.style]}`}>
                    {tool.letter.char}
                  </span>
                ) : null}
              </button>
            );
          })}
          {pending ? (
            <span className="ml-1 text-[13px] text-muted-foreground">Uploading...</span>
          ) : null}
        </div>

        <div
          ref={editorRef}
          id={name}
          contentEditable
          suppressContentEditableWarning
          role="textbox"
          aria-multiline="true"
          aria-label={label}
          data-rich-editor
          onInput={sync}
          onBlur={sync}
          onKeyUp={refreshActive}
          onMouseUp={refreshActive}
          onFocus={refreshActive}
          style={{ minHeight: `${Math.round(rows * 1.6)}rem` }}
          className="wr-rich max-h-[70vh] overflow-y-auto px-5 py-4 text-[15.5px] leading-[1.7] text-ink outline-none"
        />

        {/* Status bar: makes the surface read as an editor rather than a box,
            and word count is the one number a writer actually wants. */}
        <div className="flex items-center justify-between border-t border-line-soft bg-offwhite px-4 py-1.5 text-[12px] text-muted-foreground">
          <span>Rich text</span>
          <span className="tabular-nums">
            {words} {words === 1 ? "word" : "words"}
          </span>
        </div>
      </div>

      {/* What is actually submitted; re-sanitised server-side before saving. */}
      <input type="hidden" name={name} value={html} />

      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
        className="sr-only"
        tabIndex={-1}
        onChange={(event) => handleFile(event.target.files?.[0])}
      />

      {error ? (
        <p role="alert" className="mt-1.5 text-[13px] text-rust">
          {error}
        </p>
      ) : (
        <p className={hintClass}>
          Formatting applies to the selection. Inserted images ask for alt text.
        </p>
      )}
    </div>
  );
}
