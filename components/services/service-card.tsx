"use client";

import Image from "next/image";
import ImageWithFade from "@/components/ui/image-fade";
import Link from "@/components/ui/link";
import { Star, Clock3 } from "lucide-react";
import { motion } from "framer-motion";
import { fadeIn, hoverLift } from "@/components/animations/motion-presets";
import { Button } from "@/components/ui/button";

export function ServiceCard({ service }: { service: any }) {
  return (
    <motion.article
      variants={fadeIn}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      whileHover={hoverLift.hover}
      transition={{ type: "spring", stiffness: 260, damping: 24 }}
      className="service-card group relative overflow-hidden"
    >
      <Link href={`/services/${service.slug}`} className="block">
        <div className="w-full">
          {/* Image Container */}
          <div className="service-card-image">
          <ImageWithFade src={service.image} alt={service.title} fill className="object-cover" />
          
          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          
          {/* Badge */}
          {service.badge && (
            <span className="badge-featured">
              {service.badge}
            </span>
          )}
          </div>

        {/* Content */}
          <div className="service-card-content pb-20">
          {/* Title & Price */}
          <div className="flex items-start justify-between mb-3 gap-2">
            <h3 className="service-card-title flex-1">
              {service.title}
            </h3>
            <div className="service-card-meta">
              <div className="price text-right whitespace-nowrap">
                {service.price}
              </div>
            </div>
          </div>

          {/* Description */}
          <p className="service-card-description">
            {service.tagline}
          </p>

          {/* Meta Information */}
          <div className="service-card-meta mb-0">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5">
                <Star className="h-4 w-4 star" fill="currentColor" />
                <span className="text-sm font-semibold text-text-primary">
                  {service.rating}
                </span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock3 className="h-4 w-4 text-secondary" />
                <span className="text-sm text-text-secondary">
                  {service.duration}
                </span>
              </span>
            </div>
          </div>
          </div>
        </div>
      </Link>

      {/* CTA Button placed outside of card-wide Link to avoid nested <a> tags */}
      <div className="absolute bottom-5 left-5 right-5 z-10">
        <Button 
          size="sm" 
          variant="premium" 
          className="service-card-cta w-full"
          asChild
        >
          <Link href={`/services/${service.slug}`}>
            <span>Book Service</span>
          </Link>
        </Button>
      </div>
    </motion.article>
  );
}

export default ServiceCard;
