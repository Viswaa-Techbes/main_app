"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import {
  Camera,
  Network,
  Globe,
  Plus,
  Trash2,
  CheckCircle2,
  Loader2,
  MapPin,
  Calendar,
  Clock,
  Mic,
  ShieldCheck,
  Building,
  User,
  Phone,
  Mail,
  Info,
  HelpCircle,
  FileText,
} from "lucide-react";
import { PageShell } from "@/components/layout/page-shell";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth/context/auth-context";
import { useToast } from "@/hooks/use-toast";
import { VoiceNoteRecorder } from "@/components/quotation/VoiceNoteRecorder";

// Dynamically import location picker on client side
const QuoteLocationPicker = dynamic(
  () => import("@/components/cctv/QuoteLocationPicker"),
  { ssr: false }
);

interface QuotationItem {
  id: string;
  productName: string;
  quantity: number;
}

// Preset suggestions for quick selection per category
const CATEGORY_ITEM_SUGGESTIONS: Record<string, string[]> = {
  CCTV: [
    "5MP CCTV Camera",
    "4K IP Dome Camera",
    "Bullet Outdoor Weatherproof Camera",
    "PTZ 360° Camera",
    "4-Channel DVR / NVR",
    "8-Channel DVR / NVR",
    "16-Channel DVR / NVR",
    "1TB Surveillance HDD",
    "2TB Surveillance HDD",
    "Cat6 Cable (Bundle)",
    "SMPS Power Supply",
    "4U / 6U Network Rack",
  ],
  Networking: [
    "Cat6 Network Cable (Meters)",
    "Dual-Band Wi-Fi 6 Router",
    "8-Port Gigabit Switch",
    "16-Port / 24-Port Gigabit Switch",
    "Wireless Access Point (Ceiling Mount)",
    "Structured Cabling LAN Points",
    "9U Server / Network Rack",
    "Patch Panel (24 Ports)",
    "RJ45 Connectors & Wall Plates",
    "Outdoor Point-to-Point Wi-Fi Bridge",
  ],
  "Web Designing": [
    "Corporate Business Website",
    "E-Commerce Online Store",
    "Landing Page & Lead Funnel",
    "Custom Web Application / Portal",
    "Website UI/UX Redesign",
    "Domain & High-Speed Hosting Setup",
    "Payment Gateway Integration",
    "SEO & Speed Optimization",
    "Website Maintenance (AMC)",
  ],
};

const CATEGORY_SUBCATEGORY_MAP: Record<string, string[]> = {
  CCTV: [
    "Wired Camera Installation",
    "Wireless Camera Installation",
    "IP Camera Installation",
    "DVR / NVR Setup",
    "CCTV Maintenance & AMC",
    "CCTV Repair & Troubleshooting",
    "CCTV Upgrade & Expansion",
    "Free Site Survey",
  ],
  Networking: [
    "Office Network LAN Setup",
    "Wi-Fi & Internet Coverage",
    "Structured Cabling & Patching",
    "Router & Firewall Configuration",
    "Server & NAS Storage Integration",
    "Network Upgrade to Gigabit",
    "Annual Network Support & AMC",
    "Free Network Survey",
  ],
  "Web Designing": [
    "Business Website Development",
    "Ecommerce Online Store",
    "High-Conversion Landing Page",
    "Custom Web Application",
    "Website Redesign & Modernization",
    "Speed & SEO Optimization",
    "Website Maintenance & Updates",
    "Domain & Hosting Setup",
  ],
};

function getDatePills() {
  const pills = [];
  const today = new Date();
  for (let i = 0; i < 3; i++) {
    const d = new Date();
    d.setDate(today.getDate() + i);
    const iso = d.toISOString().split("T")[0];
    const label =
      i === 0
        ? "Today"
        : i === 1
        ? "Tomorrow"
        : d.toLocaleDateString("en-IN", {
            weekday: "short",
            day: "numeric",
            month: "short",
          });
    pills.push({ iso, label });
  }
  return pills;
}

