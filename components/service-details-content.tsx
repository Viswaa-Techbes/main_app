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
  Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
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
        <nav className="mb-6">
          <ol className="flex items-center gap-2 text-sm">
            <li>
              <Link href="/" className="text-muted-foreground hover:text-foreground">
                Home
              </Link>
            </li>
            <li className="text-muted-foreground">/</li>
            <li>
              <Link href="/services" className="text-muted-foreground hover:text-foreground">
                Services
              </Link>
            </li>
            <li className="text-muted-foreground">/</li>
            <li>
              <Link 
                href={`/services?category=${service.categoryId}`} 
                className="text-muted-foreground hover:text-foreground"
              >
                {service.category}
              </Link>
            </li>
            <li className="text-muted-foreground">/</li>
            <li className="text-foreground font-medium truncate max-w-[150px]">
              {service.title}
            </li>
          </ol>
        </nav>

        {/* Back Link */}
        <Link 
          href="/services" 
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Services
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2">
            {/* Hero Image */}
            <div className="relative h-64 md:h-96 rounded-2xl overflow-hidden mb-8">
              <Image
                src={service.image}
                alt={service.title}
                fill
                className="object-cover"
                priority
              />
              {service.badge && (
                <span className="absolute top-4 left-4 px-4 py-2 bg-accent text-accent-foreground text-sm font-semibold rounded-full">
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
                  <span className="text-sm font-medium text-primary">{service.category}</span>
                </div>
              )}

              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                {service.title}
              </h1>

              {/* Rating & Duration */}
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <div className="flex items-center gap-1.5">
                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  <span className="font-semibold text-foreground">{service.rating}</span>
                  <span className="text-muted-foreground">({service.reviews} reviews)</span>
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Clock className="w-5 h-5" />
                  <span>{service.duration}</span>
                </div>
              </div>

              {/* Description */}
              <p className="text-lg text-muted-foreground leading-relaxed">
                {service.description}
              </p>
            </div>

            {/* Features */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-foreground mb-4">What you get</h2>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {service.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-primary" />
                    </div>
                    <span className="text-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* What's Included */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-foreground mb-4">What&apos;s included</h2>
              <ul className="flex flex-wrap gap-3">
                {service.includes.map((item, index) => (
                  <li 
                    key={index} 
                    className="px-4 py-2 bg-secondary rounded-full text-sm text-foreground"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-6 bg-card rounded-2xl border border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <BadgeCheck className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Verified Experts</p>
                  <p className="text-sm text-muted-foreground">Background checked</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Service Warranty</p>
                  <p className="text-sm text-muted-foreground">30-day guarantee</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Trusted by 10K+</p>
                  <p className="text-sm text-muted-foreground">Happy customers</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Booking Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-card rounded-2xl border border-border p-6">
              {/* Price */}
              <div className="mb-6">
                <p className="text-sm text-muted-foreground mb-1">Starting at</p>
                <p className="text-3xl font-bold text-foreground">{service.price.replace("Starting ", "")}</p>
              </div>

              {/* Quantity Selector (if applicable) */}
              {!service.duration.includes("Yearly") && !service.duration.includes("device") && (
                <div className="mb-6">
                  <p className="text-sm font-medium text-foreground mb-3">Service Units</p>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-secondary transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="text-xl font-semibold w-8 text-center">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-secondary transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Duration */}
              <div className="flex items-center gap-2 mb-6 p-3 bg-secondary rounded-lg">
                <Clock className="w-5 h-5 text-muted-foreground" />
                <span className="text-sm text-foreground">
                  Estimated duration: <span className="font-medium">{service.duration}</span>
                </span>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col gap-3 mb-6">
                <Button size="lg" className="w-full gap-2 rounded-full">
                  <Calendar className="w-5 h-5" />
                  Book Now
                </Button>
                <Button size="lg" variant="outline" className="w-full gap-2 rounded-full">
                  <MessageSquare className="w-5 h-5" />
                  Request Quote
                </Button>
              </div>

              {/* Contact */}
              <div className="pt-6 border-t border-border">
                <p className="text-sm text-muted-foreground mb-3">Need help deciding?</p>
                <a 
                  href="tel:+919876543210" 
                  className="flex items-center gap-2 text-primary font-medium hover:underline"
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
          <section className="mt-16">
            <h2 className="text-2xl font-bold text-foreground mb-6">Related Services</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedServices.map((relatedService) => (
                <Link key={relatedService.id} href={`/services/${relatedService.slug}`}>
                  <div className="group bg-card rounded-2xl overflow-hidden border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300">
                    <div className="relative h-40 overflow-hidden">
                      <Image
                        src={relatedService.image}
                        alt={relatedService.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                        {relatedService.title}
                      </h3>
                      <div className="mt-2 flex items-center justify-between text-sm">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                          <span className="font-medium">{relatedService.rating}</span>
                        </div>
                        <span className="font-medium text-foreground">{relatedService.price}</span>
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
