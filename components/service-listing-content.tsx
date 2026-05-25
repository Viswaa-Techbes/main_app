"use client";

import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Star, Clock, Filter, ChevronDown, Search, X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { categories, services, type Service } from "@/lib/services-data";

type SortOption = "popular" | "rating" | "price-low" | "price-high";

export function ServiceListingContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "all";
  
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState<SortOption>("popular");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const filteredServices = useMemo(() => {
    let result = [...services];

    // Filter by category
    if (selectedCategory !== "all") {
      result = result.filter((s) => s.categoryId === selectedCategory);
    }

    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (s) =>
          s.title.toLowerCase().includes(query) ||
          s.category.toLowerCase().includes(query) ||
          s.description.toLowerCase().includes(query)
      );
    }

    // Sort
    switch (sortBy) {
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "price-low":
        result.sort((a, b) => a.priceValue - b.priceValue);
        break;
      case "price-high":
        result.sort((a, b) => b.priceValue - a.priceValue);
        break;
      default:
        // Popular - sort by reviews count
        result.sort((a, b) => {
          const aReviews = parseFloat(a.reviews.replace("K", "")) * (a.reviews.includes("K") ? 1000 : 1);
          const bReviews = parseFloat(b.reviews.replace("K", "")) * (b.reviews.includes("K") ? 1000 : 1);
          return bReviews - aReviews;
        });
    }

    return result;
  }, [selectedCategory, sortBy, searchQuery]);

  return (
    <div className="py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            Our Services
          </h1>
          <p className="mt-2 text-muted-foreground">
            Professional IT services delivered by verified experts
          </p>
        </div>

        {/* Search & Filters Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-11 rounded-full bg-card"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <X className="w-4 h-4 text-muted-foreground hover:text-foreground" />
              </button>
            )}
          </div>

          {/* Sort & Filter */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="md:hidden gap-2"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="w-4 h-4" />
              Filters
            </Button>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="h-11 px-4 pr-10 rounded-full border border-border bg-card text-foreground text-sm appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="popular">Most Popular</option>
                <option value="rating">Highest Rated</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Sidebar - Categories */}
          <aside className={`${showFilters ? "block" : "hidden"} md:block w-full md:w-64 shrink-0`}>
            <div className="bg-card rounded-2xl border border-border p-5 sticky top-24">
              <h3 className="font-semibold text-foreground mb-4">Categories</h3>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => setSelectedCategory("all")}
                  className={`text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    selectedCategory === "all"
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground hover:bg-secondary"
                  }`}
                >
                  All Services
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-between ${
                      selectedCategory === cat.id
                        ? "bg-primary text-primary-foreground"
                        : "text-foreground hover:bg-secondary"
                    }`}
                  >
                    <span>{cat.title}</span>
                    <span className={`text-xs ${selectedCategory === cat.id ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                      {services.filter(s => s.categoryId === cat.id).length}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Services Grid */}
          <div className="flex-1">
            {/* Results Count */}
            <div className="mb-6 flex items-center justify-between">
              <p className="text-muted-foreground">
                Showing <span className="font-medium text-foreground">{filteredServices.length}</span> services
              </p>
              {selectedCategory !== "all" && (
                <button
                  onClick={() => setSelectedCategory("all")}
                  className="text-sm text-primary hover:underline flex items-center gap-1"
                >
                  Clear filter <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {filteredServices.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredServices.map((service) => (
                  <ServiceCard key={service.id} service={service} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-muted-foreground">No services found matching your criteria.</p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("all");
                  }}
                >
                  Clear all filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ServiceCard({ service }: { service: Service }) {
  return (
    <Link href={`/services/${service.slug}`}>
      <div className="group bg-card rounded-2xl overflow-hidden border border-border hover:border-primary/30 hover:shadow-xl transition-all duration-300 h-full flex flex-col">
        {/* Image */}
        <div className="relative h-44 overflow-hidden">
          <Image
            src={service.image}
            alt={service.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {service.badge && (
            <span className="absolute top-3 left-3 px-3 py-1 bg-accent text-accent-foreground text-xs font-semibold rounded-full">
              {service.badge}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-1">
          {/* Category */}
          <span className="text-xs font-medium text-primary uppercase tracking-wide">
            {service.category}
          </span>

          {/* Title */}
          <h3 className="mt-2 font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
            {service.title}
          </h3>

          {/* Description */}
          <p className="mt-2 text-sm text-muted-foreground line-clamp-2 flex-1">
            {service.description}
          </p>

          {/* Rating & Duration */}
          <div className="mt-4 flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              <span className="font-medium text-foreground">{service.rating}</span>
              <span className="text-muted-foreground">({service.reviews})</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>{service.duration}</span>
            </div>
          </div>

          {/* Price & CTA */}
          <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
            <span className="font-semibold text-foreground">{service.price}</span>
            <span className="text-primary text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
              View Details <ArrowRight className="w-4 h-4" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
