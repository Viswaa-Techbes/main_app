"use client";

import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight, ShieldCheck, CheckCircle2 } from "lucide-react";
import { DEMO_PROMO_SLIDES } from "./demo-data";

interface DemoSliderProps {
  onSelectAction: (targetCategory: string, isFreeVisit?: boolean) => void;
}

export function DemoSlider({ onSelectAction }: DemoSliderProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % DEMO_PROMO_SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isPaused]);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? DEMO_PROMO_SLIDES.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % DEMO_PROMO_SLIDES.length);
  };

  const slide = DEMO_PROMO_SLIDES[currentSlide];

  return (
    <div
      className="relative overflow-hidden rounded-3xl bg-slate-950 border border-slate-800/80 shadow-2xl group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Image with Dark Gradient Overlay */}
      <div className="relative h-[340px] sm:h-[380px] lg:h-[420px] w-full overflow-hidden">
        <img
          src={slide.image}
          alt={slide.title}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className={`absolute inset-0 bg-gradient-to-r ${slide.gradient}`} />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-transparent via-black/40 to-black/80" />

        {/* Content Box */}
        <div className="absolute inset-0 flex flex-col justify-between p-6 sm:p-10 lg:p-12 z-10 max-w-2xl">
          {/* Top Tag & Badge */}
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full text-[11px] font-extrabold tracking-wider uppercase bg-blue-500/20 text-blue-300 border border-blue-400/30 backdrop-blur-md flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-blue-400" />
              {slide.tag}
            </span>
            <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 backdrop-blur-md">
              {slide.badge}
            </span>
          </div>

          {/* Headline & Description */}
          <div className="space-y-3">
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
              {slide.headline}
            </h3>
            <p className="text-sm sm:text-base text-slate-300 line-clamp-2 sm:line-clamp-3 leading-relaxed">
              {slide.description}
            </p>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 pt-1">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{slide.highlight}</span>
            </div>
          </div>

          {/* CTA Button */}
          <div className="pt-2 flex items-center gap-4">
            <button
              onClick={() => onSelectAction(slide.targetCategory, slide.id === 4)}
              className="py-3 px-6 rounded-xl font-bold text-sm bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-600/30 transition-all transform hover:-translate-y-0.5 flex items-center gap-2.5"
            >
              <span>{slide.ctaText}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          aria-label="Previous slide"
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-slate-900/60 hover:bg-slate-900 text-white border border-slate-700/60 flex items-center justify-center backdrop-blur-md transition opacity-80 group-hover:opacity-100"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={nextSlide}
          aria-label="Next slide"
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-slate-900/60 hover:bg-slate-900 text-white border border-slate-700/60 flex items-center justify-center backdrop-blur-md transition opacity-80 group-hover:opacity-100"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Pagination Dots */}
        <div className="absolute bottom-4 right-6 sm:right-10 z-20 flex items-center gap-2">
          {DEMO_PROMO_SLIDES.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => setCurrentSlide(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-2 rounded-full transition-all ${
                currentSlide === idx ? "w-8 bg-blue-500 shadow-md shadow-blue-500/50" : "w-2 bg-slate-600 hover:bg-slate-400"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
