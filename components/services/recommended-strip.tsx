import Link from "next/link";
import { ArrowRight, PhoneCall, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

export function RecommendedStrip() {
  return (
    <section className="py-6">
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-8 text-white relative overflow-hidden shadow-lg lg:p-12">
        {/* Soft background blue/green gradient overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.18),transparent_40%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.06),transparent_35%)] pointer-events-none" />

        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between relative z-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[9px] font-bold uppercase tracking-wider text-slate-300">
              <Calendar className="h-3 w-3 text-blue-400" />
              Direct Solutions Consultation
            </div>
            <h2 className="mt-4 text-xl font-extrabold tracking-tight sm:text-2xl leading-snug">
              Secure Your Systems and Prevent IT Downtime Across All Locations
            </h2>
            <p className="mt-2.5 text-xs leading-relaxed text-slate-400 font-semibold max-w-xl">
              Most commercial businesses combine structured cabling or surveillance rollout with a preventive Annual Maintenance Contract (AMC) to guarantee priority 4-hour SLA support.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <Button asChild className="h-10 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-5 shadow-sm">
              <Link href="/services?category=electronic-contracts">
                Explore Contracts
                <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-10 rounded-xl border-white/10 bg-white/5 text-xs font-bold text-white hover:bg-white/10 hover:text-white px-5">
              <Link href="/services">
                <PhoneCall className="h-3.5 w-3.5 mr-1.5 text-blue-400" />
                Speak to Advisor
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
