import { Check } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { subscriptionPlans } from "@/lib/marketplace-data";

export function AmcPlans() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="max-w-2xl">
        <Badge className="rounded-full bg-blue-100 px-4 py-1.5 text-blue-700">Subscription plans</Badge>
        <h2 className="mt-4 text-3xl font-semibold text-slate-950">Annual maintenance plans that keep your IT predictable</h2>
        <p className="mt-3 text-slate-600">
          UI-only subscription pricing for AMC upsell moments across the marketplace.
        </p>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        {subscriptionPlans.map((plan) => (
          <div
            key={plan.id}
            className={`rounded-2xl border p-8 shadow-md ${plan.badge ? 'border-emerald-200 bg-[var(--bg-soft)]' : 'border-border bg-card'}`}
          >
            {plan.badge && (
              <span className="inline-flex rounded-full px-3 py-1 text-xs font-semibold text-white" style={{backgroundColor: 'var(--success)'}}>
                {plan.badge}
              </span>
            )}
            <h3 className="mt-4 text-2xl font-semibold text-[var(--text-900)]">{plan.name}</h3>
            <p className="mt-2 text-sm leading-6 text-[var(--text-700)]">{plan.description}</p>
            <p className="mt-6 text-3xl font-semibold text-[var(--text-900)]">{plan.price}</p>
            <div className="mt-6 space-y-3">
              {plan.features.map((feature) => (
                <div key={feature} className="flex items-start gap-3 text-sm text-[var(--text-700)]">
                  <div className="rounded-full bg-emerald-100 p-1 text-emerald-700">
                    <Check className="h-3.5 w-3.5" />
                  </div>
                  {feature}
                </div>
              ))}
            </div>
            <Button className="mt-8 w-full rounded-full" variant={plan.badge ? 'primary' : 'outline'}>
              Choose Plan
            </Button>
          </div>
        ))}
      </div>
    </section>
  );
}
