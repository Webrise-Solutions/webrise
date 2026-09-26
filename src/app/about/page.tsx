import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { ReadyToGrow } from "@/components/sections/ReadyToGrow";
import { WhyChoose } from "@/components/sections/WhyChoose";
import { Icon } from "@/components/shared/Icon";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const title = "About Us | Webrise";
const description = "Meet the specialists behind Webrise.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/about" },
  openGraph: { title, description, type: "website" },
};

type TeamMember = {
  name: string;
  initials: string;
  role: string;
  image: string | null;
  tone: "night" | "teal" | "rust";
};

const fallbackTeam: TeamMember[] = [
  {
    name: "Danyal Zafar",
    initials: "DZ",
    role: "Owner & SEO Specialist",
    image: "/team/danyal-zafar.jpg",
    tone: "night",
  },
  {
    name: "Dawood Zafar",
    initials: "DZ",
    role: "Backend & DevOps Engineer",
    image: "/team/dawood-zafar.png",
    tone: "teal",
  },
  {
    name: "Ghulam Saqlain",
    initials: "GS",
    role: "Full-Stack Developer",
    image: "/team/ghulam-saqlain.png",
    tone: "rust",
  },
];

const toneClasses = {
  night: "bg-night text-cream",
  teal: "bg-teal text-white",
  rust: "bg-rust text-white",
} as const;

function TeamCard({ member }: { member: TeamMember }) {
  return (
    <article className="group relative overflow-hidden rounded-[28px] border border-white/70 bg-white p-1.5 shadow-[0_12px_36px_rgba(16,44,45,0.09)] transition-[transform,box-shadow] duration-300 hover:-translate-y-1.5 hover:shadow-[0_24px_55px_rgba(16,44,45,0.16)]">
      <div
        className={`relative aspect-[4/5] overflow-hidden rounded-[22px] ${toneClasses[member.tone]}`}
      >
        {member.image ? (
          <Image
            src={member.image}
            alt={member.name}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover object-center transition-transform duration-500 ease-out group-hover:scale-[1.025]"
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center">
            <span className="text-[clamp(4.5rem,9vw,7rem)] font-semibold tracking-[-0.08em] opacity-90">
              {member.initials}
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_48%,rgba(5,24,25,0.22)_65%,rgba(5,24,25,0.9)_100%)]" />

        <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
          <p className="inline-flex rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.09em] text-white/90 backdrop-blur-md">
            {member.role}
          </p>
          <h2 className="mt-2.5 text-[22px] font-semibold tracking-[-0.025em] text-white">
            {member.name}
          </h2>
        </div>
      </div>
    </article>
  );
}

export default async function AboutPage() {
  const { data, error } = await supabaseAdmin
    .from("team_members")
    .select("id, name, role, image_url, tone")
    .eq("published", true)
    .order("sort_order")
    .order("name");

  if (error) console.error("[about] team load failed; using bundled fallback", error);
  const team: TeamMember[] = error
    ? fallbackTeam
    : (data ?? []).map((member) => ({
        name: member.name,
        role: member.role,
        image: member.image_url,
        initials: member.name
          .split(/\s+/)
          .slice(0, 2)
          .map((part) => part[0])
          .join("")
          .toUpperCase(),
        tone: member.tone === "teal" || member.tone === "rust" ? member.tone : "night",
      }));

  return (
    <div className="min-h-screen bg-cream">
      <Header />
      <main>
        <section className="mx-auto max-w-[1200px] px-6 pb-[clamp(64px,8vw,112px)] pt-8 sm:px-10">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-teal"
          >
            <Icon name="arrow-right" size={16} className="rotate-180" />
            Back to home
          </Link>

          <div className="mx-auto max-w-[680px] pb-10 pt-[clamp(48px,7vw,88px)] text-center">
            <span className="text-[12px] font-semibold uppercase tracking-[0.1em] text-teal">
              Our team
            </span>
            <h1 className="mt-3 text-[clamp(2rem,1.4rem+2vw,3rem)] leading-tight tracking-[-0.03em] text-ink">
              Meet the people behind Webrise
            </h1>
          </div>

          <div className="mx-auto grid max-w-[1080px] gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {team.map((member) => (
              <TeamCard key={`${member.name}-${member.role}`} member={member} />
            ))}
          </div>
        </section>

        <WhyChoose />
        <ReadyToGrow />
      </main>
      <Footer />
    </div>
  );
}
