import { PageShell } from "@/components/layout/page-shell";
import { AmcPlans } from "@/components/services/amc-plans";
import { CategoryGrid } from "@/components/services/category-grid";
import { FeaturedServices } from "@/components/services/featured-services";
import PremiumHero from "@/components/home/premium-hero";
import { RecommendedStrip } from "@/components/services/recommended-strip";
import { CareersStrip } from "@/components/services/careers-strip";
import { AiRecommendations } from "@/components/sections/ai-recommendations";
import { Testimonials } from "@/components/sections/testimonials";
import TrustSection from "@/components/home/trust-section";
import TestimonialsHome from "@/components/home/testimonials";

export default function Home() {
  return (
    <PageShell>
      <PremiumHero />
      <AiRecommendations />
      <CategoryGrid />
      <FeaturedServices />
      <TrustSection />
      <AmcPlans />
      <RecommendedStrip />
      <TestimonialsHome />
      <Testimonials />
      <CareersStrip />
    </PageShell>
  );
}
