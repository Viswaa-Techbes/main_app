"use client";

import { useState } from "react";
import Link from "@/components/ui/link";
import { MapPin, ChevronDown, User, Menu, X, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 navbar-gradient shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2.5 group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center border border-transparent group-hover:shadow-md transition-colors"
                style={{ background: 'var(--color-primary)' }}>
                <span className="text-white font-extrabold text-lg">TB</span>
              </div>
              <span className="text-xl font-bold text-foreground tracking-tight">
                Tech<span className="text-gradient-primary">Bes</span>
              </span>
            </motion.div>
          </Link>

          {/* Location Selector - Desktop */}
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 cursor-pointer transition-all border border-border shadow-sm"
          >
            <MapPin className="w-4 h-4 text-primary" />
            <span className="text-sm text-foreground">Bangalore, India</span>
            <ChevronDown className="w-4 h-4 text-foreground-muted" />
          </motion.div>

          {/* Right Section */}
          <div className="hidden md:flex items-center gap-2">
            <Link href="/services">
              <Button variant="ghost" className="text-foreground hover:text-foreground-muted font-medium px-4">
                Services
              </Button>
            </Link>
            <Link href="/careers">
              <Button variant="ghost" className="text-foreground hover:text-foreground-muted font-medium px-4">
                Careers
              </Button>
            </Link>
            <Button variant="ghost" className="text-foreground hover:text-foreground-muted font-medium px-4">
              For Business
            </Button>
            <a href="tel:+919876543210" className="hidden lg:flex items-center gap-1.5 text-sm text-foreground-muted hover:text-foreground transition-colors px-3 mr-2">
              <Phone className="w-3.5 h-3.5" />
              <span>Support</span>
            </a>
            <Link href="/login">
              <motion.button 
                whileHover={{ scale: 1.05, boxShadow: "0 10px 15px -3px rgba(249, 115, 22, 0.4)" }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-6 py-2.5 btn-primary rounded-full text-sm font-bold"
              >
                <User className="w-4 h-4" />
                Login
              </motion.button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
            <motion.button
            whileTap={{ scale: 0.9 }}
            className="md:hidden p-2 rounded-lg hover:bg-white/10 text-foreground transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden overflow-hidden py-4 border-t border-border"
            >
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white/60 mb-4 border border-border">
                <MapPin className="w-4 h-4 text-primary" />
                <span className="text-sm text-foreground">Bangalore, India</span>
                <ChevronDown className="w-4 h-4 text-foreground-muted ml-auto" />
              </div>
              <div className="flex flex-col gap-1">
                <Link href="/services">
                  <Button variant="ghost" className="justify-start w-full text-foreground hover:bg-surface">
                    Services
                  </Button>
                </Link>
                <Link href="/careers">
                  <Button variant="ghost" className="justify-start w-full text-foreground hover:bg-surface">
                    Careers
                  </Button>
                </Link>
                <Button variant="ghost" className="justify-start text-foreground hover:bg-surface">
                  For Business
                </Button>
                <Link href="/login" className="mt-2">
                  <motion.button 
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center justify-center gap-2 w-full px-5 py-3 btn-primary rounded-full text-sm font-bold"
                  >
                    <User className="w-4 h-4" />
                    Login
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
