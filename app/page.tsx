import { PageShell } from "@/components/layout/page-shell";
import { CategorySidebar } from "@/components/layout/category-sidebar";
import { HomeHero } from "@/components/services/home-hero";
import { CategoryGrid } from "@/components/services/category-grid";
import { FeaturedServices } from "@/components/services/featured-services";
import { AmcPlans } from "@/components/services/amc-plans";
import { RecommendedStrip } from "@/components/services/recommended-strip";
import { WhyChoose } from "@/components/services/why-choose";
import { CustomerReviews } from "@/components/services/customer-reviews";
import { Brands } from "@/components/services/brands";
import { GeneralFaq } from "@/components/services/general-faq";
import { getSeoMetadata } from "@/lib/seo-helpers";

export const metadata = getSeoMetadata({
  title: "TechBes | CCTV Installation & IT Services in Bangalore",
  description:
    "Book professional CCTV installation, repair, AMC, networking and IT services across Bangalore with verified technicians and transparent pricing.",
  path: "/",
});

export default function Home() {
  return (
    <PageShell>
      <div className="bg-slate-50/40 min-h-screen py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          
          {/* Top Section: Category Sidebar + Hero (Desktop side-by-side) */}
          <div className="flex flex-col gap-6 lg:flex-row items-stretch">
            <div className="hidden lg:block shrink-0">
              <CategorySidebar />
            </div>
            <div className="flex-1 min-w-0">
              <HomeHero />
            </div>
          </div>

          {/* Subsequent Sections: Full Width */}
          <FeaturedServices />
          
          <CategoryGrid />
          
          <WhyChoose />
          
          <AmcPlans />
          
          <CustomerReviews />
          
          <Brands />
          
          <GeneralFaq />
          
          <RecommendedStrip />
          
        </div>
      </div>
    </PageShell>
  );
}
