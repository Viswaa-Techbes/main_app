"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Check,
  ChevronLeft,
  Clock3,
  MapPin,
  ShieldCheck,
  Star,
  TicketPercent,
  Users,
  Calendar,
  Toolbox,
  CheckCircle,
} from "lucide-react";
import { useState } from "react";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { BookingModal } from "@/components/services/booking-modal";
import { getRecommendedServices, MarketplaceService } from "@/lib/marketplace-data";

export function ServiceDetailView({ service }: { service: MarketplaceService }) {
  const [reviewName, setReviewName] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviews, setReviews] = useState(service.reviews);
  const [bookingOpen, setBookingOpen] = useState(false);
  const recommended = getRecommendedServices(service.id);

  return (
    <>
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Link href="/services" className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-950">
          <ChevronLeft className="h-4 w-4" />
          Back to services
        </Link>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.06fr,0.94fr] xl:grid-cols-[1.2fr,0.8fr]">
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
              {/* Left: image card */}
              <div className="flex justify-center lg:justify-start">
                <div className="relative w-full max-w-sm rounded-2xl overflow-hidden shadow-lg border border-slate-100 h-56 sm:h-72 bg-white">
                  <Image
                    src={service.gallery[0]}
                    alt={service.title}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </div>

              {/* Right: content */}
              <div className="flex items-center">
                <div className="w-full">
                  <Badge className="rounded-full bg-emerald-100 px-3 py-1 text-emerald-700">{service.category}</Badge>
                  <h1 className="mt-4 text-2xl sm:text-3xl md:text-4xl font-semibold text-slate-900">{service.title}</h1>
                  <p className="mt-2 text-sm text-slate-600 max-w-xl">{service.description}</p>

                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <div className="inline-flex items-center gap-2 rounded-full bg-slate-50 px-3 py-1">
                      <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                      <span className="text-sm font-medium text-slate-900">{service.rating}</span>
                      <span className="text-sm text-slate-500">({service.reviews.length})</span>
                    </div>
                    <div className="inline-flex items-center gap-2 rounded-full bg-slate-50 px-3 py-1">
                      <Clock3 className="h-4 w-4 text-emerald-600" />
                      <span className="text-sm text-slate-700">{service.duration}</span>
                    </div>
                    <div className="inline-flex items-center gap-2 rounded-full bg-slate-50 px-3 py-1">
                      <CheckCircle className="h-4 w-4 text-emerald-600" />
                      <span className="text-sm text-slate-700">Verified</span>
                    </div>
                  </div>

                  <div className="mt-6">
                    <p className="text-sm text-slate-500">Starting from</p>
                    <p className="text-3xl font-extrabold text-slate-900">{service.price}</p>
                  </div>

                  <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                    <Button className="w-full sm:w-auto rounded-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 text-lg" onClick={() => setBookingOpen(true)}>
                      Book Now
                    </Button>
                    <Button variant="outline" className="w-full sm:w-auto rounded-full py-3">
                      Request Quote
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mt-1 flex flex-wrap items-center justify-between gap-4">
                <div className="w-full md:w-[65%]">
                  <h2 className="text-xl font-semibold text-slate-950">Overview</h2>
                  <p className="mt-2 text-sm text-slate-600">{service.description}</p>
                </div>
                <div className="w-full md:w-auto flex items-center gap-3">
                  <div className="inline-flex items-center gap-2 rounded-full bg-slate-50 px-3 py-2">
                    <CheckCircle className="h-4 w-4 text-emerald-600" />
                    <span className="text-sm text-slate-700">Verified</span>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <FeatureGrid features={[...service.features, ...service.includes]} />
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-semibold text-slate-950">How it works</h2>
              <div className="mt-4">
                <HorizontalStepper steps={service.steps} />
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-semibold text-slate-950">Reviews</h2>
                  <p className="mt-1 text-sm text-slate-500">{service.rating} average rating • {reviews.length} reviews</p>
                </div>
                <Button variant="ghost" className="text-emerald-600">View All Reviews</Button>
              </div>

              <div className="mt-4 flex gap-4 overflow-x-auto pb-2">
                {reviews.map((review) => (
                  <div key={review.id} className="min-w-[18rem] max-w-xs shrink-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-slate-950">{review.user}</p>
                        <p className="text-xs text-slate-500">{review.role}</p>
                      </div>
                      <div className="inline-flex items-center gap-1 text-sm font-semibold text-slate-950">
                        <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                        {review.rating}
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-slate-600 line-clamp-3">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <h2 className="text-2xl font-semibold text-slate-950">FAQs</h2>
              <Accordion type="single" collapsible className="mt-2">
                {service.faqs.slice(0, 4).map((faq, index) => (
                  <AccordionItem key={faq.question} value={`faq-${index}`}>
                    <AccordionTrigger className="text-left text-sm font-medium text-slate-950 py-2">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-sm leading-6 text-slate-600 py-2">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>

          <div>
            <div className="sticky top-24 space-y-6">
              <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-lg">
                <div className="space-y-4">
                  <p className="text-sm font-medium text-slate-500">Starting from</p>
                  <p className="text-4xl sm:text-5xl font-extrabold text-slate-900">{service.price}</p>
                </div>

                <div className="mt-4 space-y-3 text-sm text-slate-600">
                  <div className="flex items-center gap-3 rounded-lg bg-slate-50 px-3 py-2">
                    <Clock3 className="h-4 w-4 text-emerald-600" />
                    <span>Estimated duration: <span className="font-medium text-slate-900">{service.duration}</span></span>
                  </div>
                  <div className="flex items-center gap-3 rounded-lg bg-slate-50 px-3 py-2">
                    <MapPin className="h-4 w-4 text-blue-600" />
                    <span>Service availability in metro zones</span>
                  </div>
                  <div className="flex items-center gap-3 rounded-lg bg-slate-50 px-3 py-2">
                    <TicketPercent className="h-4 w-4 text-amber-500" />
                    <span>Coupons available at checkout</span>
                  </div>
                </div>

                <div className="mt-6 flex flex-col gap-3">
                  <Button className="w-full rounded-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 text-lg" onClick={() => setBookingOpen(true)}>
                    Book Now
                  </Button>
                  <Button variant="outline" className="w-full rounded-full py-3">
                    Request Quote
                  </Button>
                </div>
              </div>

              <Card className="rounded-2xl border border-slate-200 bg-[linear-gradient(180deg,#ecfeff,#ffffff)]">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-slate-950">Recommended for you</h3>
                  <div className="mt-4 space-y-3">
                    {recommended.map((item) => (
                      <Link key={item.slug} href={`/services/${item.slug}`} className="block rounded-xl border border-slate-200 bg-white p-3 transition hover:border-emerald-200 hover:bg-emerald-50/50">
                        <p className="font-medium text-slate-950">{item.title}</p>
                        <p className="mt-1 text-sm text-slate-500">{item.price}</p>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <BookingModal open={bookingOpen} onOpenChange={setBookingOpen} service={service} />
    </>
  );
}

function FeatureGrid({ features }: { features: string[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {features.map((feat, idx) => (
        <div key={`${idx}-${feat}`} className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
            <Check className="h-4 w-4" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-900 leading-5">{feat}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function HorizontalStepper({ steps }: { steps: string[] }) {
  return (
    <div className="flex items-center gap-4 overflow-x-auto py-2">
      {steps.map((step, i) => (
        <div key={step} className="flex items-center gap-4">
          <div className="flex flex-col items-center">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-600 text-white shadow">
              {i === 0 && <Calendar className="h-5 w-5" />}
              {i === 1 && <Toolbox className="h-5 w-5" />}
              {i === 2 && <Check className="h-5 w-5" />}
              {i === 3 && <Users className="h-5 w-5" />}
            </div>
            <div className="mt-2 text-sm text-slate-600 text-center max-w-[8rem]">{step}</div>
          </div>
          {i < steps.length - 1 && <div className="h-0.5 w-12 bg-slate-200" />}
        </div>
      ))}
    </div>
  );
}
