"use client";

import Image from "next/image";
import Link from "next/link";
import { Clock3, Star, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { services, MarketplaceService } from "@/lib/marketplace-data";

export function FeaturedServices() {
  const featured = [...services].sort((a, b) => b.reviewCount - a.reviewCount).slice(0, 6);

  return (
    <section className="bg-slate-900 py-16 text-white rounded-3xl overflow-hidden relative border border-slate-800">
      {/* Subtle background grids */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.1),transparent_45%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.06),transparent_40%)] pointer-events-none" />

      <div className="mx-auto max-w-7xl px-6 relative z-10">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-300">
              ⚡ High Demand Services
            </div>
            <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">Most Booked IT Services</h2>
            <p className="mt-2 text-xs text-slate-400 max-w-xl leading-relaxed">
              Find premium IT services booked most by our residential and commercial clients across Bangalore.
            </p>
          </div>
          <Button asChild variant="outline" className="rounded-xl border-white/10 bg-white/5 text-xs font-bold text-white hover:bg-white/10 hover:text-white shrink-0 h-9.5">
            <Link href="/services">
              Browse All Services
              <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
            </Link>
          </Button>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
      className="group flex flex-col overflow-hidden rounded-2xl border border-white/5 bg-white/[0.03] transition-all duration-300 hover:-translate-y-1.5 hover:border-white/15 hover:bg-white/[0.06] hover:shadow-lg"
    >
      {/* Image container */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-800">
        <Image
          src={imgSrc}
          alt={service.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-103"
          onError={() => setImgSrc("https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=80")}
          loading="lazy"
        />
        {/* Soft dark gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent" />
        
        {service.badge && (
          <span className="absolute left-4 top-4 rounded-full bg-blue-600 px-3 py-1 text-[9px] font-bold uppercase tracking-wider text-white shadow-md">
            {service.badge}
          </span>
        )}
      </div>

      {/* Content area */}
      <div className="flex flex-1 flex-col p-5 space-y-4">
        <div className="flex items-center justify-between gap-3">
          <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-[9px] font-bold text-slate-300 uppercase tracking-wider">
            {service.category}
          </span>
          <span className="text-xs font-extrabold text-blue-400">{service.price}</span>
        </div>

        <div className="flex-1">
          <h3 className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-1 leading-snug">{service.title}</h3>
          <p className="mt-1.5 text-xs text-slate-400 font-medium leading-relaxed line-clamp-2">{service.tagline}</p>
        </div>

        <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400 font-semibold">
          <span className="inline-flex items-center gap-1">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            <span className="text-slate-200">{service.rating}</span> ({service.reviewCount})
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock3 className="h-3.5 w-3.5 text-slate-500" />
            {service.duration}
          </span>
        </div>

        {/* CTA Button */}
        <div className="mt-2 flex items-center justify-between h-9.5 w-full rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold pl-4 pr-3 transition-colors duration-150">
          <span>Book Now</span>
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </div>
      </div>
    </Link>
  );
}
