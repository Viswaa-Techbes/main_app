"use client";

import Link from "next/link";
import Image from "next/image";
import { Star, Clock, ArrowRight } from "lucide-react";
import { services } from "@/lib/services-data";

const popularServices = services
  .sort((a, b) => {
    const aReviews = parseFloat(a.reviews.replace("K", "")) * (a.reviews.includes("K") ? 1000 : 1);
    const bReviews = parseFloat(b.reviews.replace("K", "")) * (b.reviews.includes("K") ? 1000 : 1);
    return bReviews - aReviews;
  })
  .slice(0, 6);

export function PopularServices() {
  return (
    <section className="py-16 md:py-20 bg-gradient-to-b from-blue-50/60 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-10 animate-fade-up">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
              Popular Services
            </h2>
            <p className="mt-2 text-gray-500">
              Most requested services by our customers
            </p>
          </div>
          <Link href="/services" className="hidden md:flex items-center gap-2 text-blue-600 font-semibold hover:text-orange-500 transition-colors group">
            <span className="inline-flex items-center">See all <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></span>
          </Link>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {popularServices.map((service, index) => (
            <Link key={service.id} href={`/services/${service.slug}`}>
              <div
                className="group bg-white rounded-2xl overflow-hidden card-hover h-full flex flex-col animate-fade-up"
                style={{ animationDelay: `${index * 80}ms` }}
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  {service.badge && (
                    <span className="absolute top-3 left-3 badge-orange">
                      {service.badge}
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col flex-1">
                  {/* Category */}
                  <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                    {service.category}
                  </span>

                  {/* Title */}
                  <h3 className="mt-2 font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">
                    {service.title}
                  </h3>

                  {/* Rating & Duration */}
                  <div className="mt-3 flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-orange-400 fill-orange-400" />
                      <span className="font-semibold text-gray-900">{service.rating}</span>
                      <span className="text-gray-400">({service.reviews})</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-400">
                      <Clock className="w-4 h-4" />
                      <span>{service.duration}</span>
                    </div>
                  </div>

                  {/* Price & CTA */}
                  <div className="mt-auto pt-4 flex items-center justify-between border-t border-gray-100">
                    <span className="font-bold text-gray-900">{service.price}</span>
                    <span className="text-orange-500 text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
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
            <button className="btn-orange px-6 py-3 rounded-full text-sm inline-flex items-center gap-2">
              View all services <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
