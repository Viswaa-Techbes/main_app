"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Search, Loader2, X, Check, Package, Sparkles } from "lucide-react";

export interface InventoryProduct {
  _id: string;
  id?: string;
  name: string;
  brand: string;
  category: string;
  subcategory?: string;
  modelNumber?: string;
  sku?: string;
  variant?: string;
  specifications?: string;
  basePrice: number;
  price?: number;
  gstRate: number;
  isTaxInclusive: boolean;
  stock?: number;
  unit?: string;
  image?: string;
  description?: string;
  variants?: Array<{
    name: string;
    sku?: string;
    price: number;
    stock?: number;
  }>;
}

interface ProductAutocompleteProps {
  category?: string;
  placeholder?: string;
  onSelectProduct: (product: InventoryProduct) => void;
  className?: string;
  autoFocus?: boolean;
}

export function ProductAutocomplete({
  category = "",
  placeholder = "Search inventory (e.g. 'CP', '2MP', 'Hikvision', 'Router')...",
  onSelectProduct,
  className = "",
  autoFocus = false,
}: ProductAutocompleteProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<InventoryProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [error, setError] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Debounced search query against backend API
  const performSearch = useCallback(
    async (searchTerm: string) => {
      const trimmed = searchTerm.trim();
      if (!trimmed) {
        setResults([]);
        setLoading(false);
        setIsOpen(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams();
        params.set("q", trimmed);
        if (category && category !== "All") {
          params.set("category", category);
        }

        const res = await fetch(`/api/v2/inventory/search?${params.toString()}`);
        if (!res.ok) {
          throw new Error("Failed to search inventory");
        }
        const data = await res.json();
        const items: InventoryProduct[] = Array.isArray(data.data) ? data.data : [];
        setResults(items);
        setIsOpen(true);
        setHighlightedIndex(items.length > 0 ? 0 : -1);
      } catch (err: any) {
        console.error("Autocomplete search error:", err.message);
        setError("Could not load products. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    [category]
  );

  // Handle input change with debounce
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (!value.trim()) {
      setResults([]);
      setIsOpen(false);
      setLoading(false);
      return;
    }

    setLoading(true);
    debounceTimerRef.current = setTimeout(() => {
      performSearch(value);
    }, 280);
  };

  // Handle item selection
  const handleSelect = (product: InventoryProduct) => {
    onSelectProduct(product);
    setQuery("");
    setResults([]);
    setIsOpen(false);
    setHighlightedIndex(-1);
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || results.length === 0) {
      if (e.key === "ArrowDown" && query.trim()) {
        performSearch(query);
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < results.length - 1 ? prev + 1 : 0
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev > 0 ? prev - 1 : results.length - 1
        );
        break;
      case "Enter":
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < results.length) {
          handleSelect(results[highlightedIndex]);
        }
        break;
      case "Escape":
        e.preventDefault();
        setIsOpen(false);
        break;
      default:
        break;
    }
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {/* Input container */}
      <div className="relative flex items-center">
        <Search className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => {
            if (query.trim() && results.length > 0) {
              setIsOpen(true);
            }
          }}
          onKeyDown={handleKeyDown}
          autoFocus={autoFocus}
          placeholder={placeholder}
          className="w-full h-11 pl-10 pr-10 text-xs font-semibold text-slate-900 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-xs placeholder:text-slate-400 transition-all"
        />

        {/* Loading Spinner or Clear Button */}
        <div className="absolute right-3 flex items-center">
          {loading ? (
            <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
          ) : query ? (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setResults([]);
                setIsOpen(false);
                inputRef.current?.focus();
              }}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-md"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : null}
        </div>
      </div>

      {/* Autocomplete Results Dropdown */}
      {isOpen && (
        <div className="absolute z-50 left-0 right-0 mt-1.5 max-h-[320px] overflow-y-auto bg-white rounded-2xl border border-slate-200/90 shadow-[0_12px_36px_rgba(15,23,42,0.14)] p-1.5 divide-y divide-slate-100">
          {error ? (
            <div className="p-3 text-center text-xs text-rose-500 font-medium">
              {error}
            </div>
          ) : results.length === 0 ? (
            <div className="p-4 text-center">
              <Package className="w-6 h-6 text-slate-300 mx-auto mb-1.5" />
              <div className="text-xs font-bold text-slate-700">
                No inventory products found
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Try searching by brand (e.g. CP Plus, Hikvision) or resolution (e.g. 2MP, 4MP)
              </p>
            </div>
          ) : (
            results.map((product, idx) => {
              const isHighlighted = idx === highlightedIndex;
              const base = product.basePrice ?? product.price ?? 0;
              const rate = product.gstRate ?? 18;
              const isInc = Boolean(product.isTaxInclusive);
              const total = isInc
                ? base
                : Math.round((base + (base * rate) / 100) * 100) / 100;

              return (
                <div
                  key={product._id || idx}
                  onMouseDown={(e) => {
                    // Prevent input blur before click registers
                    e.preventDefault();
                    handleSelect(product);
                  }}
                  onMouseEnter={() => setHighlightedIndex(idx)}
                  className={`p-3 rounded-xl cursor-pointer transition-all flex items-center justify-between gap-3 ${
                    isHighlighted
                      ? "bg-blue-50/80 text-blue-950 shadow-xs border border-blue-200/60"
                      : "hover:bg-slate-50 text-slate-800"
                  }`}
                >
                  {/* Left: Product Name, Brand & Model */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {product.brand && (
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-blue-600 text-white tracking-wider">
                          {product.brand}
                        </span>
                      )}
                      <span className="text-xs font-bold truncate">
                        {product.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500 flex-wrap">
                      {product.variant && (
                        <span className="font-semibold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px]">
                          {product.variant}
                        </span>
                      )}
                      {product.modelNumber && (
                        <span>Model: {product.modelNumber}</span>
                      )}
                      {product.sku && <span>SKU: {product.sku}</span>}
                    </div>
                  </div>

                  {/* Right: Base Price & GST Pill */}
                  <div className="text-right shrink-0">
                    <div className="text-xs font-black text-slate-900">
                      ₹{base.toLocaleString("en-IN")}
                      <span className="text-[10px] font-semibold text-slate-400 ml-1">
                        + GST
                      </span>
                    </div>
                    <div className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200/60 mt-0.5 inline-block">
                      {rate}% GST (Total: ₹{total.toLocaleString("en-IN")})
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
