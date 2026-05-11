import { PageShell } from "@/components/layout/page-shell";
import { AmcPlans } from "@/components/services/amc-plans";
import { CategoryGrid } from "@/components/services/category-grid";
import { FeaturedServices } from "@/components/services/featured-services";
import { HomeHero } from "@/components/services/home-hero";
import { RecommendedStrip } from "@/components/services/recommended-strip";
import { CareersStrip } from "@/components/services/careers-strip";
import { AiRecommendations } from "@/components/sections/ai-recommendations";
import { Testimonials } from "@/components/sections/testimonials";

export default function Home() {
  return (
    <PageShell>
      <HomeHero />
      <AiRecommendations />
      <CategoryGrid />
      <FeaturedServices />
      <AmcPlans />
      <RecommendedStrip />
      <Testimonials />
      <CareersStrip />
    </PageShell>
  );
}
