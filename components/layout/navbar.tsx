"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu, X, MapPin } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { label: "Services", href: "/services" },
  { label: "AMC Plans", href: "/services?category=amc" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "Careers", href: "/careers" },
  { label: "Contact Us", href: "/contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-[var(--z-sticky)] ds-card" style={{boxShadow: '0 6px 20px rgba(16,24,40,0.04)'}}>
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 w-full">
      {/* Logo */}
      <Link href="/" className="flex-shrink-0">
        <span className="inline-flex items-center gap-3">
          <div className="relative h-10 w-32">
            <Image
              src="/logo.png"
              alt="Techbes"
              fill
              priority
              className="object-contain"
            />
          </div>

          <div className="hidden flex-col leading-tight md:flex">
            <span className="text-sm font-bold text-primary">
              Techbes
            </span>

            <span className="text-xs text-text-secondary">
              Verified Marketplace
            </span>
          </div>
        </span>
      </Link>

      {/* Search + Nav (desktop) */}
      <div className="hidden lg:flex items-center gap-6">
        <div className="w-[520px]">
          <div className="flex items-center gap-3 rounded-xl border px-3 py-2 bg-[var(--input)]" style={{borderColor: 'var(--border)'}}>
            <div className="flex items-center gap-3 pr-3 border-r" style={{borderRight: '1px solid var(--border)'}}>
              <MapPin className="h-5 w-5 text-[var(--color-primary)]" />
              <div className="flex flex-col leading-tight">
                <span className="text-[11px] text-[var(--muted-foreground)]">Delivering in</span>
                <span className="text-sm font-semibold text-[var(--text-900)]">Bengaluru</span>
              </div>
            </div>

            <input
              aria-label="Search services"
              placeholder="Search services, e.g. AC repair, CCTV installation"
              className="flex-1 bg-transparent outline-none text-sm text-[var(--text-700)]"
            />

            <button className="btn-primary" aria-label="Search">Search</button>
          </div>
        </div>

        <nav className="flex items-center gap-2">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
              return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-2 rounded-md transition-all duration-150 ${active ? 'text-[var(--color-secondary)] bg-[rgba(37,99,235,0.06)]' : 'text-[var(--text-700)] hover:text-[var(--color-secondary)]'}`}
              >
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <Link href="/partner" className="text-sm text-[var(--text-700)] hover:text-[var(--text-900)]"><span>Become a Partner</span></Link>
          <Link href="/services" className="btn-primary"><span>Book Now</span></Link>
        </div>
      </div>

      {/* Mobile Button */}
      <div className="flex items-center gap-2 lg:hidden">
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center justify-center rounded-lg border p-2"
          aria-label="Open menu"
        >
          {open ? <X className="h-5 w-5 text-[var(--text-900)]" /> : <Menu className="h-5 w-5 text-[var(--text-900)]" />}
        </button>
      </div>
    </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[var(--z-modal)] bg-white p-6 lg:hidden top-20"
          >
            <div className="flex items-center justify-between">
              <Image
                src="/logo.png"
                alt="logo"
                width={120}
                height={40}
                className="object-contain"
              />

              <button onClick={() => setOpen(false)}>
                <X className="h-6 w-6 text-text-primary" />
              </button>
            </div>

            <div className="mt-10 flex flex-col gap-2">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="navbar-item rounded-lg px-4 py-3 text-base"
                >
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>

            <div className="mt-10 flex flex-col gap-3">
              <Link
                href="/partner"
                className="btn-outline w-full"
              >
                <span>Become a Partner</span>
              </Link>

              <Link
                href="/services"
                className="btn-primary w-full"
              >
                <span>Book a Service</span>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>

);
}