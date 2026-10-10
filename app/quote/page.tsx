"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { PageShell } from "@/components/layout/page-shell";
import {
  QUOTATION_CATEGORIES,
  findCategoryBySlug,
  findServiceBySlug,
} from "@/lib/service-quotation-data";

function QuoteDirectRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const catQuery = searchParams.get("category");
    const serviceQuery =
      searchParams.get("service") ||
      searchParams.get("slug") ||
      searchParams.get("booking");

    if (catQuery && serviceQuery) {
      const matchedCat = findCategoryBySlug(catQuery);
      const catSlug = matchedCat ? matchedCat.slug : catQuery;
      router.replace(
        `/services?category=${encodeURIComponent(catSlug)}&booking=${encodeURIComponent(serviceQuery)}`
      );
    } else if (serviceQuery) {
      let resolvedCat = "cctv";
      for (const cat of QUOTATION_CATEGORIES) {
        const found = findServiceBySlug(cat.slug, serviceQuery);
        if (found) {
          resolvedCat = cat.slug;
          break;
        }
      }
      router.replace(
        `/services?category=${encodeURIComponent(resolvedCat)}&booking=${encodeURIComponent(serviceQuery)}`
      );
    } else if (catQuery) {
      const matchedCat = findCategoryBySlug(catQuery);
      const catSlug = matchedCat ? matchedCat.slug : catQuery;
      router.replace(`/services?category=${encodeURIComponent(catSlug)}`);
    } else {
      router.replace("/services");
    }
  }, [router, searchParams]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3 text-slate-500 text-xs font-semibold">
      <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
      <span>Opening TechBes Quotation Form...</span>
    </div>
  );
}

export default function QuotePage() {
  return (
    <PageShell>
      <Suspense
        fallback={
          <div className="min-h-[70vh] flex items-center justify-center text-xs text-slate-400">
            Loading...
          </div>
        }
      >
        <QuoteDirectRedirect />
      </Suspense>
    </PageShell>
  );
}
