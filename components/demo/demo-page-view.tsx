"use client";

import React, { useState } from "react";
import { DemoHeader } from "./demo-header";
import { DemoHero } from "./demo-hero";
import { DemoSlider } from "./demo-slider";
import { DemoCategories } from "./demo-categories";
import { DemoFreeSiteVisit } from "./demo-free-site-visit";
import { DemoQuotationStepper } from "./demo-quotation-stepper";
import { DemoTestimonials } from "./demo-testimonials";
import { DemoFooter } from "./demo-footer";
import { DemoFlowModal } from "./demo-flow-modal";
import { DEMO_CATEGORIES, DemoCategory, DemoSubCategory } from "./demo-data";

export function DemoPageView() {
  const [expandedCategoryId, setExpandedCategoryId] = useState<string | null>("cctv");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<DemoCategory | null>(DEMO_CATEGORIES[0]);
  const [selectedSubcategory, setSelectedSubcategory] = useState<DemoSubCategory | null>(
    DEMO_CATEGORIES[0].subcategories[0]
  );
  const [initialFreeSiteVisit, setInitialFreeSiteVisit] = useState(false);

  // Handle clicking a subcategory
  const handleSelectSubcategory = (category: DemoCategory, subcategory: DemoSubCategory) => {
    setSelectedCategory(category);
    setSelectedSubcategory(subcategory);
    setInitialFreeSiteVisit(subcategory.slug === "free-site-survey");
    setModalOpen(true);
  };

  // Handle Free Site Visit CTA click
  const handleBookFreeVisit = () => {
    const cctvCat = DEMO_CATEGORIES.find((c) => c.id === "cctv") || DEMO_CATEGORIES[0];
    const freeSurveySub = cctvCat.subcategories.find((s) => s.slug === "free-site-survey") || cctvCat.subcategories[0];
    setSelectedCategory(cctvCat);
    setSelectedSubcategory(freeSurveySub);
    setInitialFreeSiteVisit(true);
    setModalOpen(true);
  };

  // Handle slider actions
  const handleSliderAction = (targetCategoryId: string, isFreeVisit = false) => {
    if (isFreeVisit) {
      handleBookFreeVisit();
      return;
    }
    const cat = DEMO_CATEGORIES.find((c) => c.id === targetCategoryId) || DEMO_CATEGORIES[0];
    setExpandedCategoryId(cat.id);
    const element = document.getElementById("categories-section");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Scroll to categories
  const handleScrollToCategories = () => {
    const element = document.getElementById("categories-section");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-blue-600 selection:text-white">
      {/* Demo Sticky Navigation Header */}
      <DemoHeader
        onBookFreeVisit={handleBookFreeVisit}
        onScrollToCategories={handleScrollToCategories}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 sm:space-y-20 py-4 pb-20">
        {/* 1. HERO SECTION */}
        <section>
          <DemoHero
            onExploreCategories={handleScrollToCategories}
            onBookFreeVisit={handleBookFreeVisit}
          />
        </section>

        {/* 2. SLIDING BANNERS / ADS */}
        <section>
          <DemoSlider onSelectAction={handleSliderAction} />
        </section>

        {/* 3 & 4. MAIN CATEGORIES & SUBCATEGORIES ACCORDION */}
        <section id="categories-section">
          <DemoCategories
            onSelectSubcategory={handleSelectSubcategory}
            expandedCategoryId={expandedCategoryId}
            setExpandedCategoryId={setExpandedCategoryId}
          />
        </section>

        {/* 8. FREE SITE VISIT PROMINENT SECTION */}
        <section id="free-site-visit-section">
          <DemoFreeSiteVisit onBookFreeVisit={handleBookFreeVisit} />
        </section>

        {/* 6. QUOTATION FLOW ARCHITECTURE STEPPER */}
        <section id="quotation-flow-section">
          <DemoQuotationStepper onStartFlow={handleBookFreeVisit} />
        </section>

        {/* 7. TESTIMONIALS */}
        <section id="testimonials-section">
          <DemoTestimonials />
        </section>
      </main>

      {/* Demo Footer with official phone & coverage */}
      <DemoFooter />

      {/* Interactive Subcategory -> Login Mockup -> Lead Form Mockup -> Quotation Modal */}
      <DemoFlowModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        selectedCategory={selectedCategory}
        selectedSubcategory={selectedSubcategory}
        initialFreeSiteVisit={initialFreeSiteVisit}
      />
    </div>
  );
}
