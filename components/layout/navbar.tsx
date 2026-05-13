"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { modalPreset } from "@/components/animations/motion-presets";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/services' },
  { label: 'AMC Plans', href: '/services?category=amc' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Careers', href: '/careers' },
  { label: 'Contact', href: '/contact' },
];

export default function Navbar(){
  const [open,setOpen]=useState(false);
  const pathname = usePathname();

  useEffect(()=>{
    document.body.style.overflow = open ? 'hidden' : '';
    return ()=>{ document.body.style.overflow = ''; };
  },[open]);

  return (
    <nav className="sticky top-4 z-50 w-full">
      <div className="mx-auto max-w-7xl px-4">
        <div className="-mx-4 rounded-2xl bg-[rgba(255,255,255,0.03)] backdrop-blur-md border border-white/6 p-3 shadow-lg">
          <div className="flex items-center justify-between gap-4 px-4 py-1">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-3">
                <div className="relative h-10 w-36">
                  <Image src="/logo.png" alt="Techbes" fill className="object-contain" priority />
                </div>
                <div className="hidden md:flex flex-col leading-tight">
                  <span className="text-sm font-semibold text-white">Techbes</span>
                  <span className="text-xs text-[rgba(255,255,255,0.7)]">Verified Marketplace</span>
                </div>
              </Link>

              <div className="hidden lg:flex lg:items-center lg:gap-6">
                <nav className="relative flex items-center gap-6">
                  {NAV_ITEMS.map((item) => {
                    const active = pathname?.startsWith(item.href) && item.href !== '/';
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`relative text-sm font-medium transition-colors ${active ? 'text-white' : 'text-[rgba(255,255,255,0.86)] hover:text-white'}`}
                      >
                        <span className="py-1">{item.label}</span>
                        <span className={`absolute left-0 bottom-[-10px] h-0.5 w-full origin-left transform transition-all ${active ? 'bg-gradient-to-r from-[#F97316] to-[#2563EB] scale-x-100' : 'bg-transparent scale-x-0'}`} />
                      </Link>
                    );
                  })}
                </nav>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-3">
                <div className="rounded-full bg-[rgba(255,255,255,0.04)] px-3 py-1 text-sm text-[rgba(255,255,255,0.8)]">Delivering in <strong className="ml-1 text-white">Bengaluru</strong></div>
                <Button variant="outline" className="rounded-full text-white border-white/10 btn-magnetic" data-magnetic-btn asChild>
                  <Link href="/partner">Become a Partner</Link>
                </Button>
              </div>

              <div className="hidden lg:block">
                <Button className="rounded-full bg-gradient-to-r from-[#F97316] to-[#2563EB] text-white shadow-2xl hover:scale-[1.02] transition-transform btn-magnetic glow-pulse" data-magnetic-btn asChild>
                  <Link href="/services">Book Now</Link>
                </Button>
              </div>

              <div className="lg:hidden">
                <button aria-label="menu" onClick={()=>setOpen((o)=>!o)} className="rounded-md p-2 text-white">{open? '✕' : '☰'}</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            variants={modalPreset}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="fixed inset-0 z-50 flex flex-col bg-[linear-gradient(180deg,#081026,rgba(8,16,38,0.95))] p-6 lg:hidden"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative h-10 w-28">
                  <Image src="/logo.png" alt="Techbes" fill className="object-contain" />
                </div>
                <div className="text-sm text-[rgba(255,255,255,0.8)]">Verified Marketplace</div>
              </div>
              <button aria-label="close menu" onClick={()=>setOpen(false)} className="text-white">Close</button>
            </div>

            <div className="mt-8 flex flex-col gap-4">
              {NAV_ITEMS.map((item) => (
                <Link key={item.href} href={item.href} className="rounded-xl px-4 py-3 text-lg font-semibold text-white hover:bg-[rgba(255,255,255,0.03)]" onClick={()=>setOpen(false)}>
                  {item.label}
                </Link>
              ))}
            </div>

              <div className="mt-auto flex flex-col gap-4">
              <Button asChild className="w-full rounded-full bg-gradient-to-r from-[#F97316] to-[#2563EB] text-white btn-magnetic glow-pulse" data-magnetic-btn> 
                <Link href="/services">Book a Service</Link>
              </Button>
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1 rounded-full text-white border-white/10">Log in</Button>
                <Button className="flex-1 rounded-full bg-white text-[rgba(8,16,38,0.95)]">Sign up</Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
