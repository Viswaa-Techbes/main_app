"use client";

import { ReactNode, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ProtectedRoute } from "@/features/auth/components/protected-route";
import { PageShell } from "@/components/layout/page-shell";
import { motion } from "framer-motion";
import { LayoutDashboard, Wallet, Bell, MessageSquare, User, MapPin, ListOrdered, FileText, Star, Menu, X } from "lucide-react";
import { useAuth } from "@/features/auth/context/auth-context";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/bookings", label: "My Bookings", icon: ListOrdered },
  { href: "/dashboard/wallet", label: "Wallet & Points", icon: Wallet },
  { href: "/dashboard/support", label: "Support Tickets", icon: MessageSquare },
  { href: "/dashboard/notifications", label: "Notifications", icon: Bell },
  { href: "/dashboard/addresses", label: "Saved Addresses", icon: MapPin },
  { href: "/dashboard/invoices", label: "Invoices", icon: FileText },
  { href: "/dashboard/reviews", label: "My Reviews", icon: Star },
  { href: "/dashboard/profile", label: "Profile Settings", icon: User },
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <ProtectedRoute>
      <PageShell>
        <div className="bg-gray-50 min-h-screen py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row gap-8">
              
              {/* Mobile Menu Toggle */}
              <div className="md:hidden flex justify-between items-center mb-4">
                <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
                <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 bg-white rounded-lg shadow-sm border border-gray-100">
                  {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </div>

              {/* Sidebar Navigation */}
              <motion.aside 
                className={`\${mobileMenuOpen ? 'block' : 'hidden'} md:block w-full md:w-72 shrink-0`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden sticky top-24">
                  {/* User Mini Profile */}
                  <div className="p-6 border-b border-gray-100 bg-gradient-to-br from-blue-50 to-indigo-50/30">
                    <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl font-bold mb-4 shadow-md">
                      {user?.name?.charAt(0) || "U"}
                    </div>
                    <h3 className="font-bold text-gray-900 text-lg">{user?.name || "Customer"}</h3>
                    <p className="text-gray-500 text-sm">{user?.mobileNumber}</p>
                  </div>
                  
                  {/* Navigation Links */}
                  <nav className="p-4 space-y-1">
                    {NAV_ITEMS.map((item) => {
                      const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
                      const Icon = item.icon;
                      
                      return (
                        <Link 
                          key={item.href} 
                          href={item.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className={`group flex items-center gap-3 px-4 py-3 min-h-[48px] rounded-xl border transition-all duration-200 cursor-pointer hover:shadow-md \${
                            isActive 
                              ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold border-transparent shadow-md shadow-blue-200/50" 
                              : "bg-white text-slate-700 font-medium border-slate-200 shadow-sm hover:bg-blue-50 hover:text-blue-600 hover:border-blue-100"
                          }`}
                        >
                          <Icon size={20} className={`shrink-0 transition-colors duration-200 \${isActive ? "text-white" : "text-slate-600 group-hover:text-blue-600"}`} />
                          {item.label}
                        </Link>
                      );
                    })}
                  </nav>
                </div>
              </motion.aside>

              {/* Main Content Area */}
              <main className="flex-1 min-w-0">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  {children}
                </motion.div>
              </main>

            </div>
          </div>
        </div>
      </PageShell>
    </ProtectedRoute>
  );
}
