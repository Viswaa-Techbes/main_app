"use client";

import { useState } from "react";
import Link from "next/link";
import { MapPin, ChevronDown, User, Menu, X, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 navbar-gradient shadow-lg shadow-blue-900/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2.5 group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/20 group-hover:bg-white/25 transition-colors shadow-inner">
                <span className="text-white font-extrabold text-lg">TB</span>
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                Tech<span className="text-orange-300">Bes</span>
              </span>
            </motion.div>
          </Link>

          {/* Location Selector - Desktop */}
          <motion.div 
            whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.15)" }}
            className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm cursor-pointer transition-all border border-white/10 shadow-sm"
          >
            <MapPin className="w-4 h-4 text-orange-300" />
            <span className="text-sm text-white/90">Bangalore, India</span>
            <ChevronDown className="w-4 h-4 text-white/50" />
          </motion.div>

          {/* Right Section */}
          <div className="hidden md:flex items-center gap-2">
            <Link href="/services">
              <Button variant="ghost" className="text-white/90 hover:text-white hover:bg-white/10 font-medium px-4">
                Services
              </Button>
            </Link>
            <Link href="/careers">
              <Button variant="ghost" className="text-white/90 hover:text-white hover:bg-white/10 font-medium px-4">
                Careers
              </Button>
            </Link>
            <Button variant="ghost" className="text-white/90 hover:text-white hover:bg-white/10 font-medium px-4">
              For Business
            </Button>
            <a href="tel:+919876543210" className="hidden lg:flex items-center gap-1.5 text-sm text-white/80 hover:text-white transition-colors px-3 mr-2">
              <Phone className="w-3.5 h-3.5" />
              <span>Support</span>
            </a>
            <Link href="/login">
              <motion.button 
                whileHover={{ scale: 1.05, boxShadow: "0 10px 15px -3px rgba(249, 115, 22, 0.4)" }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-6 py-2.5 btn-orange rounded-full text-sm font-bold shadow-lg"
              >
                <User className="w-4 h-4" />
                Login
              </motion.button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="md:hidden p-2 rounded-lg hover:bg-white/10 text-white transition-colors"
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
              className="md:hidden overflow-hidden py-4 border-t border-white/10"
            >
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
                <Link href="/careers">
                  <Button variant="ghost" className="justify-start w-full text-white/90 hover:text-white hover:bg-white/10">
                    Careers
                  </Button>
                </Link>
                <Button variant="ghost" className="justify-start text-white/90 hover:text-white hover:bg-white/10">
                  For Business
                </Button>
                <Link href="/login" className="mt-2">
                  <motion.button 
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center justify-center gap-2 w-full px-5 py-3 btn-orange rounded-full text-sm font-bold"
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
