import { Icon } from "@/components/shared/Icon";
import { ActionLink } from "@/components/ui/action";
import { avatars, growthStats, contact } from "@/data/site";

const avatarTone: Record<(typeof avatars)[number]["tone"], string> = {
  teal: "bg-teal",
  rust: "bg-rust",
  muted: "bg-muted-foreground",
  "teal-dark": "bg-teal-dark",
};

export function ReadyToGrow() {
  return (
    <section className="mx-auto max-w-[1200px] px-6 pt-[clamp(40px,5vw,72px)] sm:px-10">
      <div className="grid items-center gap-[clamp(32px,5vw,64px)] overflow-hidden rounded-3xl bg-[radial-gradient(120%_140%_at_15%_10%,color-mix(in_oklch,var(--teal-dark)_45%,var(--night)),var(--night)_55%)] p-[clamp(36px,5vw,72px)] lg:grid-cols-2">
        <div>
          <h2 className="text-[clamp(2rem,1.4rem+2.4vw,3rem)] leading-[1.08] tracking-[-0.02em] text-cream">
            Ready to Grow
            <br />
            <span className="text-orange">Your Business?</span>
          </h2>
          <p className="mt-5 max-w-[42ch] text-[clamp(1rem,0.95rem+0.3vw,1.1875rem)] text-mint">
            Let's build an SEO strategy that delivers traffic, leads and revenue.
          </p>

          <div className="mt-[30px] flex flex-wrap gap-3.5">
            <ActionLink href="/services" size="lg" className="rounded-xl hover:shadow-cta-lg">
              Explore Our Services
              <Icon name="arrow-right" size={18} />
            </ActionLink>
            <ActionLink
              href={contact.whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              variant="ghostLight"
              size="lg"
              className="rounded-xl"
            >
              WhatsApp
              <Icon name="whatsapp" size={18} />
            </ActionLink>
          </div>

          <div className="mt-[30px] flex flex-wrap items-center gap-4">
            <div className="flex">
              {avatars.map((avatar) => (
                <span
                  key={avatar.initials}
                  className={`-ml-2.5 grid h-[38px] w-[38px] place-items-center rounded-full border-2 border-night text-xs font-semibold text-white ${avatarTone[avatar.tone]}`}
                >
                  {avatar.initials}
                </span>
              ))}
            </div>
            <div>
              <div className="flex gap-0.5 text-[#F5B841]" aria-label="Rated 5 out of 5">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Icon key={index} name="star" size={16} />
                ))}
              </div>
              <div className="mt-1 text-[13px] text-mint">Trusted by businesses worldwide</div>
            </div>
          </div>
        </div>

        <div className="rounded-[18px] border border-teal-soft/15 bg-white/[0.03] px-7 py-3">
          {growthStats.map((stat) => (
            <div
              key={stat.label}
              className="flex items-center gap-[18px] border-b border-teal-soft/10 py-[22px] last:border-b-0"
            >
              <span className="grid h-[54px] w-[54px] flex-none place-items-center rounded-[14px] bg-[color-mix(in_oklch,var(--mint)_16%,transparent)] text-mint">
                <Icon name={stat.icon} size={26} />
              </span>
              <div>
                <div className="text-[30px] font-semibold leading-none text-cream">
                  {stat.value}
                </div>
                <div className="mt-1.5 text-sm text-mint">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
