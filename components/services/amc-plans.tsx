import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { subscriptionPlans } from "@/lib/marketplace-data";

export function AmcPlans() {
  return (
    <section className="py-12 bg-white rounded-3xl border border-slate-100 px-6 shadow-sm">
      <div className="text-center max-w-xl mx-auto mb-12">
        <div className="inline-flex items-center gap-1 bg-blue-50 px-3 py-1 rounded-full text-[10px] font-bold text-blue-700 uppercase tracking-wider">
          AMC Plans
        </div>
        <h2 className="mt-3.5 text-2xl font-extrabold text-slate-900 tracking-tight sm:text-3xl">Predictable IT Maintenance</h2>
        <p className="mt-2 text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
          Comprehensive subscription options to secure your systems, prevent downtime, and receive priority SLA response.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {subscriptionPlans.map((plan) => {
          const isRecommended = !!plan.badge;

          return (
            <div
              key={plan.id}
              className={`flex flex-col justify-between rounded-2xl border p-6.5 transition-all duration-300 relative ${
                isRecommended
                  ? "border-blue-500 bg-gradient-to-b from-blue-50/50 via-white to-white shadow-md hover:shadow-lg hover:-translate-y-1"
                  : "border-slate-100 bg-white shadow-sm hover:shadow-md hover:-translate-y-1"
              }`}
            >
              {isRecommended && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-blue-600 px-3 py-1 text-[9px] font-bold uppercase tracking-wider text-white shadow-sm">
                  {plan.badge}
                </span>
              )}
              
              <div>
                <h3 className="text-base font-extrabold text-slate-800 mt-2">{plan.name}</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-slate-400 font-semibold">{plan.description}</p>
                <div className="mt-5 pb-5 border-b border-slate-50">
                  <span className="text-2xl font-black text-slate-800">{plan.price}</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">/ Year</span>
                </div>
                
                <div className="mt-5 space-y-3">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-start gap-2.5 text-xs text-slate-600 font-semibold leading-relaxed">
                      <div className="rounded-full bg-blue-50 p-1 text-blue-600 shrink-0 mt-0.5 border border-blue-50">
                        <Check className="h-3 w-3" />
                      </div>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Button 
                className={`mt-8 w-full h-10 rounded-xl text-xs font-bold shadow-sm transition-colors duration-150 ${
                  isRecommended 
                    ? "bg-blue-600 hover:bg-blue-700 text-white" 
                    : "bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                Choose {plan.name}
              </Button>
            </div>
          );
        })}
      </div>
    </section>
  );
}
