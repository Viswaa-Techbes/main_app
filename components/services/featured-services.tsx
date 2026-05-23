import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ServiceCard from "@/components/marketing/service-card";

export function FeaturedServices() {
  const sample = [
    { title: 'AC Installation', price: '₹1,999', duration: '2 hrs', rating: 4.7 },
    { title: 'CCTV Setup', price: '₹2,499', duration: '3 hrs', rating: 4.8 },
    { title: 'Network Setup', price: '₹1,799', duration: '1.5 hrs', rating: 4.6 },
    { title: 'Laptop Repair', price: '₹799', duration: '1 hr', rating: 4.5 },
  ]

  return (
    <section className="bg-muted py-16 text-foreground">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div>Featured services (debug)</div>
      </div>
    </section>
  );
}
