import Link from "@/components/ui/link";
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
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Badge className="rounded-full">Featured services</Badge>
            <h2 className="mt-4 text-3xl font-semibold">High-conversion services customers book most</h2>
            <p className="mt-3 max-w-2xl text-muted-foreground">
              Premium cards, fast-scannable information, and clear calls to action designed for higher booking intent.
            </p>
          </div>
            <Button asChild variant="outline" className="rounded-full border bg-background shadow-sm">
            <Link href="/services"><span>Browse full catalog</span></Link>
          </Button>
        </div>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {sample.map((s) => (
            <ServiceCard key={s.title} title={s.title} price={s.price} duration={s.duration} rating={s.rating} />
          ))}
        </div>
      </div>
    </section>
  );
}
