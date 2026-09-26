import { Icon } from "@/components/shared/Icon";
import { trustTags } from "@/data/site";

export function TrustStrip() {
  return (
    <div className="border-y border-line bg-sand">
      <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-center gap-x-7 gap-y-3.5 px-6 py-[22px] sm:px-10">
        <span className="text-sm text-muted-foreground">
          Built for ambitious UK businesses across
        </span>
        {trustTags.map((tag) => (
          <span
            key={tag.name}
            className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-3.5 py-[7px] text-sm font-medium text-ink"
          >
            <Icon name={tag.icon} size={16} className="shrink-0 text-teal" />
            {tag.name}
          </span>
        ))}
      </div>
    </div>
  );
}
