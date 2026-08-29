"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin, Phone, Twitter, Linkedin, Instagram, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function NewsletterBanner() {
  return (
    <div className="bg-white border-t border-slate-100">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 p-7 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.08),transparent_55%)] pointer-events-none" />
          <div className="relative z-10">
            <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">Stay Updated on IT Security & AMC Audits</h3>
            <p className="mt-1 text-xs text-blue-200 font-semibold max-w-md">
              Subscribe to our newsletter for exclusive AMC coupons, IT security advisories, and proactive maintenance guides.
            </p>
          </div>
          <form className="relative z-10 flex w-full max-w-sm items-center gap-2" onSubmit={(e) => e.preventDefault()}>
            <Input
              type="email"
              placeholder="Enter your email address"
              className="h-10 flex-1 rounded-xl bg-white/15 border-white/20 text-xs text-white placeholder:text-blue-200 focus:bg-white/20 focus:ring-white/30"
            />
            <Button type="submit" className="h-10 rounded-xl bg-white text-blue-700 hover:bg-blue-50 font-bold text-xs px-4 shadow-sm flex items-center gap-1.5 shrink-0">
              Subscribe
              <Send className="h-3.5 w-3.5" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950 text-slate-200">
      <div className="mx-auto max-w-7xl px-4 pt-14 sm:px-6 lg:px-8">

        {/* Footer grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 pb-12 border-b border-slate-900">
          
          {/* Logo & description (spans 2 cols) */}
          <div className="col-span-2 flex flex-col gap-4">
            <div className="relative h-10 w-36 shrink-0">
              {/* Colored logo — no invert filter */}
              <Image src="/logo.png" alt="Techbes" fill className="object-contain object-left" />
            </div>
            <p className="text-xs leading-relaxed text-slate-400 max-w-xs font-semibold">
              The premier IT services marketplace connecting certified tech specialists with residential and enterprise projects. Transparent SLA billing and 100% verified fulfillment.
            </p>
            <div className="flex items-center gap-3 text-slate-500 mt-2">
              <a href="https://twitter.com/techbes" target="_blank" rel="noreferrer" className="hover:text-blue-400 transition-colors"><Twitter className="h-4 w-4" /></a>
              <a href="https://linkedin.com/company/techbes" target="_blank" rel="noreferrer" className="hover:text-blue-400 transition-colors"><Linkedin className="h-4 w-4" /></a>
              <a href="https://instagram.com/techbes" target="_blank" rel="noreferrer" className="hover:text-pink-400 transition-colors"><Instagram className="h-4 w-4" /></a>
            </div>
          </div>

          {/* Services Group */}
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Services</h4>
            <ul className="mt-4 space-y-3 text-xs text-slate-400 font-semibold">
              <li><Link href="/services?category=cctv" className="hover:text-white transition-colors">CCTV Installation</Link></li>
              <li><Link href="/services?category=networking" className="hover:text-white transition-colors">Structured Cabling</Link></li>
              <li><Link href="/services?category=networking" className="hover:text-white transition-colors">Network Setup</Link></li>
              <li><Link href="/services?category=server" className="hover:text-white transition-colors">Server Maintenance</Link></li>
            </ul>
          </div>

          {/* Knowledge Center Group */}
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Knowledge</h4>
            <ul className="mt-4 space-y-3 text-xs text-slate-400 font-semibold">
              <li><Link href="/knowledge" className="hover:text-white transition-colors">Knowledge Hub</Link></li>
              <li><Link href="/knowledge/cctv-buying-guide" className="hover:text-white transition-colors">CCTV Buying Guide</Link></li>
              <li><Link href="/knowledge/cp-plus-vs-hikvision" className="hover:text-white transition-colors">CP Plus vs Hikvision</Link></li>
              <li><Link href="/knowledge/nagarbhavi" className="hover:text-white transition-colors">Service Areas</Link></li>
            </ul>
          </div>

          {/* Support Group */}
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Support</h4>
            <ul className="mt-4 space-y-3 text-xs text-slate-400 font-semibold">
              <li><Link href="/contact" className="hover:text-white transition-colors">Help Center</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact Support</Link></li>
              <li><Link href="/dashboard" className="hover:text-white transition-colors">Track Ticket</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">About Techbes</Link></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="col-span-2 lg:col-span-1">
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Contact</h4>
            <div className="mt-4 space-y-3 text-xs text-slate-400 font-semibold">
              <p className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
                <span>Nagarbhavi, Bangalore – 560072</span>
              </p>
              <p className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-blue-500 shrink-0" />
                <a href="tel:+919591144949" className="hover:text-white transition-colors">+91 95911 44949</a>
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* Copyright Footer */}
      <div className="bg-slate-950/80 py-6 text-xs text-slate-500 font-semibold">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center justify-between gap-4">
          <p className="text-center lg:text-left">© 2026 Techbes India. All rights reserved. Razorpay Secured Gateway.</p>
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-[9px] sm:text-[10px] uppercase tracking-wider justify-center lg:justify-end">
            <Link href="/privacy" className="hover:text-slate-400 transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-slate-400 transition-colors">Terms</Link>
            <Link href="/cookie-policy" className="hover:text-slate-400 transition-colors">Cookies</Link>
            <Link href="/refund-policy" className="hover:text-slate-400 transition-colors">Refunds</Link>
            <Link href="/cancellation-policy" className="hover:text-slate-400 transition-colors">Cancellations</Link>
            <Link href="/shipping-policy" className="hover:text-slate-400 transition-colors">Shipping</Link>
            <Link href="/return-policy" className="hover:text-slate-400 transition-colors">Returns</Link>
            <Link href="/disclaimer" className="hover:text-slate-400 transition-colors">Disclaimer</Link>
            <Link href="/security-policy" className="hover:text-slate-400 transition-colors">Security</Link>
            <Link href="/accessibility" className="hover:text-slate-400 transition-colors">Accessibility</Link>
            <Link href="/responsible-disclosure" className="hover:text-slate-400 transition-colors">Disclosure</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
