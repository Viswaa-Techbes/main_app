import { ShieldCheck, BadgeIndianRupee, Wrench, Clock3 } from "lucide-react";

export function WhyChoose() {
  const cards = [
    {
      icon: <ShieldCheck className="h-5 w-5 text-blue-600" />,
      title: "100% Certified Techs",
      description: "Every specialist is vetted, background-verified, and OEM-certified to ensure enterprise-grade delivery."
    },
    {
      icon: <BadgeIndianRupee className="h-5 w-5 text-blue-600" />,
      title: "Upfront Cost Estimates",
      description: "No surprise charges. Review detailed labor and materials pricing on our worksheet before authorization."
    },
    {
      icon: <Wrench className="h-5 w-5 text-blue-600" />,
      title: "30-Day Work Warranty",
      description: "Complete peace of mind. If any issues persist post-service, we return and resolve it at zero cost."
    },
    {
      icon: <Clock3 className="h-5 w-5 text-blue-600" />,
      title: "SLA Response Guarantee",
      description: "Dedicated dashboard priority support and 4-hour emergency turnaround for commercial AMC subscribers."
    }
  ];

  return (
    <section className="py-12 bg-white rounded-3xl border border-slate-100 px-6 shadow-sm">
      <div className="text-center max-w-xl mx-auto mb-10">
        <div className="inline-flex items-center gap-1 bg-blue-50 px-3 py-1 rounded-full text-[10px] font-bold text-blue-700 uppercase tracking-wider">
          Trust & Quality
        </div>
        <h2 className="mt-3.5 text-2xl font-extrabold text-slate-900 tracking-tight sm:text-3xl">Why Choose Techbes</h2>
        <p className="mt-2 text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
          Professional standards and bulletproof guarantees that make outsourcing IT services reliable.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card, idx) => (
          <div key={idx} className="rounded-2xl border border-slate-100 bg-slate-50/50 p-5 transition duration-200 hover:border-blue-100 hover:shadow-sm">
            <div className="rounded-xl bg-blue-50 p-2.5 text-blue-600 w-fit border border-blue-50 shadow-sm">
              {card.icon}
            </div>
            <h3 className="mt-4 text-xs font-bold text-slate-800 uppercase tracking-wider">{card.title}</h3>
            <p className="mt-2 text-xs leading-relaxed text-slate-500 font-semibold">{card.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
