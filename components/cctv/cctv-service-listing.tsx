"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Camera, Clock, ShieldCheck } from "lucide-react";
import { cctvApi, CctvSubcategory } from "@/lib/cctv-api";

export function CctvServiceListing() {
  const [services, setServices] = useState<CctvSubcategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cctvApi.subcategories().then(setServices).finally(() => setLoading(false));
  }, []);

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700"><Camera className="h-4 w-4" /> CCTV Installation</p>
          <h1 className="mt-3 text-3xl font-semibold text-slate-950">Database-managed CCTV services</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">Choose a CCTV service, configure camera type, wire length, add-ons, and get a live price before checkout.</p>
        </div>
        <Link href="/cart" className="rounded-md border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">View Cart</Link>
      </div>

      {loading ? <div className="rounded-lg border border-slate-200 bg-white p-6 text-slate-500">Loading CCTV services...</div> : null}
      {!loading && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <Link key={service._id} href={`/cctv/${service.slug}`} className="group overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition hover:border-emerald-300 hover:shadow-md">
              <div className="relative h-44 bg-slate-100">
                <Image src={service.image || "/placeholder.jpg"} alt={service.name} fill className="object-cover transition group-hover:scale-105" />
              </div>
              <div className="p-4">
                <h2 className="text-lg font-semibold text-slate-950">{service.name}</h2>
                <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">{service.shortDescription}</p>
                <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold text-slate-600">
                  <span className="inline-flex items-center gap-1 rounded-full bg-slate-50 px-2 py-1"><Clock className="h-3 w-3" /> {service.installationTime || "Fast visit"}</span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-emerald-700"><ShieldCheck className="h-3 w-3" /> Warranty</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
