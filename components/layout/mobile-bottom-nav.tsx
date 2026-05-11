"use client";

import Link from "next/link";
import { Home, Grid, Clock, User } from "lucide-react";

export default function MobileBottomNav() {
  return (
    <nav className="fixed bottom-4 left-1/2 z-50 w-[92%] -translate-x-1/2 rounded-3xl bg-white/4 border border-white/6 backdrop-blur-lg p-2 shadow-lg lg:hidden">
      <div className="flex items-center justify-between px-2">
        <Link href="/" className="flex flex-col items-center text-white/90 text-xs gap-1 py-2 px-3 rounded-2xl hover:bg-white/6">
          <Home className="h-5 w-5" />
          Home
        </Link>
        <Link href="/services" className="flex flex-col items-center text-white/90 text-xs gap-1 py-2 px-3 rounded-2xl hover:bg-white/6">
          <Grid className="h-5 w-5" />
          Services
        </Link>
        <Link href="/dashboard" className="flex flex-col items-center text-white/90 text-xs gap-1 py-2 px-3 rounded-2xl hover:bg-white/6">
          <Clock className="h-5 w-5" />
          Dashboard
        </Link>
        <Link href="/profile" className="flex flex-col items-center text-white/90 text-xs gap-1 py-2 px-3 rounded-2xl hover:bg-white/6">
          <User className="h-5 w-5" />
          Account
        </Link>
      </div>
    </nav>
  );
}
