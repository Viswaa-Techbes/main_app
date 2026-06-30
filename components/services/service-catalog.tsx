"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, Star, Clock, ArrowRight } from "lucide-react";
import { ReactNode, useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MarketplaceService } from "@/lib/marketplace-data";
import { fetchCategories, fetchAllSubcategories, CatalogCategory, CatalogSubCategory } from "@/lib/catalog-api";
import { managedServiceToMarketplaceService } from "@/lib/cctv-api";
import { Spinner } from "@/components/ui/spinner";

type SortOption = "popular" | "price-low" | "top-rated";

export function ServiceCatalog() {
  const searchParams = useSearchParams();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "all");
  const [minRating, setMinRating] = useState(0);
  const [maxPrice, setMaxPrice] = useState(30000);
  const [durationFilter, setDurationFilter] = useState("all");
  const [sortBy, setSortBy] = useState<SortOption>("popular");
  const [showFilters, setShowFilters] = useState(false);

  // Dynamic Catalog State
  const [dbCategories, setDbCategories] = useState<CatalogCategory[]>([]);
  const [dbSubcategories, setDbSubcategories] = useState<CatalogSubCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCatalog() {
      try {
        const [cats, subs] = await Promise.all([
          fetchCategories(),
          fetchAllSubcategories(),
        ]);
        setDbCategories(cats);
        setDbSubcategories(subs);
      } catch (err) {
        console.error("Failed to load dynamic catalog", err);
      } finally {
        setLoading(false);
      }
    }
    loadCatalog();
  }, []);

  // Map backend subcategories to frontend marketplace service shape
  const dynamicServices = dbSubcategories.map((sub, index) => {
    let categoryName = "Other";
    let categorySlug = "other";

    if (typeof sub.categoryId === "object" && sub.categoryId !== null) {
      categoryName = (sub.categoryId as any).name || "Other";
      categorySlug = (sub.categoryId as any).slug || "other";
    } else if (typeof sub.categoryId === "string") {
      const foundCat = dbCategories.find(c => c._id === sub.categoryId || c.slug === sub.categoryId);
      if (foundCat) {
        categoryName = foundCat.name;
        categorySlug = foundCat.slug;
      }
    }

    return managedServiceToMarketplaceService({
      ...sub,
      categoryId: {
        _id: typeof sub.categoryId === "object" ? (sub.categoryId as any)._id : sub.categoryId,
        name: categoryName,
        slug: categorySlug,
        description: "",
      }
    } as any, index);
  });

  let filteredServices = dynamicServices.filter((service) => {
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
    <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Search and Hero Card */}
      <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm sm:p-8">
        <div className="inline-flex items-center gap-1 bg-blue-50 px-3 py-1 rounded-full text-[10px] font-bold text-blue-700 uppercase tracking-wider">
          Marketplace
        </div>
        <div className="mt-4 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-xl">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight sm:text-3xl">Professional IT Services</h1>
            <p className="mt-2 text-xs leading-relaxed text-slate-500">
              Filter by category, budget, duration, and ratings to find the right certified technician.
            </p>
          </div>
          <div className="flex w-full flex-col gap-2.5 sm:flex-row lg:w-auto lg:min-w-[24rem]">
            <div className="relative w-full flex-1">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="h-11 rounded-xl pl-10 text-xs border-slate-200 focus:ring-blue-500/20 bg-slate-50"
                placeholder="Search services..."
              />
            </div>
            <Button variant="outline" className="rounded-xl lg:hidden h-11 text-xs font-semibold" onClick={() => setShowFilters((current) => !current)}>
              <SlidersHorizontal className="h-4 w-4 mr-1.5" />
              Filters
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-6 lg:flex-row lg:items-start">
        {/* Filters Sidebar */}
        <aside className={`${showFilters ? "block" : "hidden"} w-full lg:block lg:w-72 shrink-0`}>
          <div className="sticky top-28 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider">Filters</h2>
              <button
                className="text-xs font-bold text-blue-600 hover:text-blue-800 transition"
                onClick={() => {
                  setSelectedCategory("all");
                  setMinRating(0);
                  setMaxPrice(30000);
                  setDurationFilter("all");
                }}
              >
                Reset All
              </button>
            </div>

            <FilterGroup label="Category">
              <div className="flex flex-col gap-1">
                {["all", ...dbCategories.map((category) => category.slug)].map((categoryId) => {
                  const label =
                    categoryId === "all"
                      ? "All Services"
                      : dbCategories.find((category) => category.slug === categoryId)?.name ?? categoryId;
                  const isSelected = selectedCategory === categoryId;
                  return (
                    <button
                      key={categoryId}
                      onClick={() => setSelectedCategory(categoryId)}
                      className={`w-full rounded-xl px-3 py-2 text-left text-xs font-semibold transition ${
                        isSelected
                          ? "bg-blue-600 text-white shadow-sm"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </FilterGroup>

            <FilterGroup label="Price Range">
              <input
                type="range"
                min={499}
                max={30000}
                step={500}
                value={maxPrice}
                onChange={(event) => setMaxPrice(Number(event.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
              <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold mt-1">
                <span>Rs. 499</span>
                <span className="text-slate-800">Up to Rs. {maxPrice.toLocaleString("en-IN")}</span>
              </div>
            </FilterGroup>

            <FilterGroup label="Rating">
              <div className="flex flex-col gap-1">
                {[0, 4, 4.5, 4.8].map((rating) => (
                  <button
                    key={rating}
                    onClick={() => setMinRating(rating)}
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold transition ${
                      minRating === rating
                        ? "bg-blue-50 text-blue-700"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    <span>{rating === 0 ? "Any Rating" : `${rating}+ Stars`}</span>
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  </button>
                ))}
              </div>
            </FilterGroup>

            <FilterGroup label="Service Duration">
              <div className="flex flex-col gap-1">
                {[
                  { value: "all", label: "Any Duration" },
                  { value: "short", label: "Quick Fix (Up to 3 hrs)" },
                  { value: "medium", label: "Standard (3 to 6 hrs)" },
                  { value: "long", label: "Complex (6+ hrs)" },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setDurationFilter(option.value)}
                    className={`w-full rounded-xl px-3 py-2 text-left text-xs font-semibold transition ${
                      durationFilter === option.value
                        ? "bg-blue-50 text-blue-700"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </FilterGroup>
          </div>
        </aside>

        {/* Catalog Grid */}
        <div className="min-w-0 flex-1">
          <div className="mb-4 flex items-center justify-between rounded-2xl border border-slate-100 bg-white px-5 py-3 shadow-sm">
            <p className="text-xs text-slate-500 font-semibold">
              Showing <span className="text-slate-800 font-bold">{filteredServices.length}</span> services
            </p>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-semibold">Sort:</span>
              <select
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value as SortOption)}
                className="h-8 rounded-xl border border-slate-200 bg-white px-2.5 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="popular">Popularity</option>
                <option value="price-low">Price: Low to High</option>
                <option value="top-rated">Top Rated</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="flex h-64 items-center justify-center">
              <Spinner className="h-8 w-8 text-blue-600" />
            </div>
          ) : filteredServices.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              {filteredServices.map((service) => (
                <CatalogCard key={service.slug} service={service} selectedCategory={selectedCategory} />
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-slate-200 bg-white px-8 py-16 text-center">
              <h3 className="text-base font-bold text-slate-800">No Services Found</h3>
              <p className="mt-2 text-xs text-slate-400">Try adjusting your pricing or rating filter.</p>
              <Button
                className="mt-4 rounded-xl text-xs font-bold"
                variant="outline"
                onClick={() => {
                  setSearch("");
                  setSelectedCategory("all");
                  setMinRating(0);
                  setMaxPrice(30000);
                  setDurationFilter("all");
                }}
              >
                Clear Filters
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
    <div className="space-y-2">
      <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</h3>
      {children}
    </div>
  );
}

function CatalogCard({ service, selectedCategory }: { service: MarketplaceService; selectedCategory?: string }) {
  const [imgSrc, setImgSrc] = useState(service.image || "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=80");

  useEffect(() => {
    setImgSrc(service.image || "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=80");
  }, [service.image]);

  return (
    <Link
      href={`/services/${service.slug}${selectedCategory && selectedCategory !== 'all' ? `?category=${selectedCategory}` : ''}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm hover:shadow-md hover:border-blue-100 transition-all duration-300"
    >
      <div className="relative h-40 w-full overflow-hidden bg-slate-50">
        <Image
          src={imgSrc}
          alt={service.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-103"
          onError={() => setImgSrc("https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=80")}
          loading="lazy"
        />
        {service.badge && (
          <span className="absolute left-3 top-3 rounded-full bg-slate-900/90 backdrop-blur-sm px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white">
            {service.badge}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-center justify-between gap-3">
          <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-[9px] font-bold text-blue-600 uppercase tracking-wider">{service.category}</span>
          <span className="text-xs font-extrabold text-slate-800">{service.price}</span>
        </div>

        <div className="mt-2.5 flex-1">
          <h3 className="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-1">{service.title}</h3>
        </div>

        <div className="mt-3 pt-2.5 border-t border-slate-50 flex items-center justify-between text-[10px] text-slate-400 font-semibold">
          <span className="inline-flex items-center gap-1">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            <span className="text-slate-700">{service.rating}</span> ({service.reviewCount})
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5 text-slate-300" />
            {service.duration}
          </span>
        </div>

        <div className="mt-3.5 flex items-center justify-between h-8.5 w-full rounded-lg bg-blue-600 text-white text-[11px] font-bold shadow-sm group-hover:bg-blue-700 transition duration-150 pl-3.5 pr-2.5">
          <span>Book Now</span>
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </div>
      </div>
    </Link>
  );
}
