"use client";

import Link from "next/link";
import { useState } from "react";
import { PageShell } from "@/components/layout/page-shell";
import { GEO_PAGES, GeoPageData } from "@/lib/geo-data";
import { Search, BookOpen, Layers, ShieldCheck, MapPin, ArrowRight, Shield, Award } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function KnowledgeHubLanding() {
  const [searchQuery, setSearchQuery] = useState("");

  const allPages = Object.values(GEO_PAGES);

  const filteredPages = allPages.filter(
    (page) =>
      page.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      page.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      page.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const categories = [
    { name: "Pillars", label: "Authority Guides", icon: BookOpen, desc: "In-depth security guidelines for homes, offices, and warehouses." },
    { name: "Comparisons", label: "Technology Battles", icon: Layers, desc: "Direct comparisons to help you choose the right gear (IP vs Analog, WiFi vs Wired)." },
    { name: "Brands", label: "Brand Directories", icon: ShieldCheck, desc: "Detailed model specifications, use cases, and official support for CP Plus, Hikvision, etc." },
    { name: "Service Guides", label: "Specialty Setups", icon: Shield, desc: "Guides for school, retail shop, same-day, and factory security camera systems." },
    { name: "Locations", label: "Bangalore Area Hubs", icon: MapPin, desc: "Neighborhood-specific local SEO guides covering Nagarbhavi, HSR, Whitefield, etc." },
  ];

  return (
    <PageShell>
      <div className="bg-slate-50/30 min-h-[90vh] py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          
          {/* Hero Section */}
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <div className="mx-auto rounded-full bg-blue-50 border border-blue-100 p-3 text-blue-650 shadow-xs w-fit flex items-center gap-1.5 px-4">
              <Award className="h-4.5 w-4.5 text-blue-600 animate-bounce" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-blue-700">TechBes E-E-A-T Certified Authority</span>
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight sm:text-5xl">
              Knowledge Center & Security Authority
            </h1>
            <p className="text-xs leading-relaxed text-slate-500 font-semibold max-w-2xl mx-auto">
              Read citation-ready buying guides, technology comparisons, model reviews, and local neighborhood security reports compiled by TechBes engineers in Bangalore.
            </p>

            {/* Interactive Search */}
            <div className="relative max-w-md mx-auto pt-4">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                type="text"
                placeholder="Search buying guides, brands, comparisons..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-12 rounded-2xl border-slate-200 bg-white pl-11 text-xs focus:ring-2 focus:ring-blue-500/20 shadow-xs"
              />
            </div>
          </div>

          {/* Conditional Rendering based on Search query */}
          {searchQuery ? (
            <div className="space-y-4">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Search Results ({filteredPages.length})
              </h2>
              {filteredPages.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredPages.map((page) => (
                    <GuideCard key={page.slug} page={page} />
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-slate-100 bg-white p-12 text-center text-slate-400 font-semibold text-xs">
                  No guides found matching your query.
                </div>
              )}
            </div>
          ) : (
            /* Normal Category Grid Layout */
            <div className="space-y-12">
              {categories.map((cat) => {
                const CatIcon = cat.icon;
                const pagesInCat = allPages.filter((p) => p.category === cat.name);
                if (pagesInCat.length === 0) return null;

                return (
                  <div key={cat.name} className="space-y-4 pt-4 border-t border-slate-100 first:border-0 first:pt-0">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-2">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <div className="rounded-lg bg-blue-50 text-blue-600 p-1.5">
                            <CatIcon className="h-4.5 w-4.5" />
                          </div>
                          <h2 className="text-base font-extrabold text-slate-900">{cat.label}</h2>
                        </div>
                        <p className="text-[10px] text-slate-400 font-semibold">{cat.desc}</p>
                      </div>
                      <span className="text-[9px] font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full uppercase tracking-wider w-fit">
                        {pagesInCat.length} Topics
                      </span>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {pagesInCat.map((page) => (
                        <GuideCard key={page.slug} page={page} />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      </div>
    </PageShell>
  );
}

function GuideCard({ page }: { page: GeoPageData }) {
  return (
    <Link
      href={`/knowledge/${page.slug}`}
      className="group rounded-2xl border border-slate-100 bg-white p-5 hover:border-blue-100 hover:shadow-xs transition duration-200 flex flex-col justify-between"
    >
      <div className="space-y-2">
        <span className="inline-flex rounded-full bg-slate-50 border border-slate-100 px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider text-slate-400">
          {page.category}
        </span>
        <h3 className="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-1">
          {page.title}
        </h3>
        <p className="text-[10px] text-slate-400 leading-relaxed font-semibold line-clamp-2">
          {page.description}
        </p>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-50 flex items-center justify-between">
        <span className="text-[9px] font-bold text-blue-600 group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
          Read Guide <ArrowRight className="h-3 w-3" />
        </span>
      </div>
    </Link>
  );
}
