"use client";

import { useRef } from "react";
import { services } from "@/lib/marketplace-data";
import ServiceCard from "./service-card";

export function ServicesCarousel() {
  const featured = [...services].sort((a, b) => b.reviewCount - a.reviewCount).slice(0, 6);
  const containerRef = useRef<HTMLDivElement | null>(null);

  return (
    <div ref={containerRef} className="overflow-x-auto py-6">
      <div className="mx-auto flex w-max gap-6 px-4">
        {featured.map((s) => (
          <div key={s.slug} className="w-[320px]">
            <ServiceCard service={s} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default ServicesCarousel;
