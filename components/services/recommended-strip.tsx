import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function RecommendedStrip() {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
      <div className="rounded-[36px] bg-[linear-gradient(120deg,#0f172a_0%,#134e4a_42%,#2563eb_100%)] p-8 text-white shadow-[0_30px_90px_-45px_rgba(15,23,42,0.9)] lg:flex lg:items-center lg:justify-between lg:p-10">
        <div>
          <Badge className="rounded-full bg-white/10 px-4 py-1.5 text-white">Recommended for you</Badge>
          <h2 className="mt-4 max-w-2xl text-3xl font-semibold">
            Pair AMC coverage with on-demand visits to reduce downtime across all sites
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-200">
            Most businesses that book networking or surveillance services also activate an AMC plan for preventive health checks and priority support.
          </p>
        </div>
        <Button asChild className="mt-6 rounded-full bg-white text-slate-950 hover:bg-slate-100 lg:mt-0">
          <Link href="/services?category=amc">
            Explore AMC Plans
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </section>
  );
}
