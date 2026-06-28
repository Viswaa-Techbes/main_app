import { PageShell } from "@/components/layout/page-shell";
import { CategorySidebar } from "@/components/layout/category-sidebar";
import { HomeHero } from "@/components/services/home-hero";
import { CategoryGrid } from "@/components/services/category-grid";
import { FeaturedServices } from "@/components/services/featured-services";
import { AmcPlans } from "@/components/services/amc-plans";
import { RecommendedStrip } from "@/components/services/recommended-strip";

export default function Home() {
  return (
    <PageShell>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 bg-slate-50/50">
        <div className="flex flex-col gap-6 lg:flex-row">
          {/* Left Category Sidebar */}
          <div className="hidden lg:block shrink-0">
            <CategorySidebar />
          </div>

          {/* Right Main Content Area */}
          <div className="flex-1 min-w-0 space-y-10">
            <HomeHero />
            <CategoryGrid />
            <FeaturedServices />
            <AmcPlans />
            <RecommendedStrip />
          </div>
        </div>
      </div>
    </PageShell>
  );
}
