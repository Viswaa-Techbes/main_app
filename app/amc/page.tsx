"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  ShieldCheck, 
  CheckCircle2, 
  Laptop, 
  Monitor, 
  Globe, 
  Network, 
  Camera, 
  Printer, 
  MapPin, 
  Calendar, 
  Clock, 
  ArrowRight, 
  Loader2, 
  Sparkles, 
  Check, 
  Phone, 
  FileText,
  HelpCircle,
  Building2
} from "lucide-react";
import { PageShell } from "@/components/layout/page-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { AUTH_TOKEN_STORAGE_KEY } from "@/core/api/config";

interface AmcCategoryConfig {
  id: "laptop" | "desktop" | "website" | "networking" | "cctv";
  label: string;
  shortDesc: string;
  icon: React.ComponentType<{ className?: string }>;
}

const AMC_CATEGORIES: AmcCategoryConfig[] = [
  { id: "laptop", label: "Laptop", shortDesc: "Hardware diagnostics, OS & thermal service", icon: Laptop },
  { id: "desktop", label: "Desktop", shortDesc: "PC assembly, SMPS, RAM & motherboard repair", icon: Monitor },
  { id: "website", label: "Website", shortDesc: "Security patches, uptime SLA & backups", icon: Globe },
  { id: "networking", label: "Networking", shortDesc: "Routers, switches, Wi-Fi & Cat6 cabling", icon: Network },
  { id: "cctv", label: "CCTV", shortDesc: "Cameras, DVR/NVR, storage & video loss repair", icon: Camera },
];

