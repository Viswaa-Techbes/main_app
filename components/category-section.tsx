"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { categories } from "@/lib/services-data";

export function CategorySection() {
  const ALLOWED_IDS = ["cctv", "networking", "website-development"];
  const visibleCategories = categories
    .filter((cat) => ALLOWED_IDS.includes(cat.id))
    .map((cat) => {
      if (cat.id === "website-development") {
        return { ...cat, title: "Web Designing" };
      }
      return cat;
    });

  return (
    <section className="py-16 md:py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              What are you looking for?
            </h2>
            <p className="mt-2 text-muted-foreground">
              Browse our verified core engineering and technology services
            </p>
          </div>
          <Link href="/services" className="hidden md:flex items-center gap-2 text-primary font-medium hover:underline">
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {visibleCategories.map((category) => (
            <Link
              key={category.id}
              href={`/services?category=${category.id}`}
              className="group relative bg-card rounded-2xl p-6 md:p-8 border border-border hover:border-primary/40 hover:shadow-xl transition-all duration-300 flex flex-col"
            >
              {/* Icon */}
              <div className={`w-14 h-14 rounded-2xl ${category.color} flex items-center justify-center mb-5 shadow-sm`}>
                <category.icon className="w-7 h-7" />
              </div>

              {/* Content */}
              <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                {category.title}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed flex-1">
                {category.description}
              </p>
              
              {/* Services count */}
              <div className="mt-6 flex items-center justify-between pt-4 border-t border-border/50">
                <span className="text-xs font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-full">
                  {category.services}
                </span>
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </div>
            </Link>
          ))}
        </div>

        {/* Mobile View All Button */}
        <div className="mt-8 md:hidden text-center">
          <Link href="/services" className="inline-flex items-center gap-2 text-primary font-medium">
            View all categories <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
