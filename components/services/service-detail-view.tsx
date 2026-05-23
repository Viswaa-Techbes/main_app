"use client";

import Image from "next/image";
import ImageWithFade from "@/components/ui/image-fade";
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
          <span className="inline-flex items-center gap-2"><ChevronLeft className="h-4 w-4" />Back to services</span>
        </Link>

        <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-card shadow-lg">
          <div className="grid lg:grid-cols-[0.95fr,1.05fr]">
            <div className="flex flex-col justify-between gap-8 p-6 sm:p-8 lg:p-10">
              <div>
                <Badge className="rounded-full bg-muted px-4 py-1.5 text-muted-foreground">{service.category}</Badge>
                <h1 className="mt-5 text-4xl font-semibold leading-tight text-foreground sm:text-5xl">{service.title}</h1>
                <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">{service.description}</p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-border bg-muted px-4 py-3">
                  <p className="text-xs font-medium uppercase text-muted-foreground">Rating</p>
                  <p className="mt-1 inline-flex items-center gap-1 text-lg font-semibold text-foreground">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    {service.rating}
                  </p>
                </div>
                <div className="rounded-2xl border border-border bg-muted px-4 py-3">
                  <p className="text-xs font-medium uppercase text-muted-foreground">Duration</p>
                  <p className="mt-1 text-lg font-semibold text-foreground">{service.duration}</p>
                </div>
                <div className="rounded-2xl border border-border bg-muted px-4 py-3">
                  <p className="text-xs font-medium uppercase text-muted-foreground">Starts at</p>
                  <p className="mt-1 text-lg font-semibold text-foreground">{service.price}</p>
                </div>
              </div>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="rounded-2xl h-14 px-10 btn-orange font-bold text-lg flex-1 btn-magnetic glow-pulse" data-magnetic-btn onClick={() => setBookingOpen(true)}>
                  Book Now
                </Button>
                <Button variant="outline" size="lg" className="rounded-2xl h-14 px-10 border-border font-bold text-lg flex-1 btn-magnetic" data-magnetic-btn>
                  Request Quote
                </Button>
              </div>
            </div>

            <div className="relative min-h-[22rem] lg:min-h-[32rem] rounded-r-2xl overflow-hidden">
              <ImageWithFade src={service.image} alt={service.title} fill className="object-cover" priority />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent mix-blend-multiply" />
              {/* Overlay for "Book Now" on mobile right after image */}
              <div className="absolute inset-x-0 bottom-0 p-6 lg:hidden">
                 <Button onClick={() => setBookingOpen(true)} className="w-full h-14 btn-orange font-bold">Book Now</Button>
              </div>
            </div>
          </div>
        </div>

        {/* Floating/Sticky CTA for Desktop & Secondary CTA for Mobile */}
        <div className="mt-4 flex flex-wrap gap-4 items-center justify-between p-6 rounded-3xl bg-white border border-slate-200 shadow-sm lg:hidden">
            <div className="flex-1">
               <p className="text-sm text-slate-500 font-medium">Starting from</p>
               <p className="text-2xl font-bold text-slate-950">{service.price}</p>
            </div>
            <Button size="lg" className="rounded-2xl h-14 px-8 bg-orange-500 hover:bg-orange-600 font-bold" onClick={() => setBookingOpen(true)}>Book Now</Button>
            <Button variant="outline" size="lg" className="rounded-2xl h-14 px-8 font-bold">Get Quote</Button>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.08fr,0.92fr] xl:grid-cols-[1.2fr,0.8fr]">
          <div className="space-y-8">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-md sm:p-8">
              <div className="grid gap-8 md:grid-cols-2">
                <ContentList title="What you get" items={service.features} />
                <ContentList title="What is included" items={service.includes} />
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6 shadow-md sm:p-8">
              <h2 className="text-2xl font-semibold text-slate-950">How it works</h2>
              <div className="mt-6 grid gap-4">
                {service.steps.map((step, index) => (
                  <div key={step} className="flex gap-4 rounded-2xl bg-muted p-5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground shadow-sm">
                      {index + 1}
                    </div>
                    <p className="pt-2 text-sm leading-6 text-muted-foreground">{step}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6 shadow-md sm:p-8">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2 className="text-2xl font-semibold text-slate-950">Reviews</h2>
                  <p className="mt-2 text-sm text-slate-500">
                    {service.rating} average rating based on {reviews.length} showcased reviews
                  </p>
                </div>
                <div className="rounded-3xl bg-muted px-4 py-3 text-sm font-semibold text-muted-foreground">
                  {service.rating} / 5 service quality
                </div>
              </div>

              <div className="mt-6 grid gap-6 lg:grid-cols-[1fr,0.88fr]">
                  <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review.id} className="rounded-2xl border border-border p-5 bg-card">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="font-semibold text-foreground">{review.user}</p>
                          <p className="text-sm text-muted-foreground">{review.role}</p>
                        </div>
                        <div className="text-right">
                          <p className="inline-flex items-center gap-1 text-sm font-semibold text-foreground">
                            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                            {review.rating}
                          </p>
                          <p className="text-xs text-muted-foreground">{review.date}</p>
                        </div>
                      </div>
                      <p className="mt-4 text-sm leading-6 text-muted-foreground">{review.comment}</p>
                    </div>
                  ))}
                </div>

                <div className="rounded-2xl bg-muted p-5">
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
                      className="h-11 w-full rounded-2xl border border-border bg-card px-4 text-sm text-muted-foreground"
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
                      className="min-h-32 w-full rounded-2xl border border-border bg-card px-4 py-3 text-sm text-muted-foreground outline-none"
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

            <div className="rounded-[var(--radius-md)] border border-border bg-card p-6 sm:p-8" style={{boxShadow: 'var(--shadow-soft)'}}>
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
              <Card className="rounded-2xl border-border bg-card shadow-md">
                <CardContent className="space-y-6 p-6">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Starting price</p>
                    <p className="mt-2 text-4xl font-semibold text-foreground">{service.price}</p>
                  </div>
                  <div className="space-y-3 text-sm text-muted-foreground">
                    <div className="flex items-center gap-3 rounded-2xl bg-muted px-4 py-3">
                      <Clock3 className="h-4 w-4 text-primary" />
                      Estimated duration: {service.duration}
                    </div>
                    <div className="flex items-center gap-3 rounded-2xl bg-muted px-4 py-3">
                      <MapPin className="h-4 w-4 text-secondary" />
                      Available in major metro service zones
                    </div>
                    <div className="flex items-center gap-3 rounded-2xl bg-muted px-4 py-3">
                      <TicketPercent className="h-4 w-4 text-amber-500" />
                      Coupon input available in checkout
                    </div>
                  </div>
                  <Button className="w-full rounded-full btn-orange" size="lg" onClick={() => setBookingOpen(true)}>
                    Book Now
                  </Button>
                  <Button variant="outline" className="w-full rounded-full" size="lg">
                    Request Quote
                  </Button>
                </CardContent>
              </Card>

              <Card className="rounded-2xl border border-border bg-card shadow-md">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-[var(--text-900)]">Recommended for you</h3>
                  <div className="mt-4 space-y-3">
                    {recommended.map((item) => (
                      <Link key={item.slug} href={`/services/${item.slug}`} className="block rounded-3xl border border-border bg-card p-4 transition hover:border-[var(--color-secondary)] hover:bg-[var(--bg-soft)]">
                        <p className="font-semibold text-[var(--text-900)]">{item.title}</p>
                        <p className="mt-1 text-sm text-[var(--text-700)]">{item.price}</p>
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
