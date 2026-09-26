"use client";

import Link from "next/link";
import { Icon } from "@/components/shared/Icon";
import { ScreenFrame } from "@/components/shared/ScreenFrame";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export type FeaturedStudy = {
  id: string;
  slug: string;
  title: string;
  cover_image_url: string | null;
  service_name: string | null;
};

export function FeaturedWorkCarousel({ studies }: { studies: FeaturedStudy[] }) {
  return (
    <Carousel
      opts={{ align: "start", loop: studies.length > 3 }}
      className="mx-auto mt-10 max-w-[1120px] px-1"
      aria-label="Selected projects"
    >
      <CarouselContent className="-ml-5 items-stretch py-1">
        {studies.map((study) => (
          <CarouselItem key={study.id} className="h-auto basis-full pl-5 md:basis-1/2 lg:basis-1/3">
            <Link
              href={`/work/${study.slug}`}
              className="group flex h-full flex-col rounded-[22px] border border-line-soft bg-white p-2.5 shadow-[0_8px_30px_rgba(16,44,45,0.06)] transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-teal/50 hover:shadow-[0_18px_45px_rgba(16,44,45,0.12)]"
            >
              <ScreenFrame src={study.cover_image_url} alt="" fallbackIcon="award" fit="cover" />

              <div className="flex flex-1 items-end justify-between gap-4 px-3 pb-3 pt-4">
                <div className="min-w-0">
                  <span className="block truncate text-[11px] font-semibold uppercase tracking-[0.1em] text-teal">
                    {study.service_name ?? "Case study"}
                  </span>
                  <h3 className="mt-1.5 line-clamp-2 min-h-[2.75rem] text-[17px] font-semibold leading-snug tracking-[-0.015em] text-ink">
                    {study.title}
                  </h3>
                </div>
                <span className="mb-0.5 grid h-9 w-9 flex-none place-items-center rounded-full border border-line bg-cream text-teal transition-[background-color,color,border-color,transform] duration-200 group-hover:translate-x-0.5 group-hover:border-teal group-hover:bg-teal group-hover:text-white">
                  <Icon name="arrow-right" size={16} />
                </span>
              </div>
            </Link>
          </CarouselItem>
        ))}
      </CarouselContent>

      <CarouselPrevious className="left-3 z-20 h-11 w-11 border-line bg-white/95 text-teal shadow-card hover:border-teal hover:bg-teal hover:text-white disabled:opacity-35 sm:-left-4" />
      <CarouselNext className="right-3 z-20 h-11 w-11 border-line bg-white/95 text-teal shadow-card hover:border-teal hover:bg-teal hover:text-white disabled:opacity-35 sm:-right-4" />
    </Carousel>
  );
}
