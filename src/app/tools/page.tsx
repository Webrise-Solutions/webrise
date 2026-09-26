import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Icon } from "@/components/shared/Icon";
import { ToolCard } from "@/components/shared/ToolCard";
import { ActionLink } from "@/components/ui/action";
import { tools, additionalTools } from "@/data/site";

const title = "All Tools & Technologies | Webrise";
const description =
  "The full stack of SEO, analytics, AI and marketing tools our senior team uses to research, build, track and grow client websites.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: { title, description, type: "website" },
};

const allTools = [...tools, ...additionalTools];

export default function AllToolsPage() {
  return (
    <div className="min-h-screen bg-cream">
      <Header />
      <main>
        <section className="mx-auto max-w-[1200px] px-6 pb-0 pt-8 sm:px-10">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-teal"
          >
            <Icon name="arrow-right" size={16} className="shrink-0 rotate-180" />
            Back to home
          </Link>
        </section>

        <section className="mx-auto max-w-[1200px] px-6 py-[clamp(48px,6vw,88px)] sm:px-10">
          <div className="mx-auto max-w-[720px] text-center">
            <h1 className="text-[clamp(2rem,1.4rem+2vw,2.75rem)] leading-[1.15] tracking-[-0.02em]">
              All Tools &amp; <span className="text-rust">Technologies</span>
            </h1>
            <div className="mx-auto mt-[18px] h-1 w-[120px] rounded-full bg-[linear-gradient(90deg,var(--orange),transparent)]" />
            <p className="mt-[22px] text-muted-foreground">
              The complete stack our senior team uses every day: SEO research, analytics, AI
              visibility, marketing automation and delivery, used to research, build, track and grow
              client websites.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {allTools.map((tool) => (
              <ToolCard key={tool.name} tool={tool} />
            ))}
          </div>

          <div className="mt-12 flex flex-col items-center gap-4 rounded-[18px] border border-line-soft bg-white px-6 py-10 text-center shadow-card">
            <h2 className="text-xl font-semibold text-ink">Want the same stack working for you?</h2>
            <p className="max-w-[48ch] text-sm text-muted-foreground">
              Get a free audit and see exactly where these tools would move the needle for your
              site.
            </p>
            <ActionLink href="/audit" size="lg">
              Get your free SEO audit
              <Icon name="arrow-right" size={18} className="shrink-0" />
            </ActionLink>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
