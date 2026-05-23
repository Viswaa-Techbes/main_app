import Image from "next/image";
import Link from "@/components/ui/link";
import { Mail, MapPin, Phone } from "lucide-react";

const footerGroups = {
  Platform: ["Home", "Services", "Dashboard", "AMC Plans"],
  Company: ["About", "Partners", "Careers", "Contact"],
  Support: ["Help Center", "Privacy", "Terms", "Service Policy"],
};

export function SiteFooter() {
  return (
    <footer className="ds-card bg-gradient-to-tr from-[#07112a] via-[#071833] to-[#0b1230] text-slate-100">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-start justify-between gap-8">
          <div>
            <div className="relative h-10 w-40">
              <Image src="/logo.png" alt="Techbes" fill className="object-contain object-left" />
            </div>
            <p className="mt-4 max-w-2xl ds-body text-slate-300">
              A premium AI-powered field service marketplace — predictable SLAs, verified technicians, and enterprise-ready workflows.
            </p>
            <div className="mt-6 flex gap-3">
              <a href="#" className="rounded-full bg-blue-600 text-white px-3 py-1 text-xs font-semibold">Trusted</a>
              <a href="#" className="rounded-full bg-orange-500 text-white px-3 py-1 text-xs font-semibold">Enterprise</a>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {Object.entries(footerGroups).map(([group, links]) => (
              <div key={group}>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300">{group}</h3>
                <div className="mt-4 flex flex-col gap-3 text-sm text-slate-200">
                  {links.map((label) => {
                    const hrefMap: Record<string, string> = {
                      Home: "/",
                      Services: "/services",
                      Dashboard: "/dashboard",
                      "AMC Plans": "/services?category=amc",
                      Careers: "/careers",
                      Login: "/login",
                      "Sign Up": "/signup",
                    };
                    return (
                      <Link key={label} href={hrefMap[label] || "/services"} className="transition-colors hover:text-white">
                        <span>{label}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-white/4 px-4 py-5 text-center text-sm text-slate-400">
        © {new Date().getFullYear()} Techbes — Built for enterprise-grade field ops.
      </div>
    </footer>
  );
}
