import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";

const footerGroups = {
  Platform: ["Home", "Services", "Dashboard", "Electronic Contracts"],
  Company: ["About", "Partners", "Careers", "Contact"],
  Support: ["Help Center", "Privacy", "Terms", "Service Policy"],
};

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-slate-950 text-slate-200">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-10">
          <div className="relative h-12 w-36">
            <Image src="/logo.png" alt="Techbes" fill className="object-contain object-left" />
          </div>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-400">
            A premium IT services marketplace for on-demand support, enterprise installations, and long-term AMC coverage.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-4">
          {Object.entries(footerGroups).map(([group, links]) => (
            <div key={group}>
              <h3 className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">
                {group}
              </h3>
              <div className="mt-5 flex flex-col gap-3 text-sm text-slate-300">
                {links.map((label) => (
                  <Link key={label} href={label === "Home" ? "/" : "/services"} className="transition hover:text-white">
                    {label}
                  </Link>
                ))}
              </div>
            </div>
          ))}

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">
              Contact
            </h3>
            <div className="mt-5 flex flex-col gap-4 text-sm text-slate-300">
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                <span>Bengaluru, Chennai, Hyderabad, Pune</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 shrink-0 text-emerald-400" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 shrink-0 text-emerald-400" />
                <span>hello@techbes.in</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-slate-800 px-4 py-5 text-center text-sm text-slate-500">
        Copyright 2026 Techbes. Built for faster booking and better field service delivery.
      </div>
    </footer>
  );
}
