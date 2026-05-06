"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, MapPin, Search, Sparkles, X, User, LogOut, ChevronDown } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { useAuth } from "@/features/auth/context/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const navItems = [
  { label: "Services", href: "/services" },
  { label: "AMC Plans", href: "/services?category=amc" },
  { label: "Dashboard", href: "/dashboard" },
];

export function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { isAuthenticated, logout, status, user } = useAuth();
  const customerLabel = user?.name || user?.mobileNumber || user?.email || "Account";

  async function handleLogout() {
    await logout();
    router.replace("/login");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-50 border-b border-white/40 bg-white/70 backdrop-blur-2xl shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center gap-6 px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex min-w-0 items-center gap-4 transition-transform hover:scale-[1.02] active:scale-[0.98]">
          <div className="relative h-10 w-32 shrink-0">
            <Image src="/logo.png" alt="Techbes" fill className="object-contain object-left" priority />
          </div>
          <div className="hidden rounded-full border border-blue-100 bg-blue-50/50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-blue-600 md:flex">
            Verified Marketplace
          </div>
        </Link>

        {/* Desktop Search */}
        <div className="hidden flex-1 items-center justify-center lg:flex max-w-md">
          <div className="relative w-full group">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-blue-500" />
            <Input
              className="h-11 rounded-2xl border-slate-200 bg-slate-50/50 pl-11 focus:bg-white transition-all shadow-none focus:shadow-lg focus:shadow-blue-500/5"
              placeholder="Search CCTV, networking..."
            />
          </div>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-3 lg:flex">
          <div className="flex items-center gap-2 rounded-2xl border border-slate-100 bg-slate-50/50 px-3 py-1.5 text-xs font-medium text-slate-500 transition-colors hover:bg-slate-100 mr-2">
            <MapPin className="h-3.5 w-3.5 text-blue-500" />
            Bengaluru
            <ChevronDown className="h-3 w-3" />
          </div>
          
          <nav className="flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full px-4 py-2 text-sm font-semibold text-slate-600 transition-all hover:text-blue-600 hover:bg-blue-50"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="h-6 w-px bg-slate-200 mx-2" />

          {status === "authenticated" && user ? (
            <div className="flex items-center gap-2">
              <Button variant="ghost" className="rounded-full h-10 px-4 flex items-center gap-2 text-slate-700 hover:bg-slate-100" asChild>
                <Link href="/dashboard">
                  <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-[10px] font-bold text-blue-700">
                    {customerLabel.charAt(0).toUpperCase()}
                  </div>
                  {customerLabel}
                </Link>
              </Button>
              <button onClick={handleLogout} className="p-2 text-slate-400 hover:text-rose-500 transition-colors" title="Logout">
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/login" className="text-sm font-bold text-slate-600 hover:text-blue-600 px-3 transition-colors">
                Log In
              </Link>
              <Button className="rounded-full bg-blue-600 hover:bg-blue-700 px-6 font-bold shadow-lg shadow-blue-600/20" asChild>
                <Link href="/signup">Sign Up</Link>
              </Button>
            </div>
          )}
          
          <Button className="rounded-full bg-orange-500 hover:bg-orange-600 h-11 px-6 font-bold shadow-lg shadow-orange-500/30" asChild>
            <Link href="/services">
              <Sparkles className="h-4 w-4" />
              Book Now
            </Link>
          </Button>
        </div>

        {/* Mobile menu toggle */}
        <button
          className="ml-auto inline-flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600 transition-all hover:bg-slate-200 active:scale-90 lg:hidden"
          onClick={() => setIsOpen((current) => !current)}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-slate-100 bg-white/95 backdrop-blur-xl lg:hidden"
          >
            <div className="px-4 py-6 space-y-6">
              <div className="relative">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  className="h-12 rounded-2xl bg-slate-50 pl-11 border-none"
                  placeholder="Search CCTV, networking..."
                />
              </div>

              <div className="grid grid-cols-1 gap-2">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center rounded-2xl px-4 py-4 text-base font-bold text-slate-700 transition hover:bg-slate-50 active:bg-slate-100"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>

              <div className="h-px bg-slate-100 w-full" />

              {isAuthenticated && user ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 px-4 py-2">
                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                      {customerLabel.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{customerLabel}</p>
                      <p className="text-xs text-slate-500 uppercase tracking-wider">{user.role}</p>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full h-12 rounded-2xl font-bold" asChild>
                    <Link href="/dashboard" onClick={() => setIsOpen(false)}>My Dashboard</Link>
                  </Button>
                  <Button variant="ghost" className="w-full h-12 rounded-2xl font-bold text-rose-600 hover:bg-rose-50" onClick={handleLogout}>
                    Log Out
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline" className="h-12 rounded-2xl font-bold" asChild>
                    <Link href="/login" onClick={() => setIsOpen(false)}>Log In</Link>
                  </Button>
                  <Button className="h-12 rounded-2xl font-bold bg-blue-600" asChild>
                    <Link href="/signup" onClick={() => setIsOpen(false)}>Sign Up</Link>
                  </Button>
                </div>
              )}
              
              <Button className="w-full h-14 rounded-2xl font-black bg-orange-500 shadow-xl shadow-orange-500/20" asChild>
                <Link href="/services" onClick={() => setIsOpen(false)}>
                  Book a Service
                </Link>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
