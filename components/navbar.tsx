"use client";

import { useState } from "react";
import Link from "next/link";
import { MapPin, ChevronDown, User, Menu, X, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 navbar-gradient shadow-lg shadow-blue-900/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/20 group-hover:bg-white/25 transition-colors">
              <span className="text-white font-extrabold text-lg">TB</span>
            </div>
            <span className="text-xl font-bold text-white tracking-tight">
              Tech<span className="text-orange-300">Bes</span>
            </span>
          </Link>

          {/* Location Selector - Desktop */}
          <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 cursor-pointer transition-all border border-white/10">
            <MapPin className="w-4 h-4 text-orange-300" />
            <span className="text-sm text-white/90">Bangalore, India</span>
            <ChevronDown className="w-4 h-4 text-white/50" />
          </div>

          {/* Right Section */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/services">
              <Button variant="ghost" className="text-white/90 hover:text-white hover:bg-white/10 font-medium">
                Services
              </Button>
            </Link>
            <Button variant="ghost" className="text-white/90 hover:text-white hover:bg-white/10 font-medium">
              For Business
            </Button>
            <a href="tel:+919876543210" className="hidden lg:flex items-center gap-1.5 text-sm text-white/80 hover:text-white transition-colors px-3">
              <Phone className="w-3.5 h-3.5" />
              <span>Support</span>
            </a>
            <Link href="/login">
              <button className="flex items-center gap-2 px-6 py-2.5 btn-orange rounded-full text-sm shadow-lg">
                <User className="w-4 h-4" />
                Login
              </button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-white/10 text-white transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/10 animate-slide-in">
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white/10 backdrop-blur-sm mb-4">
              <MapPin className="w-4 h-4 text-orange-300" />
              <span className="text-sm text-white/90">Bangalore, India</span>
              <ChevronDown className="w-4 h-4 text-white/50 ml-auto" />
            </div>
            <div className="flex flex-col gap-1">
              <Link href="/services">
                <Button variant="ghost" className="justify-start w-full text-white/90 hover:text-white hover:bg-white/10">
                  Services
                </Button>
              </Link>
              <Button variant="ghost" className="justify-start text-white/90 hover:text-white hover:bg-white/10">
                For Business
              </Button>
              <Link href="/login" className="mt-2">
                <button className="flex items-center justify-center gap-2 w-full px-5 py-3 btn-orange rounded-full text-sm">
                  <User className="w-4 h-4" />
                  Login
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
