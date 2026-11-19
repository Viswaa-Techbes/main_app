"use client";

import { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  ShieldCheck,
  CheckCircle2,
  Loader2,
  Calendar,
  Clock,
  MapPin,
  Phone,
  User,
  Mail,
  Camera,
  HardDrive,
  Box,
  Layers,
  ArrowRight,
  Info,
  Sliders,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AUTH_TOKEN_STORAGE_KEY } from "@/core/api/config";

export interface PackageItem {
  productId?: string;
  productName: string;
  brand?: string;
  sku?: string;
  variant?: string;
  unit?: string;
  unitPrice?: number;
  quantity: number;
  gstRate?: number;
  availableStock?: number;
  inStock?: boolean;
}

export interface RecommendationPackage {
  id: string;
  tier: string;
  badge?: string;
  title: string;
  tagline: string;
  cameraCount: number;
  cameraType: string;
  brand: string;
  recorder: string;
  storage: string;
  isPopular?: boolean;
  items: PackageItem[];
  pricing?: {
    itemsSubtotal?: number;
    labourCharge?: number;
    serviceCharge?: number;
    subtotal?: number;
    gstRate?: number;
    gstAmount?: number;
    finalAmount?: number | null;
    priceDisplay: string;
    hasAuthoritativePricing: boolean;
  };
  features: string[];
  assumptions: string[];
  warranty: string;
}

interface PackageCustomizerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  packageData: RecommendationPackage | null;
  onQuotationSuccess?: (requestId: string) => void;
}

export function PackageCustomizerModal({
  open,
  onOpenChange,
  packageData,
  onQuotationSuccess,
}: PackageCustomizerModalProps) {
  const { toast } = useToast();

  if (!open || !packageData) return null;

  return (
    <PackageCustomizerContent
      packageData={packageData}
      onClose={() => onOpenChange(false)}
      onQuotationSuccess={onQuotationSuccess}
    />
  );
}

