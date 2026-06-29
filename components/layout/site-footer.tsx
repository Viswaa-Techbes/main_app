import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, Phone, Github, Twitter, Linkedin, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950 text-slate-200">
      
      {/* Newsletter Banner */}
      <div className="mx-auto max-w-7xl px-4 pt-16 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-gradient-to-r from-blue-950/40 via-slate-900/60 to-blue-950/40 p-6 md:p-10 border border-slate-800/40 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">Stay updated on IT security & audits</h3>
            <p className="mt-1 text-xs text-slate-400 font-semibold max-w-md">Subscribe to our newsletter for exclusive AMC coupons and proactive IT guides.</p>
          </div>
          <div className="flex w-full max-w-sm items-center gap-2">
            <Input 
              type="email" 
              placeholder="Enter your email address" 
              className="h-10 rounded-xl bg-slate-900 border-slate-800 text-xs text-slate-200 focus:ring-blue-500/20"
            />
            <Button className="h-10 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 shadow-sm flex items-center gap-1.5 shrink-0">
              Subscribe
              <Send className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        {/* Footer grid */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 pb-12 border-b border-slate-900">
          
          {/* Logo & description (spans 2 cols) */}
          <div className="col-span-2 flex flex-col gap-4">
            <div className="relative h-10 w-36 shrink-0">
              <Image src="/logo.png" alt="Techbes" fill className="object-contain object-left brightness-0 invert" />
            </div>
            <p className="text-xs leading-relaxed text-slate-400 max-w-xs font-semibold">
              The premier IT services marketplace connecting certified tech specialists with residential and enterprise projects. Transparent SLA billing and 100% verified fulfillment.
            </p>
            <div className="flex items-center gap-3 text-slate-500 mt-2">
              <Link href="#" className="hover:text-blue-500 transition-colors"><Twitter className="h-4.5 w-4.5" /></Link>
              <Link href="#" className="hover:text-blue-500 transition-colors"><Linkedin className="h-4.5 w-4.5" /></Link>
              <Link href="#" className="hover:text-blue-500 transition-colors"><Github className="h-4.5 w-4.5" /></Link>
            </div>
          </div>

          {/* Services Group */}
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Services</h4>
            <ul className="mt-4.5 space-y-3 text-xs text-slate-400 font-semibold">
              <li><Link href="/services" className="hover:text-white transition-colors">CCTV Installation</Link></li>
              <li><Link href="/services" className="hover:text-white transition-colors">Structured Cabling</Link></li>
              <li><Link href="/services" className="hover:text-white transition-colors">Network Setup</Link></li>
              <li><Link href="/services" className="hover:text-white transition-colors">Server Maintenance</Link></li>
            </ul>
          </div>

          {/* Solutions Group */}
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Solutions</h4>
            <ul className="mt-4.5 space-y-3 text-xs text-slate-400 font-semibold">
              <li><Link href="/services" className="hover:text-white transition-colors">Annual Contracts</Link></li>
              <li><Link href="/services" className="hover:text-white transition-colors">Managed Security</Link></li>
              <li><Link href="/services" className="hover:text-white transition-colors">Cloud Migration</Link></li>
              <li><Link href="/services" className="hover:text-white transition-colors">Disaster Recovery</Link></li>
            </ul>
          </div>

          {/* Support Group */}
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Support</h4>
            <ul className="mt-4.5 space-y-3 text-xs text-slate-400 font-semibold">
              <li><Link href="/services" className="hover:text-white transition-colors">Help Center</Link></li>
              <li><Link href="/services" className="hover:text-white transition-colors">Refund Policy</Link></li>
              <li><Link href="/services" className="hover:text-white transition-colors">Technician Portal</Link></li>
              <li><Link href="/services" className="hover:text-white transition-colors">Contact Support</Link></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="col-span-2 lg:col-span-1">
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Contact</h4>
            <div className="mt-4.5 space-y-3.5 text-xs text-slate-400 font-semibold">
              <p className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
                <span>Nagarbhavi, Bangalore, KA, India</span>
              </p>
              <p className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-blue-500 shrink-0" />
                <a href="tel:+919164487296" className="hover:text-white transition-colors">+91 91644 87296</a>
              </p>
              <p className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-blue-500 shrink-0" />
                <a href="mailto:lohith@techbes.co.in" className="hover:text-white transition-colors">lohith@techbes.co.in</a>
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* Copyright Footer */}
      <div className="bg-slate-950/80 py-6 text-xs text-slate-500 font-semibold">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 Techbes India. All rights reserved. Razorpay Secured Gateway.</p>
          <div className="flex gap-4 text-[10px] uppercase tracking-wider">
            <Link href="/services" className="hover:text-slate-400">Privacy Policy</Link>
            <Link href="/services" className="hover:text-slate-400">Terms of Use</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
