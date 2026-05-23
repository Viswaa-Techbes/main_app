"use client";

import Link from "@/components/ui/link";
import { ArrowRight } from "lucide-react";
import { categories } from "@/lib/services-data";

export function CategorySection() {
  return (
    <section className="section-padding bg-white">
      <div className="container-max">
        {/* Section Header */}
        <div className="flex items-start justify-between mb-12 animate-fade-up">
          <div>
            <h2 className="heading-lg text-text-primary">
              What are you looking for?
            </h2>
            <p className="mt-3 text-text-secondary body-md">
              Browse our wide range of IT services
            </p>
          </div>
          <Link href="/services" className="hidden md:flex items-center gap-2 link text-secondary font-semibold group whitespace-nowrap ml-4">
            <span className="inline-flex items-center">View all <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></span>
          </Link>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {categories.map((category, index) => (
            <Link
              key={category.id}
              href={`/services?category=${category.id}`}
              className="card group animate-fade-up"
              style={{ animationDelay: `${index * 60}ms` }}
            >
              <div className="w-full">
                {/* Icon */}
                <div className={`w-14 h-14 rounded-lg ${category.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <category.icon className="w-7 h-7" />
                </div>

                {/* Content */}
                <h3 className="heading-sm text-text-primary group-hover:text-secondary transition-colors">
                  {category.title}
                </h3>
                <p className="mt-2 text-sm text-text-secondary line-clamp-2">
                  {category.description}
                </p>

                {/* Services count */}
                <div className="mt-4 flex items-center justify-between pt-4 border-t border-border-light">
                  <span className="text-xs font-semibold text-secondary bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100">
                    {category.services}
                  </span>
                  <ArrowRight className="w-4 h-4 text-text-tertiary group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Mobile View All Button */}
        <div className="mt-8 md:hidden text-center">
          <Link href="/services" className="btn-primary inline-flex items-center gap-2 rounded-lg">
            <span className="inline-flex items-center">View all categories <ArrowRight className="w-4 h-4" /></span>
          </Link>
        </div>
      </div>
    </section>
  );
}