export default function EnhancedQuotePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();

  // Scroll target refs for validation
  const productsRef = useRef<HTMLDivElement>(null);
  const scheduleRef = useRef<HTMLDivElement>(null);
  const locationRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Category & Subcategory
  const [selectedCategory, setSelectedCategory] = useState<string>("CCTV");
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("");

  // Multiple Items (NO PRICING EXPOSED TO CUSTOMER)
  const [items, setItems] = useState<QuotationItem[]>([
    { id: "1", productName: "5MP CCTV Camera", quantity: 4 },
  ]);
  const [newItemName, setNewItemName] = useState("");
  const [newItemQty, setNewItemQty] = useState(1);

  // Additional Requirements
  const [additionalRequirements, setAdditionalRequirements] = useState("");
  const [voiceNoteData, setVoiceNoteData] = useState<{
    url: string;
    duration: number;
    filename: string;
    mimeType: string;
  } | null>(null);

  // Preferred visit & contact timing
  const [preferredContact, setPreferredContact] = useState("Phone Call");
  const [preferredVisitDate, setPreferredVisitDate] = useState("");
  const [preferredVisitTime, setPreferredVisitTime] = useState("09:00 AM - 12:00 PM");

  // Location Details
  const [locality, setLocality] = useState("");
  const [pincode, setPincode] = useState("");
  const [address, setAddress] = useState("");
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [googleMapsUrl, setGoogleMapsUrl] = useState("");

  // Customer Profile Details
  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [companyName, setCompanyName] = useState("");

  // Auto-select category from URL query
  useEffect(() => {
    const catParam =
      searchParams.get("category")?.toLowerCase() ||
      searchParams.get("service")?.toLowerCase() ||
      "";
    if (catParam.includes("net")) {
      setSelectedCategory("Networking");
      setSelectedSubcategory("Office Network LAN Setup");
      setItems([{ id: "1", productName: "Wi-Fi Access Point", quantity: 2 }]);
    } else if (catParam.includes("web") || catParam.includes("design")) {
      setSelectedCategory("Web Designing");
      setSelectedSubcategory("Business Website Development");
      setItems([{ id: "1", productName: "Corporate Business Website", quantity: 1 }]);
    } else {
      setSelectedCategory("CCTV");
      setSelectedSubcategory("Wired Camera Installation");
    }
  }, [searchParams]);

  // Set default subcategory when category changes
  useEffect(() => {
    const defaultSubs = CATEGORY_SUBCATEGORY_MAP[selectedCategory] || [];
    if (
      defaultSubs.length > 0 &&
      (!selectedSubcategory || !defaultSubs.includes(selectedSubcategory))
    ) {
      setSelectedSubcategory(defaultSubs[0]);
    }
  }, [selectedCategory, selectedSubcategory]);

  // Autofill if authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.name) setFullName(user.name);
      if (user.mobileNumber || user.phone)
        setMobile(user.mobileNumber || user.phone || "");
      if (user.email) setEmail(user.email);
    }
  }, [isAuthenticated, user]);

  // Item management functions
  const handleAddItem = (nameToAdd?: string, qtyToAdd?: number) => {
    const name = (nameToAdd || newItemName).trim();
    const qty = qtyToAdd || newItemQty;
    if (!name) {
      toast({
        title: "Item Name Required",
        description: "Please specify or pick a product/service to add.",
        variant: "destructive",
      });
      return;
    }

    setItems((prev) => [
      ...prev,
      {
        id: String(Date.now() + Math.random()),
        productName: name,
        quantity: Math.max(1, qty),
      },
    ]);
    setNewItemName("");
    setNewItemQty(1);
  };

  const handleRemoveItem = (id: string) => {
    if (items.length <= 1) {
      toast({
        title: "Minimum 1 Item Required",
        description: "Please keep at least one product or service requirement.",
        variant: "destructive",
      });
      return;
    }
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleUpdateItemQty = (id: string, delta: number) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newQty = Math.max(1, item.quantity + delta);
          return { ...item, quantity: newQty };
        }
        return item;
      })
    );
  };

  const handleLocationSelected = (data: any) => {
    setLocality(data.area || data.city || "");
    setPincode(data.pincode || "");
    setAddress(data.formattedAddress || data.address || "");
    setLatitude(data.latitude);
    setLongitude(data.longitude);
    if (data.latitude && data.longitude) {
      setGoogleMapsUrl(
        `https://www.google.com/maps?q=${data.latitude},${data.longitude}`
      );
    }
  };

  // Validations
  const isMobileValid = (val: string) => {
    const cleaned = val.replace(/[\s+-]/g, "");
    return /^(?:\+91|0)?[6-9]\d{9}$/.test(cleaned);
  };

  const handleSubmitQuotation = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Validate Items
    if (items.length === 0) {
      setErrorMsg("Please specify at least one product or requirement.");
      productsRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    // 2. Validate Preferred Date
    if (!preferredVisitDate) {
      setErrorMsg("Please select your preferred visit date.");
      scheduleRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    // 3. Validate Location
    if (!address.trim()) {
      setErrorMsg("Please pin your site location on the map.");
      locationRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    // 4. Validate Customer Details
    if (!fullName.trim()) {
      setErrorMsg("Please provide your full name.");
      contactRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    if (!mobile.trim() || !isMobileValid(mobile)) {
      setErrorMsg("Please enter a valid 10-digit mobile number.");
      contactRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    setSubmitting(true);
    setErrorMsg("");

    try {
      const payload: any = {
        fullName: fullName.trim(),
        mobile: mobile.trim(),
        email: email.trim() || undefined,
        companyName: companyName.trim() || undefined,
        serviceCategory: selectedCategory,
        subcategory: selectedSubcategory,
        items: items.map((it) => ({
          productName: it.productName,
          quantity: it.quantity,
        })),
        additionalRequirements: additionalRequirements.trim(),
        voiceNote: voiceNoteData || undefined,
        preferredContact,
        preferredVisitDate: preferredVisitDate || undefined,
        preferredVisitTime,
        locality: locality.trim() || address.trim(),
        pincode: pincode.trim(),
        address: address.trim(),
        latitude,
        longitude,
        googleMapsUrl,
        source: "Website Quotation Request",
      };

      const res = await fetch("/api/v2/quotes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(isAuthenticated &&
          typeof window !== "undefined" &&
          localStorage.getItem("token")
            ? { Authorization: `Bearer ${localStorage.getItem("token")}` }
            : {}),
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to submit quotation request");
      }

      toast({
        title: "Quotation Request Submitted!",
        description:
          "Your request has been logged. Admin will review and send your custom pricing.",
      });

      // Redirect to confirmation screen
      const qParams = new URLSearchParams({
        requestId: data.data?.requestId || "QT-CONFIRMED",
        fullName: fullName.trim(),
        locality: locality || "Bangalore",
        requirementType: `${selectedCategory} - ${selectedSubcategory}`,
        cameraCount: String(items.reduce((acc, it) => acc + it.quantity, 0)),
      });

      router.push(`/quote/success?${qParams.toString()}`);
    } catch (err: any) {
      console.error("Submission failed:", err);
      setErrorMsg(
        err.message || "Something went wrong while submitting. Please try again."
      );
      setSubmitting(false);
    }
  };

  const currentSuggestions =
    CATEGORY_ITEM_SUGGESTIONS[selectedCategory] ||
    CATEGORY_ITEM_SUGGESTIONS["CCTV"];

  return (
    <PageShell>
      <div className="bg-slate-50/50 min-h-screen py-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          {/* Header Title */}
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 border border-blue-100 px-3 py-1 text-xs font-bold text-blue-600">
              <ShieldCheck className="h-3.5 w-3.5" />
              Official TechBes Quotation Request
            </span>
            <h1 className="mt-3 text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
              Request Your Custom Quotation
            </h1>
            <p className="mt-2 text-sm text-slate-500 leading-relaxed font-medium">
              Complete your requirement on this single page. Our engineering team
              will prepare an itemized quote with custom rates and send it to your
              portal & WhatsApp. No upfront payment required.
            </p>
          </div>

          {/* Form Content - SINGLE CONTINUOUS SCROLLABLE CONTAINER */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-sm">
            {errorMsg && (
              <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-red-700 text-xs font-semibold">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmitQuotation} className="space-y-10">
              {/* ────────── SECTION 1: SERVICE REQUIREMENTS ────────── */}
              <section className="space-y-5">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                  <div className="w-2 h-4 bg-blue-600 rounded-full" />
                  <h3 className="text-sm font-black uppercase tracking-wider text-slate-800">
                    SERVICE REQUIREMENTS
                  </h3>
                </div>

                {/* 1A: Select Service Category */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
                    Service Category
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      {
                        id: "CCTV",
                        label: "CCTV",
                        icon: Camera,
                        desc: "Surveillance, Cameras & Storage",
                      },
                      {
                        id: "Networking",
                        label: "Networking",
                        icon: Network,
                        desc: "Wi-Fi, Switches & Structured Cabling",
                      },
                      {
                        id: "Web Designing",
                        label: "Web Designing",
                        icon: Globe,
                        desc: "Custom Websites & Digital Solutions",
                      },
                    ].map((cat) => {
                      const Icon = cat.icon;
                      const isSelected = selectedCategory === cat.id;
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => setSelectedCategory(cat.id)}
                          className={`flex flex-col items-start p-4 rounded-2xl border text-left transition-all ${
                            isSelected
                              ? "border-blue-600 bg-blue-50/60 shadow-xs ring-2 ring-blue-500/20"
                              : "border-slate-200 hover:border-slate-300 bg-white"
                          }`}
                        >
                          <div
                            className={`p-2.5 rounded-xl mb-2.5 ${
                              isSelected
                                ? "bg-blue-600 text-white"
                                : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            <Icon className="h-4 w-4" />
                          </div>
                          <span className="font-bold text-xs text-slate-800">
                            {cat.label}
                          </span>
                          <span className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                            {cat.desc}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 1B: Select Subcategory */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
                    Service Type / Subcategory
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {(CATEGORY_SUBCATEGORY_MAP[selectedCategory] || []).map((sub) => {
                      const isSelected = selectedSubcategory === sub;
                      return (
                        <button
                          key={sub}
                          type="button"
                          onClick={() => setSelectedSubcategory(sub)}
                          className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition ${
                            isSelected
                              ? "bg-blue-600 text-white shadow-xs"
                              : "bg-slate-100 text-slate-700 hover:bg-slate-200/80"
                          }`}
                        >
                          {sub}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </section>

              {/* ────────── SECTION 2: PRODUCTS & QUANTITIES ────────── */}
              <section ref={productsRef} className="space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                  <div className="w-2 h-4 bg-blue-600 rounded-full" />
                  <h3 className="text-sm font-black uppercase tracking-wider text-slate-800">
                    PRODUCTS & QUANTITIES
                  </h3>
                </div>

                {/* Items Configured List */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-slate-700">
                      Configured Items ({items.length})
                    </label>
                    <span className="text-[11px] text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded-full">
                      No Prices Shown • Custom Engineered
                    </span>
                  </div>

                  <div className="space-y-2">
                    {items.map((item, idx) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50/60 shadow-xs"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center">
                            {idx + 1}
                          </span>
                          <div>
                            <p className="text-xs font-bold text-slate-800">
                              {item.productName}
                            </p>
                            <p className="text-[11px] text-blue-600 font-bold">
                              Quantity: {item.quantity}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <div className="flex items-center border border-slate-200 rounded-lg bg-white overflow-hidden shadow-xs h-8">
                            <button
                              type="button"
                              onClick={() => handleUpdateItemQty(item.id, -1)}
                              className="px-2.5 text-xs text-slate-600 hover:bg-slate-100 font-bold"
                            >
                              -
                            </button>
                            <span className="px-2 text-xs font-bold text-slate-800">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleUpdateItemQty(item.id, 1)}
                              className="px-2.5 text-xs text-slate-600 hover:bg-slate-100 font-bold"
                            >
                              +
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleRemoveItem(item.id)}
                            className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg transition"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Add Another Item Box */}
                <div className="p-4 rounded-2xl border border-dashed border-blue-200 bg-blue-50/20 space-y-3">
                  <p className="text-xs font-bold text-slate-700">
                    Add Another Product / Service Item:
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2.5">
                    <select
                      value={newItemName}
                      onChange={(e) => setNewItemName(e.target.value)}
                      className="h-10 rounded-xl border border-slate-200 px-3 bg-white text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 max-w-[210px] truncate"
                    >
                      <option value="">-- Quick Select --</option>
                      {currentSuggestions.map((sug) => (
                        <option key={sug} value={sug}>
                          {sug}
                        </option>
                      ))}
                    </select>

                    <input
                      type="text"
                      placeholder="Or enter custom product name..."
                      value={newItemName}
                      onChange={(e) => setNewItemName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddItem();
                        }
                      }}
                      className="flex-1 h-10 px-3.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <div className="flex items-center gap-2">
                      <div className="flex items-center border border-slate-200 rounded-xl bg-white px-2 h-10">
                        <span className="text-[11px] text-slate-400 font-medium mr-1.5">
                          Qty:
                        </span>
                        <input
                          type="number"
                          min="1"
                          value={newItemQty}
                          onChange={(e) =>
                            setNewItemQty(
                              Math.max(1, parseInt(e.target.value, 10) || 1)
                            )
                          }
                          className="w-10 text-xs font-bold text-slate-800 focus:outline-none"
                        />
                      </div>
                      <Button
                        type="button"
                        onClick={() => handleAddItem()}
                        className="h-10 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold gap-1"
                      >
                        <Plus className="h-4 w-4" />
                        Add Item
                      </Button>
                    </div>
                  </div>

                  {/* Suggestion tags */}
                  <div className="pt-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                      Popular Suggestions:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {currentSuggestions.slice(0, 6).map((sug) => (
                        <button
                          key={sug}
                          type="button"
                          onClick={() => handleAddItem(sug, 1)}
                          className="text-[11px] px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-600 hover:border-blue-300 hover:text-blue-600 font-medium transition"
                        >
                          + {sug}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              {/* ────────── SECTION 3: ADDITIONAL REQUIREMENTS ────────── */}
              <section className="space-y-3">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                  <div className="w-2 h-4 bg-blue-600 rounded-full" />
                  <h3 className="text-sm font-black uppercase tracking-wider text-slate-800">
                    ADDITIONAL REQUIREMENTS
                  </h3>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">
                    Describe Your Requirements in Detail
                  </label>
                  <textarea
                    rows={4}
                    value={additionalRequirements}
                    onChange={(e) => setAdditionalRequirements(e.target.value)}
                    placeholder={
                      selectedCategory === "Networking"
                        ? "e.g. Need LAN connection for 20 systems and Wi-Fi coverage for 3 floors."
                        : selectedCategory === "CCTV"
                        ? "e.g. Need 4 cameras covering building entrance and parking, with 30 days recording backup and mobile viewing."
                        : "e.g. Modern responsive website with booking portal, payment gateway, and WhatsApp chat."
                    }
                    className="w-full rounded-2xl border border-slate-200 p-4 text-xs font-medium text-slate-800 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-blue-500 leading-relaxed"
                  />
                </div>
              </section>

              {/* ────────── SECTION 4: VOICE NOTE ────────── */}
              <section className="space-y-3">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                  <div className="w-2 h-4 bg-blue-600 rounded-full" />
                  <h3 className="text-sm font-black uppercase tracking-wider text-slate-800">
                    VOICE NOTE
                  </h3>
                  <span className="text-[10px] text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded-full">
                    Optional
                  </span>
                </div>

                <p className="text-xs text-slate-400 font-medium">
                  Explain floor plans or custom requests directly to our engineers by
                  voice.
                </p>
                <div className="pt-1">
                  <VoiceNoteRecorder
                    onVoiceNoteRecorded={(data) => setVoiceNoteData(data)}
                  />
                </div>
              </section>

              {/* ────────── SECTION 5: PREFERRED SCHEDULE ────────── */}
              <section ref={scheduleRef} className="space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                  <div className="w-2 h-4 bg-blue-600 rounded-full" />
                  <h3 className="text-sm font-black uppercase tracking-wider text-slate-800">
                    PREFERRED SCHEDULE
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1.5 flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" /> Preferred Date *
                    </label>
                    <input
                      type="date"
                      min={new Date().toISOString().split("T")[0]}
                      value={preferredVisitDate}
                      onChange={(e) => setPreferredVisitDate(e.target.value)}
                      className="h-10 w-full rounded-xl border border-slate-200 px-3 text-xs font-medium text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="flex gap-1.5 mt-2">
                      {getDatePills().map((p) => (
                        <button
                          key={p.iso}
                          type="button"
                          onClick={() => setPreferredVisitDate(p.iso)}
                          className={`px-2 py-1 text-[10px] font-bold rounded-lg border transition ${
                            preferredVisitDate === p.iso
                              ? "bg-blue-600 text-white border-blue-600"
                              : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                          }`}
                        >
                          {p.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1.5 flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" /> Time Slot
                    </label>
                    <select
                      value={preferredVisitTime}
                      onChange={(e) => setPreferredVisitTime(e.target.value)}
                      className="h-10 w-full rounded-xl border border-slate-200 px-3 text-xs font-medium text-slate-700 bg-white focus:outline-none"
                    >
                      <option value="09:00 AM - 12:00 PM">09:00 AM - 12:00 PM</option>
                      <option value="12:00 PM - 03:00 PM">12:00 PM - 03:00 PM</option>
                      <option value="03:00 PM - 06:00 PM">03:00 PM - 06:00 PM</option>
                      <option value="Flexible / Anytime">Flexible / Anytime</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1.5">
                      Contact Preference
                    </label>
                    <select
                      value={preferredContact}
                      onChange={(e) => setPreferredContact(e.target.value)}
                      className="h-10 w-full rounded-xl border border-slate-200 px-3 text-xs font-medium text-slate-700 bg-white focus:outline-none"
                    >
                      <option value="Phone Call">Phone Call</option>
                      <option value="WhatsApp">WhatsApp</option>
                      <option value="Email">Email</option>
                    </select>
                  </div>
                </div>
              </section>

              {/* ────────── SECTION 6: SERVICE LOCATION / MAP ────────── */}
              <section ref={locationRef} className="space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                  <div className="w-2 h-4 bg-blue-600 rounded-full" />
                  <h3 className="text-sm font-black uppercase tracking-wider text-slate-800">
                    SERVICE LOCATION
                  </h3>
                </div>

                <div className="rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                  <QuoteLocationPicker
                    onLocationSelected={handleLocationSelected}
                    initialAddressData={{
                      formattedAddress: address,
                      area: locality,
                      pincode: pincode,
                    }}
                  />
                </div>
              </section>

              {/* ────────── SECTION 7: CUSTOMER DETAILS ────────── */}
              <section ref={contactRef} className="space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                  <div className="w-2 h-4 bg-blue-600 rounded-full" />
                  <h3 className="text-sm font-black uppercase tracking-wider text-slate-800">
                    CUSTOMER DETAILS
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50/70 p-4 rounded-2xl border border-slate-200/70">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1.5">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Kumar S"
                      className="h-10 w-full rounded-xl border border-slate-200 px-3 text-xs font-medium text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1.5">
                      Mobile Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      placeholder="10-digit mobile number"
                      className="h-10 w-full rounded-xl border border-slate-200 px-3 text-xs font-medium text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1.5">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="h-10 w-full rounded-xl border border-slate-200 px-3 text-xs font-medium text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1.5">
                      Company / Apartment Name (Optional)
                    </label>
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="Company or Apartment Name"
                      className="h-10 w-full rounded-xl border border-slate-200 px-3 text-xs font-medium text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </section>

              {/* ────────── SECTION 8: REVIEW REQUEST (SUMMARY) ────────── */}
              <section className="space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                  <div className="w-2 h-4 bg-blue-600 rounded-full" />
                  <h3 className="text-sm font-black uppercase tracking-wider text-slate-800">
                    REVIEW REQUEST
                  </h3>
                </div>

                <div className="rounded-2xl border border-blue-100 bg-blue-50/40 p-5 space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-700">Category & Type:</span>
                    <span className="font-bold text-blue-600">
                      {selectedCategory} • {selectedSubcategory}
                    </span>
                  </div>

                  <div className="text-xs">
                    <span className="font-bold text-slate-700 block mb-1">
                      Requested Items ({items.length}):
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {items.map((it) => (
                        <span
                          key={it.id}
                          className="bg-white border border-blue-200/80 px-2.5 py-1 rounded-lg text-slate-800 font-medium text-[11px]"
                        >
                          {it.productName}{" "}
                          <strong className="text-blue-700">×{it.quantity}</strong>
                        </span>
                      ))}
                    </div>
                  </div>

                  {address && (
                    <div className="text-xs flex justify-between items-center">
                      <span className="font-bold text-slate-700">Location:</span>
                      <span className="text-slate-600 font-medium truncate max-w-[280px]">
                        📍 {locality || address}
                      </span>
                    </div>
                  )}

                  {additionalRequirements.trim() && (
                    <div className="text-xs">
                      <span className="font-bold text-slate-700 block">
                        Additional Requirement:
                      </span>
                      <p className="text-slate-600 italic">
                        "{additionalRequirements.trim()}"
                      </p>
                    </div>
                  )}

                  {voiceNoteData && (
                    <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-bold">
                      <Mic className="h-3.5 w-3.5" /> Voice Note Attached (
                      {voiceNoteData.duration}s audio)
                    </div>
                  )}

                  <div className="pt-2 border-t border-blue-100/80 flex gap-2 text-[11px] text-slate-600">
                    <Info className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                    <span>
                      Pricing is not displayed to customers now. TechBes engineering will
                      calculate custom rates and send an official quotation to your portal
                      & WhatsApp for review before payment.
                    </span>
                  </div>
                </div>
              </section>

              {/* ────────── SECTION 9: SUBMIT BUTTON ────────── */}
              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full h-12 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-extrabold gap-2 shadow-lg shadow-emerald-600/20 transition-all hover:scale-[1.005]"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Submitting Quotation Request...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-5 w-5" />
                      Submit Quotation Request
                    </>
                  )}
                </Button>
                <p className="text-center text-[11px] text-slate-400 mt-2 font-medium">
                  Your request is sent directly to the TechBes Admin Quotations Queue.
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
