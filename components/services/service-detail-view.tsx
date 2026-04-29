"use client";

import Image from "next/image";
import Link from "next/link";
import { Check, ChevronLeft, Clock3, MapPin, Star, TicketPercent } from "lucide-react";
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

        <div className="mt-6 overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_24px_70px_-44px_rgba(15,23,42,0.5)]">
          <div className="grid lg:grid-cols-[0.9fr,1.1fr]">
            <div className="flex flex-col justify-between gap-8 p-6 sm:p-8 lg:p-10">
              <div>
                <Badge className="rounded-full bg-emerald-100 px-4 py-1.5 text-emerald-700">{service.category}</Badge>
                <h1 className="mt-5 text-4xl font-semibold leading-tight text-slate-950 sm:text-5xl">{service.title}</h1>
                <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">{service.description}</p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <p className="text-xs font-medium uppercase text-slate-400">Rating</p>
                  <p className="mt-1 inline-flex items-center gap-1 text-lg font-semibold text-slate-950">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    {service.rating}
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <p className="text-xs font-medium uppercase text-slate-400">Duration</p>
                  <p className="mt-1 text-lg font-semibold text-slate-950">{service.duration}</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <p className="text-xs font-medium uppercase text-slate-400">Starts at</p>
                  <p className="mt-1 text-lg font-semibold text-slate-950">{service.price}</p>
                </div>
              </div>
            </div>

            <div className="relative min-h-[22rem] lg:min-h-[32rem]">
              <Image src={service.image} alt={service.title} fill className="object-cover" priority />
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.08fr,0.92fr] xl:grid-cols-[1.2fr,0.8fr]">
          <div className="space-y-8">
            <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_24px_60px_-42px_rgba(15,23,42,0.35)] sm:p-8">
              <div className="grid gap-8 md:grid-cols-2">
                <ContentList title="What you get" items={service.features} />
                <ContentList title="What is included" items={service.includes} />
              </div>
            </div>

            <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_24px_60px_-42px_rgba(15,23,42,0.35)] sm:p-8">
              <h2 className="text-2xl font-semibold text-slate-950">How it works</h2>
              <div className="mt-6 grid gap-4">
                {service.steps.map((step, index) => (
                  <div key={step} className="flex gap-4 rounded-2xl bg-slate-50 p-5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-950 text-sm font-semibold text-white">
                      {index + 1}
                    </div>
                    <p className="pt-2 text-sm leading-6 text-slate-600">{step}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_24px_60px_-42px_rgba(15,23,42,0.35)] sm:p-8">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2 className="text-2xl font-semibold text-slate-950">Reviews</h2>
                  <p className="mt-2 text-sm text-slate-500">
                    {service.rating} average rating based on {reviews.length} showcased reviews
                  </p>
                </div>
                <div className="rounded-3xl bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-700">
                  {service.rating} / 5 service quality
                </div>
              </div>

              <div className="mt-6 grid gap-6 lg:grid-cols-[1fr,0.88fr]">
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review.id} className="rounded-2xl border border-slate-200 p-5">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="font-semibold text-slate-950">{review.user}</p>
                          <p className="text-sm text-slate-500">{review.role}</p>
                        </div>
                        <div className="text-right">
                          <p className="inline-flex items-center gap-1 text-sm font-semibold text-slate-950">
                            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                            {review.rating}
                          </p>
                          <p className="text-xs text-slate-400">{review.date}</p>
                        </div>
                      </div>
                      <p className="mt-4 text-sm leading-6 text-slate-600">{review.comment}</p>
                    </div>
                  ))}
                </div>

                <div className="rounded-2xl bg-slate-50 p-5">
                  <h3 className="text-lg font-semibold text-slate-950">Write a review</h3>
                  <div className="mt-4 space-y-3">
                    <Input
                      value={reviewName}
                      onChange={(event) => setReviewName(event.target.value)}
                      className="h-11 rounded-2xl"
                      placeholder="Your name"
                    />
                    <select
                      value={reviewRating}
                      onChange={(event) => setReviewRating(Number(event.target.value))}
                      className="h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-700"
                    >
                      {[5, 4, 3, 2, 1].map((rating) => (
                        <option key={rating} value={rating}>
                          {rating} stars
                        </option>
                      ))}
                    </select>
                    <textarea
                      value={reviewText}
                      onChange={(event) => setReviewText(event.target.value)}
                      className="min-h-32 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none"
                      placeholder="Share your experience"
                    />
                    <Button
                      className="w-full rounded-full"
                      onClick={() => {
                        if (!reviewName || !reviewText) return;
                        setReviews((current) => [
                          {
                            id: current.length + 1,
                            user: reviewName,
                            role: "Customer",
                            rating: reviewRating,
                            comment: reviewText,
                            date: "Today",
                          },
                          ...current,
                        ]);
                        setReviewName("");
                        setReviewText("");
                        setReviewRating(5);
                      }}
                    >
                      Submit Review
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_24px_60px_-42px_rgba(15,23,42,0.35)] sm:p-8">
              <h2 className="text-2xl font-semibold text-slate-950">FAQs</h2>
              <Accordion type="single" collapsible className="mt-4">
                {service.faqs.map((faq, index) => (
                  <AccordionItem key={faq.question} value={`faq-${index}`}>
                    <AccordionTrigger className="text-left text-base font-medium text-slate-950">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-sm leading-6 text-slate-600">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>

          <div>
            <div className="sticky top-24 space-y-6">
              <Card className="rounded-[28px] border-slate-200 bg-white shadow-[0_24px_60px_-42px_rgba(15,23,42,0.35)]">
                <CardContent className="space-y-6 p-8">
                  <div>
                    <p className="text-sm font-medium text-slate-500">Starting price</p>
                    <p className="mt-2 text-4xl font-semibold text-slate-950">{service.price}</p>
                  </div>
                  <div className="space-y-3 text-sm text-slate-600">
                    <div className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3">
                      <Clock3 className="h-4 w-4 text-emerald-600" />
                      Estimated duration: {service.duration}
                    </div>
                    <div className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3">
                      <MapPin className="h-4 w-4 text-blue-600" />
                      Available in major metro service zones
                    </div>
                    <div className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3">
                      <TicketPercent className="h-4 w-4 text-amber-500" />
                      Coupon input available in checkout
                    </div>
                  </div>
                  <Button className="w-full rounded-full" size="lg" onClick={() => setBookingOpen(true)}>
                    Book Now
                  </Button>
                  <Button variant="outline" className="w-full rounded-full" size="lg">
                    Request Quote
                  </Button>
                </CardContent>
              </Card>

              <Card className="rounded-[28px] border-slate-200 bg-[linear-gradient(180deg,#ecfeff,#ffffff)] shadow-[0_24px_60px_-42px_rgba(15,23,42,0.3)]">
                <CardContent className="p-8">
                  <h3 className="text-xl font-semibold text-slate-950">Recommended for you</h3>
                  <div className="mt-5 space-y-4">
                    {recommended.map((item) => (
                      <Link key={item.slug} href={`/services/${item.slug}`} className="block rounded-3xl border border-slate-200 bg-white p-4 transition hover:border-emerald-200 hover:bg-emerald-50/50">
                        <p className="font-semibold text-slate-950">{item.title}</p>
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

function ContentList({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h2 className="text-xl font-semibold text-slate-950">{title}</h2>
      <div className="mt-4 space-y-3">
        {items.map((item) => (
          <div key={item} className="flex items-start gap-3 text-sm text-slate-600">
            <div className="rounded-full bg-emerald-100 p-1 text-emerald-700">
              <Check className="h-3.5 w-3.5" />
            </div>
            <span className="leading-6">{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
