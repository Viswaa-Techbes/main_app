import Link from "@/components/ui/link";
import { ArrowRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { categories } from "@/lib/marketplace-data";

export function CategoryGrid() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Badge variant="secondary" className="rounded-full px-4 py-1.5">
            Popular categories
          </Badge>
          <h2 className="mt-4 text-3xl font-semibold text-slate-950">Service categories built for real operational needs</h2>
          <p className="mt-3 max-w-2xl text-slate-600">
            Find high-demand IT service lines with clear outcomes, booking-ready pricing, and technician-backed fulfillment.
          </p>
        </div>
        <Link href="/services" className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 transition hover:text-emerald-800">
          <span className="inline-flex items-center">View all services <ArrowRight className="h-4 w-4" /></span>
        </Link>
      </div>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {categories.map((category, index) => (
          <Link
            key={category.id}
            href={`/services?category=${category.id}`}
            className="group relative"
            style={{ textDecoration: 'none' }}
          >
            <div className="relative overflow-hidden rounded-[var(--radius-lg)] border border-border bg-card p-6 transition duration-300 hover:-translate-y-1" style={{ boxShadow: 'var(--shadow-soft)' }}>
              <div className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${category.gradient}`} />
              <div className={`inline-flex rounded-3xl bg-gradient-to-br ${category.gradient} p-3 text-white`}>
                <category.icon className="h-6 w-6" />
              </div>
              <div className="mt-6 flex items-center justify-between gap-4">
                <h3 className="text-xl font-semibold text-slate-950">{category.title}</h3>
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-500">
                  0{index + 1}
                </span>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-600">{category.description}</p>
              <div className="mt-5 flex items-center justify-between">
                <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                  {category.servicesLabel}
                </span>
                <span className="inline-flex items-center gap-1 text-sm font-semibold text-slate-400 transition group-hover:text-emerald-700">
                  Explore
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
