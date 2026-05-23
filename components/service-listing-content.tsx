"use client";

import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "@/components/ui/link";
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
    if (selectedCategory !== "all") {
      result = result.filter((s) => s.categoryId === selectedCategory);
    }
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (s) =>
          s.title.toLowerCase().includes(query) ||
          s.category.toLowerCase().includes(query) ||
          s.description.toLowerCase().includes(query)
      );
    }
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
        <div className="mb-8 animate-fade-up">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
            Our <span className="text-gradient-blue">Services</span>
          </h1>
          <p className="mt-2 text-gray-500">
            Professional IT services delivered by verified experts
          </p>
        </div>

        {/* Search & Filters Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 animate-fade-up-delayed">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Search services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-11 rounded-full bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <X className="w-4 h-4 text-gray-400 hover:text-gray-700" />
              </button>
            )}
          </div>

          {/* Sort & Filter */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="md:hidden gap-2 border-blue-200 text-blue-600 hover:bg-blue-50"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="w-4 h-4" />
              Filters
            </Button>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="h-11 px-4 pr-10 rounded-full border border-gray-200 bg-white text-gray-700 text-sm appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="popular">Most Popular</option>
                <option value="rating">Highest Rated</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Sidebar - Categories */}
          <aside className={`${showFilters ? "block" : "hidden"} md:block w-full md:w-64 shrink-0`}>
            <div className="bg-white rounded-2xl border border-gray-200 p-5 sticky top-24 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-4">Categories</h3>
              <div className="flex flex-col gap-1.5">
                <button
                  onClick={() => setSelectedCategory("all")}
                  className={`text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    selectedCategory === "all"
                      ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md shadow-blue-500/25"
                      : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                  }`}
                >
                  All Services
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center justify-between ${
                      selectedCategory === cat.id
                        ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md shadow-blue-500/25"
                        : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                    }`}
                  >
                    <span>{cat.title}</span>
                    <span className={`text-xs font-bold ${selectedCategory === cat.id ? "text-blue-200" : "text-gray-400"}`}>
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
              <p className="text-gray-500">
                Showing <span className="font-bold text-gray-900">{filteredServices.length}</span> services
              </p>
              {selectedCategory !== "all" && (
                <button
                  onClick={() => setSelectedCategory("all")}
                  className="text-sm text-orange-500 hover:text-orange-600 font-semibold flex items-center gap-1"
                >
                  Clear filter <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {filteredServices.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredServices.map((service, i) => (
                  <ServiceCard key={service.id} service={service} index={i} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-gray-500">No services found matching your criteria.</p>
                <button
                  className="mt-4 btn-outline-blue px-5 py-2.5 text-sm"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("all");
                  }}
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ServiceCard({ service, index = 0 }: { service: Service; index?: number }) {
  return (
    <Link href={`/services/${service.slug}`}>
      <div
        className="group bg-white rounded-2xl overflow-hidden card-hover h-full flex flex-col animate-fade-up"
        style={{ animationDelay: `${index * 50}ms` }}
      >
        {/* Image */}
        <div className="relative h-44 overflow-hidden">
          <Image
            src={service.image}
            alt={service.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          {service.badge && (
            <span className="absolute top-3 left-3 badge-orange">
              {service.badge}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-1">
          {/* Category */}
          <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
            {service.category}
          </span>

          {/* Title */}
          <h3 className="mt-2 font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">
            {service.title}
          </h3>

          {/* Description */}
          <p className="mt-2 text-sm text-gray-500 line-clamp-2 flex-1">
            {service.description}
          </p>

          {/* Rating & Duration */}
          <div className="mt-4 flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-orange-400 fill-orange-400" />
              <span className="font-semibold text-gray-900">{service.rating}</span>
              <span className="text-gray-400">({service.reviews})</span>
            </div>
            <div className="flex items-center gap-1 text-gray-400">
              <Clock className="w-4 h-4" />
              <span>{service.duration}</span>
            </div>
          </div>

          {/* Price & CTA */}
          <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
            <span className="font-bold text-gray-900">{service.price}</span>
            <span className="text-orange-500 text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
              View Details <ArrowRight className="w-4 h-4" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
