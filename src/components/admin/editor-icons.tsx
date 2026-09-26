import type { SVGProps } from "react";

/**
 * Toolbar icons for the rich-text editor.
 *
 * Kept separate from the site's `Icon` set: those are marketing glyphs at 24px
 * on a 1.75 stroke, which read as too heavy and too round in a dense 16px
 * toolbar. These are drawn on the same 24px grid at a lighter weight so the
 * toolbar looks like a tool rather than a row of buttons borrowed from a
 * landing page.
 */
const paths = {
  paragraph: (
    <>
      <path d="M13 4v16" />
      <path d="M17 4v16" />
      <path d="M19 4H9.5a4.5 4.5 0 000 9H13" />
    </>
  ),
  listBullet: (
    <>
      <path d="M9 6h11M9 12h11M9 18h11" />
      <circle cx="4.5" cy="6" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="4.5" cy="12" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="4.5" cy="18" r="1.1" fill="currentColor" stroke="none" />
    </>
  ),
  listOrdered: (
    <>
      <path d="M10 6h10M10 12h10M10 18h10" />
      <path d="M4 5.5l1.2-.7V9" />
      <path d="M3.6 11.2a1.3 1.3 0 012.2.9c0 .9-2.2 1.6-2.2 2.9h2.4" />
      <path d="M3.7 16.6a1.2 1.2 0 011.9 1c0 .5-.4.9-1 .9.6 0 1 .4 1 .9a1.2 1.2 0 01-1.9 1" />
    </>
  ),
  quote: (
    <>
      <path d="M9.5 7.5c-2 0-3.5 1.5-3.5 3.4C6 12.7 7.3 14 9 14c.3 0 .6 0 .8-.1-.4 1.5-1.6 2.6-3 3.1" />
      <path d="M18.5 7.5c-2 0-3.5 1.5-3.5 3.4 0 1.8 1.3 3.1 3 3.1.3 0 .6 0 .8-.1-.4 1.5-1.6 2.6-3 3.1" />
    </>
  ),
  code: (
    <>
      <path d="M9 8l-4 4 4 4" />
      <path d="M15 8l4 4-4 4" />
    </>
  ),
  link: (
    <>
      <path d="M10.5 13.5a3.6 3.6 0 005.1 0l2.7-2.7a3.6 3.6 0 00-5.1-5.1l-1.3 1.3" />
      <path d="M13.5 10.5a3.6 3.6 0 00-5.1 0l-2.7 2.7a3.6 3.6 0 005.1 5.1l1.3-1.3" />
    </>
  ),
  unlink: (
    <>
      <path d="M15 9l3-3a3.6 3.6 0 015.1 5.1" transform="translate(-3 -1) scale(0.86)" />
      <path d="M10.5 13.5a3.6 3.6 0 005.1 0l1.2-1.2" />
      <path d="M13.5 10.5a3.6 3.6 0 00-5.1 0l-2.7 2.7a3.6 3.6 0 005.1 5.1l1.3-1.3" />
      <path d="M4 4l16 16" />
    </>
  ),
  image: (
    <>
      <rect x="3.5" y="5" width="17" height="14" rx="2.2" />
      <circle cx="9" cy="10" r="1.6" />
      <path d="M20.5 15.5l-4.2-4-6.8 7.5" />
    </>
  ),
  rule: <path d="M4 12h16" />,
  clear: (
    <>
      <path d="M8.5 18h10" />
      <path d="M14.5 6L9 18" />
      <path d="M5.5 6h11" />
    </>
  ),
  undo: (
    <>
      <path d="M4 9h9.5a4.5 4.5 0 010 9H9" />
      <path d="M7 5.5L3.5 9 7 12.5" />
    </>
  ),
  redo: (
    <>
      <path d="M20 9h-9.5a4.5 4.5 0 000 9H15" />
      <path d="M17 5.5L20.5 9 17 12.5" />
    </>
  ),
} as const;

export type EditorIconName = keyof typeof paths;

export function EditorIcon({
  name,
  size = 17,
  ...props
}: { name: EditorIconName; size?: number } & SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {paths[name]}
    </svg>
  );
}
