"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import {
  Camera,
  Network,
  Globe,
  Plus,
  Trash2,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
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
    "4-Channel DVR",
    "8-Channel NVR",
    "16-Channel NVR",
    "1TB Surveillance HDD",
    "2TB Surveillance HDD",
    "Cat6 Cable (Meters)",
    "3+1 Coaxial Cable (Meters)",
    "SMPS Power Supply",
    "BNC & DC Connectors",
    "Rack 4U / 6U",
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

export default function EnhancedQuotePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();

  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Step 1: Category & Subcategory
  const [selectedCategory, setSelectedCategory] = useState<string>("CCTV");
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("");

  // Step 1: Multiple Items (NO PRICING EXPOSED TO CUSTOMER)
  const [items, setItems] = useState<QuotationItem[]>([
    { id: "1", productName: "5MP CCTV Camera", quantity: 4 },
  ]);
  const [newItemName, setNewItemName] = useState("");
  const [newItemQty, setNewItemQty] = useState(1);

  // Step 2: Additional Requirements
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

  // Step 3: Location Details (Preserving existing QuoteLocationPicker)
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
    const catParam = searchParams.get("category")?.toLowerCase() || searchParams.get("service")?.toLowerCase() || "";
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
    if (defaultSubs.length > 0 && (!selectedSubcategory || !defaultSubs.includes(selectedSubcategory))) {
      setSelectedSubcategory(defaultSubs[0]);
    }
  }, [selectedCategory]);

  // Autofill if authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.name) setFullName(user.name);
      if (user.mobileNumber || user.phone) setMobile(user.mobileNumber || user.phone || "");
      if (user.email) setEmail(user.email);
    }
  }, [isAuthenticated, user]);

  // Item management functions
  const handleAddItem = (nameToAdd?: string, qtyToAdd?: number) => {
    const name = (nameToAdd || newItemName).trim();
    const qty = qtyToAdd || newItemQty;
    if (!name) return;

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
        description: "Please specify at least one product or service requirement.",
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
      setGoogleMapsUrl(`https://www.google.com/maps?q=${data.latitude},${data.longitude}`);
    }
  };

  // Validations
  const isMobileValid = (val: string) => {
    const cleaned = val.replace(/[\s+-]/g, "");
    return /^(?:\+91|0)?[6-9]\d{9}$/.test(cleaned);
  };

  const isStep1Valid = items.length > 0 && items.every((it) => it.productName.trim().length > 0 && it.quantity >= 1);
  const isStep2Valid = true; // Voice note & additional requirements are flexible
  const isStep3Valid =
    fullName.trim().length > 0 &&
    mobile.trim().length > 0 &&
    isMobileValid(mobile) &&
    address.trim().length > 0;

  const handleSubmitQuotation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isStep3Valid) {
      setErrorMsg("Please provide your name, valid mobile number, and address.");
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
          ...(isAuthenticated && typeof window !== "undefined" && localStorage.getItem("token")
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
        description: "Your request has been logged. Admin will review and send your custom pricing.",
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
      setErrorMsg(err.message || "Something went wrong while submitting. Please try again.");
      setSubmitting(false);
    }
  };

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
              Select your services, specify items and quantities, record or describe your requirements, and submit.
              Our engineering team will prepare an authoritative quote with transparent pricing for you.
            </p>
          </div>

          {/* Stepper Wizard Indicator */}
          <div className="mb-8 bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
            <div className="grid grid-cols-3 gap-2 text-center">
              <button
                type="button"
                onClick={() => setStep(1)}
                className={`flex flex-col items-center gap-1.5 p-2 rounded-xl transition ${
                  step === 1 ? "bg-blue-50 text-blue-600 font-bold" : "text-slate-500 hover:bg-slate-50"
                }`}
              >
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                  step === 1 ? "bg-blue-600 text-white font-bold" : "bg-slate-200 text-slate-600"
                }`}>
                  1
                </span>
                <span className="text-xs">Category & Items</span>
              </button>

              <button
                type="button"
                onClick={() => isStep1Valid && setStep(2)}
                disabled={!isStep1Valid}
                className={`flex flex-col items-center gap-1.5 p-2 rounded-xl transition ${
                  step === 2 ? "bg-blue-50 text-blue-600 font-bold" : "text-slate-500 hover:bg-slate-50"
                }`}
              >
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                  step === 2 ? "bg-blue-600 text-white font-bold" : "bg-slate-200 text-slate-600"
                }`}>
                  2
                </span>
                <span className="text-xs">Requirements & Voice</span>
              </button>

              <button
                type="button"
                onClick={() => isStep1Valid && setStep(3)}
                disabled={!isStep1Valid}
                className={`flex flex-col items-center gap-1.5 p-2 rounded-xl transition ${
                  step === 3 ? "bg-blue-50 text-blue-600 font-bold" : "text-slate-500 hover:bg-slate-50"
                }`}
              >
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                  step === 3 ? "bg-blue-600 text-white font-bold" : "bg-slate-200 text-slate-600"
                }`}>
                  3
                </span>
                <span className="text-xs">Location & Contact</span>
              </button>
            </div>
          </div>

          {/* Form Content */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-sm">
            {errorMsg && (
              <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-red-700 text-xs font-semibold">
                {errorMsg}
              </div>
            )}

            {/* ────────── STEP 1: CATEGORY, SUBCATEGORY & MULTIPLE ITEMS ────────── */}
            {step === 1 && (
              <div className="space-y-8 animate-in fade-in duration-300">
                {/* 1. Category Selection: ONLY CCTV, Networking, Web Designing */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                    Step 1A: Select Service Category
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                      { id: "CCTV", label: "CCTV", icon: Camera, desc: "Surveillance, Cameras & Storage" },
                      { id: "Networking", label: "Networking", icon: Network, desc: "Wi-Fi, Switches & Structured Cabling" },
                      { id: "Web Designing", label: "Web Designing", icon: Globe, desc: "Custom Websites & Digital Solutions" },
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
                              ? "border-blue-600 bg-blue-50/60 shadow-sm ring-2 ring-blue-500/20"
                              : "border-slate-200 hover:border-slate-300 bg-white"
                          }`}
                        >
                          <div className={`p-2.5 rounded-xl mb-3 ${isSelected ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600"}`}>
                            <Icon className="h-5 w-5" />
                          </div>
                          <span className="font-bold text-sm text-slate-800">{cat.label}</span>
                          <span className="text-[11px] text-slate-500 mt-1 leading-snug">{cat.desc}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Subcategory Selection */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                    Step 1B: Select Subcategory
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
                              ? "bg-blue-600 text-white shadow-sm"
                              : "bg-slate-100 text-slate-700 hover:bg-slate-200/80"
                          }`}
                        >
                          {sub}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 3. MULTIPLE QUOTATION ITEMS (NO PRICING SHOWN) */}
                <div className="border-t border-slate-100 pt-6">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                        Step 1C: Requested Items & Quantities
                      </label>
                      <p className="text-[11px] text-slate-400 font-medium">
                        Add items and specify required quantities. Pricing will be tailored by TechBes admin.
                      </p>
                    </div>
                  </div>

                  {/* Existing Items List */}
                  <div className="space-y-2.5 mb-5">
                    {items.map((item, idx) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-slate-50/60"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center">
                            {idx + 1}
                          </span>
                          <div>
                            <p className="text-xs font-bold text-slate-800">{item.productName}</p>
                            <p className="text-[11px] text-blue-600 font-bold">Qty: {item.quantity}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {/* Quantity control */}
                          <div className="flex items-center border border-slate-200 rounded-lg bg-white overflow-hidden shadow-xs">
                            <button
                              type="button"
                              onClick={() => handleUpdateItemQty(item.id, -1)}
                              className="px-2.5 py-1 text-xs text-slate-600 hover:bg-slate-100 font-bold"
                            >
                              -
                            </button>
                            <span className="px-2 text-xs font-bold text-slate-800">{item.quantity}</span>
                            <button
                              type="button"
                              onClick={() => handleUpdateItemQty(item.id, 1)}
                              className="px-2.5 py-1 text-xs text-slate-600 hover:bg-slate-100 font-bold"
                            >
                              +
                            </button>
                          </div>

                          {/* Delete button */}
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

                  {/* Add New Item Box */}
                  <div className="p-4 rounded-2xl border border-dashed border-blue-200 bg-blue-50/20 space-y-3">
                    <p className="text-xs font-bold text-slate-700">Add an Item to this Quotation:</p>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <input
                        type="text"
                        placeholder="e.g. 5MP CCTV Camera, 1TB HDD, Cat6 Cable..."
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
                          <span className="text-[11px] text-slate-400 font-medium mr-1.5">Qty:</span>
                          <input
                            type="number"
                            min="1"
                            value={newItemQty}
                            onChange={(e) => setNewItemQty(Math.max(1, parseInt(e.target.value, 10) || 1))}
                            className="w-12 text-xs font-bold text-slate-800 focus:outline-none"
                          />
                        </div>
                        <Button
                          type="button"
                          onClick={() => handleAddItem()}
                          disabled={!newItemName.trim()}
                          className="h-10 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold gap-1"
                        >
                          <Plus className="h-4 w-4" />
                          Add
                        </Button>
                      </div>
                    </div>

                    {/* Quick suggestion pills */}
                    <div className="pt-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                        Popular Suggestions:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {(CATEGORY_ITEM_SUGGESTIONS[selectedCategory] || []).map((sug) => (
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
                </div>

                {/* Continue button */}
                <div className="flex justify-end pt-4">
                  <Button
                    type="button"
                    onClick={() => setStep(2)}
                    disabled={!isStep1Valid}
                    className="h-11 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold gap-2"
                  >
                    Continue to Requirements
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* ────────── STEP 2: ADDITIONAL REQUIREMENTS & VOICE NOTE ────────── */}
            {step === 2 && (
              <div className="space-y-8 animate-in fade-in duration-300">
                <div>
                  <h3 className="text-base font-bold text-slate-900 mb-1">Additional Requirements</h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Provide any specifics regarding layout, floor levels, ports, brand preferences, or custom needs.
                  </p>
                </div>

                {/* Multi-line Description Field */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                    Requirement Description (Multi-line)
                  </label>
                  <textarea
                    rows={4}
                    value={additionalRequirements}
                    onChange={(e) => setAdditionalRequirements(e.target.value)}
                    placeholder={
                      selectedCategory === "Networking"
                        ? "e.g. I need Wi-Fi coverage for 3 floors and structured LAN points for 12 rooms with gigabit PoE switches."
                        : selectedCategory === "CCTV"
                        ? "e.g. Need 4 cameras covering building entrance and parking, with 30 days recording backup and mobile viewing."
                        : "e.g. Modern responsive website for our IT company with service booking and customer portal integration."
                    }
                    className="w-full rounded-2xl border border-slate-200 p-4 text-xs font-medium text-slate-800 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-blue-500 leading-relaxed"
                  />
                </div>

                {/* Voice Note Recorder (Part 5: Networking & General) */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                      Voice Note Audio Recording
                    </label>
                    <span className="text-[10px] text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded-full">
                      Optional Voice Message
                    </span>
                  </div>
                  <VoiceNoteRecorder
                    onVoiceNoteRecorded={(data) => {
                      setVoiceNoteData(data);
                    }}
                  />
                </div>

                {/* Visit & Contact Preferences */}
                <div className="border-t border-slate-100 pt-6">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                    Preferred Visit & Contact Details
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1.5">Contact Via</label>
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

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1.5 flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" /> Preferred Date
                      </label>
                      <input
                        type="date"
                        min={new Date().toISOString().split("T")[0]}
                        value={preferredVisitDate}
                        onChange={(e) => setPreferredVisitDate(e.target.value)}
                        className="h-10 w-full rounded-xl border border-slate-200 px-3 text-xs font-medium text-slate-700 bg-white focus:outline-none"
                      />
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
                  </div>
                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-4 border-t border-slate-100">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(1)}
                    className="h-11 px-5 rounded-xl text-xs font-bold gap-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Items
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setStep(3)}
                    className="h-11 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold gap-2"
                  >
                    Continue to Location & Contact
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* ────────── STEP 3: LOCATION & CUSTOMER PROFILE ────────── */}
            {step === 3 && (
              <form onSubmit={handleSubmitQuotation} className="space-y-8 animate-in fade-in duration-300">
                {/* 1. Location Capture (Preserving existing QuoteLocationPicker) */}
                <div>
                  <h3 className="text-base font-bold text-slate-900 mb-1">Location Details</h3>
                  <p className="text-xs text-slate-500 font-medium mb-4">
                    Pinpoint your service location in Bangalore so our field engineers can evaluate on-site requirements.
                  </p>
                  <div className="rounded-2xl border border-slate-100 overflow-hidden">
                    <QuoteLocationPicker
                      onLocationSelected={handleLocationSelected}
                      initialAddressData={{
                        formattedAddress: address,
                        area: locality,
                        pincode: pincode,
                      }}
                    />
                  </div>
                </div>

                {/* 2. Customer Profile Details */}
                <div className="border-t border-slate-100 pt-6">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                    Your Contact Information
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1.5">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
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
                        required
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                        placeholder="10-digit mobile number"
                        className="h-10 w-full rounded-xl border border-slate-200 px-3 text-xs font-medium text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1.5">Email Address</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@example.com (optional)"
                        className="h-10 w-full rounded-xl border border-slate-200 px-3 text-xs font-medium text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1.5">Company / Apartment Name</label>
                      <input
                        type="text"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="Company or Apartment Name (optional)"
                        className="h-10 w-full rounded-xl border border-slate-200 px-3 text-xs font-medium text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Summary Card before Submission */}
                <div className="rounded-2xl border border-blue-100 bg-blue-50/40 p-4 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-700">Category & Subcategory:</span>
                    <span className="font-bold text-blue-600">{selectedCategory} • {selectedSubcategory}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-700">Requested Items ({items.length}):</span>
                    <span className="text-slate-600 font-medium">
                      {items.map((it) => `${it.productName} (x${it.quantity})`).join(", ")}
                    </span>
                  </div>
                  {voiceNoteData && (
                    <div className="flex justify-between items-center text-xs text-emerald-700">
                      <span className="font-bold">Voice Note:</span>
                      <span className="font-semibold">Attached ({voiceNoteData.duration}s)</span>
                    </div>
                  )}
                  <p className="text-[11px] text-slate-500 font-medium pt-2 border-t border-blue-100/60">
                    ℹ️ Note: Pricing is not displayed now. Once submitted, TechBes Admin will prepare your quotation and notify you via WhatsApp with a direct link to view and book.
                  </p>
                </div>

                {/* Navigation and Submit */}
                <div className="flex justify-between pt-4 border-t border-slate-100">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(2)}
                    className="h-11 px-5 rounded-xl text-xs font-bold gap-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Requirements
                  </Button>

                  <Button
                    type="submit"
                    disabled={submitting || !isStep3Valid}
                    className="h-11 px-8 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold gap-2 shadow-md shadow-blue-500/10"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Submitting Quotation Request...
                      </>
                    ) : (
                      <>
                        Submit Quotation Request
                        <CheckCircle2 className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </PageShell>
  );
}
