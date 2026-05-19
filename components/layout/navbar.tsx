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
    <> <header className="navbar-clean fixed top-0 left-0 right-0 z-[var(--z-sticky)]"> <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 w-full">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-3 flex-shrink-0">
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
      </Link>

      {/* Desktop Nav */}
      <nav className="hidden items-center gap-1 lg:flex">
        {NAV_ITEMS.map((item) => {
          const active =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`navbar-item rounded-md transition-all duration-200 ${active
                  ? "text-secondary bg-[rgba(37,99,235,0.08)]"
                  : "text-text-primary hover:text-secondary hover:bg-bg-secondary"
                }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Right Side */}
      <div className="hidden items-center gap-3 lg:flex">

        <div className="flex items-center gap-2 rounded-lg border border-border-primary bg-bg-secondary px-3 py-2">
          <MapPin className="h-4 w-4 text-primary" />

          <div className="flex flex-col leading-tight">
            <span className="text-[11px] text-text-secondary">
              Delivering in
            </span>

            <span className="text-sm font-semibold text-text-primary">
              Bengaluru
            </span>
          </div>
        </div>

        <Link
          href="/partner"
          className="btn-outline btn-sm"
        >
          Become a Partner
        </Link>

        <Link
          href="/services"
          className="btn-primary btn-sm"
        >
          Book Now
        </Link>
      </div>

      {/* Mobile Button */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-center rounded-lg border border-border-primary p-2 lg:hidden"
      >
        {open ? (
          <X className="h-5 w-5 text-text-primary" />
        ) : (
          <Menu className="h-5 w-5 text-text-primary" />
        )}
      </button>
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
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="mt-10 flex flex-col gap-3">
              <Link
                href="/partner"
                className="btn-outline w-full"
              >
                Become a Partner
              </Link>

              <Link
                href="/services"
                className="btn-primary w-full"
              >
                Book a Service
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>

);
}