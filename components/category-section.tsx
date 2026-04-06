"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { categories } from "@/lib/services-data";

export function CategorySection() {
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
              Browse our wide range of IT services
            </p>
          </div>
          <Link href="/services" className="hidden md:flex items-center gap-2 text-primary font-medium hover:underline">
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/services?category=${category.id}`}
              className="group relative bg-card rounded-2xl p-5 md:p-6 border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300"
            >
              {/* Icon */}
              <div className={`w-12 h-12 md:w-14 md:h-14 rounded-xl ${category.color} flex items-center justify-center mb-4`}>
                <category.icon className="w-6 h-6 md:w-7 md:h-7" />
              </div>

              {/* Content */}
              <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                {category.title}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                {category.description}
              </p>
              
              {/* Services count */}
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
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
