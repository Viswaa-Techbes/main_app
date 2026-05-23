"use client";

import Link from "next/link";
import { Lightbulb, Cpu } from "lucide-react";

import { Card } from "@/components/ui/card";

export function AiRecommendations() {
  const items = [
    { title: "Smart AMC bundling", desc: "AI suggests AMC + 2 preventive visits", CTA: "/services?category=amc" },
    { title: "Priority CCTV audit", desc: "Field-AI recommends a security audit for large sites", CTA: "/services?category=cctv" },
    { title: "Network health check", desc: "Automated diagnostics before large deployments", CTA: "/services?category=networking" },
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground/60">AI Recommendations</h3>
        <h2 className="mt-3 text-3xl font-extrabold text-foreground">Personalized suggestions powered by our field AI</h2>
        <p className="mt-2 max-w-2xl text-sm text-foreground/70">Machine-curated bundles and workflow suggestions driven by historical bookings, site type, and technician availability.</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-3">
        {items.map((it) => (
          <Card key={it.title} className="glass-card p-6">
            <div className="flex items-start gap-4">
              <div className="rounded-lg bg-gradient-to-br from-cyan-400 to-purple-500 p-3 text-white">
                <Cpu className="h-6 w-6" />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-foreground">{it.title}</h4>
                <p className="mt-1 text-sm text-foreground/70">{it.desc}</p>
                <div className="mt-4">
                  <Link href={it.CTA} className="text-sm font-semibold text-primary hover:underline"><span>View recommended plan →</span></Link>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}

export default AiRecommendations;