export default function AmcInquiryPage() {
  const { toast } = useToast();

  // Selected Categories
  const [selectedCats, setSelectedCats] = useState<Record<string, boolean>>({
    cctv: true,
    networking: true,
    laptop: false,
    desktop: false,
    website: false,
  });

  // Category Specific Fields
  // CCTV
  const [cctvCameraCount, setCctvCameraCount] = useState("4 - 8 Cameras");
  const [cctvRecorderType, setCctvRecorderType] = useState("8-Channel DVR/NVR (Hikvision / CP Plus)");
  const [cctvStorageHdd, setCctvStorageHdd] = useState("2TB Surveillance HDD");

  // Networking
  const [networkPoints, setNetworkPoints] = useState("16 - 24 LAN Drops");
  const [networkHardware, setNetworkHardware] = useState("1x Router Gateway + 2x Gigabit Switches + 2x Wi-Fi APs");
  const [networkServerRack, setNetworkServerRack] = useState("Wall-mount Rack & Patch Panel Cabling");

  // Laptop & Desktop
  const [laptopCount, setLaptopCount] = useState("5 - 10 Units");
  const [desktopCount, setDesktopCount] = useState("10 - 20 Units");
  const [deviceBrands, setDeviceBrands] = useState("Dell / HP / Lenovo Commercial");
  const [hardwareUpgradesNeeded, setHardwareUpgradesNeeded] = useState("Periodic OS tune-up, RAM/SSD upgrades & Antivirus");

  // Printers (Optional peripheral)
  const [includePrinters, setIncludePrinters] = useState(false);
  const [printerDetails, setPrinterDetails] = useState("2x HP LaserJet Network Printers (Toner & Maintenance)");

  // Website
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [websitePlatform, setWebsitePlatform] = useState("WordPress / WooCommerce");
  const [websiteMaintenanceNeeds, setWebsiteMaintenanceNeeds] = useState("Daily Backups, Security Scans, Plugin Updates & 99.9% Uptime");

  // Free Site Visit Option
  const [freeSiteVisit, setFreeSiteVisit] = useState(true);

  // Customer Contact Details
  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [address, setAddress] = useState("");
  const [preferredVisitDate, setPreferredVisitDate] = useState("");
  const [preferredVisitTime, setPreferredVisitTime] = useState("10:00 AM - 01:00 PM");
  const [notes, setNotes] = useState("");

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState<any | null>(null);

  // Toggle Category
  const toggleCategory = (id: string) => {
    setSelectedCats((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Select / Deselect All
  const handleSelectAll = (select: boolean) => {
    const updated: Record<string, boolean> = {};
    AMC_CATEGORIES.forEach((c) => {
      updated[c.id] = select;
    });
    setSelectedCats(updated);
  };

  const selectedCount = Object.values(selectedCats).filter(Boolean).length;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedCount === 0) {
      toast({
        title: "Please Select At Least One Service",
        description: "Select Laptop, Desktop, Website, Networking, or CCTV to configure your AMC inquiry.",
        variant: "destructive",
      });
      return;
    }

    if (!fullName.trim()) {
      toast({
        title: "Name Required",
        description: "Please enter your full contact name.",
        variant: "destructive",
      });
      return;
    }

    const cleanedPhone = mobile.replace(/[\s+-]/g, "");
    const isPhoneValid = /^(?:\+91|0)?[6-9]\d{9}$/.test(cleanedPhone);
    if (!mobile.trim() || !isPhoneValid) {
      toast({
        title: "Valid Mobile Required",
        description: "Please enter a valid 10-digit Indian mobile number for quotation updates.",
        variant: "destructive",
      });
      return;
    }

    if (freeSiteVisit && !address.trim()) {
      toast({
        title: "Site Address Required",
        description: "Please enter your business or premises address in Bangalore for the free on-site survey.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Build structured items based on selected categories
      const items: Array<{ productName: string; quantity: number }> = [];

      if (selectedCats.cctv) {
        items.push({
          productName: `CCTV System AMC — ${cctvCameraCount} (${cctvRecorderType}, ${cctvStorageHdd})`,
          quantity: 1,
        });
      }

      if (selectedCats.networking) {
        items.push({
          productName: `Networking Infrastructure AMC — ${networkPoints} (${networkHardware}; ${networkServerRack})`,
          quantity: 1,
        });
      }

      if (selectedCats.laptop) {
        items.push({
          productName: `Laptop Maintenance AMC — ${laptopCount} (${deviceBrands}; ${hardwareUpgradesNeeded})`,
          quantity: 1,
        });
      }

      if (selectedCats.desktop) {
        items.push({
          productName: `Desktop Maintenance AMC — ${desktopCount} (${deviceBrands}; ${hardwareUpgradesNeeded})`,
          quantity: 1,
        });
      }

      if (selectedCats.website) {
        items.push({
          productName: `Website Maintenance AMC — ${websiteUrl.trim() || "Website"} (${websitePlatform}; ${websiteMaintenanceNeeds})`,
          quantity: 1,
        });
      }

      if (includePrinters) {
        items.push({
          productName: `Printers & Scanners Maintenance: ${printerDetails}`,
          quantity: 1,
        });
      }

      if (freeSiteVisit) {
        items.push({
          productName: "Free On-Site AMC Audit & Engineering Survey (Zero Cost)",
          quantity: 1,
        });
      }

      const selectedNames = Object.entries(selectedCats)
        .filter(([_, checked]) => checked)
        .map(([id]) => id.toUpperCase())
        .join(", ");

      const token =
        (typeof window !== "undefined" &&
          (localStorage.getItem(AUTH_TOKEN_STORAGE_KEY) || localStorage.getItem("token"))) ||
        "";

      const payload = {
        fullName: fullName.trim(),
        mobile: mobile.trim(),
        email: email.trim() || undefined,
        whatsapp: mobile.trim(),
        companyName: companyName.trim() || undefined,
        serviceCategory: "AMC",
        subcategory: "Comprehensive AMC",
        items,
        propertyType: companyName.trim() ? "Corporate Commercial" : "Business / Residence",
        additionalRequirements: [
          `Covered AMC Categories: ${selectedNames}`,
          freeSiteVisit ? "Customer requested FREE ON-SITE INSPECTION & AUDIT" : "Remote Consultation & Estimated Quote",
          notes.trim() ? `Additional Notes: ${notes.trim()}` : "",
        ]
          .filter(Boolean)
          .join(" | "),
        locality: address.trim() ? address.split(",")[0] : "Bangalore",
        address: address.trim() || "Bangalore Site Location",
        preferredVisitDate: preferredVisitDate || undefined,
        preferredVisitTime: preferredVisitTime || undefined,
        source: "AMC Dedicated Inquiry Page",
      };

      const res = await fetch("/api/v2/quotes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to submit AMC quotation request.");
      }

      setSubmissionSuccess(data.data);
      toast({
        title: "AMC Request Confirmed!",
        description: `Request #${data.data.requestId} has been submitted to TechBes engineering team.`,
      });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: any) {
      toast({
        title: "Submission Failed",
        description: err.message || "Could not submit enquiry. Please verify your details and try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageShell>
      <div className="bg-slate-50/50 min-h-screen py-10">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-10">
          
          {/* Hero Banner */}
          <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white p-8 sm:p-12 shadow-md border border-blue-900/40">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.22),transparent_50%)] pointer-events-none" />
            <div className="relative z-10 max-w-3xl space-y-4">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 px-3.5 py-1 text-[10px] font-extrabold uppercase tracking-widest text-blue-300">
                <ShieldCheck className="h-3.5 w-3.5 text-blue-300" />
                Comprehensive IT Infrastructure AMC
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
                Predictable IT Maintenance <br />
                <span className="text-blue-400">Zero System Downtime</span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl font-medium">
                Tailored Annual Maintenance Contracts covering CCTV, Networking, Laptops, Desktops, and Business Websites across Bangalore. Proactive health checks and priority SLA engineer response.
              </p>

              {/* Advertised Starting Price Highlight */}
              <div className="mt-6 pt-6 border-t border-blue-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-amber-400/20 border border-amber-400/40 p-2.5 text-amber-300">
                    <Sparkles className="h-6 w-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-amber-300 block">
                      Guaranteed Transparent Value
                    </span>
                    <p className="text-base sm:text-lg font-black text-white">
                      AMC Plans Starting from <span className="text-amber-300 text-xl font-black">₹9,999</span>
                      <span className="text-xs text-slate-300 font-normal"> / year</span>
                    </p>
                  </div>
                </div>
                <div className="text-xs text-blue-200/90 font-medium max-w-xs sm:text-right">
                  * Final quotation is fully customized based on hardware quantities, scope of coverage, and site audit.
                </div>
              </div>
            </div>
          </section>

          {/* Submission Success Confirmation Screen */}
          {submissionSuccess ? (
            <div className="rounded-3xl border border-slate-100 bg-white p-8 sm:p-12 shadow-sm text-center space-y-6">
              <div className="mx-auto rounded-full bg-emerald-50 border border-emerald-100 p-4 text-emerald-600 w-fit animate-pulse">
                <CheckCircle2 className="h-12 w-12" />
              </div>
              <div className="space-y-2">
                <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                  AMC Quotation Request Confirmed
                </span>
                <h2 className="text-2xl font-black text-slate-900 sm:text-3xl">
                  Thank You, {fullName || "Valued Customer"}!
                </h2>
                <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                  Your AMC requirements have been registered in our engineering dispatch system. Our senior technical estimator will review your details and connect shortly.
                </p>
              </div>

              {/* Reference Card */}
              <div className="max-w-md mx-auto rounded-2xl border border-slate-100 bg-slate-50 p-5 text-left text-xs space-y-3">
                <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                  <span className="text-slate-400 font-semibold">Reference ID:</span>
                  <span className="font-mono font-black text-blue-600 text-sm select-all">
                    {submissionSuccess.requestId}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-semibold">Contact Mobile:</span>
                  <span className="font-bold text-slate-800">{mobile}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-semibold">Audit Visit Requested:</span>
                  <span className="font-bold text-emerald-600">
                    {freeSiteVisit ? "Yes (Free Site Survey)" : "Online Discussion"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-semibold">Premises / Address:</span>
                  <span className="font-bold text-slate-800 text-right truncate max-w-[200px]">
                    {address || "Bangalore"}
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-center gap-3 pt-4">
                <Button 
                  onClick={() => {
                    setSubmissionSuccess(null);
                    setNotes("");
                  }}
                  variant="outline"
                  className="rounded-xl font-bold text-xs h-11"
                >
                  Submit Another AMC Inquiry
                </Button>
                <Button 
                  asChild
                  className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs h-11 shadow-sm"
                >
                  <Link href="/services">
                    Browse All IT Services
                  </Link>
                </Button>
              </div>
            </div>
          ) : (
            /* Inquiry Form */
            <form onSubmit={handleSubmit} className="space-y-8">
              
              {/* Category Selection Section */}
              <section className="rounded-3xl border border-slate-100 bg-white p-6 sm:p-8 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div>
                    <h2 className="text-base font-black text-slate-900 tracking-tight sm:text-lg">
                      1. Select Categories for AMC Coverage
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Choose individual categories or select all together for an integrated workplace contract.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleSelectAll(true)}
                      className="text-xs font-bold text-blue-600 hover:text-blue-800 transition px-2.5 py-1 rounded-lg hover:bg-blue-50"
                    >
                      Select All
                    </button>
                    <span className="text-slate-300">|</span>
                    <button
                      type="button"
                      onClick={() => handleSelectAll(false)}
                      className="text-xs font-bold text-slate-500 hover:text-slate-700 transition px-2.5 py-1 rounded-lg hover:bg-slate-50"
                    >
                      Clear
                    </button>
                  </div>
                </div>

                {/* 5 Service Category Cards */}
                <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
                  {AMC_CATEGORIES.map((cat) => {
                    const Icon = cat.icon;
                    const isSelected = !!selectedCats[cat.id];
                    return (
                      <div
                        key={cat.id}
                        onClick={() => toggleCategory(cat.id)}
                        className={`group relative flex flex-col justify-between p-4 rounded-2xl border cursor-pointer transition-all duration-200 select-none ${
                          isSelected
                            ? "border-blue-600 bg-blue-50/40 shadow-sm"
                            : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50"
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className={`p-2.5 rounded-xl transition-colors ${
                            isSelected ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600 group-hover:bg-slate-200"
                          }`}>
                            <Icon className="h-5 w-5" />
                          </div>
                          <div className={`h-5 w-5 rounded-full border flex items-center justify-center transition-colors ${
                            isSelected ? "border-blue-600 bg-blue-600 text-white" : "border-slate-300 bg-white"
                          }`}>
                            {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
                          </div>
                        </div>

                        <div className="mt-4">
                          <h3 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                            {cat.label}
                          </h3>
                          <p className="text-[10px] text-slate-500 font-medium leading-relaxed mt-0.5 line-clamp-2">
                            {cat.shortDesc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* Service-Specific Details based on selection */}
              <section className="rounded-3xl border border-slate-100 bg-white p-6 sm:p-8 shadow-sm space-y-6">
                <div className="pb-4 border-b border-slate-100">
                  <h2 className="text-base font-black text-slate-900 tracking-tight sm:text-lg">
                    2. Requirements &amp; Equipment Specifications
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Provide approximate counts and technical details for each selected service.
                  </p>
                </div>

                {selectedCount === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-xs text-slate-400 font-medium">
                    Please select at least one category above to view and configure service specifications.
                  </div>
                ) : (
                  <div className="space-y-6">
                    
                    {/* CCTV Fields */}
                    {selectedCats.cctv && (
                      <div className="rounded-2xl border border-sky-100 bg-sky-50/30 p-5 space-y-4">
                        <div className="flex items-center gap-2 text-sky-800 font-bold text-xs uppercase tracking-wider">
                          <Camera className="h-4 w-4 text-sky-600" />
                          <span>CCTV Surveillance Details</span>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-3">
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-700 block">
                              Number of Cameras
                            </label>
                            <select
                              value={cctvCameraCount}
                              onChange={(e) => setCctvCameraCount(e.target.value)}
                              className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-blue-500/20"
                            >
                              <option value="1 - 4 Cameras">1 - 4 Cameras</option>
                              <option value="4 - 8 Cameras">4 - 8 Cameras</option>
                              <option value="9 - 16 Cameras">9 - 16 Cameras</option>
                              <option value="17 - 32 Cameras">17 - 32 Cameras</option>
                              <option value="32+ Enterprise Facility">32+ Enterprise Facility</option>
                            </select>
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-700 block">
                              Recorder (DVR / NVR) Type
                            </label>
                            <select
                              value={cctvRecorderType}
                              onChange={(e) => setCctvRecorderType(e.target.value)}
                              className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-blue-500/20"
                            >
                              <option value="4-Channel Recorder">4-Channel DVR / NVR</option>
                              <option value="8-Channel DVR/NVR (Hikvision / CP Plus)">8-Channel DVR / NVR</option>
                              <option value="16-Channel DVR / NVR">16-Channel DVR / NVR</option>
                              <option value="32-Channel NVR Server">32-Channel NVR Server</option>
                              <option value="Multiple Distributed Recorders">Multiple Distributed Recorders</option>
                            </select>
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-700 block">
                              Surveillance Storage (HDD)
                            </label>
                            <select
                              value={cctvStorageHdd}
                              onChange={(e) => setCctvStorageHdd(e.target.value)}
                              className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-blue-500/20"
                            >
                              <option value="1TB HDD (15 days backup)">1TB HDD (15 days backup)</option>
                              <option value="2TB Surveillance HDD">2TB Surveillance HDD</option>
                              <option value="4TB Surveillance HDD">4TB Surveillance HDD</option>
                              <option value="8TB+ Enterprise Storage">8TB+ Enterprise Storage</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Networking Fields */}
                    {selectedCats.networking && (
                      <div className="rounded-2xl border border-emerald-100 bg-emerald-50/30 p-5 space-y-4">
                        <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs uppercase tracking-wider">
                          <Network className="h-4 w-4 text-emerald-600" />
                          <span>Networking &amp; Cabling Infrastructure</span>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-3">
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-700 block">
                              Active LAN Network Points
                            </label>
                            <select
                              value={networkPoints}
                              onChange={(e) => setNetworkPoints(e.target.value)}
                              className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-blue-500/20"
                            >
                              <option value="1 - 10 LAN Drops">1 - 10 LAN Drops</option>
                              <option value="16 - 24 LAN Drops">16 - 24 LAN Drops</option>
                              <option value="25 - 50 LAN Drops">25 - 50 LAN Drops</option>
                              <option value="50+ Enterprise Cabling">50+ Enterprise Cabling</option>
                            </select>
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-700 block">
                              Switches, Routers &amp; Access Points
                            </label>
                            <input
                              type="text"
                              value={networkHardware}
                              onChange={(e) => setNetworkHardware(e.target.value)}
                              placeholder="e.g. 1x Gateway, 2x 24-Port Switch, 4x Wi-Fi APs"
                              className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-blue-500/20"
                            />
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-700 block">
                              Server, Racks &amp; Cabling Scope
                            </label>
                            <input
                              type="text"
                              value={networkServerRack}
                              onChange={(e) => setNetworkServerRack(e.target.value)}
                              placeholder="e.g. 9U Rack, Cat6 patching, NAS local server"
                              className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-blue-500/20"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Laptop & Desktop Fields */}
                    {(selectedCats.laptop || selectedCats.desktop) && (
                      <div className="rounded-2xl border border-indigo-100 bg-indigo-50/30 p-5 space-y-4">
                        <div className="flex items-center gap-2 text-indigo-800 font-bold text-xs uppercase tracking-wider">
                          <Laptop className="h-4 w-4 text-indigo-600" />
                          <span>Computer Systems (Laptop &amp; Desktop)</span>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                          {selectedCats.laptop && (
                            <div className="space-y-1.5">
                              <label className="text-xs font-bold text-slate-700 block">
                                Laptop Quantity
                              </label>
                              <select
                                value={laptopCount}
                                onChange={(e) => setLaptopCount(e.target.value)}
                                className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-blue-500/20"
                              >
                                <option value="1 - 5 Laptops">1 - 5 Laptops</option>
                                <option value="5 - 10 Units">5 - 10 Units</option>
                                <option value="11 - 25 Units">11 - 25 Units</option>
                                <option value="25+ Enterprise Fleet">25+ Enterprise Fleet</option>
                              </select>
                            </div>
                          )}

                          {selectedCats.desktop && (
                            <div className="space-y-1.5">
                              <label className="text-xs font-bold text-slate-700 block">
                                Desktop PC Quantity
                              </label>
                              <select
                                value={desktopCount}
                                onChange={(e) => setDesktopCount(e.target.value)}
                                className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-blue-500/20"
                              >
                                <option value="1 - 5 Desktops">1 - 5 Desktops</option>
                                <option value="10 - 20 Units">10 - 20 Units</option>
                                <option value="21 - 50 Units">21 - 50 Units</option>
                                <option value="50+ Workstations">50+ Workstations</option>
                              </select>
                            </div>
                          )}

                          <div className="space-y-1.5 sm:col-span-2">
                            <label className="text-xs font-bold text-slate-700 block">
                              Device Brands &amp; Hardware Requirements
                            </label>
                            <input
                              type="text"
                              value={hardwareUpgradesNeeded}
                              onChange={(e) => setHardwareUpgradesNeeded(e.target.value)}
                              placeholder="e.g. Dell / HP, RAM upgrades, SSD upgrades, Antivirus"
                              className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-blue-500/20"
                            />
                          </div>
                        </div>

                        {/* Optional Printers Checkbox */}
                        <div className="pt-2 border-t border-indigo-100/70">
                          <label className="flex items-center gap-2.5 cursor-pointer text-xs font-bold text-slate-800">
                            <input
                              type="checkbox"
                              checked={includePrinters}
                              onChange={(e) => setIncludePrinters(e.target.checked)}
                              className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                            />
                            <Printer className="h-4 w-4 text-indigo-600" />
                            <span>Include Office Printers &amp; Scanners in AMC</span>
                          </label>

                          {includePrinters && (
                            <div className="mt-3">
                              <input
                                type="text"
                                value={printerDetails}
                                onChange={(e) => setPrinterDetails(e.target.value)}
                                placeholder="e.g. 2x HP LaserJet Multifunction, 1x Canon InkTank"
                                className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-blue-500/20"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Website Fields */}
                    {selectedCats.website && (
                      <div className="rounded-2xl border border-violet-100 bg-violet-50/30 p-5 space-y-4">
                        <div className="flex items-center gap-2 text-violet-800 font-bold text-xs uppercase tracking-wider">
                          <Globe className="h-4 w-4 text-violet-600" />
                          <span>Website AMC &amp; Application Maintenance</span>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-3">
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-700 block">
                              Website URL / Domain
                            </label>
                            <input
                              type="url"
                              value={websiteUrl}
                              onChange={(e) => setWebsiteUrl(e.target.value)}
                              placeholder="https://yourcompany.com"
                              className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-blue-500/20"
                            />
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-700 block">
                              CMS / Framework
                            </label>
                            <select
                              value={websitePlatform}
                              onChange={(e) => setWebsitePlatform(e.target.value)}
                              className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-blue-500/20"
                            >
                              <option value="WordPress / WooCommerce">WordPress / WooCommerce</option>
                              <option value="Custom React / Next.js / Node">Custom React / Next.js / Node</option>
                              <option value="Shopify / E-Commerce">Shopify / E-Commerce</option>
                              <option value="PHP / Laravel / CodeIgniter">PHP / Laravel / CodeIgniter</option>
                              <option value="Static HTML / Webflow">Static HTML / Webflow</option>
                            </select>
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-700 block">
                              Maintenance Scope
                            </label>
                            <input
                              type="text"
                              value={websiteMaintenanceNeeds}
                              onChange={(e) => setWebsiteMaintenanceNeeds(e.target.value)}
                              placeholder="Daily backups, security audits, SLA uptime"
                              className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-blue-500/20"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                  </div>
                )}
              </section>

              {/* Free Site Visit & Audit Option */}
              <section className="rounded-3xl border border-blue-200 bg-gradient-to-r from-blue-50/80 via-white to-blue-50/40 p-6 sm:p-7 shadow-sm">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={freeSiteVisit}
                    onChange={(e) => setFreeSiteVisit(e.target.checked)}
                    className="h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 mt-0.5 shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-black text-slate-900">
                        Request a Free On-Site Inspection &amp; Audit in Bangalore
                      </span>
                      <span className="rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider">
                        Free Survey
                      </span>
                    </div>
                    <p className="text-xs text-slate-650 font-medium leading-relaxed mt-1">
                      Our certified senior technician will physically inspect your premises, audit your existing CCTV cameras, network points, and computers, and furnish a tailored quotation with zero obligation.
                    </p>
                  </div>
                </label>
              </section>

              {/* Customer Contact & Site Details */}
              <section className="rounded-3xl border border-slate-100 bg-white p-6 sm:p-8 shadow-sm space-y-6">
                <div className="pb-4 border-b border-slate-100">
                  <h2 className="text-base font-black text-slate-900 tracking-tight sm:text-lg">
                    3. Contact &amp; Site Information
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    We will send the quotation details and schedule the engineer visit through these details.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">
                      Contact Name <span className="text-rose-500">*</span>
                    </label>
                    <Input
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Your Full Name"
                      className="h-10 rounded-xl text-xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">
                      Mobile Number <span className="text-rose-500">*</span>
                    </label>
                    <Input
                      required
                      type="tel"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      placeholder="10-digit mobile number"
                      className="h-10 rounded-xl text-xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">
                      Email Address (Optional)
                    </label>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="office@yourcompany.com"
                      className="h-10 rounded-xl text-xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">
                      Business / Organization Name
                    </label>
                    <Input
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="e.g. Acme Tech Solutions"
                      className="h-10 rounded-xl text-xs"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">
                    Business / Site Address in Bangalore <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    required={freeSiteVisit}
                    rows={2}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Enter complete office/premises address, building name, area and pincode"
                    className="w-full rounded-xl border border-slate-200 p-3 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-blue-500/20 bg-slate-50 focus:bg-white"
                  />
                </div>

                {freeSiteVisit && (
                  <div className="grid gap-4 sm:grid-cols-2 pt-1">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 block">
                        Preferred Audit Date
                      </label>
                      <Input
                        type="date"
                        value={preferredVisitDate}
                        onChange={(e) => setPreferredVisitDate(e.target.value)}
                        className="h-10 rounded-xl text-xs"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 block">
                        Preferred Time Slot
                      </label>
                      <select
                        value={preferredVisitTime}
                        onChange={(e) => setPreferredVisitTime(e.target.value)}
                        className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-blue-500/20"
                      >
                        <option value="10:00 AM - 01:00 PM">10:00 AM - 01:00 PM (Morning)</option>
                        <option value="02:00 PM - 05:00 PM">02:00 PM - 05:00 PM (Afternoon)</option>
                        <option value="05:00 PM - 07:00 PM">05:00 PM - 07:00 PM (Evening)</option>
                      </select>
                    </div>
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">
                    Additional Notes &amp; Specific Equipment Details
                  </label>
                  <textarea
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Share any other existing issues, special warranty requirements, or site visit directions..."
                    className="w-full rounded-xl border border-slate-200 p-3 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-blue-500/20 bg-slate-50 focus:bg-white"
                  />
                </div>
              </section>

              {/* Submit Button & Starting Price Guarantee Banner */}
              <div className="rounded-3xl border border-slate-100 bg-white p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                    <ShieldCheck className="h-4 w-4 text-blue-600" />
                    <span>Advertised Rate: Starting from ₹9,999 / year</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 max-w-md">
                    Custom itemized quotation will be generated according to your actual hardware and scope. No arbitrary fixed calculators.
                  </p>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-12 px-8 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all hover:scale-102 flex items-center justify-center gap-2 shrink-0 min-w-[220px]"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Submitting Request...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit AMC Inquiry</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>

            </form>
          )}

          {/* Quick FAQ Strip */}
          <section className="rounded-3xl border border-slate-100 bg-white p-6 sm:p-8 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <HelpCircle className="h-4 w-4 text-blue-600" />
              Frequently Asked Questions About TechBes AMC
            </h3>
            <div className="grid gap-4 sm:grid-cols-2 text-xs text-slate-600 font-medium">
              <div className="rounded-xl bg-slate-50 p-4 border border-slate-100">
                <h4 className="font-bold text-slate-900 mb-1">How is the final AMC price calculated?</h4>
                <p className="leading-relaxed">
                  The ₹9,999 figure is our advertised starting baseline. The final quotation is tailored based on your camera counts, network drop counts, server complexity, and preventive visit frequency.
                </p>
              </div>
              <div className="rounded-xl bg-slate-50 p-4 border border-slate-100">
                <h4 className="font-bold text-slate-900 mb-1">What is included in the Free Site Audit?</h4>
                <p className="leading-relaxed">
                  Our senior certified technician visits your office/premises across Bangalore, inspects all cabling, switches, cameras, and computers, and provides a health score and itemized proposal at zero charge.
                </p>
              </div>
            </div>
          </section>

        </div>
      </div>
    </PageShell>
  );
}
