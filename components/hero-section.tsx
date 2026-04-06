"use client";

import { Search, Shield, Clock, Award } from "lucide-react";
import { Input } from "@/components/ui/input";
import Image from "next/image";

export function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-primary/5 via-background to-accent/5 py-12 md:py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
          {/* Left Section - Text & Search */}
          <div className="flex-1 w-full lg:max-w-xl">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight text-balance">
              Professional IT Services{" "}
              <span className="text-primary">at Your Doorstep</span>
            </h1>

            <p className="mt-5 text-base md:text-lg text-muted-foreground text-pretty">
              Book trusted IT professionals for installation, maintenance, and
              support. Quality service guaranteed with transparent pricing.
            </p>

            {/* Search Bar */}
            <div className="mt-8 relative">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="What service do you need?"
                  className="w-full h-14 pl-12 pr-28 text-base rounded-2xl border-2 border-border bg-card shadow-lg focus:border-primary focus:ring-primary"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors">
                  Search
                </button>
              </div>
              <div className="mt-3 flex flex-wrap gap-2 text-sm text-muted-foreground">
                <span>Popular:</span>
                <button className="hover:text-primary transition-colors">
                  CCTV Installation
                </button>
                <span>•</span>
                <button className="hover:text-primary transition-colors">
                  Network Setup
                </button>
                <span>•</span>
                <button className="hover:text-primary transition-colors">
                  AMC Services
                </button>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="mt-8 flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                  <Shield className="w-4 h-4 text-primary" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-sm text-foreground">
                    Verified Experts
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Background checked
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                  <Clock className="w-4 h-4 text-primary" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-sm text-foreground">
                    Same Day Service
                  </p>
                  <p className="text-xs text-muted-foreground">Quick response</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                  <Award className="w-4 h-4 text-primary" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-sm text-foreground">
                    4.9 Rating
                  </p>
                  <p className="text-xs text-muted-foreground">500K+ reviews</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Section - Image Grid */}
          <div className="flex-1 w-full lg:max-w-lg">
            <div className="grid grid-cols-2 gap-3">
              {/* Top Left - Large */}
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-md">
                <Image
                  src="https://images.unsplash.com/photo-1558002038-1055907df827?w=400&h=300&fit=crop"
                  alt="CCTV installation service"
                  fill
                  className="object-cover"
                />
              </div>
              {/* Top Right */}
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-md">
                <Image
                  src="https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=400&h=300&fit=crop"
                  alt="Network setup and configuration"
                  fill
                  className="object-cover"
                />
              </div>
              {/* Bottom Left */}
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-md">
                <Image
                  src="https://images.unsplash.com/photo-1563770660941-20978e870e26?w=400&h=300&fit=crop"
                  alt="IT technician at work"
                  fill
                  className="object-cover"
                />
              </div>
              {/* Bottom Right */}
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-md">
                <Image
                  src="https://images.unsplash.com/photo-1551808525-51a94da548ce?w=400&h=300&fit=crop"
                  alt="Security system maintenance"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
