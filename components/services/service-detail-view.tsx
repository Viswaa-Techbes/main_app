"use client";

import Image from "next/image";
import Link from "next/link";
import { Calendar, Check, CheckCircle, ChevronLeft, Clock3, FileText, MapPin, Star, TicketPercent, Toolbox, Users, ArrowRight, ShieldCheck } from "lucide-react";
import type { ReactNode } from "react";
import { FormEvent, useState, useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ServiceBookingConfigModal } from "@/components/booking/service-config-modal";
import { cctvApi } from "@/lib/cctv-api";
import { getRecommendedServices, MarketplaceService } from "@/lib/marketplace-data";
import { useAuth } from "@/features/auth/context/auth-context";
import { useToast } from "@/hooks/use-toast";

export function ServiceDetailView({ service }: { service: MarketplaceService }) {
  const [reviews] = useState(service.reviews);
  const [configOpen, setConfigOpen] = useState(false);
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [quoteSaving, setQuoteSaving] = useState(false);
  const [quoteForm, setQuoteForm] = useState({ name: "", phone: "", email: "", location: "", message: "" });
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const pathname = usePathname();
  const isCctvCategory = service.categoryId === "cctv" || service.category === "CCTV" || service.slug?.includes("cctv") || pathname.includes("cctv");
  const searchParams = useSearchParams();
  const recommended = getRecommendedServices(service.id);

  const initialImage = (service.gallery && service.gallery.length > 0 ? service.gallery[0] : service.image) || "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=80";
  const [imgSrc, setImgSrc] = useState(initialImage);

  useEffect(() => {
    const nextImg = (service.gallery && service.gallery.length > 0 ? service.gallery[0] : service.image) || "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=80";
    setImgSrc(nextImg);
  }, [service.image, service.gallery]);

  const cctvService = service.managedService || {
        _id: service.slug,
        slug: service.slug,
        name: service.title,
        categoryId: service.categoryId || "general",
        shortDescription: service.tagline,
        overview: service.description,
        suitableFor: service.recommendedFor,
        includedServices: service.includes,
        excludedServices: [],
        cameraTypes: [],
        cableTypes: [],
        installationProcess: service.steps,
        installationTime: service.duration,
        warranty: "30-day workmanship warranty. Product warranty depends on device brand and invoice.",
        faqs: service.faqs,
        pricingStartsFrom: service.priceValue,
        image: service.image,
        supportedAddons: (service as any).supportedAddons || [],
        supportedProducts: (service as any).supportedProducts || [],
        supportedSpareParts: (service as any).supportedSpareParts || [],
      };

  function openBooking() {
    if (!isAuthenticated) {
      window.localStorage.setItem("techbes_pending_service", String(service.id));
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }
    setConfigOpen(true);
  }

  async function submitQuote(event: FormEvent) {
    event.preventDefault();
    try {
      setQuoteSaving(true);
      await cctvApi.createLead({
        name: quoteForm.name,
        phone: quoteForm.phone,
        email: quoteForm.email,
        pincode: quoteForm.location,
        service: service.title,
        plan: quoteForm.message || "Quote request",
        status: "Quote Requested",
      });
      toast({ title: "Quote request sent", description: "Our team will contact you shortly." });
      setQuoteOpen(false);
      setQuoteForm({ name: "", phone: "", email: "", location: "", message: "" });
    } catch (err: any) {
      toast({ title: "Unable to submit quote", description: err.message || "Please try again." });
    } finally {
      setQuoteSaving(false);
    }
  }

  return (
    <>
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 bg-slate-50/30">
        <Link href={`/services${searchParams?.get("category") ? `?category=${searchParams.get("category")}` : ""}`} className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-blue-600 transition">
          <ChevronLeft className="h-4 w-4" />
          Back to Services
        </Link>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr,360px]">
          <div className="space-y-6">
            
            {/* Service Banner and Info Card */}
            <div className="grid gap-6 rounded-3xl border border-slate-100 bg-white p-5 shadow-sm md:grid-cols-2 md:items-center">
              <div className="relative h-60 overflow-hidden rounded-2xl bg-slate-50 border border-slate-100 shadow-sm sm:h-72">
                <Image
                  src={imgSrc}
                  alt={service.title}
                  title={service.title}
                  fill
                  className="object-cover"
                  onError={() => setImgSrc("https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=80")}
                  priority
                />
              </div>
              <div className="flex flex-col h-full justify-between py-2">
                <div>
                  <Badge className="rounded-full bg-blue-50 px-3 py-1 text-[9px] font-bold uppercase tracking-wider text-blue-600 border-none shadow-none">{service.category}</Badge>
                  <h1 className="mt-4 text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">{service.title}</h1>
                  <p className="mt-2 text-xs leading-relaxed text-slate-500">{service.tagline || service.description}</p>
                </div>
                
                <div className="mt-5">
                  <div className="flex flex-wrap items-center gap-2">
                    <Pill icon={<Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />} text={`${service.rating} (${service.reviewCount} reviews)`} />
                    <Pill icon={<Clock3 className="h-3.5 w-3.5 text-blue-600" />} text={service.duration} />
                    <Pill icon={<ShieldCheck className="h-3.5 w-3.5 text-blue-600" />} text="Verified Expert" />
                  </div>

                  <div className="mt-6 border-t border-slate-50 pt-4">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">How much does it cost?</p>
                    <p className="text-2xl font-black text-slate-800">{service.price}</p>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-2">
                    <Button className="h-10 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-6 shadow-sm" onClick={openBooking}>Book Now</Button>
                    {cctvService && <Button variant="outline" className="h-10 rounded-xl border-slate-200 text-xs font-bold px-4" onClick={() => setConfigOpen(true)}>Add To Cart</Button>}
                    <Button variant="outline" className="h-10 rounded-xl border-slate-200 text-xs font-bold px-4" asChild>
                      <Link href={`/get-a-quote?service=${service.slug}`}>Request Quote</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Overview Section */}
            <Section title={`What is ${service.title} and how does it work?`}>
              {/* Conversational content intro */}
              <p className="text-xs leading-relaxed text-slate-600 font-semibold mb-6">
                Looking for reliable, expert {service.title} in Bangalore? At TechBes, we map experienced local technicians directly to your residential or business site. Here is everything you need to know about setting up, pricing, and scheduling your service.
              </p>

              {/* AI Answer Direct Cards */}
              {(service as any).aeoData?.aiAnswers?.map((block: any, idx: number) => (
                <div key={idx} className="mb-6 rounded-2xl border border-blue-100 bg-blue-50/20 p-5 space-y-2 text-left">
                  <span className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-[9px] font-bold uppercase tracking-wider text-blue-700">
                    ★ AI Overview & Direct Answer
                  </span>
                  <h3 className="text-xs font-bold text-slate-850 uppercase tracking-wider">{block.question}</h3>
                  <p className="text-xs leading-relaxed text-slate-600 font-semibold">{block.answer}</p>
                </div>
              ))}

              <p className="text-xs leading-relaxed text-slate-500">{service.description}</p>
              <div className="mt-6">
                <FeatureGrid features={[...service.features, ...service.includes]} />
              </div>
            </Section>

            {/* AEO Comparison Tables */}
            {(service as any).aeoData?.comparisons && (service as any).aeoData.comparisons.length > 0 && (
              <Section title="Compare Technology Options & Specifications">
                <div className="space-y-6">
                  {(service as any).aeoData.comparisons.map((comp: any, idx: number) => (
                    <div key={idx} className="space-y-3">
                      <h3 className="text-xs font-bold text-slate-850 uppercase tracking-wider">{comp.title}</h3>
                      <div className="overflow-x-auto rounded-2xl border border-slate-100 bg-white">
                        <table className="min-w-full divide-y divide-slate-100 text-xs text-slate-600">
                          <thead className="bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                            <tr>
                              {comp.headers.map((h: string) => (
                                <th key={h} className="px-4 py-3 text-left">{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 font-medium">
                            {comp.rows.map((row: string[], rIdx: number) => (
                              <tr key={rIdx} className="hover:bg-slate-50/50 transition">
                                {row.map((cell: string, cIdx: number) => (
                                  <td key={cIdx} className="px-4 py-3 whitespace-nowrap">{cell}</td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* AEO How-To Step Guides */}
            {(service as any).aeoData?.howTo && (
              <Section title={(service as any).aeoData.howTo.title}>
                <p className="mb-6 text-xs leading-relaxed text-slate-500">
                  {(service as any).aeoData.howTo.description}
                </p>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 text-left">
                  {(service as any).aeoData.howTo.steps.map((step: any, sIdx: number) => (
                    <div key={sIdx} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm space-y-2">
                      <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                        {step.name}
                      </h4>
                      <p className="text-xs leading-relaxed text-slate-500 font-medium">
                        {step.text}
                      </p>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* Addons Section */}
            {((service as any).supportedProducts || (service as any).supportedAddons || (service as any).supportedSpareParts) && (
              <Section title="Available Addons & Products">
                <div className="grid gap-3 sm:grid-cols-3">
                  {(service as any).supportedProducts?.map((p: string) => (
                    <div key={p} className="rounded-xl border border-slate-100 bg-slate-50/50 p-3.5 text-xs font-semibold text-slate-800">
                      {p}
                    </div>
                  ))}
                  {(service as any).supportedAddons?.map((a: string) => (
                    <div key={a} className="rounded-xl border border-slate-100 bg-slate-50/50 p-3.5 text-xs font-semibold text-slate-800">
                      {a}
                    </div>
                  ))}
                  {(service as any).supportedSpareParts?.map((s: string) => (
                    <div key={s} className="rounded-xl border border-slate-100 bg-slate-50/50 p-3.5 text-xs font-semibold text-slate-800">
                      {s}
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* How it works */}
            <Section title={`How does our ${service.title} booking process work?`}>
              <HorizontalStepper steps={service.steps} />
            </Section>

            {/* FAQ Accordion */}
            <Section title={`Common Questions About ${service.title} in Bangalore`}>
              <Accordion type="single" collapsible className="w-full">
                {service.faqs.map((faq, index) => (
                  <AccordionItem key={faq.question} value={`faq-${index}`} className="border-slate-100">
                    <AccordionTrigger className="text-xs font-bold text-slate-850 hover:no-underline text-left">{faq.question}</AccordionTrigger>
                    <AccordionContent className="text-xs leading-relaxed text-slate-500">{faq.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </Section>

            {/* CCTV Internal Linking Strip */}
            {service.categoryId === "cctv" && (
              <Section title="TechBes CCTV Security Ecosystem in Bangalore">
                <p className="mb-4 text-xs leading-relaxed text-slate-500 font-semibold">
                  From initial planning to long-term maintenance, TechBes provides complete end-to-end security camera lifecycle services across Bangalore.
                </p>
                <div className="grid gap-3 grid-cols-2 md:grid-cols-5 text-left">
                  {[
                    { slug: "install-new-cctv", label: "1. Install CCTV", desc: "Site setup & wiring" },
                    { slug: "maintenance-amc", label: "2. CCTV AMC", desc: "Annual servicing contracts" },
                    { slug: "repair-existing-cctv", label: "3. CCTV Repair", desc: "Troubleshoot & fix faults" },
                    { slug: "buy-cctv-products", label: "4. Buy Cameras", desc: "Recorders, wires & gear" },
                    { slug: "free-site-survey", label: "5. Free Survey", desc: "On-site planning & quote" }
                  ].map((item) => {
                    const isActive = service.slug === item.slug;
                    return (
                      <Link
                        key={item.slug}
                        href={`/services/${item.slug}`}
                        className={`group p-4 rounded-2xl border transition duration-200 text-center flex flex-col justify-between ${
                          isActive
                            ? "bg-blue-50/50 border-blue-200 ring-1 ring-blue-100"
                            : "bg-white border-slate-100 hover:border-blue-100 hover:shadow-sm"
                        }`}
                      >
                        <div>
                          <h4 className={`text-xs font-bold transition-colors ${
                            isActive ? "text-blue-700" : "text-slate-800 group-hover:text-blue-600"
                          }`}>
                            {item.label}
                          </h4>
                          <p className="mt-1 text-[9px] text-slate-400 font-semibold leading-relaxed">
                            {item.desc}
                          </p>
                        </div>
                        <span className={`mt-3 mx-auto inline-flex items-center justify-center h-5 w-5 rounded-full text-[9px] font-bold ${
                          isActive
                            ? "bg-blue-600 text-white"
                            : "bg-slate-100 text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition"
                        }`}>
                          {isActive ? "✓" : "→"}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </Section>
            )}

            {/* Related Services */}
            <Section title="Other Popular IT & Security Solutions in Bangalore">
              <div className="grid gap-3 sm:grid-cols-3">
                {recommended.map((item) => (
                  <Link key={item.slug} href={`/services/${item.slug}`} className="group rounded-2xl border border-slate-100 bg-white p-4 transition duration-200 hover:border-blue-100 hover:shadow-sm">
                    <p className="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{item.title}</p>
                    <p className="mt-1 text-[11px] font-semibold text-slate-400">{item.price}</p>
                  </Link>
                ))}
              </div>
            </Section>
          </div>

          {/* Sticky checkout options - Desktop only */}
          <aside className="hidden lg:block">
            <div className="sticky top-28 space-y-4">
              <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm space-y-5">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">How much does it cost?</p>
                  <p className="mt-1 text-3xl font-black text-slate-800">{service.price}</p>
                </div>
                
                <div className="space-y-3.5 pt-4 border-t border-slate-50 text-[11px] font-semibold text-slate-600">
                  <Pill icon={<Clock3 className="h-4 w-4 text-blue-600" />} text={`Duration: ${service.duration}`} />
                  <Pill icon={<MapPin className="h-4 w-4 text-blue-600" />} text="Bangalore & Metro Zones" />
                  <Pill icon={<TicketPercent className="h-4 w-4 text-amber-500" />} text="Coupons applied at checkout" />
                </div>

                <div className="grid gap-2 pt-2">
                  <Button className="h-10 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs" onClick={openBooking}>Book Now</Button>
                  {cctvService && <Button variant="outline" className="h-10 rounded-xl border-slate-200 text-xs font-bold" onClick={() => setConfigOpen(true)}>Add To Cart</Button>}
                  <Button variant="outline" className="h-10 rounded-xl border-slate-200 text-xs font-bold w-full" asChild>
                    <Link href={`/get-a-quote?service=${service.slug}`}>Request Quote</Link>
                  </Button>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {cctvService && <ServiceBookingConfigModal open={configOpen} onOpenChange={setConfigOpen} service={cctvService as any} />}
      <Dialog open={quoteOpen} onOpenChange={setQuoteOpen}>
        <DialogContent className="rounded-2xl border border-slate-100">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-slate-900">Request Quote</DialogTitle>
            <DialogDescription className="text-xs text-slate-400">Share your requirements for {service.title} and we will offer a custom estimate.</DialogDescription>
          </DialogHeader>
          <form onSubmit={submitQuote} className="grid gap-3.5 mt-2">
            <QuoteField label="Name" value={quoteForm.name} onChange={(value) => setQuoteForm({ ...quoteForm, name: value })} required />
            <QuoteField label="Phone" value={quoteForm.phone} onChange={(value) => setQuoteForm({ ...quoteForm, phone: value })} required />
            <QuoteField label="Email" type="email" value={quoteForm.email} onChange={(value) => setQuoteForm({ ...quoteForm, email: value })} required />
            <QuoteField label="Location" value={quoteForm.location} onChange={(value) => setQuoteForm({ ...quoteForm, location: value })} required />
            <label className="grid gap-1.5 text-xs font-bold text-slate-700">
              Message
              <textarea className="min-h-24 rounded-xl border border-slate-200 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-slate-50" value={quoteForm.message} onChange={(event) => setQuoteForm({ ...quoteForm, message: event.target.value })} />
            </label>
            <Button className="mt-2 h-10 rounded-xl bg-blue-600 text-white hover:bg-blue-700 text-xs font-bold shadow-sm" disabled={quoteSaving}>
              <FileText className="h-4 w-4 mr-1.5" />
              {quoteSaving ? "Submitting..." : "Submit Quote Request"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

function Pill({ icon, text }: { icon: ReactNode; text: string }) {
  return <div className="inline-flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 text-[11px] font-semibold text-slate-700 w-full border border-slate-100/50">{icon}<span>{text}</span></div>;
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm"><h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider pb-3.5 border-b border-slate-50">{title}</h2><div className="mt-4">{children}</div></div>;
}

function QuoteField({ label, value, onChange, type = "text", required }: { label: string; value: string; onChange: (value: string) => void; type?: string; required?: boolean }) {
  return (
    <label className="grid gap-1.5 text-xs font-bold text-slate-700">
      {label}
      <input className="h-10 rounded-xl border border-slate-200 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-slate-50" type={type} value={value} onChange={(event) => onChange(event.target.value)} required={required} />
    </label>
  );
}

function FeatureGrid({ features }: { features: string[] }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {features.map((feat, idx) => (
        <div key={`${idx}-${feat}`} className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/50 p-3">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
            <Check className="h-4 w-4" />
          </div>
          <p className="text-xs font-semibold leading-relaxed text-slate-600">{feat}</p>
        </div>
      ))}
    </div>
  );
}

function HorizontalStepper({ steps }: { steps: string[] }) {
  return (
    <div className="flex items-start gap-4 overflow-x-auto py-2">
      {steps.map((step, i) => (
        <div key={step} className="flex items-start gap-4 shrink-0">
          <div className="flex min-w-[7rem] flex-col items-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white shadow-sm font-bold text-xs">
              {i === 0 && <Calendar className="h-4.5 w-4.5" />}
              {i === 1 && <Toolbox className="h-4.5 w-4.5" />}
              {i === 2 && <Check className="h-4.5 w-4.5" />}
              {i >= 3 && <Users className="h-4.5 w-4.5" />}
            </div>
            <div className="mt-2 max-w-[7rem] text-center text-[10px] font-bold text-slate-500 uppercase tracking-wider">{step}</div>
          </div>
          {i < steps.length - 1 && <div className="mt-5 h-0.5 w-8 bg-slate-100" />}
        </div>
      ))}
    </div>
  );
}
