import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ServicesCarousel from "@/components/services/services-carousel";

export function FeaturedServices() {
  return (
    <section className="bg-muted py-16 text-foreground">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Badge className="rounded-full bg-white/10 px-4 py-1.5 text-white">Featured services</Badge>
            <h2 className="mt-4 text-3xl font-semibold">High-conversion services customers book most</h2>
            <p className="mt-3 max-w-2xl text-muted-foreground">
              Premium cards, fast-scannable information, and clear calls to action designed for higher booking intent.
            </p>
          </div>
          <Button asChild variant="outline" className="rounded-full border bg-background shadow-sm">
            <Link href="/services">
              Browse full catalog
            </Link>
          </Button>
        </div>

        <div className="mt-8">
          <ServicesCarousel />
        </div>
      </div>
    </section>
  );
}
