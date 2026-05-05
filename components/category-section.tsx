"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { categories } from "@/lib/services-data";

export function CategorySection() {
  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-10 animate-fade-up">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
              What are you looking for?
            </h2>
            <p className="mt-2 text-gray-500">
              Browse our wide range of IT services
            </p>
          </div>
          <Link href="/services" className="hidden md:flex items-center gap-2 text-blue-600 font-semibold hover:text-orange-500 transition-colors group">
            View all <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
          {categories.map((category, index) => (
            <Link
              key={category.id}
              href={`/services?category=${category.id}`}
              className="group relative bg-white rounded-2xl p-5 md:p-6 card-hover animate-fade-up"
              style={{ animationDelay: `${index * 60}ms` }}
            >
              {/* Icon */}
              <div className={`w-13 h-13 md:w-14 md:h-14 rounded-xl ${category.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <category.icon className="w-6 h-6 md:w-7 md:h-7" />
              </div>

              {/* Content */}
              <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                {category.title}
              </h3>
              <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                {category.description}
              </p>

              {/* Services count */}
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">
                  {category.services}
                </span>
                <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-orange-500 group-hover:translate-x-1 transition-all" />
              </div>
            </Link>
          ))}
        </div>

        {/* Mobile View All Button */}
        <div className="mt-8 md:hidden text-center">
          <Link href="/services" className="inline-flex items-center gap-2 px-6 py-3 btn-orange rounded-full text-sm">
            View all categories <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
