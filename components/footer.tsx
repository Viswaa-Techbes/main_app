import Link from "@/components/ui/link";
import { MapPin, Phone, Mail, ArrowRight } from "lucide-react";

const footerLinks = {
  services: [
    "CCTV Installation",
    "Network Setup",
    "Cyber Security",
    "Data Center",
    "AMC Services",
    "Fire Safety",
  ],
  company: [
    "About Us",
    "Careers",
    "Blog",
    "Press",
    "Partners",
    "Contact",
  ],
  support: [
    "Help Center",
    "Safety Center",
    "Community Guidelines",
    "Terms of Service",
    "Privacy Policy",
    "Cookie Policy",
  ],
};

export function Footer() {
  return (
    <footer className="bg-surface text-foreground">
      {/* CTA Bar */}
      <div className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl md:text-2xl font-extrabold tracking-tight">
              Ready to get started with <span className="text-gradient-primary">TechBes</span>?
            </h3>
            <p className="text-sm text-foreground-muted mt-1">Book your first service today — it takes less than 2 minutes.</p>
          </div>
          <Link href="/services">
            <button className="btn-primary px-7 py-3 rounded-full text-sm inline-flex items-center gap-2 whitespace-nowrap">
              Book a Service <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-md"
                style={{ background: 'var(--gradient-accent)' }}>
                <span className="text-white font-extrabold text-lg">TB</span>
              </div>
              <span className="text-xl font-bold text-foreground tracking-tight">
                Tech<span className="text-gradient-primary">Bes</span>
              </span>
            </div>
            <p className="mt-4 text-sm text-foreground-muted leading-relaxed">
              Professional IT services at your doorstep. Quality guaranteed with transparent pricing.
            </p>

            {/* Contact Info */}
            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-3 text-sm text-foreground-muted hover:text-foreground transition-colors">
                <MapPin className="w-4 h-4 text-primary" />
                <span>Bangalore, Karnataka, India</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-foreground-muted hover:text-foreground transition-colors">
                <Phone className="w-4 h-4 text-primary" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-foreground-muted hover:text-foreground transition-colors">
                <Mail className="w-4 h-4 text-primary" />
                <span>support@techbes.com</span>
              </div>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-bold text-foreground mb-4 text-sm uppercase tracking-wider">Services</h3>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link}>
                  <a href="#" className="text-sm text-foreground-muted hover:text-gradient-primary transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-bold text-foreground mb-4 text-sm uppercase tracking-wider">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link}>
                  <a href="#" className="text-sm text-foreground-muted hover:text-secondary transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-bold text-foreground mb-4 text-sm uppercase tracking-wider">Support</h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link}>
                  <a href="#" className="text-sm text-foreground-muted hover:text-secondary transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-foreground-muted">
            © 2026 TechBes. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-sm text-foreground-muted hover:text-gradient-primary transition-colors">
              Terms
            </a>
            <a href="#" className="text-sm text-foreground-muted hover:text-gradient-primary transition-colors">
              Privacy
            </a>
            <a href="#" className="text-sm text-foreground-muted hover:text-gradient-primary transition-colors">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
