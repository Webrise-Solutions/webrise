import { ToolLogo } from "@/components/shared/ToolLogo";
import type { Tool } from "@/types/site";

// Mailchimp's logo is bright yellow (#FFE01B) — Mailchimp's own brand guidelines
// place it on a dark tile since it disappears on light backgrounds.
const darkTileTools = new Set(["Mailchimp"]);

export function ToolCard({ tool }: { tool: Tool }) {
  const isDarkTile = darkTileTools.has(tool.name);

  return (
    <article className="flex flex-col items-center rounded-[18px] border border-line-soft bg-white px-6 py-8 text-center shadow-card transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-lift">
      <div
        className={`grid h-[82px] w-full place-items-center rounded-2xl ${
          isDarkTile ? "max-w-[96px] bg-ink p-3" : "bg-transparent px-2"
        }`}
      >
        <ToolLogo name={tool.name} size={52} className="max-h-full max-w-full object-contain" />
      </div>
      <h3 className="mt-5 text-[19px]">{tool.name}</h3>
      <p className="mt-2.5 text-sm text-muted-foreground">{tool.description}</p>
      <div
        className={`mt-5 h-[3px] w-10 rounded-full ${tool.tone === "teal" ? "bg-teal" : "bg-orange"}`}
      />
    </article>
  );
}
