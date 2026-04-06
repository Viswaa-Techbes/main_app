"use client";

import { useState } from "react";
import Link from "next/link";
import { MapPin, ChevronDown, User, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-card border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">TS</span>
            </div>
            <span className="text-xl font-bold text-foreground">
              Techbes<span className="text-primary">Pro</span>
            </span>
          </div>

          {/* Location Selector - Desktop */}
          <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-secondary hover:bg-secondary/80 cursor-pointer transition-colors">
            <MapPin className="w-4 h-4 text-primary" />
            <span className="text-sm text-foreground">Bangalore, India</span>
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          </div>

          {/* Right Section */}
          <div className="hidden md:flex items-center gap-4">
            <Link href="/services">
              <Button variant="ghost" className="text-foreground">
                Services
              </Button>
            </Link>
            <Button variant="ghost" className="text-foreground">
              For Business
            </Button>
            <Button variant="outline" className="gap-2">
              <User className="w-4 h-4" />
              Login
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-secondary"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-secondary mb-4">
              <MapPin className="w-4 h-4 text-primary" />
              <span className="text-sm text-foreground">Bangalore, India</span>
              <ChevronDown className="w-4 h-4 text-muted-foreground ml-auto" />
            </div>
            <div className="flex flex-col gap-2">
              <Link href="/services">
                <Button variant="ghost" className="justify-start w-full">
                  Services
                </Button>
              </Link>
              <Button variant="ghost" className="justify-start">
                For Business
              </Button>
              <Button variant="outline" className="gap-2 justify-center mt-2">
                <User className="w-4 h-4" />
                Login
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
