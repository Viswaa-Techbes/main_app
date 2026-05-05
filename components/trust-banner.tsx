"use client";

import { CheckCircle, Users, Building2, Star, ArrowRight } from "lucide-react";

const stats = [
  { value: "50K+", label: "Services Completed", icon: CheckCircle },
  { value: "10K+", label: "Happy Customers", icon: Users },
  { value: "500+", label: "Business Partners", icon: Building2 },
  { value: "4.9", label: "Average Rating", icon: Star },
];

export function TrustBanner() {
  return (
    <section className="relative py-16 md:py-24 overflow-hidden">
      {/* Blue gradient background */}
      <div className="absolute inset-0 navbar-gradient" />
      {/* Decorative circles */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-white/5 rounded-full" />
        <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-orange-500/10 rounded-full blur-xl" />
        <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-blue-400/10 rounded-full blur-2xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="animate-fade-up">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 mb-6">
              <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse-soft" />
              <span className="text-xs font-semibold text-white/80 tracking-wide uppercase">Enterprise Ready</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white leading-tight tracking-tight">
              Trusted by 500+ Businesses{" "}
              <span className="text-orange-300">Across India</span>
            </h2>
            <p className="mt-5 text-white/70 text-lg leading-relaxed max-w-lg">
              Join thousands of businesses who rely on TechBes for their
              IT infrastructure needs. From startups to enterprises, we deliver
              quality service every time.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <button className="btn-orange px-7 py-3.5 rounded-full text-sm inline-flex items-center gap-2 font-semibold">
                Get Started Today <ArrowRight className="w-4 h-4" />
              </button>
              <button className="px-7 py-3.5 rounded-full text-sm inline-flex items-center gap-2 font-semibold text-white border-2 border-white/25 hover:bg-white/10 transition-all hover:border-white/40">
                Contact Sales
              </button>
            </div>
          </div>

          {/* Right Stats */}
          <div className="grid grid-cols-2 gap-4 animate-fade-up-delayed">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="trust-badge p-6 text-center"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <stat.icon className="w-8 h-8 mx-auto mb-3 text-orange-300" />
                <p className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">{stat.value}</p>
                <p className="mt-1 text-sm text-white/60 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
