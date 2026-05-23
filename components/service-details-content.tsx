"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Star,
  Clock,
  ChevronLeft,
  Check,
  Shield,
  Users,
  BadgeCheck,
  Phone,
  MessageSquare,
  Calendar,
  Minus,
  Plus,
  ArrowRight
} from "lucide-react";
import { type Service, services, categories } from "@/lib/services-data";

interface ServiceDetailsContentProps {
  service: Service;
}

export function ServiceDetailsContent({ service }: ServiceDetailsContentProps) {
  const [quantity, setQuantity] = useState(1);

  const category = categories.find((c) => c.id === service.categoryId);
  const relatedServices = services
    .filter((s) => s.categoryId === service.categoryId && s.id !== service.id)
    .slice(0, 3);

  return (
    <div className="py-6 md:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-6 animate-fade-up">
          <ol className="flex items-center gap-2 text-sm">
            <li>
              <Link href="/" className="text-gray-400 hover:text-blue-600 transition-colors">
                <span>Home</span>
              </Link>
            </li>
            <li className="text-gray-300">/</li>
            <li>
              <Link href="/services" className="text-gray-400 hover:text-blue-600 transition-colors">
                <span>Services</span>
              </Link>
            </li>
            <li className="text-gray-300">/</li>
            <li>
              <Link
                href={`/services?category=${service.categoryId}`}
                className="text-gray-400 hover:text-blue-600 transition-colors"
              >
                {service.category}
              </Link>
            </li>
            <li className="text-gray-300">/</li>
            <li className="text-gray-900 font-medium truncate max-w-[150px]">
              {service.title}
            </li>
          </ol>
        </nav>

        {/* Back Link */}
        <Link
          href="/services"
          className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium mb-6 group"
        >
          <span className="inline-flex items-center gap-1"><ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />Back to Services</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 animate-fade-up">
            {/* Hero Image */}
            <div className="relative h-64 md:h-96 rounded-2xl overflow-hidden mb-8 shadow-lg shadow-blue-900/10">
              <Image
                src={service.image}
                alt={service.title}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              {service.badge && (
                <span className="absolute top-4 left-4 badge-orange text-sm px-4 py-2">
                  {service.badge}
                </span>
              )}
            </div>

            {/* Service Info */}
            <div className="mb-8">
              {/* Category Badge */}
              {category && (
                <div className="inline-flex items-center gap-2 mb-4">
                  <div className={`w-8 h-8 rounded-lg ${category.color} flex items-center justify-center`}>
                    <category.icon className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-bold text-blue-600 uppercase tracking-wide">{service.category}</span>
                </div>
              )}

              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
                {service.title}
              </h1>

              {/* Rating & Duration */}
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <div className="flex items-center gap-1.5 bg-orange-50 px-3 py-1.5 rounded-full border border-orange-100">
                  <Star className="w-5 h-5 text-orange-400 fill-orange-400" />
                  <span className="font-bold text-gray-900">{service.rating}</span>
                  <span className="text-gray-500 text-sm">({service.reviews} reviews)</span>
                </div>
                <div className="flex items-center gap-1.5 text-gray-500 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100">
                  <Clock className="w-5 h-5 text-blue-500" />
                  <span className="text-sm font-medium">{service.duration}</span>
                </div>
              </div>

              {/* Description */}
              <p className="text-lg text-gray-500 leading-relaxed">
                {service.description}
              </p>
            </div>

            {/* Features */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">What you get</h2>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {service.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shrink-0 mt-0.5 shadow-sm shadow-blue-500/25">
                      <Check className="w-3.5 h-3.5 text-white" />
                    </div>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* What's Included */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">What&apos;s included</h2>
              <ul className="flex flex-wrap gap-3">
                {service.includes.map((item, index) => (
                  <li
                    key={index}
                    className="px-4 py-2 bg-blue-50 rounded-full text-sm text-blue-700 font-medium border border-blue-100"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-6 bg-white rounded-2xl border border-gray-200 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center border border-blue-100">
                  <BadgeCheck className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Verified Experts</p>
                  <p className="text-sm text-gray-500">Background checked</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center border border-orange-100">
                  <Shield className="w-5 h-5 text-orange-500" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Service Warranty</p>
                  <p className="text-sm text-gray-500">30-day guarantee</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center border border-blue-100">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Trusted by 10K+</p>
                  <p className="text-sm text-gray-500">Happy customers</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Booking Card */}
          <div className="lg:col-span-1 animate-fade-up-delayed">
            <div className="sticky top-24 bg-white rounded-2xl border border-gray-200 p-6 shadow-lg shadow-blue-900/5">
              {/* Price */}
              <div className="mb-6">
                <p className="text-sm text-gray-500 mb-1">Starting at</p>
                <p className="text-3xl font-extrabold text-gray-900 tracking-tight">
                  {service.price.replace("Starting ", "")}
                </p>
              </div>

              {/* Quantity Selector */}
              {!service.duration.includes("Yearly") && !service.duration.includes("device") && (
                <div className="mb-6">
                  <p className="text-sm font-semibold text-gray-900 mb-3">Service Units</p>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 rounded-full border-2 border-gray-200 flex items-center justify-center hover:bg-blue-50 hover:border-blue-300 transition-all"
                    >
                      <Minus className="w-4 h-4 text-gray-600" />
                    </button>
                    <span className="text-xl font-bold w-8 text-center text-gray-900">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-10 h-10 rounded-full border-2 border-gray-200 flex items-center justify-center hover:bg-blue-50 hover:border-blue-300 transition-all"
                    >
                      <Plus className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                </div>
              )}

              {/* Duration */}
              <div className="flex items-center gap-2 mb-6 p-3 bg-blue-50 rounded-xl border border-blue-100">
                <Clock className="w-5 h-5 text-blue-500" />
                <span className="text-sm text-gray-700">
                  Estimated: <span className="font-semibold">{service.duration}</span>
                </span>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col gap-3 mb-6">
                <button className="w-full btn-orange py-3.5 rounded-xl text-sm inline-flex items-center justify-center gap-2 font-semibold">
                  <Calendar className="w-5 h-5" />
                  Book Now
                </button>
                <button className="w-full btn-outline-blue py-3.5 rounded-xl text-sm inline-flex items-center justify-center gap-2 font-semibold">
                  <MessageSquare className="w-5 h-5" />
                  Request Quote
                </button>
              </div>

              {/* Contact */}
              <div className="pt-6 border-t border-gray-100">
                <p className="text-sm text-gray-500 mb-3">Need help deciding?</p>
                <a
                  href="tel:+919876543210"
                  className="flex items-center gap-2 text-orange-500 font-semibold hover:text-orange-600 transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  Call us: +91 98765 43210
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Related Services */}
        {relatedServices.length > 0 && (
          <section className="mt-16 animate-fade-up-slow">
            <h2 className="text-2xl font-extrabold text-gray-900 mb-6 tracking-tight">Related Services</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedServices.map((relatedService) => (
                <Link key={relatedService.id} href={`/services/${relatedService.slug}`}>
                  <div className="group bg-white rounded-2xl overflow-hidden card-hover h-full">
                    <div className="relative h-40 overflow-hidden">
                      <Image
                        src={relatedService.image}
                        alt={relatedService.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {relatedService.title}
                      </h3>
                      <div className="mt-2 flex items-center justify-between text-sm">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-orange-400 fill-orange-400" />
                          <span className="font-semibold">{relatedService.rating}</span>
                        </div>
                        <span className="font-bold text-gray-900">{relatedService.price}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
