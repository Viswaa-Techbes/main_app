"use client";

import { CheckCircle, Users, Building2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

const stats = [
  { value: "50K+", label: "Services Completed", icon: CheckCircle },
  { value: "10K+", label: "Happy Customers", icon: Users },
  { value: "500+", label: "Business Partners", icon: Building2 },
  { value: "4.9", label: "Average Rating", icon: Star },
];

export function TrustBanner() {
  return (
    <section className="py-16 md:py-20 bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold leading-tight text-balance">
              Trusted by 500+ Businesses Across India
            </h2>
            <p className="mt-4 text-primary-foreground/80 text-lg">
              Join thousands of businesses who rely on TechBes for their 
              IT infrastructure needs. From startups to enterprises, we deliver 
              quality service every time.
            </p>
            
            <div className="mt-8 flex flex-wrap gap-4">
              <Button 
                size="lg" 
                className="bg-card text-foreground hover:bg-card/90 rounded-full"
              >
                Get Started Today
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 rounded-full"
              >
                Contact Sales
              </Button>
            </div>
          </div>

          {/* Right Stats */}
          <div className="grid grid-cols-2 gap-6">
            {stats.map((stat, index) => (
              <div 
                key={index}
                className="bg-primary-foreground/10 backdrop-blur-sm rounded-2xl p-6 text-center"
              >
                <stat.icon className="w-8 h-8 mx-auto mb-3 text-primary-foreground/80" />
                <p className="text-3xl md:text-4xl font-bold">{stat.value}</p>
                <p className="mt-1 text-sm text-primary-foreground/70">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
