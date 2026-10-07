"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { PageShell } from "@/components/layout/page-shell";

function RedirectToQuote() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const query = searchParams.toString();
    router.replace(`/quote${query ? `?${query}` : ""}`);
  }, [router, searchParams]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3 text-slate-500 text-xs font-semibold">
      <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
      <span>Loading TechBes Quotation Portal...</span>
    </div>
  );
}

export default function GetQuotePage() {
  return (
    <PageShell>
      <Suspense fallback={<div className="min-h-[70vh] flex items-center justify-center text-xs text-slate-400">Loading...</div>}>
        <RedirectToQuote />
      </Suspense>
    </PageShell>
  );
}
