import { ActionLink } from "@/components/ui/action";
import { Icon } from "@/components/shared/Icon";
import { LogoMark } from "@/components/shared/Logo";
import { ToolLogo } from "@/components/shared/ToolLogo";
import { contact, orbitTools } from "@/data/site";

const badgeTones = {
  featured: "bg-[color-mix(in_oklch,var(--orange)_16%,white)] text-rust",
  soft: "bg-teal-soft text-teal-dark",
  dark: "bg-ink text-cream",
} as const;

export function Hero() {
  return (
    <section
      id="top"
      className="mx-auto grid max-w-[1240px] items-center gap-[clamp(32px,5vw,64px)] px-4 py-[clamp(40px,6vw,96px)] sm:px-6 md:px-10 lg:grid-cols-2"
    >
      <div>
        <span className="inline-flex items-center gap-2 rounded-full bg-teal-soft px-3 py-1.5 text-xs sm:text-[13px] font-medium uppercase tracking-[0.08em] text-teal">
          <Icon name="white-hat" size={15} className="shrink-0" />
          White-hat, senior-led
        </span>

        <h1 className="mt-4 sm:mt-5 text-[clamp(1.875rem,1.2rem+3vw,3.75rem)] leading-[1.04] tracking-[-0.02em]">
          <span className="text-rust">AI-Powered SEO.</span>
          <br />
          <span className="text-teal">Human-Led Growth.</span>
        </h1>

        <div className="my-4 sm:my-[26px] h-1 w-[min(200px,90%)] rounded-full bg-[linear-gradient(90deg,var(--orange),transparent)]" />

        <p className="max-w-[40ch] text-[clamp(1rem,0.9rem+0.4vw,1.1875rem)]">
          Webrise pairs <strong className="font-semibold text-ink">senior SEO specialists</strong>{" "}
          with AI-driven strategy to get you ranked on Google and recommended by ChatGPT, Gemini,
          Perplexity and Claude.
        </p>

        <div className="mt-6 sm:mt-8 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-3">
          <ActionLink
            href={contact.whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            size="lg"
          >
            Chat on WhatsApp
            <Icon name="whatsapp" size={18} className="shrink-0" />
          </ActionLink>
          <ActionLink href="/services" variant="outlineDark" size="lg">
            Explore Services
            <Icon name="arrow-right" size={18} className="shrink-0" />
          </ActionLink>
        </div>

        <div className="mt-5 sm:mt-7 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-[18px] sm:gap-y-3 text-xs sm:text-sm text-muted-foreground">
          {["No lock-in contracts", "Reply within 1 working day"].map((item) => (
            <span key={item} className="inline-flex items-center gap-2">
              <Icon name="check-circle" size={18} className="shrink-0 text-teal" />
              {item}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-8 grid place-items-center sm:mt-0 md:mt-0">
        <div className="relative aspect-square w-full max-w-[560px]">
          <div className="absolute inset-[8%] rounded-full border border-dashed border-teal/30" />
          <div className="absolute inset-[26%] rounded-full border border-teal/15 bg-[radial-gradient(circle_at_50%_50%,color-mix(in_oklch,var(--teal-soft)_55%,transparent),transparent_70%)]" />
          <div className="wr-motion absolute inset-[20%] animate-soft-pulse rounded-full bg-[radial-gradient(circle,color-mix(in_oklch,var(--orange)_10%,transparent),transparent_65%)]" />

          <div className="absolute left-1/2 top-1/2 z-[3] grid aspect-square w-[34%] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-line bg-white shadow-float">
            <LogoMark className="h-auto w-[58%]" />
          </div>

          <div className="wr-motion absolute inset-0 animate-orbit">
            {orbitTools.map((tool) => {
              const rad = ((tool.angle - 90) * Math.PI) / 180;
              return (
                <div
                  key={tool.name}
                  className="absolute"
                  style={{
                    left: `${50 + 42 * Math.cos(rad)}%`,
                    top: `${50 + 42 * Math.sin(rad)}%`,
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  <div className="wr-motion w-[95px] animate-orbit-rev rounded-[14px] border border-line-soft bg-white p-2 text-center shadow-lift sm:w-[110px] sm:p-2.5 md:w-[140px] md:px-3 md:py-3.5">
                    <div className="mx-auto grid h-[44px] w-[44px] place-items-center rounded-[12px] border border-line-soft bg-slate-50 p-1.5 sm:h-[48px] sm:w-[48px] sm:p-2 md:h-[52px] md:w-[52px] md:p-2.5">
                      <ToolLogo
                        name={tool.name}
                        size={24}
                        className="max-h-full max-w-full object-contain sm:size-[28px] md:size-[30px]"
                      />
                    </div>
                    <div className="mt-2 text-[12px] font-semibold text-ink sm:mt-2.5 sm:text-[13px] md:mt-3 md:text-[15px]">
                      {tool.name}
                    </div>
                    <div className="mt-0.5 text-[9px] text-muted-foreground sm:text-[10px] md:text-xs">
                      {tool.role}
                    </div>
                    <div
                      className={`mt-1.5 inline-block rounded-full px-2 py-0.5 text-[9px] font-semibold sm:mt-2 sm:px-2.5 sm:py-1 sm:text-[10px] md:mt-2.5 md:px-2.5 md:py-1 md:text-[11px] ${badgeTones[tool.badgeTone]}`}
                    >
                      {tool.badge}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
