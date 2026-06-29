"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, MapPin, Search, ShoppingCart, X, Mail, Phone, Bell, User, ChevronDown } from "lucide-react";
import { useState } from "react";

import { useAuth } from "@/features/auth/context/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Solutions", href: "/services" },
  { label: "About Us", href: "/about" },
  { label: "Contact Us", href: "/contact" },
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
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-100 transition-all duration-300">
      {/* Top Info Bar */}
      <div className="hidden border-b border-slate-100 bg-slate-50 text-[11px] font-medium text-slate-500 py-2 lg:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-1.5 text-slate-600">
              <MapPin className="h-3.5 w-3.5 text-blue-600" />
              <span>Bangalore, India</span>
            </div>
            <a href="tel:+919164487296" className="flex items-center gap-1.5 hover:text-blue-600 transition">
              <Phone className="h-3.5 w-3.5 text-blue-600" />
              <span>+91 91644 87296</span>
            </a>
            <a href="mailto:lohith@techbes.co.in" className="flex items-center gap-1.5 hover:text-blue-600 transition">
              <Mail className="h-3.5 w-3.5 text-blue-600" />
              <span>lohith@techbes.co.in</span>
            </a>
          </div>
          <div className="flex items-center gap-6 text-slate-600">
            <Link href="/services" className="hover:text-blue-600 transition">Support</Link>
            <Link href="/dashboard" className="hover:text-blue-600 transition">Track Ticket</Link>
            {status === "authenticated" && user ? (
              <span className="font-semibold text-slate-800">{user.email}</span>
            ) : (
              <Link href="/login" className="hover:text-blue-600 transition font-semibold">Login / Register</Link>
            )}
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative h-9 w-28 shrink-0 transition-transform group-hover:scale-102">
              <Image src="/logo.png" alt="Techbes" fill className="object-contain object-left" priority />
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden items-center gap-6 lg:flex">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-[13px] font-semibold text-slate-700 hover:text-blue-600 transition duration-150 relative py-1 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-blue-600 after:transition-all hover:after:w-full"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Custom Search Icon (Sleek trigger) */}
          <div className="relative hidden max-w-xs xl:block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <Input
              className="h-9 w-48 rounded-full border-slate-200 bg-slate-50 pl-9 text-xs focus:bg-white focus:ring-2 focus:ring-blue-500/20"
              placeholder="Search services..."
            />
          </div>

          {/* Location for Tablet */}
          <div className="hidden items-center gap-1.5 rounded-full border border-slate-100 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 md:flex lg:hidden">
            <MapPin className="h-3.5 w-3.5 text-blue-600" />
            Bangalore
          </div>

          {/* Notification bell (Interactive) */}
          <button className="relative rounded-full p-2 text-slate-600 hover:bg-slate-50 transition" aria-label="Notifications">
            <Bell className="h-4.5 w-4.5" />
            <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-blue-600" />
          </button>

          {/* Cart Icon */}
          <Link href="/cart" className="relative rounded-full p-2 text-slate-600 hover:bg-slate-50 transition" aria-label="Cart">
            <ShoppingCart className="h-4.5 w-4.5" />
          </Link>

          {/* Login / Profile */}
          <div className="hidden lg:flex items-center gap-2 border-l border-slate-100 pl-4">
            {status === "authenticated" && user ? (
              <div className="flex items-center gap-2">
                <Button variant="ghost" className="h-9 rounded-full px-3 text-xs font-semibold text-slate-700 hover:bg-slate-50" asChild>
                  <Link href="/dashboard">
                    <User className="mr-1.5 h-3.5 w-3.5 text-blue-600" />
                    Dashboard
                  </Link>
                </Button>
                <Button variant="outline" className="h-9 rounded-full text-xs border-slate-200 hover:bg-slate-50" onClick={handleLogout}>
                  Log Out
                </Button>
              </div>
            ) : (
              <Button variant="ghost" className="h-9 rounded-full px-3 text-xs font-semibold text-slate-700 hover:bg-slate-50" asChild>
                <Link href="/login">Log In</Link>
              </Button>
            )}
          </div>

          {/* Get a Quote / Book Service CTA */}
          <Button className="h-9.5 rounded-full px-5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all duration-150" asChild>
            <Link href="/services">
              Get a Quote
            </Link>
          </Button>

          {/* Mobile Menu Toggle */}
          <button
            className="rounded-full border border-slate-200 bg-white p-1.5 text-slate-700 shadow-sm lg:hidden hover:bg-slate-50 transition"
            onClick={() => setIsOpen((curr) => !curr)}
            aria-label="Toggle navigation"
          >
            {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {isOpen && (
        <div className="border-t border-slate-100 bg-white px-4 py-4 lg:hidden animate-fade-in">
          <div className="relative mb-4">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              className="h-10 rounded-full bg-slate-50 pl-11 text-sm border-none"
              placeholder="Search services..."
            />
          </div>
          <div className="mb-4 flex items-center gap-2 rounded-2xl bg-blue-50/50 px-4 py-2.5 text-xs font-semibold text-blue-700">
            <MapPin className="h-4 w-4" />
            Bengaluru, Karnataka
          </div>
          <div className="flex flex-col gap-1">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <hr className="my-2 border-slate-100" />
            {isAuthenticated && user ? (
              <>
                <Link
                  href="/dashboard"
                  className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
                  onClick={() => setIsOpen(false)}
                >
                  Dashboard ({user.email})
                </Link>
                <Button
                  variant="outline"
                  className="justify-center rounded-full mt-2"
                  onClick={async () => {
                    setIsOpen(false);
                    await handleLogout();
                  }}
                >
                  Log Out
                </Button>
              </>
            ) : (
              <Button variant="outline" className="justify-center rounded-full mt-2" asChild>
                <Link href="/login" onClick={() => setIsOpen(false)}>
                  Log In
                </Link>
              </Button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
