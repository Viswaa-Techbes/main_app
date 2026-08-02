"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageShell } from "@/components/layout/page-shell";
import { Search, Home, ChevronRight, HelpCircle, Camera, Network, Laptop, Monitor, Server } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function NotFound() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/services?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const categories = [
    { label: "CCTV Setup", slug: "cctv", icon: Camera },
    { label: "Networking", slug: "networking", icon: Network },
    { label: "Laptop Fix", slug: "laptop", icon: Laptop },
    { label: "Desktop PC", slug: "desktop", icon: Monitor },
    { label: "Servers", slug: "server", icon: Server },
  ];

  const popularServices = [
    { label: "CCTV Installation in Bangalore", slug: "install-new-cctv" },
    { label: "CCTV AMC & Maintenance Contracts", slug: "maintenance-amc" },
    { label: "Office Structured Network Setup", slug: "office-network-deployment" },
    { label: "Doorstep Laptop & Display Repair", slug: "laptop-repair" },
    { label: "Free CCTV Site Survey & Estimation", slug: "free-site-survey" },
  ];

  return (
    <PageShell>
      <div className="bg-slate-50/30 min-h-[80vh] flex items-center py-12">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 text-center space-y-8">
          
          {/* 404 Icon & Header */}
          <div className="space-y-4">
            <div className="mx-auto rounded-full bg-blue-50 border border-blue-100 p-5 text-blue-600 shadow-sm w-fit animate-pulse">
              <HelpCircle className="h-10 w-10" />
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight sm:text-5xl">404 - Page Not Found</h1>
            <p className="text-xs leading-relaxed text-slate-500 font-semibold max-w-md mx-auto">
              Sorry, we couldn't find the page you are looking for. It might have been moved or renamed. Browse our Bangalore IT services below.
            </p>
          </div>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="relative max-w-md mx-auto flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                type="text"
                placeholder="Search CCTV, networking, repairs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-12 rounded-xl border-slate-200 bg-white pl-11 text-xs focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
            <Button type="submit" className="h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-6 shadow-sm">
              Search
            </Button>
          </form>

          {/* Categories Grid */}
          <div className="space-y-4 pt-2">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Browse Services</h3>
            <div className="grid gap-3 grid-cols-2 sm:grid-cols-5">
              {categories.map((cat) => {
                const Icon = cat.icon;
                return (
                  <Link
                    key={cat.slug}
                    href={`/services?category=${cat.slug}`}
                    className="p-4 rounded-xl border border-slate-100 bg-white hover:border-blue-100 hover:shadow-sm transition flex flex-col items-center gap-2 text-center"
                  >
                    <div className="rounded-full bg-blue-50 text-blue-600 p-2.5">
                      <Icon className="h-4.5 w-4.5" />
                    </div>
                    <span className="text-[10px] font-bold text-slate-800">{cat.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Popular Services Links */}
          <div className="space-y-3 pt-2">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Popular Bangalore Services</h3>
            <div className="flex flex-col gap-2 max-w-md mx-auto text-left">
              {popularServices.map((service) => (
                <Link
                  key={service.slug}
                  href={`/services/${service.slug}`}
                  className="group flex items-center justify-between rounded-xl border border-slate-100 bg-white p-3.5 hover:border-blue-100 hover:shadow-xs transition duration-200"
                >
                  <span className="text-xs font-semibold text-slate-700 group-hover:text-blue-600 transition-colors">
                    {service.label}
                  </span>
                  <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-blue-650 transition-colors" />
                </Link>
              ))}
            </div>
          </div>

          {/* Back Home */}
          <div className="pt-4 border-t border-slate-100">
            <Button asChild className="h-11 rounded-xl bg-slate-905 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-6 shadow-sm flex items-center gap-2 mx-auto w-fit">
              <Link href="/">
                <Home className="h-4 w-4" />
                Back to Homepage
              </Link>
            </Button>
          </div>

        </div>
      </div>
    </PageShell>
  );
}
