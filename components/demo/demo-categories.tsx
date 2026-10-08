"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp, ArrowRight, Sparkles, CheckCircle2, ShieldCheck } from "lucide-react";
import { DEMO_CATEGORIES, DemoCategory, DemoSubCategory } from "./demo-data";

interface DemoCategoriesProps {
  onSelectSubcategory: (category: DemoCategory, subcategory: DemoSubCategory) => void;
  expandedCategoryId: string | null;
  setExpandedCategoryId: (id: string | null) => void;
}

export function DemoCategories({
  onSelectSubcategory,
  expandedCategoryId,
  setExpandedCategoryId,
}: DemoCategoriesProps) {
  const toggleCategory = (catId: string) => {
    setExpandedCategoryId(expandedCategoryId === catId ? null : catId);
  };

  return (
    <div id="categories-section" className="space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="text-xs font-bold text-blue-400 uppercase tracking-widest flex items-center gap-1.5 mb-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Complete Service Catalog ({DEMO_CATEGORIES.length} Core Domains)
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Explore All Categories & Subcategories
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-xl">
            Click any category to expand its full subcategory service lineup. Select any subcategory to preview the seamless customer booking & quotation workflow.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-3.5 py-1.5 rounded-full shrink-0">
          <ShieldCheck className="w-4 h-4" />
          <span>Interactive Investor Demo Mode</span>
        </div>
      </div>

      {/* Grid of Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
        {DEMO_CATEGORIES.map((category) => {
          const Icon = category.icon;
          const isExpanded = expandedCategoryId === category.id;

          return (
            <div
              key={category.id}
              className={`rounded-2xl transition-all duration-200 border ${
                isExpanded
                  ? "bg-slate-900 border-blue-500/60 shadow-xl shadow-blue-500/10 ring-1 ring-blue-500/30"
                  : "bg-slate-900/70 hover:bg-slate-900 border-slate-800 hover:border-slate-700"
              }`}
            >
              {/* Category Card Header */}
              <button
                type="button"
                onClick={() => toggleCategory(category.id)}
                className="w-full p-5 text-left flex items-start justify-between gap-4 select-none cursor-pointer"
              >
                <div className="flex items-start gap-4">
                  {/* Icon Container */}
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-md ${
                      isExpanded
                        ? "bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-blue-500/30"
                        : "bg-slate-800 border border-slate-700 text-blue-400"
                    }`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <h3 className="text-base font-bold text-white tracking-tight">
                        {category.name}
                      </h3>
                      <span className="text-[11px] px-2.5 py-0.5 rounded-full font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                        {category.subcategories.length} Subcategories
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      {category.description}
                    </p>
                  </div>
                </div>

                {/* Expand / Collapse Icon */}
                <div
                  className={`p-2 rounded-xl border transition-all shrink-0 ${
                    isExpanded
                      ? "bg-blue-600 text-white border-blue-500"
                      : "bg-slate-800/80 text-slate-400 border-slate-700 group-hover:text-white"
                  }`}
                >
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </button>

              {/* Subcategories Accordion Content */}
              {isExpanded && (
                <div className="px-5 pb-5 pt-2 border-t border-slate-800/80 space-y-2.5 animate-in fade-in duration-200">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Click any subcategory to demonstrate customer quotation flow:
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {category.subcategories.map((sub) => (
                      <div
                        key={sub.id}
                        onClick={() => onSelectSubcategory(category, sub)}
                        className="p-3 rounded-xl bg-slate-950/70 hover:bg-slate-800/90 border border-slate-800 hover:border-blue-500/50 cursor-pointer transition-all flex flex-col justify-between group/sub shadow-sm"
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <span className="text-xs font-bold text-white group-hover/sub:text-blue-400 transition-colors">
                              {sub.name}
                            </span>
                            {sub.badge && (
                              <span
                                className={`text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded shrink-0 ${
                                  sub.badge === "100% Free"
                                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                    : "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                                }`}
                              >
                                {sub.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                            {sub.description}
                          </p>
                        </div>

                        <div className="mt-2.5 pt-2 border-t border-slate-900 flex items-center justify-between text-[11px]">
                          {sub.startingPrice ? (
                            <span className="font-semibold text-slate-300">
                              From <strong className="text-white">{sub.startingPrice}</strong>
                            </span>
                          ) : (
                            <span className="text-slate-500">Itemized Quote</span>
                          )}
                          <span className="font-bold text-blue-400 flex items-center gap-1 group-hover/sub:translate-x-1 transition-transform">
                            Select Flow →
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
