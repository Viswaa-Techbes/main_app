import Link from "next/link";
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
    <footer className="bg-gray-900 text-white">
      {/* CTA Bar */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl md:text-2xl font-extrabold tracking-tight">
              Ready to get started with <span className="text-orange-400">TechBes</span>?
            </h3>
            <p className="text-sm text-gray-400 mt-1">Book your first service today — it takes less than 2 minutes.</p>
          </div>
          <Link href="/services">
            <button className="btn-orange px-7 py-3 rounded-full text-sm inline-flex items-center gap-2 whitespace-nowrap">
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
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-500/30">
                <span className="text-white font-extrabold text-lg">TB</span>
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                Tech<span className="text-orange-400">Bes</span>
              </span>
            </div>
            <p className="mt-4 text-sm text-gray-400 leading-relaxed">
              Professional IT services at your doorstep. Quality guaranteed with transparent pricing.
            </p>

            {/* Contact Info */}
            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-3 text-sm text-gray-400 hover:text-white transition-colors">
                <MapPin className="w-4 h-4 text-blue-400" />
                <span>Bangalore, Karnataka, India</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-400 hover:text-white transition-colors">
                <Phone className="w-4 h-4 text-orange-400" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-400 hover:text-white transition-colors">
                <Mail className="w-4 h-4 text-blue-400" />
                <span>support@techbes.com</span>
              </div>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">Services</h3>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link}>
                  <a href="#" className="text-sm text-gray-400 hover:text-orange-400 transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link}>
                  <a href="#" className="text-sm text-gray-400 hover:text-blue-400 transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">Support</h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link}>
                  <a href="#" className="text-sm text-gray-400 hover:text-blue-400 transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">
            © 2026 TechBes. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-sm text-gray-500 hover:text-orange-400 transition-colors">
              Terms
            </a>
            <a href="#" className="text-sm text-gray-500 hover:text-orange-400 transition-colors">
              Privacy
            </a>
            <a href="#" className="text-sm text-gray-500 hover:text-orange-400 transition-colors">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
