import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, Phone, Github, Twitter, Linkedin, ShieldCheck } from "lucide-react";

const footerGroups = {
  Services: ["CCTV Installation", "Structured Cabling", "Laptop Repairs", "Server Maintenance"],
  Platform: ["Home", "Services", "Dashboard", "Electronic Contracts"],
  Support: ["Help Center", "Privacy Policy", "Terms of Service", "Refund Policy"],
};

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 text-slate-200">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-4 md:grid-cols-2">
          {/* Logo / Brand Info */}
          <div className="flex flex-col gap-4">
            <div className="relative h-9 w-32 shrink-0">
              <Image src="/logo.png" alt="Techbes" fill className="object-contain object-left brightness-0 invert" />
            </div>
            <p className="text-xs leading-6 text-slate-400 max-w-sm">
              The premier IT services marketplace connecting certified technicians with residential and commercial projects. Instant booking, transparent pricing, and 100% verified fulfillment.
            </p>
            <div className="flex items-center gap-3 text-slate-400 mt-2">
              <Link href="#" className="hover:text-blue-500 transition"><Twitter className="h-4 w-4" /></Link>
              <Link href="#" className="hover:text-blue-500 transition"><Linkedin className="h-4 w-4" /></Link>
              <Link href="#" className="hover:text-blue-500 transition"><Github className="h-4 w-4" /></Link>
            </div>
          </div>

          {/* Columns */}
          {Object.entries(footerGroups).map(([group, links]) => (
            <div key={group}>
              <h3 className="text-xs font-bold uppercase tracking-[0.24em] text-slate-500">
                {group}
              </h3>
              <ul className="mt-5 flex flex-col gap-3 text-xs text-slate-400">
                {links.map((label) => (
                  <li key={label}>
                    <Link href="/services" className="transition hover:text-white hover:translate-x-0.5 inline-block duration-150">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact Details */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.24em] text-slate-500">
              Contact Us
            </h3>
            <div className="mt-5 flex flex-col gap-4 text-xs text-slate-400">
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" />
                <span>Bengaluru, Chennai, Hyderabad, Pune, Mumbai</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 shrink-0 text-blue-500" />
                <a href="tel:+919876543210" className="hover:text-white transition">+91 98765 43210</a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 shrink-0 text-blue-500" />
                <a href="mailto:hello@techbes.in" className="hover:text-white transition">hello@techbes.in</a>
              </div>
              <div className="flex items-center gap-2 rounded-2xl bg-white/5 p-3 mt-1 border border-white/5">
                <ShieldCheck className="h-4.5 w-4.5 text-blue-500" />
                <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Secured by Razorpay</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-slate-900 bg-slate-950/50 py-6 text-center text-xs text-slate-600">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 Techbes. All rights reserved. Built for faster booking and professional IT delivery.</p>
          <div className="flex gap-4 text-[10px] uppercase tracking-wider font-semibold text-slate-600">
            <Link href="/services" className="hover:text-slate-400">Privacy Policy</Link>
            <Link href="/services" className="hover:text-slate-400">Terms of Use</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
