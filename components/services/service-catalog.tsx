"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, Star, Clock, ArrowRight, Camera, Network, Laptop, Monitor, Server, Zap, Home, Globe, Key, Shield, Settings, CheckCircle2, Rocket } from "lucide-react";
import { ReactNode, useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MarketplaceService } from "@/lib/marketplace-data";
import { fetchCategories, fetchAllSubcategories, fetchSubcategories, CatalogCategory, CatalogSubCategory } from "@/lib/catalog-api";
import { managedServiceToMarketplaceService, normalizeCategoryId } from "@/lib/cctv-api";
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

  const categoriesToUse = dbCategories.length > 0 ? dbCategories : [
    { _id: "cctv", name: "CCTV", slug: "cctv", description: "", icon: "Camera", image: "", color: "", gradient: "", isActive: true, sortOrder: 1 },
    { _id: "networking", name: "Networking", slug: "networking", description: "", icon: "Network", image: "", color: "", gradient: "", isActive: true, sortOrder: 2 },
    { _id: "laptop", name: "Laptop", slug: "laptop", description: "", icon: "Laptop", image: "", color: "", gradient: "", isActive: true, sortOrder: 3 },
    { _id: "desktop", name: "Desktop", slug: "desktop", description: "", icon: "Monitor", image: "", color: "", gradient: "", isActive: true, sortOrder: 4 },
    { _id: "server", name: "Server", slug: "server", description: "", icon: "Server", image: "", color: "", gradient: "", isActive: true, sortOrder: 5 },
    { _id: "electronic-contracts", name: "Electronic Contracts", slug: "electronic-contracts", description: "", icon: "Zap", image: "", color: "", gradient: "", isActive: true, sortOrder: 6 },
    { _id: "home-automation", name: "Home Automation", slug: "home-automation", description: "", icon: "Home", image: "", color: "", gradient: "", isActive: true, sortOrder: 7 },
    { _id: "website-development", name: "Website Development", slug: "website-development", description: "", icon: "Globe", image: "", color: "", gradient: "", isActive: true, sortOrder: 8 },
    { _id: "software-licensing", name: "Software Licensing", slug: "software-licensing", description: "", icon: "Key", image: "", color: "", gradient: "", isActive: true, sortOrder: 9 },
    { _id: "cyber-security", name: "Cyber Security", slug: "cyber-security", description: "", icon: "Shield", image: "", color: "", gradient: "", isActive: true, sortOrder: 10 },
  ];

  // Load categories list on mount
  useEffect(() => {
    async function loadCats() {
      try {
        const cats = await fetchCategories();
        if (cats && cats.length > 0) {
          setDbCategories(cats);
        }
      } catch (err) {
        console.error("Failed to load categories", err);
      }
    }
    loadCats();
  }, []);

  // Load subcategories dynamically based on selectedCategory selection
  useEffect(() => {
    async function loadSubs() {
      setLoading(true);
      try {
        if (selectedCategory === "all") {
          const subs = await fetchAllSubcategories();
          setDbSubcategories(subs);
        } else {
          const subs = await fetchSubcategories(selectedCategory);
          setDbSubcategories(subs);
        }
      } catch (err) {
        console.error("Failed to load subcategories for category:", selectedCategory, err);
        setDbSubcategories([]);
      } finally {
        setLoading(false);
      }
    }
    loadSubs();
  }, [selectedCategory]);


  // Map backend subcategories to frontend marketplace service shape
  const dynamicServices = dbSubcategories.map((sub, index) => {
    let categoryName = "Other";
    let categorySlug = "other";

    if (typeof sub.categoryId === "object" && sub.categoryId !== null) {
      categoryName = (sub.categoryId as any).name || "Other";
      categorySlug = (sub.categoryId as any).slug || "other";
    } else if (typeof sub.categoryId === "string") {
      const foundCat = categoriesToUse.find(c => c._id === sub.categoryId || c.slug === sub.categoryId);
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

  const servicesToUse = dynamicServices;

  let filteredServices = servicesToUse.filter((service) => {
    const matchesSearch =
      search.length === 0 ||
      service.title.toLowerCase().includes(search.toLowerCase()) ||
      service.category.toLowerCase().includes(search.toLowerCase()) ||
      service.tagline.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" ||
      service.categoryId === selectedCategory ||
      normalizeCategoryId(service.categoryId) === normalizeCategoryId(selectedCategory);
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
                {["all", ...categoriesToUse.map((category) => category.slug)].map((categoryId) => {
                  const label =
                    categoryId === "all"
                      ? "All Services"
                      : categoriesToUse.find((category) => category.slug === categoryId)?.name ?? categoryId;
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
          {selectedCategory !== "all" && !["cctv", "networking", "laptop", "desktop", "electrical", "home-automation"].includes(selectedCategory) ? (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-slate-100 bg-white px-8 py-20 text-center shadow-sm">
              <div className="rounded-full bg-blue-50 p-6 mb-6">
                <Rocket className="h-10 w-10 text-blue-600" />
              </div>
              <h2 className="text-xl font-extrabold text-slate-900">Launching Soon</h2>
              <p className="mt-3 max-w-sm text-sm text-slate-500">
                We're currently preparing services for this category. They'll be available very soon.
              </p>
              <Button 
                className="mt-8 rounded-xl font-bold"
                onClick={() => setSelectedCategory("all")}
              >
                Browse Other Services
              </Button>
            </div>
          ) : (
            <>
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
          ) : dbSubcategories.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-200 bg-white px-8 py-16 text-center">
              <h3 className="text-base font-bold text-slate-800">No services available under this category</h3>
              <p className="mt-2 text-xs text-slate-400">Please check back later or choose another category.</p>
            </div>
          ) : filteredServices.length > 0 ? (
            <div className="grid gap-4 grid-cols-2 md:grid-cols-3 xl:grid-cols-5">
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
            </>
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

const categoryIcons: Record<string, any> = {
  cctv: Camera,
  networking: Network,
  laptop: Laptop,
  desktop: Monitor,
  server: Server,
  "electronic-contracts": Zap,
  "home-automation": Home,
  "website-development": Globe,
  "software-licensing": Key,
  "cyber-security": Shield,
};

function CatalogCard({ service, selectedCategory, isActive = false }: { service: MarketplaceService; selectedCategory?: string, isActive?: boolean }) {
  const Icon = categoryIcons[service.categoryId] || Settings;

  return (
    <Link
      href={`/services/${service.slug}${selectedCategory && selectedCategory !== 'all' ? `?category=${selectedCategory}` : ''}`}
      className={`group relative flex flex-col items-center text-center p-4 rounded-[18px] border transition-all duration-300 ease-out hover:-translate-y-[6px] ${
        isActive 
          ? "border-blue-600 bg-blue-50 shadow-[0_4px_12px_rgba(15,23,42,0.06)]" 
          : "border-slate-200 bg-white shadow-[0_4px_12px_rgba(15,23,42,0.06)] hover:border-blue-600 hover:shadow-[0_14px_30px_rgba(37,99,235,0.18)]"
      }`}
    >
      {/* Background glow on hover */}
      <div className="absolute inset-0 rounded-[18px] opacity-0 group-hover:opacity-100 bg-[radial-gradient(ellipse_at_center,rgba(37,99,235,0.08),transparent_60%)] pointer-events-none transition-opacity duration-300" />
      
      {/* Active Indicator */}
      {isActive && (
        <div className="absolute top-3 right-3 h-5 w-5 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-sm">
          <CheckCircle2 className="h-3 w-3" />
        </div>
      )}

      {/* Icon Container */}
      <div className="relative z-10 rounded-full bg-blue-50 text-blue-600 p-3.5 transition-transform duration-300 group-hover:scale-[1.08] shadow-sm">
        <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 bg-blue-400/20 blur-md transition-opacity duration-300" />
        <Icon className="relative z-10 h-6 w-6" />
      </div>

      <h3 className="relative z-10 mt-3 text-[13px] font-[700] text-slate-900 transition-colors truncate w-full">{service.title}</h3>
      <p className="relative z-10 mt-1 text-[10px] leading-relaxed text-slate-600 font-medium line-clamp-2 h-7">{service.tagline || service.description}</p>
    </Link>
  );
}
