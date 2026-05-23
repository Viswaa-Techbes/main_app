import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Heading from '@/components/design-system/heading'
import Text from '@/components/design-system/text'
import ServiceCard from '@/components/marketing/service-card'

export function RecommendedStrip() {
  const sample = [
    { title: 'AMC (Annual)', price: 'From ₹999/mo', duration: 'Varies', rating: 4.8 },
    { title: 'Priority Support', price: 'Contact for pricing', duration: 'On-demand', rating: 4.7 },
  ]

  return (
    <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
      <div className="rounded-2xl bg-[var(--card)] p-8 shadow-sm lg:flex lg:items-center lg:justify-between lg:p-10" style={{border: '1px solid var(--border)'}}>
        <div className="lg:max-w-2xl">
          <Badge className="rounded-full">Recommended for you</Badge>
          <Heading as="h2" className="mt-4">Pair AMC coverage with on-demand visits to reduce downtime across all sites</Heading>
          <Text className="mt-3">Most businesses that book networking or surveillance services also activate an AMC plan for preventive health checks and priority support.</Text>
        </div>

        <div className="mt-6 lg:mt-0 flex items-center gap-6">
          <div className="hidden md:grid md:grid-cols-1 md:gap-3">
            {sample.map((s) => (
              <div key={s.title} className="w-64">
                <ServiceCard title={s.title} price={s.price} duration={s.duration} rating={s.rating} />
              </div>
            ))}
          </div>

          <div className="flex-shrink-0">
            <Button asChild variant="primary">
              <Link href="/services?category=amc">
                  <span className="inline-flex items-center">Explore AMC Plans <ArrowRight className="ml-2 inline-block" /></span>
                </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
