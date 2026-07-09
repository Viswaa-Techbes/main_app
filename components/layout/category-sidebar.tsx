"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { 
  Camera, 
  Network, 
  Laptop, 
  Monitor, 
  Server, 
  FileCheck, 
  Home, 
  Globe, 
  Key, 
  ShieldCheck,
  ChevronRight,
  HelpCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";

const sidebarCategories = [
  { id: "cctv", title: "CCTV", subtitle: "Installation, Repair & AMC", icon: Camera },
  { id: "networking", title: "Networking", subtitle: "Wired & Wireless Solutions", icon: Network },
  { id: "laptop", title: "Laptop", subtitle: "Sales, Repair & Upgrade", icon: Laptop },
  { id: "desktop", title: "Desktop", subtitle: "Sales, Repair & Upgrade", icon: Monitor },
  { id: "server", title: "Server", subtitle: "Installation & Support", icon: Server },
  { id: "electronic-contracts", title: "Electronic Contracts", subtitle: "Digital Contracts Made Easy", icon: FileCheck },
  { id: "home-automation", title: "Home Automation", subtitle: "Smart Solutions for Home", icon: Home },
  { id: "website-development", title: "Website Development", subtitle: "Professional Websites", icon: Globe },
  { id: "software-licensing", title: "Software Licensing", subtitle: "Genuine Licenses", icon: Key },
  { id: "cyber-security", title: "Cyber Security", subtitle: "Protect Your Data & Systems", icon: ShieldCheck },
];

export function CategorySidebar() {
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get("category") || "";

  return (
    <aside className="w-full lg:w-[280px] shrink-0">
      <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
        <h2 className="px-3 py-2 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">
          Our Categories
        </h2>
        <nav className="mt-2 space-y-1">
          {sidebarCategories.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;

            return (
              <Link
                key={cat.id}
                href={`/services?category=${cat.id}`}
                className={`flex items-center justify-between rounded-xl px-3 py-2.5 transition-all duration-200 group ${
                  isActive 
                    ? "bg-blue-50/75 text-blue-600 font-semibold" 
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`rounded-lg p-2 transition-colors ${
                    isActive ? "bg-blue-100 text-blue-600" : "bg-slate-50 text-slate-500 group-hover:bg-white group-hover:text-blue-600 shadow-sm"
                  }`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs leading-none font-semibold truncate flex items-center gap-1.5">
                      {cat.title}
                      {cat.id !== "cctv" && (
                        <span className="text-[8px] font-bold text-slate-400 bg-slate-100 px-1 py-0.5 rounded-sm uppercase tracking-wide">
                          Soon
                        </span>
                      )}
                    </p>
                    <p className="mt-1 text-[10px] text-slate-400 font-medium truncate max-w-[160px]">{cat.subtitle}</p>
                  </div>
                </div>
                <ChevronRight className={`h-3.5 w-3.5 text-slate-300 transition-transform group-hover:translate-x-0.5 ${isActive ? "text-blue-500" : ""}`} />
              </Link>
            );
          })}
        </nav>

        {/* Not Sure What You Need Card */}
        <div className="mt-5 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 p-4 text-white shadow-md relative overflow-hidden">
          <div className="absolute right-0 bottom-0 translate-x-2 translate-y-2 opacity-10">
            <HelpCircle className="h-24 w-24" />
          </div>
          <div className="flex items-center gap-2">
            <HelpCircle className="h-4 w-4 text-blue-200" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-200">Not Sure What You Need?</span>
          </div>
          <p className="mt-2 text-xs font-semibold leading-relaxed">
            Get a free consultation from our verified experts.
          </p>
          <Button 
            className="mt-4 w-full h-8.5 rounded-xl bg-white text-blue-600 hover:bg-slate-50 text-[11px] font-bold shadow-sm transition-transform hover:scale-102"
            asChild
          >
            <Link href="/services">
              Book a Free Consultation
            </Link>
          </Button>
        </div>
      </div>
    </aside>
  );
}
