"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import {
  Calendar,
  Clock,
  FileText,
  Zap,
  CheckCircle2,
  Info,
  Loader2,
  MapPin,
  Plus,
  Trash2,
  Mic,
  Phone,
  User,
  Mail,
  Building,
  ShieldCheck,
  PackageCheck,
  Camera,
  Network,
  Globe,
  SlidersHorizontal,
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cctvApi, CctvSubcategory } from "@/lib/cctv-api";
import { useToast } from "@/hooks/use-toast";
import dynamic from "next/dynamic";
import { AUTH_TOKEN_STORAGE_KEY } from "@/core/api/config";
import { VoiceNoteRecorder } from "@/components/quotation/VoiceNoteRecorder";

const LocationPicker = dynamic(() => import("./LocationPicker"), { ssr: false });

interface QuotationItem {
  id: string;
  productName: string;
  quantity: number;
}

// Quick suggestions per category
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
    "Cat6 LAN Point Cabling",
    "Dual-Band Wi-Fi 6 Router",
    "8-Port Gigabit Switch",
    "16-Port / 24-Port Gigabit Switch",
    "Ceiling Mount Wi-Fi Access Point",
    "Structured Cabling (Meters)",
    "9U Server / Network Rack",
    "Patch Panel (24 Ports)",
    "PoE Injector / Switch",
    "RJ45 Wall Plates & Keystone",
  ],
  "Web Designing": [
    "Corporate Business Website",
    "E-Commerce Online Store",
    "High-Converting Landing Page",
    "Custom Web Application / Portal",
    "Payment Gateway Integration",
    "Domain & High-Speed Cloud Hosting",
    "Website UI/UX Redesign",
    "SEO & Speed Optimization",
    "Annual Maintenance Contract (AMC)",
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

export function ServiceBookingConfigModal({
  open,
  onOpenChange,
  service,
  editItem,
  onRequestQuote,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  service: CctvSubcategory;
  editItem?: any | null;
  onRequestQuote?: () => void;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();

  // Scroll target refs for validation
  const requirementsRef = useRef<HTMLDivElement>(null);
  const productsRef = useRef<HTMLDivElement>(null);
  const scheduleRef = useRef<HTMLDivElement>(null);
  const locationRef = useRef<HTMLDivElement>(null);
  const customerDetailsRef = useRef<HTMLDivElement>(null);

  // Core Form States
  const [selectedPackageId, setSelectedPackageId] = useState<string>("");
  const [notes, setNotes] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("09:00 AM - 12:00 PM");

  // Customer Contact details
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");

  // Address and Map location states
  const [savedAddresses, setSavedAddresses] = useState<any[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [stateName, setStateName] = useState("");
  const [pincode, setPincode] = useState("");
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);

  // Structured address details
  const [houseNumber, setHouseNumber] = useState("");
  const [street, setStreet] = useState("");
  const [area, setArea] = useState("");
  const [landmark, setLandmark] = useState("");
  const [district, setDistrict] = useState("");
  const [floor, setFloor] = useState("");
  const [apartmentName, setApartmentName] = useState("");
  const [formattedAddress, setFormattedAddress] = useState("");

  // Quotation Custom Items & Voice Note
  const [quotationItems, setQuotationItems] = useState<QuotationItem[]>([]);
  const [newItemName, setNewItemName] = useState("");
  const [newItemQty, setNewItemQty] = useState(1);
  const [voiceNoteData, setVoiceNoteData] = useState<{
    url: string;
    duration: number;
    filename: string;
    mimeType: string;
  } | null>(null);

  const [submittedQuote, setSubmittedQuote] = useState<any | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Category detection
  const isNetworking = useMemo(() => {
    const slug = (service.slug || "").toLowerCase();
    const cat = String(service.categoryId || "").toLowerCase();
    return (
      slug.includes("network") ||
      cat.includes("network") ||
      (service.name || "").toLowerCase().includes("network")
    );
  }, [service]);

  const isWebDesigning = useMemo(() => {
    const slug = (service.slug || "").toLowerCase();
    const cat = String(service.categoryId || "").toLowerCase();
    return (
      slug.includes("web") ||
      cat.includes("web") ||
      (service.name || "").toLowerCase().includes("web")
    );
  }, [service]);

  const serviceCategoryLabel = useMemo(() => {
    if (isNetworking) return "Networking";
    if (isWebDesigning) return "Web Designing";
    return "CCTV";
  }, [isNetworking, isWebDesigning]);

  const isBuyCctvProducts = service.slug === "buy-cctv-products";
  const isInstallNewCctv =
    service.slug === "install-new-cctv" ||
    (!isNetworking && !isWebDesigning && !isBuyCctvProducts);

  const [availableProducts, setAvailableProducts] = useState<any[]>([]);
  const [selectedProductsCheckboxes, setSelectedProductsCheckboxes] = useState<
    Record<string, boolean>
  >({});
  const [selectedProductQuantities, setSelectedProductQuantities] = useState<
    Record<string, number>
  >({});
  const [selectedProductVariants, setSelectedProductVariants] = useState<
    Record<string, string>
  >({});

  // CCTV Hardware Specifications
  const [cctvPropertyType, setCctvPropertyType] = useState<string>("Home");
  const [cctvSelectedCameraTypes, setCctvSelectedCameraTypes] = useState<
    Record<string, boolean>
  >({ "Dome Camera": true, "Bullet Camera": true });
  const [cctvCameraQuantities, setCctvCameraQuantities] = useState<
    Record<string, number>
  >({ "Dome Camera": 4, "Bullet Camera": 2 });

  const [cctvCameraBrands, setCctvCameraBrands] = useState<Record<string, string>>({});
  const [cctvCameraModels, setCctvCameraModels] = useState<Record<string, string>>({});
  const [cctvSdCardEnabled, setCctvSdCardEnabled] = useState<boolean>(false);
  const [cctvSdCardCapacity, setCctvSdCardCapacity] = useState<string>("");
  const [cctvSdCardQuantity, setCctvSdCardQuantity] = useState<number>(1);
  const [cctvInstallationRequired, setCctvInstallationRequired] =
    useState<boolean>(true);
  const [cctvCableType, setCctvCableType] = useState<string>("CAT6 Solid Copper");
  const [cctvCableLength, setCctvCableLength] = useState<number>(90);
  const [cctvDvrChannels, setCctvDvrChannels] = useState<string>("4 Channel");
  const [cctvDvrManualOverride, setCctvDvrManualOverride] =
    useState<boolean>(false);
  const [cctvNetworkRack, setCctvNetworkRack] = useState<boolean>(false);
  const [cctvMonitorMounting, setCctvMonitorMounting] = useState<boolean>(false);
  const [cctvHddCapacity, setCctvHddCapacity] = useState<string>("1TB");
  const [cctvRackType, setCctvRackType] = useState<string>("");

  // Dynamic CCTV metadata tables
  const [cctvBrands, setCctvBrands] = useState<any[]>([]);
  const [cctvAllModels, setCctvAllModels] = useState<any[]>([]);

  const cctvTotalCameras = useMemo(() => {
    return Object.entries(cctvSelectedCameraTypes)
      .filter(([_, checked]) => checked)
      .reduce((sum, [type]) => sum + (cctvCameraQuantities[type] || 1), 0);
  }, [cctvSelectedCameraTypes, cctvCameraQuantities]);

  const hasAnalog = useMemo(() => {
    return Object.entries(cctvSelectedCameraTypes)
      .filter(([_, checked]) => checked)
      .some(([type]) => type === "Analog Camera");
  }, [cctvSelectedCameraTypes]);

  const showSdCardSection = useMemo(() => {
    return Object.entries(cctvSelectedCameraTypes)
      .filter(([_, checked]) => checked)
      .some(([type]) =>
        ["WiFi Indoor Camera", "WiFi Outdoor Camera", "4G Camera"].includes(type)
      );
  }, [cctvSelectedCameraTypes]);

  useEffect(() => {
    if (!showSdCardSection) {
      setCctvSdCardEnabled(false);
    }
  }, [showSdCardSection]);

  useEffect(() => {
    if (isInstallNewCctv && !cctvDvrManualOverride) {
      let rec = "None";
      if (cctvTotalCameras > 0) {
        if (cctvTotalCameras <= 4) rec = "4 Channel";
        else if (cctvTotalCameras <= 8) rec = "8 Channel";
        else if (cctvTotalCameras <= 16) rec = "16 Channel";
        else rec = "32 Channel";
      }
      setCctvDvrChannels(rec);
    }
  }, [cctvTotalCameras, isInstallNewCctv, cctvDvrManualOverride]);

  // Reset state on modal close
  useEffect(() => {
    if (!open) {
      setSelectedPackageId("");
      setNotes("");
      setDate("");
      setTime("09:00 AM - 12:00 PM");
      setQuotationItems([]);
      setNewItemName("");
      setNewItemQty(1);
      setVoiceNoteData(null);
      setSubmittedQuote(null);
    }
  }, [open]);

  // Load user profile & metadata
  useEffect(() => {
    if (!open) return;
    const token =
      localStorage.getItem(AUTH_TOKEN_STORAGE_KEY) ||
      localStorage.getItem("token") ||
      "";

    if (token) {
      fetch("/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((r) => (r.ok ? r.json() : {}))
        .then((json: any) => {
          if (json.success && json.data) {
            setCustomerName(json.data.name || "");
            setCustomerPhone(json.data.mobileNumber || json.data.phone || "");
            setCustomerEmail(json.data.email || "");
          }
        })
        .catch(() => {});

      fetch("/api/user/address", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((r) => (r.ok ? r.json() : {}))
        .then((json: any) => {
          const list = Array.isArray(json.data)
            ? json.data
            : Array.isArray(json)
            ? json
            : [];
          setSavedAddresses(list);
          const def = list.find((a: any) => a.isDefault) || list[0];
          if (def) {
            setSelectedAddressId(def._id);
            setAddress(def.address || "");
            setCity(def.city || "");
            setStateName(def.state || "");
            setPincode(def.pincode || "");
            setLatitude(def.latitude || null);
            setLongitude(def.longitude || null);
            setFormattedAddress(def.formattedAddress || def.address || "");
          }
        })
        .catch(() => {});
    }

    // Load CCTV options
    if (isInstallNewCctv || isBuyCctvProducts) {
      Promise.all([
        fetch("/api/v2/cctv/brands")
          .then((r) => r.json())
          .catch(() => ({ data: [] })),
        fetch("/api/v2/cctv/models")
          .then((r) => r.json())
          .catch(() => ({ data: [] })),
      ]).then(([br, md]) => {
        const brandsList = br?.data || [];
        const modelsList = md?.data || [];
        setCctvBrands(brandsList);
        setCctvAllModels(modelsList);

        if (brandsList.length > 0) {
          const firstBrand = brandsList[0]._id;
          setCctvCameraBrands((prev) => {
            const updated = { ...prev };
            Object.keys(cctvSelectedCameraTypes).forEach((t) => {
              if (!updated[t]) updated[t] = firstBrand;
            });
            return updated;
          });
        }
      });
    }

    if (isBuyCctvProducts) {
      cctvApi
        .products()
        .then((json: any) => {
          const list = Array.isArray(json) ? json : json?.data || [];
          setAvailableProducts(list);
        })
        .catch(() => {});
    }
  }, [open, isInstallNewCctv, isBuyCctvProducts]);

  // Add Item / Manage Items helpers
  const handleAddCustomItem = (nameToAdd?: string, qtyToAdd?: number) => {
    const name = (nameToAdd || newItemName).trim();
    const qty = qtyToAdd || newItemQty;
    if (!name) {
      toast({
        title: "Product / Service Required",
        description: "Please specify or choose an item name to add.",
        variant: "destructive",
      });
      return;
    }
    setQuotationItems((prev) => [
      ...prev,
      {
        id: "item-" + Date.now() + "-" + Math.random().toString(36).substr(2, 4),
        productName: name,
        quantity: Math.max(1, qty),
      },
    ]);
    setNewItemName("");
    setNewItemQty(1);
  };

  const handleUpdateItemQty = (id: string, qty: number) => {
    if (qty <= 0) {
      handleRemoveItem(id);
      return;
    }
    setQuotationItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, quantity: qty } : it))
    );
  };

  const handleRemoveItem = (id: string) => {
    setQuotationItems((prev) => prev.filter((it) => it.id !== id));
  };

  // Compile final quotation items list (Name & Quantity only - NO PRICING EXPOSED)
  const finalItemsToSubmit = useMemo(() => {
    const list: { productName: string; quantity: number }[] = [];

    if (isInstallNewCctv) {
      // Camera Hardware
      Object.entries(cctvSelectedCameraTypes).forEach(([type, checked]) => {
        if (checked) {
          const qty = cctvCameraQuantities[type] || 1;
          const bId = cctvCameraBrands[type];
          const mId = cctvCameraModels[type];
          const brandObj = cctvBrands.find((b) => b._id === bId);
          const modelObj = cctvAllModels.find((m) => m._id === mId);
          const detail = modelObj
            ? `${brandObj?.name || ""} ${modelObj.resolution || ""} ${
                modelObj.name || ""
              }`.trim()
            : "";
          list.push({
            productName: detail ? `${type} (${detail})` : type,
            quantity: qty,
          });
        }
      });

      // Cabling & Installation
      if (cctvInstallationRequired) {
        if (cctvCableLength > 0) {
          list.push({
            productName: `${cctvCableType || "CAT6"} Cabling (${cctvCableLength} meters)`,
            quantity: 1,
          });
        }
        list.push({
          productName: "Camera Fitting & Alignment Service",
          quantity: cctvTotalCameras || 1,
        });
      }

      // Recorder DVR / NVR
      if (cctvDvrChannels && cctvDvrChannels !== "None") {
        list.push({
          productName: `${cctvDvrChannels} ${hasAnalog ? "DVR" : "NVR"} Recorder Unit`,
          quantity: 1,
        });
      }

      // SD Card
      if (cctvSdCardEnabled && cctvSdCardCapacity) {
        list.push({
          productName: `Surveillance SD Card (${cctvSdCardCapacity})`,
          quantity: cctvSdCardQuantity || 1,
        });
      }

      // HDD
      if (cctvHddCapacity) {
        list.push({
          productName: `Surveillance Hard Drive (${cctvHddCapacity})`,
          quantity: 1,
        });
      }

      // Rack & Accessories
      if (cctvRackType) {
        list.push({
          productName: `Wall-Mount Rack (${cctvRackType})`,
          quantity: 1,
        });
      }
      if (cctvNetworkRack) {
        list.push({
          productName: "Network Rack Installation & Dressing",
          quantity: 1,
        });
      }
      if (cctvMonitorMounting) {
        list.push({
          productName: "Display Monitor Wall Mounting",
          quantity: 1,
        });
      }
    } else if (isBuyCctvProducts) {
      // Products from store
      Object.entries(selectedProductsCheckboxes).forEach(([prodId, checked]) => {
        if (checked) {
          const p = availableProducts.find(
            (item) => item._id === prodId || item.id === prodId
          );
          if (p) {
            const v = selectedProductVariants[prodId];
            const q = selectedProductQuantities[prodId] || 1;
            list.push({
              productName: `${p.name || p.title}${v ? ` (${v})` : ""}`,
              quantity: q,
            });
          }
        }
      });
    } else {
      // General service or scope package
      if (selectedPackageId) {
        const pkg = service.packages?.find((p: any) => p._id === selectedPackageId);
        if (pkg) {
          list.push({ productName: `${service.name} — ${pkg.name}`, quantity: 1 });
        }
      }
    }

    // Add extra user-specified custom items
    quotationItems.forEach((it) => {
      list.push({ productName: it.productName, quantity: it.quantity });
    });

    // Fallback if none of the above but service is selected
    if (list.length === 0 && !isInstallNewCctv && !isBuyCctvProducts) {
      list.push({
        productName: `${service.name} Standard Requirement`,
        quantity: 1,
      });
    }

    return list;
  }, [
    isInstallNewCctv,
    isBuyCctvProducts,
    cctvSelectedCameraTypes,
    cctvCameraQuantities,
    cctvCameraBrands,
    cctvCameraModels,
    cctvBrands,
    cctvAllModels,
    cctvInstallationRequired,
    cctvCableLength,
    cctvCableType,
    cctvTotalCameras,
    cctvDvrChannels,
    hasAnalog,
    cctvSdCardEnabled,
    cctvSdCardCapacity,
    cctvSdCardQuantity,
    cctvHddCapacity,
    cctvRackType,
    cctvNetworkRack,
    cctvMonitorMounting,
    selectedProductsCheckboxes,
    availableProducts,
    selectedProductVariants,
    selectedProductQuantities,
    selectedPackageId,
    service.packages,
    service.name,
    quotationItems,
  ]);

  // Submit Quotation Request to Backend with validation and smooth scrolling
  const handleSubmitQuotation = async () => {
    // 1. Validate Items
    if (finalItemsToSubmit.length === 0) {
      toast({
        title: "Product / Service Required",
        description:
          "Please select or add at least one camera, item, or scope requirement.",
        variant: "destructive",
      });
      productsRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    // 2. Validate Preferred Date
    if (!date) {
      toast({
        title: "Preferred Date Required",
        description: "Please choose your preferred site visit date.",
        variant: "destructive",
      });
      scheduleRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    // 3. Validate Service Location
    if (!address.trim() && !formattedAddress.trim()) {
      toast({
        title: "Service Location Required",
        description:
          "Please pin your installation address on the map or enter your location.",
        variant: "destructive",
      });
      locationRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    // 4. Validate Customer Details
    if (!customerName.trim()) {
      toast({
        title: "Name Required",
        description: "Please enter your full name.",
        variant: "destructive",
      });
      customerDetailsRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      return;
    }

    const cleanedPhone = customerPhone.replace(/[\s+-]/g, "");
    const isPhoneValid = /^(?:\+91|0)?[6-9]\d{9}$/.test(cleanedPhone);
    if (!customerPhone.trim() || !isPhoneValid) {
      toast({
        title: "Valid Mobile Required",
        description:
          "Please enter a valid 10-digit mobile number for quotation updates.",
        variant: "destructive",
      });
      customerDetailsRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      return;
    }

    setSubmitting(true);
    try {
      const token =
        localStorage.getItem(AUTH_TOKEN_STORAGE_KEY) ||
        localStorage.getItem("token") ||
        "";

      const payload = {
        fullName: customerName.trim(),
        mobile: customerPhone.trim(),
        email: customerEmail.trim() || undefined,
        whatsapp: customerPhone.trim(),
        serviceCategory: serviceCategoryLabel,
        subcategory: service.name,
        items: finalItemsToSubmit,
        propertyType: cctvPropertyType || undefined,
        additionalRequirements: notes.trim() || undefined,
        voiceNote: voiceNoteData
          ? {
              url: voiceNoteData.url,
              duration: voiceNoteData.duration,
              filename: voiceNoteData.filename,
              mimeType: voiceNoteData.mimeType,
            }
          : undefined,
        locality:
          area ||
          district ||
          city ||
          (address ? address.split(",")[0] : "Bangalore"),
        pincode: pincode || undefined,
        address: formattedAddress || address,
        latitude: latitude || 12.9716,
        longitude: longitude || 77.5946,
        preferredVisitDate: date || undefined,
        preferredVisitTime: time || undefined,
        source: "Website Quotation Modal",
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

      setSubmittedQuote(data.data);
      toast({
        title: "Quotation Request Submitted!",
        description: `Request #${data.data.requestId} has been sent to our engineering team.`,
      });
    } catch (err: any) {
      toast({
        title: "Submission Error",
        description: err.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const currentSuggestions =
    CATEGORY_ITEM_SUGGESTIONS[serviceCategoryLabel] ||
    CATEGORY_ITEM_SUGGESTIONS["CCTV"];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-4xl rounded-[28px] p-6 sm:p-8 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.14)] border border-slate-100">
        <DialogHeader className="border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              {serviceCategoryLabel} Quotation
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              No Upfront Payment
            </span>
          </div>
          <DialogTitle className="text-2xl font-black text-slate-900 mt-2">
            Request Quotation: {service.name}
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500 font-medium">
            Fill in your requirements below. Our engineering team prepares custom
            itemized pricing with warranties and sends the quote to your customer
            portal & WhatsApp.
          </DialogDescription>
        </DialogHeader>

        {submittedQuote ? (
          /* SUCCESS CONFIRMATION VIEW (NO CHECKOUT / PAYMENT) */
          <div className="py-8 px-4 text-center space-y-6 animate-fadeIn">
            <div className="mx-auto w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/10">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <span className="inline-block px-3.5 py-1 bg-blue-50 border border-blue-200 text-blue-700 text-xs font-black uppercase tracking-wider rounded-full">
                Request ID: {submittedQuote.requestId}
              </span>
              <h3 className="text-2xl font-black text-slate-900">
                Quotation Request Received!
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed font-medium">
                Thank you,{" "}
                <span className="font-bold text-slate-800">
                  {submittedQuote.fullName}
                </span>
                ! Your requirement containing{" "}
                <span className="font-bold text-slate-800">
                  {submittedQuote.itemsCount} item(s)
                </span>{" "}
                has been submitted to TechBes engineering.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-slate-50/80 p-5 max-w-md mx-auto text-left text-xs space-y-2.5 text-slate-600">
              <div className="flex justify-between">
                <span className="font-semibold text-slate-500">Service Category:</span>
                <span className="font-bold text-slate-800">
                  {submittedQuote.serviceCategory}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-slate-500">Service:</span>
                <span className="font-bold text-slate-800">{service.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-slate-500">Area / Locality:</span>
                <span className="font-bold text-slate-800">
                  {submittedQuote.locality}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-slate-500">Status:</span>
                <span className="font-bold text-amber-600">
                  Under Engineering Review
                </span>
              </div>
              {voiceNoteData && (
                <div className="flex justify-between border-t border-slate-200 pt-2">
                  <span className="font-semibold text-slate-500">Voice Note:</span>
                  <span className="font-bold text-emerald-600">
                    Audio Note Attached 🎙️
                  </span>
                </div>
              )}
            </div>

            <div className="bg-blue-50/80 border border-blue-200/80 rounded-2xl p-4 text-xs text-blue-900 max-w-md mx-auto text-left flex gap-3">
              <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <span className="leading-relaxed font-medium">
                <strong>Next Step:</strong> You will receive a WhatsApp message and
                portal alert as soon as our engineers finalize itemized pricing. You can
                then review rates and click <strong>Pay Now to Book</strong>.
              </span>
            </div>

            <div className="flex justify-center gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => {
                  setSubmittedQuote(null);
                  onOpenChange(false);
                }}
                className="rounded-xl font-bold text-xs h-10 px-5"
              >
                Close
              </Button>
              <Button
                onClick={() => {
                  setSubmittedQuote(null);
                  onOpenChange(false);
                  router.push("/dashboard/quotes");
                }}
                className="rounded-xl font-bold text-xs h-10 px-6 bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20"
              >
                View in Customer Portal
              </Button>
            </div>
          </div>
        ) : (
          /* ONE SINGLE SCROLLABLE QUOTATION FORM */
          <div className="space-y-8 mt-5">
            {/* ────────── SECTION 1: SERVICE / CCTV REQUIREMENTS ────────── */}
            <section ref={requirementsRef} className="space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                <div className="w-2 h-4 bg-blue-600 rounded-full" />
                <h3 className="text-sm font-black uppercase tracking-wider text-slate-800">
                  {serviceCategoryLabel.toUpperCase()} REQUIREMENTS
                </h3>
              </div>

              {/* CCTV Property Type Selection */}
              {isInstallNewCctv ? (
                <div className="space-y-2.5">
                  <label className="text-xs font-bold text-slate-700 block">
                    Property Type *
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "Home",
                      "Apartment",
                      "Office",
                      "Shop",
                      "Warehouse",
                      "Factory",
                      "Other",
                    ].map((t) => (
                      <button
                        type="button"
                        key={t}
                        onClick={() => setCctvPropertyType(t)}
                        className={`px-3.5 py-1.5 text-xs font-bold rounded-xl border transition ${
                          cctvPropertyType === t
                            ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                            : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              ) : isNetworking ? (
                <div className="space-y-2.5">
                  <label className="text-xs font-bold text-slate-700 block">
                    Premises / Network Setup Scope
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "Office / Corporate",
                      "Commercial Space",
                      "Multi-Floor Building",
                      "Home / Villa",
                      "Warehouse / Factory",
                      "Retail Store",
                    ].map((t) => (
                      <button
                        type="button"
                        key={t}
                        onClick={() => setCctvPropertyType(t)}
                        className={`px-3.5 py-1.5 text-xs font-bold rounded-xl border transition ${
                          cctvPropertyType === t
                            ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                            : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              ) : isWebDesigning ? (
                <div className="space-y-2.5">
                  <label className="text-xs font-bold text-slate-700 block">
                    Project Type
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "Corporate Business Website",
                      "E-Commerce Online Store",
                      "Landing Page / Sales Funnel",
                      "Custom Web Application",
                      "Website Redesign",
                    ].map((t) => (
                      <button
                        type="button"
                        key={t}
                        onClick={() => setCctvPropertyType(t)}
                        className={`px-3.5 py-1.5 text-xs font-bold rounded-xl border transition ${
                          cctvPropertyType === t
                            ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                            : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}

              {/* Service packages if available */}
              {service.packages && service.packages.length > 0 && !isInstallNewCctv && !isBuyCctvProducts && (
                <div className="space-y-2.5 pt-2">
                  <label className="text-xs font-bold text-slate-700 block">
                    Select Service Package Scope (Optional)
                  </label>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {service.packages.map((pkg: any) => {
                      const isSelected = selectedPackageId === pkg._id;
                      return (
                        <div
                          key={pkg._id}
                          onClick={() =>
                            setSelectedPackageId(isSelected ? "" : pkg._id)
                          }
                          className={`cursor-pointer rounded-2xl border p-4 transition-all hover:shadow-sm ${
                            isSelected
                              ? "border-blue-600 bg-blue-50/20 ring-1 ring-blue-600 shadow-xs"
                              : "border-slate-200 bg-white"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <h4 className="font-bold text-xs text-slate-900">
                              {pkg.name}
                            </h4>
                            {isSelected && (
                              <CheckCircle2 className="w-4 h-4 text-blue-600" />
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                            {pkg.description}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </section>

            {/* ────────── SECTION 2: PRODUCTS & QUANTITIES ────────── */}
            <section ref={productsRef} className="space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                <div className="w-2 h-4 bg-blue-600 rounded-full" />
                <h3 className="text-sm font-black uppercase tracking-wider text-slate-800">
                  PRODUCTS & QUANTITIES
                </h3>
              </div>

              {/* CCTV Camera Hardware selection with quantities */}
              {isInstallNewCctv && (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-2">
                      Camera Types & Quantities *
                    </label>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {[
                        "Dome Camera",
                        "Bullet Camera",
                        "PTZ Camera",
                        "WiFi Indoor Camera",
                        "WiFi Outdoor Camera",
                        "Analog Camera",
                        "4G Camera",
                      ].map((cType) => {
                        const isChecked = !!cctvSelectedCameraTypes[cType];
                        const qty = cctvCameraQuantities[cType] || 1;
                        return (
                          <div
                            key={cType}
                            className={`p-3 rounded-2xl border transition-all ${
                              isChecked
                                ? "border-blue-500 bg-blue-50/20 shadow-xs"
                                : "border-slate-200 bg-white hover:border-slate-300"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <label className="flex items-center gap-2.5 cursor-pointer text-xs font-bold text-slate-800">
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={(e) => {
                                    setCctvSelectedCameraTypes((prev) => ({
                                      ...prev,
                                      [cType]: e.target.checked,
                                    }));
                                    if (
                                      e.target.checked &&
                                      !cctvCameraQuantities[cType]
                                    ) {
                                      setCctvCameraQuantities((prev) => ({
                                        ...prev,
                                        [cType]: cType === "Bullet Camera" ? 2 : 4,
                                      }));
                                    }
                                  }}
                                  className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                />
                                <span>{cType}</span>
                              </label>

                              {isChecked && (
                                <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-white h-8 shadow-xs">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setCctvCameraQuantities((prev) => ({
                                        ...prev,
                                        [cType]: Math.max(
                                          (prev[cType] || 1) - 1,
                                          1
                                        ),
                                      }))
                                    }
                                    className="h-full px-2.5 text-xs font-bold text-slate-500 hover:bg-slate-100"
                                  >
                                    -
                                  </button>
                                  <span className="px-2 text-xs font-black text-slate-800">
                                    {qty}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setCctvCameraQuantities((prev) => ({
                                        ...prev,
                                        [cType]: (prev[cType] || 1) + 1,
                                      }))
                                    }
                                    className="h-full px-2.5 text-xs font-bold text-slate-500 hover:bg-slate-100"
                                  >
                                    +
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Cabling & Installation */}
                  <div className="space-y-3 bg-slate-50/70 rounded-2xl p-4 border border-slate-200/70">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-800">
                      <input
                        type="checkbox"
                        checked={cctvInstallationRequired}
                        onChange={(e) =>
                          setCctvInstallationRequired(e.target.checked)
                        }
                        className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span>Professional On-Site Installation & Cabling Required</span>
                    </label>

                    {cctvInstallationRequired && (
                      <div className="grid gap-3 sm:grid-cols-2 pt-1">
                        <div>
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                            Cable Type
                          </label>
                          <select
                            value={cctvCableType}
                            onChange={(e) => setCctvCableType(e.target.value)}
                            className="h-9 w-full rounded-xl border border-slate-200 px-3 bg-white text-xs font-semibold text-slate-700"
                          >
                            <option value="CAT6 Solid Copper">
                              CAT6 Solid Copper (Recommended for IP/PoE)
                            </option>
                            <option value="CAT6 CCA Standard">
                              CAT6 CCA Standard
                            </option>
                            <option value="3+1 Coaxial CCTV Cable">
                              3+1 Coaxial (For Analog Cameras)
                            </option>
                          </select>
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                            Estimated Cable Length (meters)
                          </label>
                          <input
                            type="number"
                            min={0}
                            step={10}
                            value={cctvCableLength}
                            onChange={(e) =>
                              setCctvCableLength(Number(e.target.value))
                            }
                            className="h-9 w-full rounded-xl border border-slate-200 px-3 bg-white text-xs font-semibold text-slate-700"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* DVR / NVR & Storage HDD */}
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        Recorder Channel Tier
                      </label>
                      <select
                        value={cctvDvrChannels}
                        onChange={(e) => {
                          setCctvDvrChannels(e.target.value);
                          setCctvDvrManualOverride(true);
                        }}
                        className="h-9 w-full rounded-xl border border-slate-200 px-3 bg-white text-xs font-semibold text-slate-700"
                      >
                        <option value="None">None / Not Required</option>
                        <option value="4 Channel">4 Channel Recorder</option>
                        <option value="8 Channel">8 Channel Recorder</option>
                        <option value="16 Channel">16 Channel Recorder</option>
                        <option value="32 Channel">32 Channel Recorder</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        Surveillance Storage HDD
                      </label>
                      <select
                        value={cctvHddCapacity}
                        onChange={(e) => setCctvHddCapacity(e.target.value)}
                        className="h-9 w-full rounded-xl border border-slate-200 px-3 bg-white text-xs font-semibold text-slate-700"
                      >
                        <option value="">None / Existing Storage</option>
                        <option value="1TB">1TB Surveillance HDD</option>
                        <option value="2TB">2TB Surveillance HDD</option>
                        <option value="4TB">4TB Surveillance HDD</option>
                        <option value="6TB">6TB Surveillance HDD</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Buy CCTV Products Store List */}
              {isBuyCctvProducts && (
                <div className="space-y-3">
                  <label className="text-xs font-bold text-slate-700 block">
                    Select Products from Catalog *
                  </label>
                  <div className="grid gap-2.5 sm:grid-cols-2 max-h-[220px] overflow-y-auto pr-1">
                    {availableProducts.map((p) => {
                      const pId = p._id || p.id;
                      const isChecked = !!selectedProductsCheckboxes[pId];
                      const qty = selectedProductQuantities[pId] || 1;
                      return (
                        <div
                          key={pId}
                          className={`p-3 rounded-2xl border transition-all ${
                            isChecked
                              ? "border-blue-500 bg-blue-50/20 shadow-xs"
                              : "border-slate-200 bg-white"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-800">
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={(e) => {
                                  setSelectedProductsCheckboxes((prev) => ({
                                    ...prev,
                                    [pId]: e.target.checked,
                                  }));
                                  if (
                                    e.target.checked &&
                                    !selectedProductQuantities[pId]
                                  ) {
                                    setSelectedProductQuantities((prev) => ({
                                      ...prev,
                                      [pId]: 1,
                                    }));
                                  }
                                }}
                                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                              />
                              <span className="truncate max-w-[170px]">
                                {p.name || p.title}
                              </span>
                            </label>

                            {isChecked && (
                              <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-white h-7">
                                <button
                                  type="button"
                                  onClick={() =>
                                    setSelectedProductQuantities((prev) => ({
                                      ...prev,
                                      [pId]: Math.max(
                                        (prev[pId] || 1) - 1,
                                        1
                                      ),
                                    }))
                                  }
                                  className="h-full px-2 text-xs font-bold text-slate-500 hover:bg-slate-100"
                                >
                                  -
                                </button>
                                <span className="px-2 text-xs font-black text-slate-800">
                                  {qty}
                                </span>
                                <button
                                  type="button"
                                  onClick={() =>
                                    setSelectedProductQuantities((prev) => ({
                                      ...prev,
                                      [pId]: (prev[pId] || 1) + 1,
                                    }))
                                  }
                                  className="h-full px-2 text-xs font-bold text-slate-500 hover:bg-slate-100"
                                >
                                  +
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Unified Product / Item Addition Bar with Quantity */}
              <div className="p-4 rounded-2xl border border-dashed border-blue-200 bg-blue-50/20 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Plus className="w-3.5 h-3.5 text-blue-600" />
                    <span>Add Item / Specific Product & Quantity</span>
                  </label>
                  <span className="text-[10px] text-slate-400 font-semibold">
                    {quotationItems.length} custom item(s) added
                  </span>
                </div>

                {/* Quick suggestions pills */}
                <div className="flex flex-wrap gap-1.5">
                  {currentSuggestions.slice(0, 6).map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => handleAddCustomItem(tag, 1)}
                      className="px-2.5 py-1 text-[10px] font-bold rounded-lg bg-white border border-slate-200 hover:bg-blue-50 hover:text-blue-700 text-slate-600 transition"
                    >
                      + {tag}
                    </button>
                  ))}
                </div>

                {/* Dropdown / Input + Quantity Selector + Add Button */}
                <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center pt-1">
                  <div className="flex-1 flex gap-2">
                    <select
                      value={newItemName}
                      onChange={(e) => setNewItemName(e.target.value)}
                      className="h-10 rounded-xl border border-slate-200 px-3 bg-white text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 max-w-[210px] truncate"
                    >
                      <option value="">-- Select from list --</option>
                      {currentSuggestions.map((sug) => (
                        <option key={sug} value={sug}>
                          {sug}
                        </option>
                      ))}
                    </select>
                    <input
                      type="text"
                      placeholder="Or type custom item name..."
                      value={newItemName}
                      onChange={(e) => setNewItemName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddCustomItem();
                        }
                      }}
                      className="flex-1 h-10 rounded-xl border border-slate-200 px-3 text-xs font-medium text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>

                  <div className="flex items-center justify-between sm:justify-start gap-2">
                    <div className="flex items-center border border-slate-200 rounded-xl bg-white h-10 px-1 shadow-xs">
                      <span className="text-[10px] font-bold uppercase text-slate-400 px-1.5">
                        Qty
                      </span>
                      <button
                        type="button"
                        onClick={() => setNewItemQty((q) => Math.max(q - 1, 1))}
                        className="h-8 w-7 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-100 flex items-center justify-center"
                      >
                        -
                      </button>
                      <span className="w-8 text-center text-xs font-extrabold text-slate-900">
                        {newItemQty}
                      </span>
                      <button
                        type="button"
                        onClick={() => setNewItemQty((q) => q + 1)}
                        className="h-8 w-7 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-100 flex items-center justify-center"
                      >
                        +
                      </button>
                    </div>
                    <Button
                      type="button"
                      onClick={() => handleAddCustomItem()}
                      className="h-10 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl"
                    >
                      + Add Item
                    </Button>
                  </div>
                </div>

                {/* Custom Items Added List */}
                {quotationItems.length > 0 && (
                  <div className="space-y-2 mt-3 pt-3 border-t border-blue-100/80">
                    {quotationItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200/80 bg-white text-xs shadow-xs"
                      >
                        <span className="font-semibold text-slate-800">
                          {item.productName}
                        </span>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-white h-7">
                            <button
                              type="button"
                              onClick={() =>
                                handleUpdateItemQty(item.id, item.quantity - 1)
                              }
                              className="h-full px-2 text-xs font-bold text-slate-500 hover:bg-slate-100"
                            >
                              -
                            </button>
                            <span className="px-2 text-xs font-black text-slate-800">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                handleUpdateItemQty(item.id, item.quantity + 1)
                              }
                              className="h-full px-2 text-xs font-bold text-slate-500 hover:bg-slate-100"
                            >
                              +
                            </button>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(item.id)}
                            className="text-slate-400 hover:text-rose-600 transition p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
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

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 block">
                  Describe Your Requirements in Detail
                </label>
                <textarea
                  rows={4}
                  placeholder={
                    isNetworking
                      ? "e.g. Need LAN connection for 20 systems and Wi-Fi coverage for 3 floors."
                      : isWebDesigning
                      ? "e.g. Need responsive corporate website with service booking, customer login, and WhatsApp integration."
                      : "e.g. Need CCTV cameras covering front gate, backyard, and corridor. Prefer night colour vision."
                  }
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 p-3.5 text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 leading-relaxed"
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
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-50 text-blue-600">
                  Optional
                </span>
              </div>

              <p className="text-xs text-slate-400 font-medium">
                Record an audio note explaining your requirement directly to our engineers.
              </p>
              <div className="pt-1">
                <VoiceNoteRecorder
                  onVoiceNoteRecorded={(vn) => setVoiceNoteData(vn)}
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

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">
                    Preferred Visit / Delivery Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    min={new Date().toISOString().split("T")[0]}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="h-10 w-full rounded-xl border border-slate-200 px-3 bg-white text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                  <div className="flex gap-1.5 mt-2">
                    {getDatePills().map((p) => (
                      <button
                        key={p.iso}
                        type="button"
                        onClick={() => setDate(p.iso)}
                        className={`px-2.5 py-1 text-[10px] font-bold rounded-lg border transition ${
                          date === p.iso
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
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">
                    Preferred Time Slot
                  </label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {[
                      "09:00 AM - 12:00 PM",
                      "12:00 PM - 03:00 PM",
                      "03:00 PM - 06:00 PM",
                      "06:00 PM - 08:00 PM",
                    ].map((slot) => (
                      <button
                        type="button"
                        key={slot}
                        onClick={() => setTime(slot)}
                        className={`py-2 px-2 text-[11px] font-bold rounded-xl border text-center transition ${
                          time === slot
                            ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                            : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
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

              {/* Saved Addresses quick selection */}
              {savedAddresses.length > 0 && (
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                    Pick a Saved Address:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {savedAddresses.map((addr) => (
                      <button
                        type="button"
                        key={addr._id}
                        onClick={() => {
                          setSelectedAddressId(addr._id);
                          setAddress(addr.address || "");
                          setFormattedAddress(
                            addr.formattedAddress || addr.address || ""
                          );
                          setCity(addr.city || "");
                          setStateName(addr.state || "");
                          setPincode(addr.pincode || "");
                          setLatitude(addr.latitude || null);
                          setLongitude(addr.longitude || null);
                          setHouseNumber(addr.houseNumber || "");
                          setLandmark(addr.landmark || "");
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
                          selectedAddressId === addr._id
                            ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                            : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                        }`}
                      >
                        📍 {addr.title || addr.type || "Address"} (
                        {addr.area || addr.city || "Bangalore"})
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Existing Map Location Picker Component */}
              <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-xs">
                <LocationPicker
                  initialCoords={
                    latitude && longitude
                      ? { lat: latitude, lng: longitude }
                      : null
                  }
                  initialAddressData={{
                    address,
                    formattedAddress,
                    houseNumber,
                    street,
                    area,
                    landmark,
                    city,
                    district,
                    state: stateName,
                    pincode,
                  }}
                  onLocationSelected={(data: any) => {
                    setAddress(data.address || "");
                    setFormattedAddress(
                      data.formattedAddress || data.address || ""
                    );
                    setLatitude(data.latitude);
                    setLongitude(data.longitude);
                    if (data.city) setCity(data.city);
                    if (data.state) setStateName(data.state);
                    if (data.pincode) setPincode(data.pincode);
                    if (data.area) setArea(data.area);
                    if (data.district) setDistrict(data.district);
                    if (data.houseNumber) setHouseNumber(data.houseNumber);
                    if (data.street) setStreet(data.street);
                    if (data.landmark) setLandmark(data.landmark);
                  }}
                />
              </div>
            </section>

            {/* ────────── SECTION 7: CUSTOMER DETAILS ────────── */}
            <section ref={customerDetailsRef} className="space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                <div className="w-2 h-4 bg-blue-600 rounded-full" />
                <h3 className="text-sm font-black uppercase tracking-wider text-slate-800">
                  CUSTOMER DETAILS
                </h3>
              </div>

              <div className="grid gap-3 sm:grid-cols-3 bg-slate-50/70 p-4 rounded-2xl border border-slate-200/70">
                <div>
                  <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Rajesh Kumar"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="h-10 w-full rounded-xl border border-slate-200 px-3 bg-white text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
                    Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    placeholder="e.g. 9876543210"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="h-10 w-full rounded-xl border border-slate-200 px-3 bg-white text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    placeholder="e.g. rajesh@example.com"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="h-10 w-full rounded-xl border border-slate-200 px-3 bg-white text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
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

              <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-800">
                      Quotation Request Summary
                    </h4>
                    <p className="text-[11px] text-slate-400 font-medium">
                      Review your requested items and information.
                    </p>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-blue-100 text-blue-700">
                    Custom Rate Preparation
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-slate-500">Service:</span>
                    <span className="font-bold text-slate-800">
                      {serviceCategoryLabel} — {service.name}
                    </span>
                  </div>

                  {isInstallNewCctv && cctvPropertyType && (
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-slate-500">
                        Property Type:
                      </span>
                      <span className="font-bold text-slate-800">
                        {cctvPropertyType}
                      </span>
                    </div>
                  )}

                  {/* Configured Items */}
                  <div className="border-t border-slate-200 pt-2 space-y-1.5">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                      Requested Items & Scope ({finalItemsToSubmit.length}):
                    </span>
                    {finalItemsToSubmit.length === 0 ? (
                      <p className="text-[11px] text-slate-400 italic">
                        No items configured yet
                      </p>
                    ) : (
                      <div className="grid gap-1.5 sm:grid-cols-2">
                        {finalItemsToSubmit.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex justify-between items-center bg-white border border-slate-200/70 rounded-xl px-3 py-2 shadow-xs"
                          >
                            <span className="font-medium text-slate-800 truncate max-w-[200px]">
                              {item.productName}
                            </span>
                            <span className="font-black text-slate-900 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                              Qty {item.quantity}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Location & Schedule */}
                  <div className="grid gap-2 sm:grid-cols-2 border-t border-slate-200 pt-2">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Preferred Schedule:
                      </span>
                      <span className="font-bold text-slate-800">
                        {date ? `📅 ${date}` : "Date not chosen"} {time ? `• ${time}` : ""}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Service Location:
                      </span>
                      <span className="font-medium text-slate-800 truncate block">
                        📍 {formattedAddress || address || "Location not pinned"}
                      </span>
                    </div>
                  </div>

                  {/* Additional Requirement & Voice Note */}
                  {(notes.trim() || voiceNoteData) && (
                    <div className="border-t border-slate-200 pt-2 space-y-1">
                      {notes.trim() && (
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                            Additional Requirement:
                          </span>
                          <p className="text-slate-700 italic">"{notes.trim()}"</p>
                        </div>
                      )}
                      {voiceNoteData && (
                        <div className="flex items-center gap-1.5 text-emerald-700 font-bold text-[11px] pt-1">
                          <Mic className="w-3.5 h-3.5" /> Voice Note Attached (
                          {voiceNoteData.duration}s audio)
                        </div>
                      )}
                    </div>
                  )}

                  {/* Pricing explanation */}
                  <div className="bg-amber-50/70 border border-amber-200/60 rounded-xl p-3 text-[11px] text-amber-800 flex gap-2">
                    <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span>
                      <strong>Admin Pricing Notice:</strong> Unit prices, rates, GST,
                      and total amounts are calculated by TechBes engineers and
                      sent to your portal & WhatsApp for your approval.
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* ────────── SECTION 9: SUBMIT QUOTATION REQUEST ────────── */}
            <div className="pt-2 pb-4">
              <Button
                type="button"
                disabled={submitting}
                onClick={handleSubmitQuotation}
                className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.005]"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Submitting Quotation Request...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    Submit Quotation Request
                  </>
                )}
              </Button>
              <p className="text-center text-[11px] text-slate-400 mt-2 font-medium">
                Your quotation request will be directly dispatched to the TechBes Admin
                Dashboard.
              </p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default ServiceBookingConfigModal;
