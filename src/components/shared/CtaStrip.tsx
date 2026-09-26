import { ActionLink } from "@/components/ui/action";
import { Icon } from "@/components/shared/Icon";
import { contact } from "@/data/site";
import { cn } from "@/lib/utils";

interface CtaStripProps {
  title: string;
  description: string;
  className?: string;
}

/** Sand-toned closing band: a short prompt on the left, audit and WhatsApp on the right. */
export function CtaStrip({ title, description, className }: CtaStripProps) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-between gap-5 rounded-2xl border border-line bg-sand px-6 py-6 sm:px-8",
        className,
      )}
    >
      <div>
        <h2 className="text-[17px] font-semibold text-ink">{title}</h2>
        <p className="mt-1.5 max-w-[56ch] text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="flex flex-wrap gap-3">
        <ActionLink href="/audit" size="sm">
          Get your free audit
          <Icon name="arrow-right" size={16} className="shrink-0" />
        </ActionLink>
        <ActionLink
          href={contact.whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          variant="outline"
          size="sm"
        >
          <Icon name="whatsapp" size={16} className="shrink-0" />
          WhatsApp
        </ActionLink>
      </div>
    </div>
  );
}
