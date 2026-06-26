"use client";

import Image from "next/image";
import Link from "next/link";
import { Clock3, Star } from "lucide-react";
import { useState, useEffect } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { services, MarketplaceService } from "@/lib/marketplace-data";

export function FeaturedServices() {
  const featured = [...services].sort((a, b) => b.reviewCount - a.reviewCount).slice(0, 6);

  return (
    <section className="bg-slate-950 py-16 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Badge className="rounded-full bg-white/10 px-4 py-1.5 text-white">Featured services</Badge>
            <h2 className="mt-4 text-3xl font-semibold">High-conversion services customers book most</h2>
            <p className="mt-3 max-w-2xl text-slate-300">
              Premium cards, fast-scannable information, and clear calls to action designed for higher booking intent.
            </p>
          </div>
          <Button asChild variant="outline" className="rounded-full border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white">
            <Link href="/services">
              Browse full catalog
            </Link>
          </Button>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {featured.map((service) => (
            <FeaturedCard key={service.slug} service={service} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturedCard({ service }: { service: MarketplaceService }) {
  const [imgSrc, setImgSrc] = useState(service.image || "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=80");

  useEffect(() => {
    setImgSrc(service.image || "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=80");
  }, [service.image]);

  return (
    <Link
      href={`/services/${service.slug}`}
      className="group overflow-hidden rounded-[30px] border border-white/10 bg-white/5 transition duration-300 hover:-translate-y-1 hover:border-emerald-400/40 hover:bg-white/10"
    >
      <div className="relative h-56 overflow-hidden">
        <Image
          src={imgSrc}
          alt={service.title}
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
          onError={() => setImgSrc("https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=80")}
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
        {service.badge && (
          <span className="absolute left-4 top-4 rounded-full bg-emerald-400 px-3 py-1 text-xs font-semibold text-slate-950">
            {service.badge}
          </span>
        )}
      </div>
      <div className="space-y-4 p-6">
        <div className="flex items-center justify-between gap-3">
          <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-slate-200">
            {service.category}
          </span>
          <span className="text-sm font-semibold text-emerald-300">{service.price}</span>
        </div>
        <div>
          <h3 className="text-2xl font-semibold">{service.title}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-300">{service.tagline}</p>
        </div>
        <div className="flex items-center gap-4 text-sm text-slate-200">
          <span className="inline-flex items-center gap-1.5">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            {service.rating} ({service.reviewCount})
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock3 className="h-4 w-4 text-emerald-300" />
            {service.duration}
          </span>
        </div>
        <div className="inline-flex h-11 w-full items-center justify-center rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-[0_18px_40px_-18px_rgba(16,185,129,0.65)]">
          Book Now
        </div>
      </div>
    </Link>
  );
}
