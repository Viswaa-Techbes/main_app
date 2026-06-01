"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, CheckCircle, XCircle } from "lucide-react";
import { CctvSubcategory } from "@/lib/cctv-api";
import { CctvPriceCalculator } from "@/components/cctv/cctv-price-calculator";

export function CctvServiceDetail({ service }: { service: CctvSubcategory }) {
  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Link href="/cctv" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-950"><ChevronLeft className="h-4 w-4" /> Back to CCTV services</Link>
      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr,380px]">
        <div className="space-y-6">
          <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
            <div className="relative h-72 bg-slate-100">
              <Image src={service.image || "/placeholder.jpg"} alt={service.name} fill className="object-cover" priority />
            </div>
            <div className="p-6">
              <p className="text-sm font-semibold text-emerald-700">CCTV Installation</p>
              <h1 className="mt-2 text-3xl font-semibold text-slate-950">{service.name}</h1>
              <p className="mt-3 text-sm leading-6 text-slate-600">{service.overview}</p>
            </div>
          </div>

          <Info title="What's Included" items={service.includedServices} icon="check" />
          <Info title="What's Excluded" items={service.excludedServices} icon="x" />
          <Info title="Camera Types" items={service.cameraTypes} icon="check" />
          <Info title="Cable Types" items={service.cableTypes} icon="check" />
          <Info title="Installation Process" items={service.installationProcess} icon="check" ordered />
          <section className="rounded-lg border border-slate-200 bg-white p-5">
            <h2 className="text-xl font-semibold text-slate-950">Warranty</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">{service.warranty}</p>
          </section>
          <section className="rounded-lg border border-slate-200 bg-white p-5">
            <h2 className="text-xl font-semibold text-slate-950">FAQ</h2>
            <div className="mt-3 divide-y divide-slate-100">
              {service.faqs.map((faq) => (
                <div key={faq.question} className="py-3">
                  <p className="font-semibold text-slate-900">{faq.question}</p>
                  <p className="mt-1 text-sm text-slate-600">{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
        <div className="lg:sticky lg:top-24 lg:self-start">
          <CctvPriceCalculator service={service} />
        </div>
      </div>
    </main>
  );
}

function Info({ title, items, icon, ordered }: { title: string; items: string[]; icon: "check" | "x"; ordered?: boolean }) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5">
      <h2 className="text-xl font-semibold text-slate-950">{title}</h2>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {items.map((item, index) => (
          <div key={item} className="flex gap-2 rounded-md bg-slate-50 p-3 text-sm text-slate-700">
            {icon === "check" ? <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" /> : <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-500" />}
            <span>{ordered ? `${index + 1}. ${item}` : item}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