function PackageCustomizerContent({
  packageData,
  onClose,
  onQuotationSuccess,
}: {
  packageData: RecommendationPackage;
  onClose: () => void;
  onQuotationSuccess?: (requestId: string) => void;
}) {
  const { toast } = useToast();

  // State initialization
  const [cameraCount, setCameraCount] = useState<number>(packageData.cameraCount || 4);
  const [cableLengthNote, setCableLengthNote] = useState<string>("");
  const [includeRack, setIncludeRack] = useState<boolean>(
    packageData.tier === "Recommended" || packageData.tier === "Premium"
  );
  const [selectedStorage, setSelectedStorage] = useState<string>(
    packageData.storage.includes("2TB") ? "2TB" : packageData.storage.includes("4TB") ? "4TB" : "1TB"
  );

  // Customer Contact Fields
  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [locality, setLocality] = useState("Bangalore");
  const [pincode, setPincode] = useState("");
  const [preferredDate, setPreferredDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  });
  const [preferredTime, setPreferredTime] = useState("10:00 AM - 01:00 PM");
  const [notes, setNotes] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [submittedRequestId, setSubmittedRequestId] = useState<string | null>(null);

  // Compute customized items based on adjusted cameraCount and toggles
  const customizedItems = useMemo(() => {
    const list: PackageItem[] = [];

    // Scale camera items
    for (const item of packageData.items) {
      const lower = item.productName.toLowerCase();
      if (lower.includes("camera") || lower.includes("dome") || lower.includes("bullet")) {
        list.push({ ...item, quantity: cameraCount });
      } else if (lower.includes("junction")) {
        list.push({ ...item, quantity: cameraCount });
      } else if (lower.includes("cable") || lower.includes("cat6") || lower.includes("3+1")) {
        list.push({ ...item, quantity: cameraCount * 25 });
      } else if (lower.includes("hard drive") || lower.includes("hdd")) {
        list.push({
          ...item,
          productName: `Surveillance Hard Drive (${selectedStorage})`,
          quantity: 1,
        });
      } else if (lower.includes("rack")) {
        if (includeRack) {
          list.push({ ...item, quantity: 1 });
        }
      } else {
        list.push({ ...item });
      }
    }

    return list;
  }, [packageData, cameraCount, selectedStorage, includeRack]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim()) {
      toast({
        title: "Name Required",
        description: "Please enter your full name.",
        variant: "destructive",
      });
      return;
    }

    const cleanMobile = mobile.replace(/[^\d]/g, "");
    if (cleanMobile.length < 10) {
      toast({
        title: "Valid Mobile Required",
        description: "Please enter a valid 10-digit Indian mobile number.",
        variant: "destructive",
      });
      return;
    }

    if (!address.trim()) {
      toast({
        title: "Address Required",
        description: "Please enter your service address or Bangalore locality.",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem(AUTH_TOKEN_STORAGE_KEY) || localStorage.getItem("token") || ""
          : "";

      const fullNotes = [
        `[AI Assistant Package: ${packageData.tier} - ${packageData.title}]`,
        `Camera Units: ${cameraCount} (${packageData.cameraType})`,
        `Storage: ${selectedStorage} Surveillance Hard Drive`,
        cableLengthNote.trim() ? `Cable Note: ${cableLengthNote.trim()}` : "Cable Note: Unsure - measure during site survey",
        notes.trim() ? `Special Notes: ${notes.trim()}` : "",
      ]
        .filter(Boolean)
        .join("\n");

      const payload = {
        fullName: fullName.trim(),
        mobile: cleanMobile.slice(-10),
        email: email.trim() || undefined,
        whatsapp: cleanMobile.slice(-10),
        serviceCategory: "CCTV",
        subcategory: "Install New CCTV",
        service: "Install New CCTV",
        serviceSlug: "install-new-cctv",
        propertyType: "Home / Villa",
        cameraCount: String(cameraCount),
        storage: `${selectedStorage} Surveillance HDD`,
        recorder: packageData.recorder,
        items: customizedItems.map((it) => ({
          productId: it.productId,
          productName: it.productName,
          brand: it.brand,
          sku: it.sku,
          variant: it.variant,
          unitPrice: it.unitPrice,
          quantity: it.quantity,
          gstRate: it.gstRate || 18,
        })),
        additionalRequirements: fullNotes,
        locality: locality.trim() || "Bangalore",
        address: address.trim(),
        pincode: pincode.trim() || undefined,
        preferredVisitDate: preferredDate || undefined,
        preferredVisitTime: preferredTime || undefined,
        source: "AI Service Assistant",
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
        throw new Error(data.message || "Failed to submit quotation request.");
      }

      const reqId = data.data?.requestId || data.data?.id || `TB-QUO-${Date.now().toString().slice(-6)}`;
      setSubmittedRequestId(reqId);
      if (onQuotationSuccess) onQuotationSuccess(reqId);

      toast({
        title: "Quotation Request Submitted! 🎉",
        description: `Reference ID: ${reqId}. Our technical team will review and contact you shortly.`,
      });
    } catch (err: any) {
      toast({
        title: "Submission Error",
        description: err.message || "Please check your network connection and try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="!max-w-4xl sm:!max-w-4xl w-[94vw] max-w-[900px] max-h-[90dvh] overflow-y-auto rounded-2xl sm:rounded-3xl p-5 sm:p-8 bg-white border border-slate-100 shadow-2xl">
        <DialogHeader className="border-b border-slate-100 pb-4 text-left">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-black uppercase tracking-wider">
              {packageData.tier} Package Customizer
            </span>
            <span className="text-xs font-semibold text-slate-400">• TechBes Grounded Inventory</span>
          </div>
          <DialogTitle className="text-xl font-black text-slate-900 mt-1">
            {submittedRequestId ? "Quotation Request Received!" : `Customize ${packageData.title}`}
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500">
            {submittedRequestId
              ? "Your request has been dispatched to TechBes engineering team."
              : "Review hardware quantities, customize storage and accessories, and request an official itemized quotation."}
          </DialogDescription>
        </DialogHeader>

        {submittedRequestId ? (
          /* Success Screen */
          <div className="py-6 space-y-6 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Official Quotation Reference
              </span>
              <p className="text-2xl font-black text-blue-700 tracking-tight">{submittedRequestId}</p>
              <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                Thank you, <strong>{fullName}</strong>. We have logged your customized <strong>{cameraCount}-camera</strong> {packageData.tier} configuration.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 text-left text-xs space-y-2 max-w-md mx-auto">
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Contact Mobile:</span>
                <span className="font-bold text-slate-800">{mobile}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Site Address:</span>
                <span className="font-bold text-slate-800 truncate max-w-[200px]">{address}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Preferred Schedule:</span>
                <span className="font-bold text-slate-800">{preferredDate} • {preferredTime}</span>
              </div>
            </div>

            <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-800 text-[11px] leading-relaxed max-w-md mx-auto">
              ℹ️ A TechBes field engineer will call you shortly to confirm site survey timing and provide the finalized quote.
            </div>

            <Button
              type="button"
              onClick={onClose}
              className="w-full h-11 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md"
            >
              Done & Return to Assistant
            </Button>
          </div>
        ) : (
          /* Customization & Contact Form */
          <form onSubmit={handleSubmit} className="space-y-6 pt-2">
            {/* 1. Camera Stepper */}
            <div className="p-4 rounded-2xl bg-blue-50/40 border border-blue-200/70 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                    <Camera className="w-4 h-4 text-blue-600" /> Camera Units Required
                  </h4>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Adjust camera count (+ / -) based on your premises size.
                  </p>
                </div>

                <div className="flex items-center border border-slate-300 rounded-xl bg-white shadow-xs overflow-hidden h-9">
                  <button
                    type="button"
                    onClick={() => setCameraCount((c) => Math.max(1, c - 1))}
                    className="px-3 text-sm font-bold text-slate-600 hover:bg-slate-100 h-full transition"
                    title="Decrease camera"
                  >
                    -
                  </button>
                  <span className="px-3 text-xs font-black text-slate-900 min-w-[36px] text-center">
                    {cameraCount}
                  </span>
                  <button
                    type="button"
                    onClick={() => setCameraCount((c) => Math.min(32, c + 1))}
                    className="px-3 text-sm font-bold text-slate-600 hover:bg-slate-100 h-full transition"
                    title="Increase camera"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* 2. Hardware Options: Storage & Rack */}
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
                  <HardDrive className="w-3.5 h-3.5 text-blue-600" /> Storage Capacity (HDD)
                </label>
                <select
                  value={selectedStorage}
                  onChange={(e) => setSelectedStorage(e.target.value)}
                  className="h-9 w-full rounded-xl border border-slate-200 px-3 bg-white text-xs font-semibold text-slate-800"
                >
                  <option value="1TB">1TB SkyHawk Surveillance HDD (~12-15 Days)</option>
                  <option value="2TB">2TB WD Purple 24/7 HDD (~25-30 Days)</option>
                  <option value="4TB">4TB Ultra Surveillance HDD (~50+ Days)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
                  <Box className="w-3.5 h-3.5 text-blue-600" /> Wall Rack Enclosure
                </label>
                <div className="flex items-center h-9 px-3 rounded-xl border border-slate-200 bg-white">
                  <label className="flex items-center gap-2 cursor-pointer w-full">
                    <input
                      type="checkbox"
                      checked={includeRack}
                      onChange={(e) => setIncludeRack(e.target.checked)}
                      className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-xs font-semibold text-slate-800">
                      Include 4U Wall Mount Rack with Lock
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* 3. Cable Length Note (Optional - non-intrusive) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                  Cabling Length Estimate (Optional)
                </label>
                <span className="text-[10px] text-slate-400 font-medium">Leave blank if unknown</span>
              </div>
              <input
                type="text"
                placeholder="e.g. Approx 50 meters, or 'Not sure, technician to measure on site'"
                value={cableLengthNote}
                onChange={(e) => setCableLengthNote(e.target.value)}
                className="h-9 w-full rounded-xl border border-slate-200 px-3 bg-white text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
              <p className="text-[10px] text-slate-500 italic">
                * We include up to 25m cabling per camera point in the estimate. Final cabling is measured on site.
              </p>
            </div>

            {/* 4. Contact & Address Details */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <User className="w-4 h-4 text-blue-600" /> Customer & Site Information
              </h4>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Your Full Name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="h-9 w-full rounded-xl border border-slate-200 px-3 bg-white text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">
                    Mobile Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="10-digit Mobile Number"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    className="h-9 w-full rounded-xl border border-slate-200 px-3 bg-white text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div className="sm:col-span-2">
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">
                    Site Address / Street <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="House/Building No., Street Name, Area"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="h-9 w-full rounded-xl border border-slate-200 px-3 bg-white text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">
                    Area / Locality
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. HSR Layout, Koramangala"
                    value={locality}
                    onChange={(e) => setLocality(e.target.value)}
                    className="h-9 w-full rounded-xl border border-slate-200 px-3 bg-white text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              {/* Schedule */}
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-blue-600" /> Preferred Visit Date
                  </label>
                  <input
                    type="date"
                    min={new Date().toISOString().split("T")[0]}
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    className="h-9 w-full rounded-xl border border-slate-200 px-3 bg-white text-xs font-semibold text-slate-800"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-blue-600" /> Preferred Slot
                  </label>
                  <select
                    value={preferredTime}
                    onChange={(e) => setPreferredTime(e.target.value)}
                    className="h-9 w-full rounded-xl border border-slate-200 px-3 bg-white text-xs font-semibold text-slate-800"
                  >
                    <option value="09:00 AM - 12:00 PM">09:00 AM - 12:00 PM</option>
                    <option value="12:00 PM - 03:00 PM">12:00 PM - 03:00 PM</option>
                    <option value="03:00 PM - 06:00 PM">03:00 PM - 06:00 PM</option>
                    <option value="06:00 PM - 08:00 PM">06:00 PM - 08:00 PM</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">
                  Additional Notes (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Prefer camera above main gate and inside lobby; need night color view."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 p-2.5 bg-white text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>

            {/* 5. Summary Notice & Submit */}
            <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-2xl flex items-start gap-2 text-[11px] text-amber-900">
              <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                <strong>Official Quotation Workflow:</strong> Our backend pricing engine computes genuine hardware costs and labor. You will receive an official PDF quotation on WhatsApp and your portal for transparent approval before work begins.
              </span>
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="w-1/3 h-11 rounded-xl text-xs font-bold"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submitting}
                className="w-2/3 h-11 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Submitting Request...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    Submit Quotation Request
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
