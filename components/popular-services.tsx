"use client";

import Link from "next/link";
import Image from "next/image";
import { Star, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { services } from "@/lib/services-data";

// Get top 6 services by reviews
const popularServices = services
  .sort((a, b) => {
    const aReviews = parseFloat(a.reviews.replace("K", "")) * (a.reviews.includes("K") ? 1000 : 1);
    const bReviews = parseFloat(b.reviews.replace("K", "")) * (b.reviews.includes("K") ? 1000 : 1);
    return bReviews - aReviews;
  })
  .slice(0, 6);

export function PopularServices() {
  return (
    <section className="py-16 md:py-20 bg-secondary/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              Popular Services
            </h2>
            <p className="mt-2 text-muted-foreground">
              Most requested services by our customers
            </p>
          </div>
          <Link href="/services" className="hidden md:flex items-center gap-2 text-primary font-medium hover:underline">
            See all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {popularServices.map((service) => (
            <Link key={service.id} href={`/services/${service.slug}`}>
              <div className="group bg-card rounded-2xl overflow-hidden border border-border hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {service.badge && (
                    <span className="absolute top-3 left-3 px-3 py-1 bg-accent text-accent-foreground text-xs font-semibold rounded-full">
                      {service.badge}
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col flex-1">
                  {/* Category */}
                  <span className="text-xs font-medium text-primary uppercase tracking-wide">
                    {service.category}
                  </span>

                  {/* Title */}
                  <h3 className="mt-2 font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
                    {service.title}
                  </h3>

                  {/* Rating & Duration */}
                  <div className="mt-3 flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="font-medium text-foreground">{service.rating}</span>
                      <span className="text-muted-foreground">({service.reviews})</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>{service.duration}</span>
                    </div>
                  </div>

                  {/* Price & CTA */}
                  <div className="mt-auto pt-4 flex items-center justify-between">
                    <span className="font-semibold text-foreground">{service.price}</span>
                    <span className="text-primary text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                      View Details <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Mobile View All */}
        <div className="mt-8 md:hidden text-center">
          <Link href="/services">
            <Button variant="outline" className="rounded-full">
              View all services <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
