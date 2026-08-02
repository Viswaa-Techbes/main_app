import { notFound } from "next/navigation";
import Link from "next/link";
import { getGeoPageBySlug } from "@/lib/geo-data";
import { PageShell } from "@/components/layout/page-shell";
import { JsonLd } from "@/components/seo/json-ld";
import { ChevronRight, Award, Compass, ArrowRight, Phone, Calendar, ArrowLeft } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = getGeoPageBySlug(slug);

  if (!page) {
    return {
      title: "Guide Not Found | TechBes",
    };
  }

  const title = `${page.title} | TechBes Bangalore`;
  const description = page.description;
  const canonicalUrl = `https://techbes.co.in/knowledge/${slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: "article",
      siteName: "TechBes Bangalore",
      images: [
        {
          url: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=80",
          width: 800,
          height: 600,
          alt: page.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function GeoPage({ params }: PageProps) {
  const { slug } = await params;
  const page = getGeoPageBySlug(slug);

  if (!page) {
    notFound();
  }

  const breadcrumbs = {
    items: [
      { name: "Home", url: "/" },
      { name: "Knowledge Hub", url: "/knowledge" },
      { name: page.title, url: `/knowledge/${page.slug}` },
    ],
  };

  // Structured schemas
  const isLocation = page.category === "Locations";

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": page.title,
    "description": page.description,
    "author": {
      "@type": "Organization",
      "name": "TechBes",
      "url": "https://techbes.co.in"
    },
    "publisher": {
      "@type": "Organization",
      "name": "TechBes",
      "logo": {
        "@type": "ImageObject",
        "url": "https://techbes.co.in/logo.png"
      }
    },
    "mainEntityOfPage": `https://techbes.co.in/knowledge/${page.slug}`,
    "inLanguage": "en-IN"
  };

  const localBusinessSchema = isLocation ? {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": `TechBes CCTV & IT Services ${page.title}`,
    "description": page.description,
    "telephone": "+91 95911 44949",
    "email": "lohith@techbes.co.in",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "1st Floor, #962, Above SBI Bank, Papareddy Palya, 2nd Stage, Nagarbhavi",
      "addressLocality": "Bangalore",
      "addressRegion": "Karnataka",
      "postalCode": page.locationInfo?.pincodes[0] || "560072",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 12.9625,
      "longitude": 77.5155
    },
    "url": `https://techbes.co.in/knowledge/${page.slug}`,
    "areaServed": {
      "@type": "Place",
      "name": page.title
    }
  } : null;

  return (
    <PageShell>
      <JsonLd type="breadcrumb" data={breadcrumbs} />
      <JsonLd type="faq" data={{ faqs: page.faqs }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      {localBusinessSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }} />}

      <div className="bg-slate-50/30 min-h-screen py-10">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-8">
          
          {/* Back button */}
          <Link href="/knowledge" className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-400 hover:text-blue-600 transition">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Knowledge Center
          </Link>

          {/* Hero Header */}
          <div className="space-y-4 text-left">
            <span className="inline-flex rounded-full bg-blue-50 border border-blue-100 px-3 py-1 text-[9px] font-bold uppercase tracking-wider text-blue-700">
              {page.category}
            </span>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight sm:text-4xl leading-tight">
              {page.title}
            </h1>
            <p className="text-xs text-slate-400 font-semibold flex flex-wrap items-center gap-2">
              <span>Author: TechBes Engineering Team</span>
              <span>•</span>
              <span>Reading Time: 5 mins</span>
              <span>•</span>
              <span>Focus: Bangalore Services</span>
            </p>
          </div>

          {/* AI Citation Ready Summary Card */}
          <div className="rounded-3xl border border-blue-100 bg-blue-50/10 p-6 shadow-sm space-y-4 text-left">
            <div className="flex items-center gap-2 border-b border-blue-50 pb-3">
              <Award className="h-5 w-5 text-blue-650" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700">
                AI Overview & Direct Answer (Generative Citation Ready)
              </span>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">
                Q: {page.question}
              </h3>
              <p className="text-xs leading-relaxed text-slate-600 font-semibold bg-white border border-blue-50 rounded-2xl p-4">
                {page.answer}
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Key Takeaways</h4>
              <ul className="grid gap-2 sm:grid-cols-2">
                {page.keyPoints.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-[10px] font-semibold text-slate-600">
                    <span className="text-blue-600 font-bold mt-0.5">•</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* main Content Blocks */}
          <div className="space-y-6 text-left">
            {page.sections.map((sect, idx) => (
              <div key={idx} className="rounded-2xl border border-slate-100 bg-white p-6 shadow-xs space-y-2.5">
                <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider pb-2 border-b border-slate-50">
                  {sect.title}
                </h2>
                <p className="text-xs leading-relaxed text-slate-500 font-medium whitespace-pre-wrap">
                  {sect.text}
                </p>
              </div>
            ))}
          </div>

          {/* Comparisons Table widget (if category is Comparisons) */}
          {page.comparisonTable && (
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-xs text-left space-y-4">
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider pb-2 border-b border-slate-50">
                Technology Specification Matrix
              </h2>
              <div className="overflow-x-auto rounded-2xl border border-slate-100 bg-white">
                <table className="min-w-full divide-y divide-slate-100 text-xs text-slate-600">
                  <thead className="bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    <tr>
                      {page.comparisonTable.headers.map((h) => (
                        <th key={h} className="px-4 py-3 text-left">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {page.comparisonTable.rows.map((row, rIdx) => (
                      <tr key={rIdx} className="hover:bg-slate-50/50 transition">
                        {row.map((cell, cIdx) => (
                          <td key={cIdx} className="px-4 py-3 whitespace-nowrap">{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Brand Specs widget (if category is Brands) */}
          {page.brandInfo && (
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-xs text-left space-y-4">
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider pb-2 border-b border-slate-50">
                Hardware Capabilities & Models
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Supported Models</h4>
                  <ul className="list-disc pl-4 text-xs text-slate-600 font-medium space-y-1">
                    {page.brandInfo.models.map((m) => <li key={m}>{m}</li>)}
                  </ul>
                </div>
                <div className="space-y-1">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Core Advantages</h4>
                  <ul className="list-disc pl-4 text-xs text-slate-600 font-medium space-y-1">
                    {page.brandInfo.advantages.map((a) => <li key={a}>{a}</li>)}
                  </ul>
                </div>
              </div>
              <div className="pt-2 border-t border-slate-50">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Recommended Customer Segment</h4>
                <p className="text-xs text-slate-550 leading-relaxed font-semibold mt-1">
                  {page.brandInfo.recommendedCustomers}
                </p>
              </div>
            </div>
          )}

          {/* Location Specific Specs (if category is Locations) */}
          {page.locationInfo && (
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-xs text-left space-y-4">
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider pb-2 border-b border-slate-50">
                Local Neighborhood Coverage Details
              </h2>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-1">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Covered Sectors</h4>
                  <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                    {page.locationInfo.neighborhoods.join(", ")}
                  </p>
                </div>
                <div className="space-y-1">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Key Landmarks</h4>
                  <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                    {page.locationInfo.landmarks.join(", ")}
                  </p>
                </div>
                <div className="space-y-1">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Pincodes Served</h4>
                  <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                    {page.locationInfo.pincodes.join(", ")}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* FAQs Accordion */}
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-xs text-left space-y-4">
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider pb-2 border-b border-slate-50">
              Related Frequently Asked Questions
            </h2>
            <Accordion type="single" collapsible className="w-full">
              {page.faqs.map((faq, index) => (
                <AccordionItem key={faq.question} value={`faq-${index}`} className="border-slate-100">
                  <AccordionTrigger className="text-xs font-bold text-slate-850 hover:no-underline text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-xs leading-relaxed text-slate-500 font-medium">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          {/* Call To Action Card */}
          <div className="rounded-3xl border border-slate-150 bg-slate-900 p-6 sm:p-8 text-white text-left space-y-4 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div className="space-y-2">
              <span className="inline-flex rounded-full bg-blue-500/20 text-blue-450 text-[9px] font-bold uppercase tracking-wider px-3 py-1">
                Bangalore Installation Support
              </span>
              <h2 className="text-lg font-black tracking-tight">Need help wring or repairing cameras?</h2>
              <p className="text-[11px] leading-relaxed text-slate-400 max-w-md font-semibold">
                TechBes assigns certified technicians with test monitors, wring accessories, and official CP Plus/Hikvision models to audit and secure your property.
              </p>
            </div>
            <div className="flex flex-col gap-2 shrink-0">
              <Button asChild className="h-10 rounded-xl bg-blue-650 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-6 shadow-xs flex items-center gap-2">
                <Link href="/services/install-new-cctv">
                  Book CCTV Setup <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-10 rounded-xl border-slate-700 hover:bg-slate-800 text-white font-bold text-xs px-6">
                <Link href="/contact" className="flex items-center gap-2">
                  <Phone className="h-4 w-4" /> Call Support
                </Link>
              </Button>
            </div>
          </div>

          {/* Related Guides links */}
          {page.relatedSlugs && page.relatedSlugs.length > 0 && (
            <div className="space-y-3 text-left">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Related Topics</h4>
              <div className="grid gap-3 sm:grid-cols-3">
                {page.relatedSlugs.map((relSlug) => {
                  const relPage = getGeoPageBySlug(relSlug);
                  if (!relPage) return null;

                  return (
                    <Link
                      key={relSlug}
                      href={`/knowledge/${relSlug}`}
                      className="group p-4 rounded-xl border border-slate-100 bg-white hover:border-blue-100 hover:shadow-xs transition duration-200"
                    >
                      <h4 className="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-1">
                        {relPage.title}
                      </h4>
                      <p className="text-[9px] text-slate-400 font-semibold line-clamp-1 mt-1">
                        {relPage.description}
                      </p>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

        </div>
      </div>
    </PageShell>
  );
}
