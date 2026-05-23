"use client";

import { Search, Shield, Clock, Award, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import Link from "@/components/ui/link";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden py-14 md:py-20 lg:py-24">
      {/* Background decorative blobs */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-100/60 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -right-20 w-80 h-80 bg-orange-100/50 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-50/30 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Left Section - Text & Search */}
          <div className="flex-1 w-full lg:max-w-xl animate-fade-up">
            {/* Top badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200 mb-6">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse-soft" />
              <span className="text-sm font-semibold text-blue-700">
                Trusted by 10K+ businesses across India
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-[3.4rem] font-extrabold text-gray-900 leading-[1.12] tracking-tight">
              Professional IT Services{" "}
              <span className="text-gradient-blue">at Your</span>{" "}
              <span className="text-gradient-orange">Doorstep</span>
            </h1>

            <p className="mt-5 text-lg md:text-xl text-gray-500 leading-relaxed max-w-lg">
              Book trusted IT professionals for installation, maintenance, and
              support. Quality service guaranteed with transparent pricing.
            </p>

            {/* Search Bar */}
            <div className="mt-8 relative animate-fade-up-delayed">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="What service do you need?"
                  className="w-full h-14 pl-12 pr-32 text-base rounded-2xl border-2 border-gray-200 bg-white shadow-lg shadow-blue-900/5 focus:border-blue-500 focus:ring-blue-500 transition-all"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2.5 btn-orange rounded-xl text-sm">
                  Search
                </button>
              </div>
              <div className="mt-3 flex flex-wrap gap-2 text-sm text-gray-500">
                <span>Popular:</span>
                <button className="hover:text-blue-600 transition-colors font-medium">
                  CCTV Installation
                </button>
                <span className="text-gray-300">•</span>
                <button className="hover:text-blue-600 transition-colors font-medium">
                  Network Setup
                </button>
                <span className="text-gray-300">•</span>
                <button className="hover:text-blue-600 transition-colors font-medium">
                  AMC Services
                </button>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="mt-10 flex flex-wrap items-center gap-8 animate-fade-up-slow">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-blue-600" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-sm text-gray-900">
                    Verified Experts
                  </p>
                  <p className="text-xs text-gray-500">
                    Background checked
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-orange-500" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-sm text-gray-900">
                    Same Day Service
                  </p>
                  <p className="text-xs text-gray-500">Quick response</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center">
                  <Award className="w-5 h-5 text-blue-600" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-sm text-gray-900">
                    4.9 Rating
                  </p>
                  <p className="text-xs text-gray-500">500K+ reviews</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Section - Image Grid */}
          <div className="flex-1 w-full lg:max-w-lg animate-fade-up-delayed">
            <div className="grid grid-cols-2 gap-3">
              {/* Top Left */}
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-lg shadow-blue-900/10 card-hover border-0">
                <Image
                  src="https://images.unsplash.com/photo-1558002038-1055907df827?w=400&h=300&fit=crop"
                  alt="CCTV installation service"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/50 to-transparent" />
                <span className="absolute bottom-3 left-3 badge-orange">CCTV</span>
              </div>
              {/* Top Right */}
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-lg shadow-blue-900/10 card-hover border-0 mt-6">
                <Image
                  src="https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=400&h=300&fit=crop"
                  alt="Network setup and configuration"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/50 to-transparent" />
                <span className="absolute bottom-3 left-3 badge-blue">Networking</span>
              </div>
              {/* Bottom Left */}
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-lg shadow-blue-900/10 card-hover border-0 -mt-4">
                <Image
                  src="https://images.unsplash.com/photo-1563770660941-20978e870e26?w=400&h=300&fit=crop"
                  alt="IT technician at work"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-orange-900/50 to-transparent" />
                <span className="absolute bottom-3 left-3 badge-orange">Support</span>
              </div>
              {/* Bottom Right */}
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-lg shadow-blue-900/10 card-hover border-0">
                <Image
                  src="https://images.unsplash.com/photo-1551808525-51a94da548ce?w=400&h=300&fit=crop"
                  alt="Security system maintenance"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/50 to-transparent" />
                <span className="absolute bottom-3 left-3 badge-blue">Security</span>
              </div>
            </div>

            {/* Floating stat card */}
            <div className="hidden lg:flex absolute -right-4 top-1/2 -translate-y-1/2 items-center gap-3 bg-white rounded-2xl px-5 py-4 shadow-xl shadow-blue-900/10 border border-blue-100 animate-fade-up-slow">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-orange-500/30">
                ✓
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">50K+ Jobs</p>
                <p className="text-xs text-gray-500">Completed this year</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
