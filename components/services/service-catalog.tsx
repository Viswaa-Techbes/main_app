"use client";

import Image from "next/image";
import ImageWithFade from "@/components/ui/image-fade";
import Link from "@/components/ui/link";
import { Search, SlidersHorizontal, Star } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { categories, MarketplaceService, services } from "@/lib/marketplace-data";

type SortOption = "popular" | "price-low" | "top-rated";

export function ServiceCatalog() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");
  
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(categoryParam || "all");
  const [minRating, setMinRating] = useState(0);
  const [maxPrice, setMaxPrice] = useState(30000);
  const [durationFilter, setDurationFilter] = useState("all");
  const [sortBy, setSortBy] = useState<SortOption>("popular");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [categoryParam]);

  let filteredServices = services.filter((service) => {
    const matchesSearch =
      search.length === 0 ||
      service.title.toLowerCase().includes(search.toLowerCase()) ||
      service.category.toLowerCase().includes(search.toLowerCase()) ||
      service.tagline.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === "all" || service.categoryId === selectedCategory;
    const matchesRating = service.rating >= minRating;
    const matchesPrice = service.priceValue <= maxPrice;
    const matchesDuration =
      durationFilter === "all" ||
      (durationFilter === "short" && service.durationMinutes > 0 && service.durationMinutes <= 180) ||
      (durationFilter === "medium" && service.durationMinutes > 180 && service.durationMinutes <= 360) ||
      (durationFilter === "long" && service.durationMinutes > 360);

    return matchesSearch && matchesCategory && matchesRating && matchesPrice && matchesDuration;
  });

  if (sortBy === "popular") filteredServices = [...filteredServices].sort((a, b) => b.reviewCount - a.reviewCount);
  if (sortBy === "price-low") filteredServices = [...filteredServices].sort((a, b) => a.priceValue - b.priceValue);
  if (sortBy === "top-rated") filteredServices = [...filteredServices].sort((a, b) => b.rating - a.rating);

  return (
    <section className="mx-auto w-full max-w-screen-xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <div className="rounded-2xl border border-border bg-card p-6 shadow-lg sm:p-8 lg:p-10">
        <div className="inline-flex items-center gap-3 rounded-full bg-muted px-4 py-1.5 text-sm font-semibold text-muted-foreground">
          <span className="text-sm font-semibold text-primary">Service marketplace</span>
        </div>
        <div className="mt-4 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-semibold text-foreground">Browse IT services with richer filters and faster decisions</h1>
            <p className="mt-3 max-w-3xl text-muted-foreground">
              Filter by category, budget, duration, and quality signals to find the right service quickly.
            </p>
          </div>
          <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto lg:min-w-[28rem] lg:max-w-xl">
            <div className="relative w-full flex-1">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="h-12 rounded-full pl-11"
                placeholder="Search services"
              />
            </div>
            <Button variant="outline" className="rounded-full lg:hidden" onClick={() => setShowFilters((current) => !current)}>
              <SlidersHorizontal className="h-4 w-4" />
              Filters
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-8 lg:flex-row lg:items-start">
        <aside className={`${showFilters ? "block" : "hidden"} w-full lg:block lg:w-80 lg:shrink-0 xl:w-84`}>
          <div className="sticky top-24 rounded-2xl border border-border bg-card p-6 shadow-md">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">Filters</h2>
              <button
                className="text-sm font-medium text-primary"
                onClick={() => {
                  setSelectedCategory("all");
                  setMinRating(0);
                  setMaxPrice(30000);
                  setDurationFilter("all");
                }}
              >
                Reset
              </button>
            </div>

            <FilterGroup label="Category">
              {["all", ...categories.map((category) => category.id)].map((categoryId) => {
                const label =
                  categoryId === "all"
                    ? "All services"
                    : categories.find((category) => category.id === categoryId)?.title ?? categoryId;
                return (
                  <button
                    key={categoryId}
                    onClick={() => setSelectedCategory(categoryId)}
                    className={`w-full rounded-2xl px-4 py-3 text-left text-sm font-medium transition ${
                      selectedCategory === categoryId
                        ? "bg-primary/10 text-primary border border-primary/20"
                        : "bg-muted text-muted-foreground hover:bg-primary/5"
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </FilterGroup>

            <FilterGroup label="Price range">
              <input
                type="range"
                min={499}
                max={30000}
                step={500}
                value={maxPrice}
                onChange={(event) => setMaxPrice(Number(event.target.value))}
                className="w-full accent-emerald-600"
              />
              <div className="flex items-center justify-between text-sm text-slate-500">
                <span>Rs. 499</span>
                <span className="font-semibold text-slate-950">Up to Rs. {maxPrice.toLocaleString("en-IN")}</span>
              </div>
            </FilterGroup>

            <FilterGroup label="Minimum rating">
              {[0, 4, 4.5, 4.8].map((rating) => (
                <button
                  key={rating}
                  onClick={() => setMinRating(rating)}
                  className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 text-sm font-medium transition ${
                    minRating === rating
                      ? "bg-primary/10 text-primary"
                      : "bg-muted text-muted-foreground hover:bg-primary/5 hover:text-primary"
                  }`}
                >
                  <span>{rating === 0 ? "Any rating" : `${rating}+ stars`}</span>
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                </button>
              ))}
            </FilterGroup>

            <FilterGroup label="Duration">
              {[
                { value: "all", label: "Any duration" },
                { value: "short", label: "Up to 3 hrs" },
                { value: "medium", label: "3 to 6 hrs" },
                { value: "long", label: "Long projects" },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setDurationFilter(option.value)}
                  className={`w-full rounded-2xl px-4 py-3 text-left text-sm font-medium transition ${
                    durationFilter === option.value
                      ? "bg-primary/10 text-primary"
                      : "bg-muted text-muted-foreground hover:bg-primary/5 hover:text-primary"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </FilterGroup>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <div className="mb-5 flex flex-col gap-3 rounded-2xl border border-border bg-card p-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
              Showing <span className="font-semibold text-foreground">{filteredServices.length}</span> services
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm text-slate-500">Sort by</span>
              <select
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value as SortOption)}
                className="h-11 rounded-full border border-border bg-card px-4 text-sm font-medium text-muted-foreground"
              >
                <option value="popular">Most Popular</option>
                <option value="price-low">Price Low to High</option>
                <option value="top-rated">Top Rated</option>
              </select>
            </div>
          </div>

          {filteredServices.length > 0 ? (
            <>
              {/* Mobile horizontal snap list */}
              <div className="sm:hidden -mx-4 pl-4">
                <div className="flex gap-4 overflow-x-auto snap-scroll snap-x py-2">
                  {filteredServices.map((service) => (
                    <div key={service.slug} className="snap-center min-w-[80%] sm:min-w-[45%]">
                      <CatalogCard service={service} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Desktop / Tablet grid */}
              <div className="hidden sm:grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredServices.map((service) => (
                  <CatalogCard key={service.slug} service={service} />
                ))}
              </div>
            </>
          ) : (
            <div className="rounded-2xl border border-dashed border-border bg-card px-8 py-16 text-center">
              <h3 className="text-2xl font-semibold text-foreground">No results found</h3>
              <p className="mt-3 text-muted-foreground">Try broadening your price, rating, or duration filters to see more matches.</p>
              <Button
                className="mt-6 rounded-full"
                variant="outline"
                onClick={() => {
                  setSearch("");
                  setSelectedCategory("all");
                  setMinRating(0);
                  setMaxPrice(30000);
                  setDurationFilter("all");
                }}
              >
                Clear filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function FilterGroup({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="mt-7">
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">{label}</h3>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function CatalogCard({ service }: { service: MarketplaceService }) {
  return (
    <Link href={`/services/${service.slug}`} className="group block">
      <article className="group relative overflow-hidden rounded-2xl border border-border bg-card shadow-lg transition-transform duration-300 hover:-translate-y-2">
        <div className="relative h-60 overflow-hidden rounded-t-2xl">
          <ImageWithFade src={service.image} alt={service.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
          {service.badge && (
            <span className="absolute left-4 top-4 rounded-full bg-[var(--primary)] px-3 py-1 text-xs font-semibold text-white shadow-md">{service.badge}</span>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent mix-blend-multiply" />
        </div>
        <div className="space-y-4 p-6">
          <div className="flex items-center justify-between gap-3">
            <span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">{service.category}</span>
            <span className="text-sm font-semibold text-foreground">{service.price}</span>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-foreground transition group-hover:text-primary">{service.title}</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{service.tagline}</p>
          </div>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              {service.rating} ({service.reviewCount})
            </span>
            <span>{service.duration}</span>
          </div>
          <div className="mt-2">
            <Button size="sm" variant="premium" className="w-full rounded-full">Book Now</Button>
          </div>
        </div>
      </article>
    </Link>
  );
}
