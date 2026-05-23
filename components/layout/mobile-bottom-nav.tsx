"use client";

import Link from "next/link";
import { Home, Grid, Clock, User } from "lucide-react";

export default function MobileBottomNav() {
  return (
    <nav aria-label="Primary mobile navigation" className="fixed bottom-4 left-1/2 z-50 w-[94%] -translate-x-1/2 rounded-3xl bg-white/6 border border-white/6 backdrop-blur-xl p-2 shadow-lg lg:hidden">
      <div className="flex items-center justify-between px-2">
        <Link href="/" className="flex flex-col items-center text-white/95 text-xs gap-1 py-3 px-4 rounded-2xl hover:bg-white/8 touch-manipulation">
          <span className="inline-flex flex-col items-center"><Home className="h-6 w-6" /><span className="text-[11px]">Home</span></span>
        </Link>
        <Link href="/services" className="flex flex-col items-center text-white/95 text-xs gap-1 py-3 px-4 rounded-2xl hover:bg-white/8 touch-manipulation">
          <span className="inline-flex flex-col items-center"><Grid className="h-6 w-6" /><span className="text-[11px]">Services</span></span>
        </Link>
        <Link href="/dashboard" className="flex flex-col items-center text-white/95 text-xs gap-1 py-3 px-4 rounded-2xl hover:bg-white/8 touch-manipulation">
          <span className="inline-flex flex-col items-center"><Clock className="h-6 w-6" /><span className="text-[11px]">Bookings</span></span>
        </Link>
        <Link href="/profile" className="flex flex-col items-center text-white/95 text-xs gap-1 py-3 px-4 rounded-2xl hover:bg-white/8 touch-manipulation">
          <span className="inline-flex flex-col items-center"><User className="h-6 w-6" /><span className="text-[11px]">Account</span></span>
        </Link>
      </div>
    </nav>
  );
}
