import Link from "next/link";
import { Icon } from "@/components/shared/Icon";
import { ToolCard } from "@/components/shared/ToolCard";
import { tools } from "@/data/site";

export function Tools() {
  return (
    <section
      id="tools"
      className="mx-auto max-w-[1200px] px-4 py-[clamp(48px,6vw,96px)] sm:px-6 md:px-10"
    >
      <div className="mx-auto max-w-[640px] text-center">
        <h2 className="text-[clamp(2rem,1.4rem+2vw,2.75rem)] leading-[1.15] tracking-[-0.02em]">
          Tools &amp; Technologies <span className="text-rust">We Use</span>
        </h2>
        <div className="mx-auto mt-[18px] h-1 w-[120px] rounded-full bg-[linear-gradient(90deg,var(--orange),transparent)]" />
        <p className="mt-[22px] text-muted-foreground">
          We use industry-leading tools and technologies to research, analyze, optimize and track
          performance, delivering measurable growth for every client.
        </p>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {tools.map((tool) => (
          <ToolCard key={tool.name} tool={tool} />
        ))}
      </div>

      <div className="mt-10 flex flex-col items-center gap-5">
        <Link
          href="/tools"
          className="inline-flex items-center gap-2 rounded-[10px] border border-teal px-[26px] py-[15px] text-[15px] font-semibold text-teal transition-colors duration-200 hover:bg-teal-soft"
        >
          View all tools
          <Icon name="arrow-right" size={18} className="shrink-0" />
        </Link>

        <div className="inline-flex items-center gap-3 rounded-full border border-line-soft bg-white px-6 py-3.5 shadow-card">
          <Icon name="shield-lock" size={20} className="shrink-0 text-teal" />
          <span className="text-[15px] text-ink">
            Top-tier tools. Proven strategies.{" "}
            <strong className="font-semibold text-rust">Real results.</strong>
          </span>
        </div>
      </div>
    </section>
  );
}
