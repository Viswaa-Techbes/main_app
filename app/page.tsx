import { PageShell } from "@/components/layout/page-shell";
import { AmcPlans } from "@/components/services/amc-plans";
import { CategoryGrid } from "@/components/services/category-grid";
import { FeaturedServices } from "@/components/services/featured-services";
import { HomeHero } from "@/components/services/home-hero";
import { RecommendedStrip } from "@/components/services/recommended-strip";
import { CareersStrip } from "@/components/services/careers-strip";

export default function Home() {
  return (
    <PageShell>
      <HomeHero />
      <CategoryGrid />
      <FeaturedServices />
      <AmcPlans />
      <CareersStrip />
      <RecommendedStrip />
    </PageShell>
  );
}
