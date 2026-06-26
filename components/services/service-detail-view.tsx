"use client";

import Image from "next/image";
import Link from "next/link";
import { Calendar, Check, CheckCircle, ChevronLeft, Clock3, FileText, MapPin, Star, TicketPercent, Toolbox, Users } from "lucide-react";
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
  const searchParams = useSearchParams();
  const recommended = getRecommendedServices(service.id);

  const initialImage = (service.gallery && service.gallery.length > 0 ? service.gallery[0] : service.image) || "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=80";
  const [imgSrc, setImgSrc] = useState(initialImage);

  useEffect(() => {
    const nextImg = (service.gallery && service.gallery.length > 0 ? service.gallery[0] : service.image) || "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=80";
    setImgSrc(nextImg);
  }, [service.image, service.gallery]);
  const cctvService = service.configurableType === "cctv"
    ? (service.managedService || {
        _id: service.slug,
        slug: service.slug,
        name: service.title,
        categoryId: service.categoryId || "cctv",
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
      })
    : null;

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
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Link href={`/services${searchParams?.get("category") ? `?category=${searchParams.get("category")}` : ""}`} className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-950">
          <ChevronLeft className="h-4 w-4" />
          Back to services
        </Link>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr,420px]">
          <div className="space-y-6">
            <div className="grid gap-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:grid-cols-2 lg:items-center">
              <div className="relative h-56 overflow-hidden rounded-2xl bg-slate-100 sm:h-72">
                <Image
                  src={imgSrc}
                  alt={service.title}
                  fill
                  className="object-cover"
                  onError={() => setImgSrc("https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=80")}
                  priority
                />
              </div>
              <div>
                <Badge className="rounded-full bg-emerald-100 px-3 py-1 text-emerald-700">{service.category}</Badge>
                <h1 className="mt-4 text-2xl font-semibold text-slate-900 sm:text-3xl md:text-4xl">{service.title}</h1>
                <p className="mt-2 max-w-xl text-sm text-slate-600">{service.description}</p>
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <Pill icon={<Star className="h-4 w-4 fill-amber-400 text-amber-400" />} text={`${service.rating} (${service.reviewCount})`} />
                  <Pill icon={<Clock3 className="h-4 w-4 text-emerald-600" />} text={service.duration} />
                  <Pill icon={<CheckCircle className="h-4 w-4 text-emerald-600" />} text="Verified" />
                </div>
                <div className="mt-6">
                  <p className="text-sm text-slate-500">Starting from</p>
                  <p className="text-3xl font-extrabold text-slate-900">{service.price}</p>
                </div>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <Button className="rounded-full bg-emerald-600 text-white hover:bg-emerald-700" onClick={cctvService ? () => setConfigOpen(true) : openBooking}>Book Now</Button>
                  {cctvService && <Button variant="outline" className="rounded-full" onClick={() => setConfigOpen(true)}>Add To Cart</Button>}
                  <Button variant="outline" className="rounded-full" onClick={() => setQuoteOpen(true)}>Request Quote</Button>
                </div>
              </div>
            </div>

            <Section title="Overview">
              <p className="text-sm leading-6 text-slate-600">{service.description}</p>
              <div className="mt-5">
                <FeatureGrid features={[...service.features, ...service.includes]} />
              </div>
            </Section>

            {((service as any).supportedProducts || (service as any).supportedAddons || (service as any).supportedSpareParts) && (
              <Section title="Available Addons & Products">
                <div className="grid gap-3 sm:grid-cols-3">
                  {(service as any).supportedProducts?.map((p: string) => (
                    <div key={p} className="rounded-xl border border-slate-100 bg-white p-3 text-sm">
                      <div className="text-sm font-medium text-slate-900">{p}</div>
                    </div>
                  ))}
                  {(service as any).supportedAddons?.map((a: string) => (
                    <div key={a} className="rounded-xl border border-slate-100 bg-white p-3 text-sm">
                      <div className="text-sm font-medium text-slate-900">{a}</div>
                    </div>
                  ))}
                  {(service as any).supportedSpareParts?.map((s: string) => (
                    <div key={s} className="rounded-xl border border-slate-100 bg-white p-3 text-sm">
                      <div className="text-sm font-medium text-slate-900">{s}</div>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            <Section title="FAQ">
              <Accordion type="single" collapsible>
                {service.faqs.slice(0, 5).map((faq, index) => (
                  <AccordionItem key={faq.question} value={`faq-${index}`}>
                    <AccordionTrigger className="text-left text-sm font-medium text-slate-950">{faq.question}</AccordionTrigger>
                    <AccordionContent className="text-sm leading-6 text-slate-600">{faq.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </Section>

            <Section title="How it works">
              <HorizontalStepper steps={service.steps} />
            </Section>

            <Section title="Related Services">
              <div className="grid gap-3 sm:grid-cols-3">
                {recommended.map((item) => (
                  <Link key={item.slug} href={`/services/${item.slug}`} className="rounded-xl border border-slate-200 bg-white p-3 transition hover:border-emerald-200 hover:bg-emerald-50/50">
                    <p className="font-medium text-slate-950">{item.title}</p>
                    <p className="mt-1 text-sm text-slate-500">{item.price}</p>
                  </Link>
                ))}
              </div>
            </Section>
          </div>

          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-4">
              <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-lg">
                <p className="text-sm font-medium text-slate-500">Starting from</p>
                <p className="mt-2 text-4xl font-extrabold text-slate-900">{service.price}</p>
                <div className="mt-4 space-y-3 text-sm text-slate-600">
                  <Pill icon={<Clock3 className="h-4 w-4 text-emerald-600" />} text={`Estimated duration: ${service.duration}`} />
                  <Pill icon={<MapPin className="h-4 w-4 text-blue-600" />} text="Service availability in metro zones" />
                  <Pill icon={<TicketPercent className="h-4 w-4 text-amber-500" />} text="Coupons available at checkout" />
                </div>
                <div className="mt-5 grid gap-2">
                  <Button className="rounded-full bg-emerald-600 text-white hover:bg-emerald-700" onClick={cctvService ? () => setConfigOpen(true) : openBooking}>Book Now</Button>
                  {cctvService && <Button variant="outline" className="rounded-full" onClick={() => setConfigOpen(true)}>Add To Cart</Button>}
                  <Button variant="outline" className="rounded-full" onClick={() => setQuoteOpen(true)}>Request Quote</Button>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {cctvService && <ServiceBookingConfigModal open={configOpen} onOpenChange={setConfigOpen} service={cctvService as any} />}
      <Dialog open={quoteOpen} onOpenChange={setQuoteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request Quote</DialogTitle>
            <DialogDescription>Share your details for {service.title}. We will contact you with a tailored estimate.</DialogDescription>
          </DialogHeader>
          <form onSubmit={submitQuote} className="grid gap-3">
            <QuoteField label="Name" value={quoteForm.name} onChange={(value) => setQuoteForm({ ...quoteForm, name: value })} required />
            <QuoteField label="Phone" value={quoteForm.phone} onChange={(value) => setQuoteForm({ ...quoteForm, phone: value })} required />
            <QuoteField label="Email" type="email" value={quoteForm.email} onChange={(value) => setQuoteForm({ ...quoteForm, email: value })} required />
            <QuoteField label="Location" value={quoteForm.location} onChange={(value) => setQuoteForm({ ...quoteForm, location: value })} required />
            <label className="grid gap-1 text-sm font-medium text-slate-700">
              Message
              <textarea className="min-h-24 rounded-md border border-slate-300 px-3 py-2" value={quoteForm.message} onChange={(event) => setQuoteForm({ ...quoteForm, message: event.target.value })} />
            </label>
            <Button className="mt-2 bg-emerald-600 text-white hover:bg-emerald-700" disabled={quoteSaving}>
              <FileText className="h-4 w-4" />
              {quoteSaving ? "Submitting..." : "Submit Quote Request"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

function Pill({ icon, text }: { icon: ReactNode; text: string }) {
  return <div className="inline-flex items-center gap-2 rounded-full bg-slate-50 px-3 py-1.5 text-sm text-slate-700">{icon}<span>{text}</span></div>;
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><h2 className="text-xl font-semibold text-slate-950">{title}</h2><div className="mt-4">{children}</div></div>;
}

function QuoteField({ label, value, onChange, type = "text", required }: { label: string; value: string; onChange: (value: string) => void; type?: string; required?: boolean }) {
  return <label className="grid gap-1 text-sm font-medium text-slate-700">{label}<input className="h-10 rounded-md border border-slate-300 px-3" type={type} value={value} onChange={(event) => onChange(event.target.value)} required={required} /></label>;
}

function FeatureGrid({ features }: { features: string[] }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {features.map((feat, idx) => (
        <div key={`${idx}-${feat}`} className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
            <Check className="h-4 w-4" />
          </div>
          <p className="text-sm font-medium leading-5 text-slate-900">{feat}</p>
        </div>
      ))}
    </div>
  );
}

function HorizontalStepper({ steps }: { steps: string[] }) {
  return (
    <div className="flex items-start gap-4 overflow-x-auto py-2">
      {steps.map((step, i) => (
        <div key={step} className="flex items-start gap-4">
          <div className="flex min-w-[8rem] flex-col items-center">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-600 text-white shadow">
              {i === 0 && <Calendar className="h-5 w-5" />}
              {i === 1 && <Toolbox className="h-5 w-5" />}
              {i === 2 && <Check className="h-5 w-5" />}
              {i >= 3 && <Users className="h-5 w-5" />}
            </div>
            <div className="mt-2 max-w-[8rem] text-center text-sm text-slate-600">{step}</div>
          </div>
          {i < steps.length - 1 && <div className="mt-5 h-0.5 w-12 bg-slate-200" />}
        </div>
      ))}
    </div>
  );
}
