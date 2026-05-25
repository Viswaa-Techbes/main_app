"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, MapPin, Search, Sparkles, X } from "lucide-react";
import { useState } from "react";

import { useAuth } from "@/features/auth/context/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const navItems = [
  { label: "Services", href: "/services" },
  { label: "My Bookings", href: "/dashboard" },
  { label: "Support", href: "/support" },
];

export function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { isAuthenticated, logout, status, user } = useAuth();

  async function handleLogout() {
    await logout();
    router.replace("/login");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-50 border-b border-white/60 bg-white/75 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex min-w-0 items-center gap-3">
          <div className="relative h-11 w-32 shrink-0">
            <Image src="/logo.png" alt="Techbes" fill className="object-contain object-left" priority />
          </div>
          <div className="hidden rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 md:flex">
            Verified IT Marketplace
          </div>
        </Link>

        <div className="hidden flex-1 items-center justify-center lg:flex">
          <div className="relative w-full max-w-xl">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              className="h-12 rounded-full border-white bg-white/90 pl-11 shadow-[0_20px_40px_-24px_rgba(15,23,42,0.4)]"
              placeholder="Search CCTV, networking, AMC plans..."
            />
          </div>
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-sm text-slate-600">
            <MapPin className="h-4 w-4 text-emerald-600" />
            Bengaluru
          </div>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="px-3 py-1 text-sm font-medium text-slate-700 transition hover:text-slate-900"
            >
              {item.label}
            </Link>
          ))}
          <div className="ml-4 flex items-center gap-3">
            {status === "authenticated" && user ? (
              <>
                <Button variant="ghost" className="px-3 py-1 rounded-full text-sm">
                  {user.email}
                </Button>
                <Button variant="outline" className="px-3 py-1 rounded-full" onClick={handleLogout}>
                  Log Out
                </Button>
              </>
            ) : (
              <Button variant="outline" className="px-3 py-1 rounded-full" asChild>
                <Link href="/login">Log In</Link>
              </Button>
            )}
            <Button className="rounded-full px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white">
              Book Service
            </Button>
          </div>
        </div>

        <button
          className="ml-auto inline-flex rounded-full border border-slate-200 bg-white p-2 text-slate-700 shadow-sm lg:hidden"
          onClick={() => setIsOpen((current) => !current)}
          aria-label="Toggle navigation"
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {isOpen && (
        <div className="border-t border-slate-200 bg-white px-4 py-4 lg:hidden">
          <div className="relative mb-4">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              className="h-12 rounded-full bg-slate-50 pl-11"
              placeholder="Search CCTV, networking, AMC plans..."
            />
          </div>
          <div className="mb-4 flex items-center gap-2 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
            <MapPin className="h-4 w-4" />
            Bengaluru, Karnataka
          </div>
          <div className="flex flex-col gap-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            {isAuthenticated && user ? (
              <>
                <Link
                  href="/dashboard"
                  className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700"
                  onClick={() => setIsOpen(false)}
                >
                  Signed in as {user.email}
                </Link>
                <Button
                  variant="outline"
                  className="justify-center rounded-full"
                  onClick={async () => {
                    setIsOpen(false);
                    await handleLogout();
                  }}
                >
                  Log Out
                </Button>
              </>
            ) : (
              <Button variant="outline" className="justify-center rounded-full" asChild>
                <Link href="/login" onClick={() => setIsOpen(false)}>
                  Log In
                </Link>
              </Button>
            )}
            <Button className="justify-center rounded-full">Book a Service</Button>
          </div>
        </div>
      )}
    </header>
  );
}
