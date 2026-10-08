"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarCheck, FileText, ShoppingCart, Zap, ShieldAlert, CheckCircle2, Info, Loader2, Upload, MapPin, Check, Plus, Trash2, Mic, Phone, User, Mail, ChevronRight, PackageCheck, AlertCircle } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cctvApi, CctvSubcategory } from "@/lib/cctv-api";
import { useToast } from "@/hooks/use-toast";
import dynamic from "next/dynamic";
import { fetchAuthApi } from "@/lib/api";
import { AUTH_TOKEN_STORAGE_KEY } from "@/core/api/config";
import { VoiceNoteRecorder } from "@/components/quotation/VoiceNoteRecorder";

const LocationPicker = dynamic(() => import("./LocationPicker"), { ssr: false });

interface QuotationItem {
  id: string;
  productName: string;
  quantity: number;
}

export function ServiceBookingConfigModal({
  open,
  onOpenChange,
  service,
  editItem,
  onRequestQuote
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

  const [step, setStep] = useState(1);
  const [selectedPackageId, setSelectedPackageId] = useState<string>("");
  const [questionAnswers, setQuestionAnswers] = useState<Record<string, any>>({});
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");

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
  const [deliveryInstructions, setDeliveryInstructions] = useState("");
  const [formattedAddress, setFormattedAddress] = useState("");

  // Quotation specific states
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
  const [uploading, setUploading] = useState(false);

  // Category detection
  const isNetworking = useMemo(() => {
    const slug = (service.slug || "").toLowerCase();
    const cat = String(service.categoryId || "").toLowerCase();
    return slug.includes("network") || cat.includes("network") || (service.name || "").toLowerCase().includes("network");
  }, [service]);

  const isWebDesigning = useMemo(() => {
    const slug = (service.slug || "").toLowerCase();
    const cat = String(service.categoryId || "").toLowerCase();
    return slug.includes("web") || cat.includes("web") || (service.name || "").toLowerCase().includes("web");
  }, [service]);

  const serviceCategoryLabel = useMemo(() => {
    if (isNetworking) return "Networking";
    if (isWebDesigning) return "Web Designing";
    return "CCTV";
  }, [isNetworking, isWebDesigning]);

  const isBuyCctvProducts = service.slug === "buy-cctv-products";
  const isInstallNewCctv = service.slug === "install-new-cctv";
  const isCctvServiceRequest = ["install-new-cctv", "repair-existing-cctv", "maintenance-amc", "upgrade-existing-cctv", "free-site-survey"].includes(service.slug);

  const [availableProducts, setAvailableProducts] = useState<any[]>([]);
  const [selectedProductsCheckboxes, setSelectedProductsCheckboxes] = useState<Record<string, boolean>>({});
  const [selectedProductQuantities, setSelectedProductQuantities] = useState<Record<string, number>>({});
  const [selectedProductVariants, setSelectedProductVariants] = useState<Record<string, string>>({});

  // Install New CCTV custom states
  const [cctvPropertyType, setCctvPropertyType] = useState<string>("Home");
  const [cctvSelectedCameraTypes, setCctvSelectedCameraTypes] = useState<Record<string, boolean>>({ "Dome Camera": true });
  const [cctvCameraQuantities, setCctvCameraQuantities] = useState<Record<string, number>>({ "Dome Camera": 4 });
  const [cctvCameraBrands, setCctvCameraBrands] = useState<Record<string, string>>({});
  const [cctvCameraModels, setCctvCameraModels] = useState<Record<string, string>>({});
  const [cctvSdCardEnabled, setCctvSdCardEnabled] = useState<boolean>(false);
  const [cctvSdCardCapacity, setCctvSdCardCapacity] = useState<string>("");
  const [cctvSdCardQuantity, setCctvSdCardQuantity] = useState<number>(1);
  const [cctvInstallationRequired, setCctvInstallationRequired] = useState<boolean>(true);
  const [cctvCableType, setCctvCableType] = useState<string>("CAT6 Solid Copper");
  const [cctvCableLength, setCctvCableLength] = useState<number>(90);
  const [cctvDvrChannels, setCctvDvrChannels] = useState<string>("4 Channel");
  const [cctvDvrManualOverride, setCctvDvrManualOverride] = useState<boolean>(false);
  const [cctvNetworkRack, setCctvNetworkRack] = useState<boolean>(false);
  const [cctvMonitorMounting, setCctvMonitorMounting] = useState<boolean>(false);
  const [cctvHddCapacity, setCctvHddCapacity] = useState<string>("1TB");
  const [cctvRackType, setCctvRackType] = useState<string>("");

  // Dynamic CCTV metadata tables
  const [cctvBrands, setCctvBrands] = useState<any[]>([]);
  const [cctvAllModels, setCctvAllModels] = useState<any[]>([]);
  const [cctvSdCards, setCctvSdCards] = useState<any[]>([]);
  const [cctvCables, setCctvCables] = useState<any[]>([]);
  const [cctvHdds, setCctvHdds] = useState<any[]>([]);
  const [cctvRacks, setCctvRacks] = useState<any[]>([]);
  const [cctvAccessories, setCctvAccessories] = useState<any[]>([]);

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
      .some(([type]) => ["WiFi Indoor Camera", "WiFi Outdoor Camera", "4G Camera"].includes(type));
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

  // Reset state when modal is closed
  useEffect(() => {
    if (!open) {
      setStep(1);
      setSelectedPackageId("");
      setQuestionAnswers({});
      setUploadedImages([]);
      setDate("");
      setTime("");
      setNotes("");
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
    const token = localStorage.getItem(AUTH_TOKEN_STORAGE_KEY) || localStorage.getItem("token") || "";

    if (token) {
      fetch("/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` }
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
        headers: { Authorization: `Bearer ${token}` }
      })
        .then((r) => (r.ok ? r.json() : {}))
        .then((json: any) => {
          const list = Array.isArray(json.data) ? json.data : Array.isArray(json) ? json : [];
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
        fetch("/api/v2/cctv/brands").then((r) => r.json()).catch(() => ({ data: [] })),
        fetch("/api/v2/cctv/models").then((r) => r.json()).catch(() => ({ data: [] })),
        fetch("/api/v2/cctv/sd-cards").then((r) => r.json()).catch(() => ({ data: [] })),
        fetch("/api/v2/cctv/cable-pricings").then((r) => r.json()).catch(() => ({ data: [] })),
        fetch("/api/v2/cctv/accessories").then((r) => r.json()).catch(() => ({ data: [] })),
        fetch("/api/v2/cctv/hdds").then((r) => r.json()).catch(() => ({ data: [] })),
        fetch("/api/v2/cctv/racks").then((r) => r.json()).catch(() => ({ data: [] })),
      ]).then(([br, md, sd, cb, ac, hd, rk]) => {
        const brandsList = br?.data || [];
        const modelsList = md?.data || [];
        setCctvBrands(brandsList);
        setCctvAllModels(modelsList);
        setCctvSdCards(sd?.data || []);
        setCctvCables(cb?.data || []);
        setCctvAccessories(ac?.data || []);
        setCctvHdds(hd?.data || []);
        setCctvRacks(rk?.data || []);

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
      cctvApi.products().then((json: any) => {
        const list = Array.isArray(json) ? json : json?.data || [];
        setAvailableProducts(list);
      }).catch(() => {});
    }
  }, [open, isInstallNewCctv, isBuyCctvProducts]);

  // Add Item / Manage Items helpers
  const handleAddCustomItem = () => {
    if (!newItemName.trim()) {
      toast({ title: "Item Name Required", description: "Please enter a product or service name.", variant: "destructive" });
      return;
    }
    setQuotationItems((prev) => [
      ...prev,
      {
        id: "item-" + Date.now() + "-" + Math.random().toString(36).substr(2, 4),
        productName: newItemName.trim(),
        quantity: Math.max(1, newItemQty || 1),
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
    setQuotationItems((prev) => prev.map((it) => (it.id === id ? { ...it, quantity: qty } : it)));
  };

  const handleRemoveItem = (id: string) => {
    setQuotationItems((prev) => prev.filter((it) => it.id !== id));
  };

  // Compile final quotation items list (Name & Quantity only - NO PRICES!)
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
          const detail = modelObj ? `${brandObj?.name || ""} ${modelObj.resolution || ""} ${modelObj.name || ""}`.trim() : type;
          list.push({ productName: `${type}: ${detail}`, quantity: qty });
        }
      });

      // Cabling & Installation
      if (cctvInstallationRequired) {
        if (cctvCableLength > 0) {
          list.push({ productName: `${cctvCableType || "CAT6"} Cabling (${cctvCableLength} meters)`, quantity: 1 });
        }
        list.push({ productName: "Camera Fitting & Alignment Service", quantity: cctvTotalCameras || 1 });
      }

      // Recorder DVR / NVR
      if (cctvDvrChannels && cctvDvrChannels !== "None") {
        list.push({ productName: `${cctvDvrChannels} ${hasAnalog ? "DVR" : "NVR"} Recorder Unit`, quantity: 1 });
      }

      // SD Card
      if (cctvSdCardEnabled && cctvSdCardCapacity) {
        list.push({ productName: `Surveillance SD Card (${cctvSdCardCapacity})`, quantity: cctvSdCardQuantity || 1 });
      }

      // HDD
      if (cctvHddCapacity) {
        list.push({ productName: `Surveillance Hard Drive (${cctvHddCapacity})`, quantity: 1 });
      }

      // Rack & Accessories
      if (cctvRackType) {
        list.push({ productName: `Wall-Mount Rack (${cctvRackType})`, quantity: 1 });
      }
      if (cctvNetworkRack) {
        list.push({ productName: "Network Rack Installation & Dressing", quantity: 1 });
      }
      if (cctvMonitorMounting) {
        list.push({ productName: "Display Monitor Wall Mounting", quantity: 1 });
      }
    } else if (isBuyCctvProducts) {
      // Products from store
      Object.entries(selectedProductsCheckboxes).forEach(([prodId, checked]) => {
        if (checked) {
          const p = availableProducts.find((item) => item._id === prodId || item.id === prodId);
          if (p) {
            const v = selectedProductVariants[prodId];
            const q = selectedProductQuantities[prodId] || 1;
            list.push({ productName: `${p.name || p.title}${v ? ` (${v})` : ""}`, quantity: q });
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
      } else if (quotationItems.length === 0) {
        list.push({ productName: `${service.name} Standard Requirement`, quantity: 1 });
      }
    }

    // Add extra user-specified custom items
    quotationItems.forEach((it) => {
      list.push({ productName: it.productName, quantity: it.quantity });
    });

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

  // Steps Definition
  const stepsList = useMemo(() => {
    if (isBuyCctvProducts) {
      return [
        { step: 1, label: "Select Products" },
        { step: 2, label: "Requirements & Voice Note" },
        { step: 3, label: "Preferred Schedule" },
        { step: 4, label: "Delivery Address" },
        { step: 5, label: "Review Quotation Request" },
      ];
    } else if (isInstallNewCctv) {
      return [
        { step: 1, label: "Camera Specifications" },
        { step: 2, label: "Requirements & Voice Note" },
        { step: 3, label: "Preferred Schedule" },
        { step: 4, label: "Service Location" },
        { step: 5, label: "Review Quotation Request" },
      ];
    } else {
      return [
        { step: 1, label: "Scope & Items" },
        { step: 2, label: "Requirements & Voice Note" },
        { step: 3, label: "Preferred Schedule" },
        { step: 4, label: "Service Location" },
        { step: 5, label: "Review Quotation Request" },
      ];
    }
  }, [isBuyCctvProducts, isInstallNewCctv]);

  const currentStepLabel = stepsList[step - 1]?.label || "";

  // Step Validation & Navigation
  const goNext = () => {
    if (currentStepLabel === "Select Products" && isBuyCctvProducts) {
      const hasChecked = Object.values(selectedProductsCheckboxes).some((v) => v);
      if (!hasChecked && quotationItems.length === 0) {
        toast({ title: "Product Required", description: "Please select at least one product or add a custom item.", variant: "destructive" });
        return;
      }
    }

    if (currentStepLabel === "Camera Specifications" && isInstallNewCctv) {
      const hasCam = Object.values(cctvSelectedCameraTypes).some((v) => v);
      if (!hasCam && quotationItems.length === 0) {
        toast({ title: "Camera Required", description: "Please select at least one camera type or item.", variant: "destructive" });
        return;
      }
    }

    if (currentStepLabel === "Scope & Items" && !isInstallNewCctv && !isBuyCctvProducts) {
      if (service.packages && service.packages.length > 0 && !selectedPackageId && quotationItems.length === 0) {
        toast({ title: "Selection Required", description: "Please select a service scope or specify items.", variant: "destructive" });
        return;
      }
    }

    if (currentStepLabel === "Preferred Schedule") {
      if (!date) {
        toast({ title: "Date Required", description: "Please select your preferred visit date.", variant: "destructive" });
        return;
      }
    }

    if (currentStepLabel === "Service Location" || currentStepLabel === "Delivery Address") {
      if (!customerName.trim()) {
        toast({ title: "Name Required", description: "Please enter your full name.", variant: "destructive" });
        return;
      }
      if (!customerPhone.trim()) {
        toast({ title: "Phone Required", description: "Please enter your contact mobile number.", variant: "destructive" });
        return;
      }
      if (!address.trim() && !formattedAddress.trim()) {
        toast({ title: "Address Required", description: "Please pin your location on the map or enter your address.", variant: "destructive" });
        return;
      }
    }

    setStep((s) => Math.min(s + 1, stepsList.length));
  };

  const goPrev = () => {
    setStep((s) => Math.max(s - 1, 1));
  };

  // Submit Quotation Request to Backend
  const handleSubmitQuotation = async () => {
    if (!customerName.trim()) {
      toast({ title: "Name Required", description: "Please enter your full name.", variant: "destructive" });
      setStep(4);
      return;
    }
    if (!customerPhone.trim()) {
      toast({ title: "Phone Required", description: "Please enter your mobile number.", variant: "destructive" });
      setStep(4);
      return;
    }
    if (!address.trim() && !formattedAddress.trim()) {
      toast({ title: "Address Required", description: "Please provide your service address.", variant: "destructive" });
      setStep(4);
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem(AUTH_TOKEN_STORAGE_KEY) || localStorage.getItem("token") || "";

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
        voiceNote: voiceNoteData ? {
          url: voiceNoteData.url,
          duration: voiceNoteData.duration,
          filename: voiceNoteData.filename,
          mimeType: voiceNoteData.mimeType,
        } : undefined,
        locality: area || district || city || (address ? address.split(",")[0] : "Bangalore"),
        pincode: pincode || undefined,
        address: formattedAddress || address,
        latitude: latitude || 12.9716,
        longitude: longitude || 77.5946,
        preferredVisitDate: date || undefined,
        preferredVisitTime: time || undefined,
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-5xl rounded-[24px] p-6 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.12)] border border-slate-100/80">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              {serviceCategoryLabel} Quotation
            </span>
          </div>
          <DialogTitle className="text-2xl font-black text-slate-900 mt-1">
            Request Quotation: {service.name}
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500 font-medium">
            Specify your technical requirement, item quantities, and site address. Our engineers will calculate custom rates and send an itemized quotation to your portal & WhatsApp.
          </DialogDescription>
        </DialogHeader>

        {submittedQuote ? (
          /* SUCCESS CONFIRMATION VIEW */
          <div className="py-8 px-4 text-center space-y-6 animate-fadeIn">
            <div className="mx-auto w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-md shadow-emerald-500/10">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <span className="inline-block px-3 py-1 bg-blue-50 border border-blue-200 text-blue-700 text-xs font-black uppercase tracking-wider rounded-full">
                Request ID: {submittedQuote.requestId}
              </span>
              <h3 className="text-2xl font-black text-slate-900">Quotation Request Received!</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                Thank you, <span className="font-bold text-slate-800">{submittedQuote.fullName}</span>! Your requirement containing <span className="font-bold text-slate-800">{submittedQuote.itemsCount} items</span> has been submitted to TechBes engineering.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-slate-50/80 p-4 max-w-md mx-auto text-left text-xs space-y-2 text-slate-600">
              <div className="flex justify-between">
                <span className="font-semibold text-slate-500">Service Category:</span>
                <span className="font-bold text-slate-800">{submittedQuote.serviceCategory}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-slate-500">Service:</span>
                <span className="font-bold text-slate-800">{service.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-slate-500">Area / Locality:</span>
                <span className="font-bold text-slate-800">{submittedQuote.locality}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-slate-500">Status:</span>
                <span className="font-bold text-amber-600">Under Engineering Review</span>
              </div>
              {voiceNoteData && (
                <div className="flex justify-between border-t border-slate-200 pt-1.5">
                  <span className="font-semibold text-slate-500">Voice Note:</span>
                  <span className="font-bold text-emerald-600">Audio Note Attached 🎙️</span>
                </div>
              )}
            </div>

            <div className="bg-blue-50/70 border border-blue-200/60 rounded-xl p-3.5 text-xs text-blue-800 max-w-md mx-auto text-left flex gap-2.5">
              <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <span>
                <strong>Next Step:</strong> You will receive a notification and a WhatsApp message once our team prepares the itemized rates. You can view the full price breakdown in your Customer Portal and click <strong>Pay Now to Book</strong>.
              </span>
            </div>

            <div className="flex justify-center gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => {
                  setSubmittedQuote(null);
                  onOpenChange(false);
                }}
                className="rounded-xl font-bold text-xs"
              >
                Close
              </Button>
              <Button
                onClick={() => {
                  setSubmittedQuote(null);
                  onOpenChange(false);
                  router.push("/dashboard/quotes");
                }}
                className="rounded-xl font-bold text-xs bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20"
              >
                View in Customer Portal
              </Button>
            </div>
          </div>
        ) : (
          /* STEPPER WIZARD */
          <>
            {/* Stepper Progress Bar */}
            <div className="flex flex-wrap gap-2 pb-4 border-b border-slate-100 items-center">
              {stepsList.map((sDef) => {
                const isActive = step === sDef.step;
                const isCompleted = step > sDef.step;

                if (isCompleted) {
                  return (
                    <div
                      key={sDef.step}
                      className="rounded-full px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider transition bg-emerald-600 text-white border border-emerald-700 shadow-sm flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                      <span>{sDef.label}</span>
                    </div>
                  );
                }

                if (isActive) {
                  return (
                    <div
                      key={sDef.step}
                      className="rounded-full px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider transition bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20 flex items-center gap-1.5"
                    >
                      <span className="h-4 w-4 rounded-full bg-white text-blue-600 flex items-center justify-center text-[9px] font-black">{sDef.step}</span>
                      <span>{sDef.label}</span>
                    </div>
                  );
                }

                return (
                  <div
                    key={sDef.step}
                    className="rounded-full px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider transition bg-slate-100 text-slate-400 border border-slate-200/50 flex items-center gap-1.5"
                  >
                    <span className="h-4 w-4 rounded-full bg-slate-200 text-slate-400 flex items-center justify-center text-[9px] font-bold">{sDef.step}</span>
                    <span>{sDef.label}</span>
                  </div>
                );
              })}
            </div>

            <div className="grid gap-6 mt-4 lg:grid-cols-[1fr,340px]">
              {/* Main Step Wizard Form */}
              <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm min-h-[380px] flex flex-col justify-between">
                <div>
                  {/* STEP 1: SPECIFICATIONS / SCOPE / PRODUCTS */}
                  {(currentStepLabel === "Camera Specifications" || currentStepLabel === "Select Products" || currentStepLabel === "Scope & Items") && (
                    <div className="space-y-5">
                      {isInstallNewCctv ? (
                        <div className="space-y-5">
                          <div>
                            <h3 className="text-base font-black text-slate-800">CCTV System Specifications</h3>
                            <p className="text-xs text-slate-400 font-medium">Select property type, cameras, cabling, and storage requirements.</p>
                          </div>

                          {/* 1. Property Type */}
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-700">Property Type *</label>
                            <div className="flex flex-wrap gap-2">
                              {["Home", "Apartment", "Office", "Shop", "Warehouse", "Factory", "Other"].map((t) => (
                                <button
                                  type="button"
                                  key={t}
                                  onClick={() => setCctvPropertyType(t)}
                                  className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition ${
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

                          {/* 2. Camera Types & Quantities */}
                          <div className="space-y-3">
                            <label className="text-xs font-bold text-slate-700">Select Camera Types & Quantities *</label>
                            <div className="grid gap-3 sm:grid-cols-2">
                              {["Dome Camera", "Bullet Camera", "PTZ Camera", "WiFi Indoor Camera", "WiFi Outdoor Camera", "Analog Camera", "4G Camera"].map((cType) => {
                                const isChecked = !!cctvSelectedCameraTypes[cType];
                                const qty = cctvCameraQuantities[cType] || 1;
                                return (
                                  <div
                                    key={cType}
                                    className={`p-3 rounded-2xl border transition-all ${
                                      isChecked ? "border-blue-500 bg-blue-50/20 shadow-sm" : "border-slate-200 bg-white"
                                    }`}
                                  >
                                    <div className="flex items-center justify-between">
                                      <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-800">
                                        <input
                                          type="checkbox"
                                          checked={isChecked}
                                          onChange={(e) => {
                                            setCctvSelectedCameraTypes((prev) => ({ ...prev, [cType]: e.target.checked }));
                                            if (e.target.checked && !cctvCameraQuantities[cType]) {
                                              setCctvCameraQuantities((prev) => ({ ...prev, [cType]: 1 }));
                                            }
                                          }}
                                          className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                        />
                                        <span>{cType}</span>
                                      </label>

                                      {isChecked && (
                                        <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-white h-7">
                                          <button
                                            type="button"
                                            onClick={() => setCctvCameraQuantities((prev) => ({ ...prev, [cType]: Math.max((prev[cType] || 1) - 1, 1) }))}
                                            className="h-full px-2 text-xs font-bold text-slate-500 hover:bg-slate-100"
                                          >
                                            -
                                          </button>
                                          <span className="px-2 text-xs font-black text-slate-800">{qty}</span>
                                          <button
                                            type="button"
                                            onClick={() => setCctvCameraQuantities((prev) => ({ ...prev, [cType]: (prev[cType] || 1) + 1 }))}
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

                          {/* 3. Cabling & Installation */}
                          <div className="space-y-3 bg-slate-50/60 rounded-2xl p-4 border border-slate-100">
                            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-800">
                              <input
                                type="checkbox"
                                checked={cctvInstallationRequired}
                                onChange={(e) => setCctvInstallationRequired(e.target.checked)}
                                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                              />
                              <span>Professional On-Site Installation & Cabling Required</span>
                            </label>

                            {cctvInstallationRequired && (
                              <div className="grid gap-3 sm:grid-cols-2 pt-2">
                                <div>
                                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Cable Type</label>
                                  <select
                                    value={cctvCableType}
                                    onChange={(e) => setCctvCableType(e.target.value)}
                                    className="h-9 w-full rounded-xl border border-slate-200 px-3 bg-white text-xs font-semibold text-slate-700"
                                  >
                                    <option value="CAT6 Solid Copper">CAT6 Solid Copper (Recommended for IP/PoE)</option>
                                    <option value="CAT6 CCA Standard">CAT6 CCA Standard</option>
                                    <option value="3+1 Coaxial CCTV Cable">3+1 Coaxial (For Analog Cameras)</option>
                                  </select>
                                </div>
                                <div>
                                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Estimated Cable Length (meters)</label>
                                  <input
                                    type="number"
                                    min={0}
                                    step={10}
                                    value={cctvCableLength}
                                    onChange={(e) => setCctvCableLength(Number(e.target.value))}
                                    className="h-9 w-full rounded-xl border border-slate-200 px-3 bg-white text-xs font-semibold text-slate-700"
                                  />
                                </div>
                              </div>
                            )}
                          </div>

                          {/* 4. DVR / NVR & Storage */}
                          <div className="grid gap-3 sm:grid-cols-2">
                            <div>
                              <label className="text-xs font-bold text-slate-700 block mb-1">Recorder Channel Tier</label>
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
                              <label className="text-xs font-bold text-slate-700 block mb-1">Surveillance Storage HDD</label>
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
                      ) : isBuyCctvProducts ? (
                        <div className="space-y-4">
                          <div>
                            <h3 className="text-base font-black text-slate-800">Select CCTV Products</h3>
                            <p className="text-xs text-slate-400 font-medium">Select cameras, recorders, or accessories from our verified stock.</p>
                          </div>

                          <div className="grid gap-3 sm:grid-cols-2 max-h-[260px] overflow-y-auto pr-1">
                            {availableProducts.map((p) => {
                              const pId = p._id || p.id;
                              const isChecked = !!selectedProductsCheckboxes[pId];
                              const qty = selectedProductQuantities[pId] || 1;
                              return (
                                <div
                                  key={pId}
                                  className={`p-3 rounded-2xl border transition-all ${
                                    isChecked ? "border-blue-500 bg-blue-50/20 shadow-sm" : "border-slate-200 bg-white"
                                  }`}
                                >
                                  <div className="flex items-center justify-between">
                                    <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-800">
                                      <input
                                        type="checkbox"
                                        checked={isChecked}
                                        onChange={(e) => {
                                          setSelectedProductsCheckboxes((prev) => ({ ...prev, [pId]: e.target.checked }));
                                          if (e.target.checked && !selectedProductQuantities[pId]) {
                                            setSelectedProductQuantities((prev) => ({ ...prev, [pId]: 1 }));
                                          }
                                        }}
                                        className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                      />
                                      <span className="truncate max-w-[170px]">{p.name || p.title}</span>
                                    </label>

                                    {isChecked && (
                                      <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-white h-7">
                                        <button
                                          type="button"
                                          onClick={() => setSelectedProductQuantities((prev) => ({ ...prev, [pId]: Math.max((prev[pId] || 1) - 1, 1) }))}
                                          className="h-full px-2 text-xs font-bold text-slate-500 hover:bg-slate-100"
                                        >
                                          -
                                        </button>
                                        <span className="px-2 text-xs font-black text-slate-800">{qty}</span>
                                        <button
                                          type="button"
                                          onClick={() => setSelectedProductQuantities((prev) => ({ ...prev, [pId]: (prev[pId] || 1) + 1 }))}
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
                      ) : (
                        <div className="space-y-4">
                          <div>
                            <h3 className="text-base font-black text-slate-800">Choose Service Scope & Requirements</h3>
                            <p className="text-xs text-slate-400 font-medium">Select a service tier or specify the required items below.</p>
                          </div>

                          {service.packages && service.packages.length > 0 && (
                            <div className="grid gap-3 sm:grid-cols-2">
                              {service.packages.map((pkg: any) => {
                                const isSelected = selectedPackageId === pkg._id;
                                return (
                                  <div
                                    key={pkg._id}
                                    onClick={() => setSelectedPackageId(pkg._id)}
                                    className={`cursor-pointer rounded-2xl border p-4 transition-all hover:shadow-md ${
                                      isSelected ? "border-blue-600 bg-blue-50/15 ring-1 ring-blue-600 shadow-sm" : "border-slate-200 bg-white"
                                    }`}
                                  >
                                    <h4 className="font-bold text-sm text-slate-900">{pkg.name}</h4>
                                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">{pkg.description}</p>
                                    {pkg.includes && pkg.includes.length > 0 && (
                                      <ul className="text-[10px] text-slate-600 mt-2 space-y-1 list-disc pl-4">
                                        {pkg.includes.map((inc: string, idx: number) => (
                                          <li key={idx}>{inc}</li>
                                        ))}
                                      </ul>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      )}

                      {/* MULTI-ITEM MANAGER (Add Item, Change Quantity, Remove Item) */}
                      <div className="pt-4 border-t border-slate-100 space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                            <Plus className="w-3.5 h-3.5 text-blue-600" />
                            <span>Add Specific Products / Custom Items</span>
                          </label>
                          <span className="text-[10px] text-slate-400 font-semibold">
                            {quotationItems.length} custom item(s) added
                          </span>
                        </div>

                        {/* Quick suggestions pills */}
                        {isNetworking ? (
                          <div className="flex flex-wrap gap-1.5">
                            {["Cat6 Cabling Point", "WiFi Access Point Setup", "Router / Firewall Setup", "16-Port Switch Setup", "Network Rack Dressing"].map((tag) => (
                              <button
                                key={tag}
                                type="button"
                                onClick={() => setNewItemName(tag)}
                                className="px-2.5 py-1 text-[10px] font-bold rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-600 transition"
                              >
                                + {tag}
                              </button>
                            ))}
                          </div>
                        ) : isWebDesigning ? (
                          <div className="flex flex-wrap gap-1.5">
                            {["Corporate 5-Page Website", "Custom E-Commerce Store", "Landing Page Design", "Payment Gateway Setup", "Domain & Cloud Hosting"].map((tag) => (
                              <button
                                key={tag}
                                type="button"
                                onClick={() => setNewItemName(tag)}
                                className="px-2.5 py-1 text-[10px] font-bold rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-600 transition"
                              >
                                + {tag}
                              </button>
                            ))}
                          </div>
                        ) : null}

                        {/* Add Item Input Bar */}
                        <div className="flex gap-2 items-center">
                          <input
                            type="text"
                            placeholder="e.g. 10m Cat6 Cable, HDMI Extender, 8-Port Switch..."
                            value={newItemName}
                            onChange={(e) => setNewItemName(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                handleAddCustomItem();
                              }
                            }}
                            className="flex-1 h-9 rounded-xl border border-slate-200 px-3 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                          />
                          <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-white h-9 w-24">
                            <button
                              type="button"
                              onClick={() => setNewItemQty((q) => Math.max(q - 1, 1))}
                              className="h-full px-2 text-xs font-bold text-slate-500 hover:bg-slate-100"
                            >
                              -
                            </button>
                            <span className="flex-1 text-center text-xs font-extrabold text-slate-800">{newItemQty}</span>
                            <button
                              type="button"
                              onClick={() => setNewItemQty((q) => q + 1)}
                              className="h-full px-2 text-xs font-bold text-slate-500 hover:bg-slate-100"
                            >
                              +
                            </button>
                          </div>
                          <Button
                            type="button"
                            size="sm"
                            onClick={handleAddCustomItem}
                            className="h-9 px-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl"
                          >
                            Add Item
                          </Button>
                        </div>

                        {/* Custom Items List */}
                        {quotationItems.length > 0 && (
                          <div className="space-y-2 mt-2 max-h-[140px] overflow-y-auto">
                            {quotationItems.map((item) => (
                              <div
                                key={item.id}
                                className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200/80 bg-slate-50/50 text-xs"
                              >
                                <span className="font-semibold text-slate-800">{item.productName}</span>
                                <div className="flex items-center gap-3">
                                  <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-white h-7">
                                    <button
                                      type="button"
                                      onClick={() => handleUpdateItemQty(item.id, item.quantity - 1)}
                                      className="h-full px-2 text-xs font-bold text-slate-500 hover:bg-slate-100"
                                    >
                                      -
                                    </button>
                                    <span className="px-2 text-xs font-black text-slate-800">{item.quantity}</span>
                                    <button
                                      type="button"
                                      onClick={() => handleUpdateItemQty(item.id, item.quantity + 1)}
                                      className="h-full px-2 text-xs font-bold text-slate-500 hover:bg-slate-100"
                                    >
                                      +
                                    </button>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveItem(item.id)}
                                    className="text-slate-400 hover:text-rose-600 transition"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* STEP 2: ADDITIONAL REQUIREMENTS & VOICE NOTE */}
                  {currentStepLabel === "Requirements & Voice Note" && (
                    <div className="space-y-5">
                      <div>
                        <h3 className="text-base font-black text-slate-800">Additional Requirements & Voice Note</h3>
                        <p className="text-xs text-slate-400 font-medium">
                          Explain your floor plan, brand preference, or speak directly to our engineering team using a voice recording.
                        </p>
                      </div>

                      {/* Text Requirements */}
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-700 block">
                          Describe Your Requirements in Detail
                        </label>
                        <textarea
                          rows={4}
                          placeholder="e.g. Need CCTV cameras covering front gate, backyard, and corridor. Prefer Hikvision or CP Plus 4MP with night colour vision. Also require 1 LAN cable point from living room to study..."
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          className="w-full rounded-2xl border border-slate-200 p-3.5 text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        />
                      </div>

                      {/* Voice Note Recorder Component */}
                      <div className="space-y-2 pt-2">
                        <VoiceNoteRecorder onVoiceNoteRecorded={(vn) => setVoiceNoteData(vn)} />
                      </div>
                    </div>
                  )}

                  {/* STEP 3: PREFERRED SCHEDULE */}
                  {currentStepLabel === "Preferred Schedule" && (
                    <div className="space-y-5">
                      <div>
                        <h3 className="text-base font-black text-slate-800">Preferred Visit & Site Survey Date</h3>
                        <p className="text-xs text-slate-400 font-medium">When should our technical team visit or coordinate the delivery?</p>
                      </div>

                      <div className="space-y-3">
                        <label className="text-xs font-bold text-slate-700 block">Select Date *</label>
                        <input
                          type="date"
                          min={new Date().toISOString().split("T")[0]}
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                          className="h-10 w-full rounded-xl border border-slate-200 px-3 bg-white text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        />
                      </div>

                      {!isBuyCctvProducts && (
                        <div className="space-y-3">
                          <label className="text-xs font-bold text-slate-700 block">Preferred Time Slot</label>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
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
                                className={`py-2 px-3 text-xs font-bold rounded-xl border transition ${
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
                      )}
                    </div>
                  )}

                  {/* STEP 4: SERVICE LOCATION & CONTACT */}
                  {(currentStepLabel === "Service Location" || currentStepLabel === "Delivery Address") && (
                    <div className="space-y-5">
                      <div>
                        <h3 className="text-base font-black text-slate-800">Contact & Service Location</h3>
                        <p className="text-xs text-slate-400 font-medium">Pin your installation site address and confirm your phone number.</p>
                      </div>

                      {/* Contact Info Inputs */}
                      <div className="grid gap-3 sm:grid-cols-3 bg-slate-50/60 p-3.5 rounded-2xl border border-slate-100">
                        <div>
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Full Name *</label>
                          <input
                            type="text"
                            placeholder="e.g. Rajesh Kumar"
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                            className="h-9 w-full rounded-xl border border-slate-200 px-3 bg-white text-xs font-semibold text-slate-800"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Mobile Number *</label>
                          <input
                            type="tel"
                            placeholder="e.g. 9876543210"
                            value={customerPhone}
                            onChange={(e) => setCustomerPhone(e.target.value)}
                            className="h-9 w-full rounded-xl border border-slate-200 px-3 bg-white text-xs font-semibold text-slate-800"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Email (Optional)</label>
                          <input
                            type="email"
                            placeholder="e.g. rajesh@example.com"
                            value={customerEmail}
                            onChange={(e) => setCustomerEmail(e.target.value)}
                            className="h-9 w-full rounded-xl border border-slate-200 px-3 bg-white text-xs font-semibold text-slate-800"
                          />
                        </div>
                      </div>

                      {/* Location Picker Map */}
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-700 block">Pin Site Location on Map *</label>
                        <div className="rounded-2xl overflow-hidden border border-slate-200">
                          <LocationPicker
                            initialAddress={formattedAddress || address}
                            initialLatitude={latitude}
                            initialLongitude={longitude}
                            onLocationSelect={(data: any) => {
                              setAddress(data.address || "");
                              setFormattedAddress(data.formattedAddress || data.address || "");
                              setLatitude(data.latitude);
                              setLongitude(data.longitude);
                              if (data.city) setCity(data.city);
                              if (data.state) setStateName(data.state);
                              if (data.pincode) setPincode(data.pincode);
                              if (data.area) setArea(data.area);
                              if (data.district) setDistrict(data.district);
                            }}
                          />
                        </div>
                      </div>

                      {/* Structured Details */}
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div>
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Flat / Building / House No.</label>
                          <input
                            type="text"
                            placeholder="e.g. Flat 302, Green Valley Apts"
                            value={houseNumber}
                            onChange={(e) => setHouseNumber(e.target.value)}
                            className="h-9 w-full rounded-xl border border-slate-200 px-3 bg-white text-xs font-semibold text-slate-800"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Landmark / Locality</label>
                          <input
                            type="text"
                            placeholder="e.g. Near Metro Station"
                            value={landmark}
                            onChange={(e) => setLandmark(e.target.value)}
                            className="h-9 w-full rounded-xl border border-slate-200 px-3 bg-white text-xs font-semibold text-slate-800"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STEP 5: REVIEW QUOTATION REQUEST (NO PRICES SHOWN!) */}
                  {currentStepLabel === "Review Quotation Request" && (
                    <div className="space-y-5">
                      <div>
                        <h3 className="text-base font-black text-slate-800">Review Quotation Request</h3>
                        <p className="text-xs text-slate-400 font-medium">Verify your items and site information before submitting to engineering.</p>
                      </div>

                      {/* Items Specification Card */}
                      <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-3">
                        <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            Requested Items & Scope ({finalItemsToSubmit.length})
                          </span>
                          <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                            Custom Quotation
                          </span>
                        </div>

                        <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1">
                          {finalItemsToSubmit.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center text-xs text-slate-700 py-1">
                              <span className="font-semibold text-slate-800">{item.productName}</span>
                              <span className="font-black text-slate-900 bg-slate-100 px-2.5 py-0.5 rounded-md">
                                Qty: {item.quantity}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Site & Contact Review */}
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-3.5 text-xs space-y-1.5">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Contact & Schedule</span>
                          <div className="text-slate-800 font-bold">{customerName || "Customer"}</div>
                          <div className="text-slate-600 font-medium">{customerPhone}</div>
                          <div className="text-blue-700 font-bold mt-1">
                            📅 {date || "Preferred date not specified"} {time && `(${time})`}
                          </div>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-3.5 text-xs space-y-1.5">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Service Location</span>
                          <div className="text-slate-800 font-medium leading-relaxed line-clamp-2">
                            {houseNumber ? `${houseNumber}, ` : ""}{formattedAddress || address || "Bangalore"}
                          </div>
                          {landmark && <div className="text-[10px] text-slate-500">Landmark: {landmark}</div>}
                        </div>
                      </div>

                      {/* Voice Note & Requirements summary */}
                      {(notes || voiceNoteData) && (
                        <div className="rounded-2xl border border-slate-200 bg-blue-50/30 p-3.5 text-xs space-y-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 block">Special Instructions</span>
                          {notes && <p className="text-slate-700 italic">"{notes}"</p>}
                          {voiceNoteData && (
                            <div className="flex items-center gap-1.5 text-emerald-700 font-bold text-[11px] mt-1">
                              <Mic className="w-3.5 h-3.5" /> Voice Note Attached ({voiceNoteData.duration}s audio)
                            </div>
                          )}
                        </div>
                      )}

                      {/* Quotation Policy Note */}
                      <div className="rounded-2xl bg-amber-50/80 border border-amber-200/80 p-3 flex gap-2 text-xs text-amber-800">
                        <Info className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                        <div>
                          <strong>No Upfront Charges:</strong> Submitting this request sends your technical requirements to TechBes engineering. We prepare custom rates, attach warranties, and send the quote to your Customer Portal & WhatsApp for approval.
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Navigation Buttons */}
                <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-6">
                  {step > 1 ? (
                    <Button variant="outline" size="sm" onClick={goPrev} className="h-9 px-4 rounded-xl text-xs font-bold text-slate-500 border-slate-200 hover:bg-slate-50">
                      Back
                    </Button>
                  ) : (
                    <div />
                  )}

                  {step < stepsList.length ? (
                    <Button
                      size="sm"
                      onClick={goNext}
                      className="h-9 px-5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-md shadow-blue-500/20"
                    >
                      Continue
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      disabled={submitting}
                      onClick={handleSubmitQuotation}
                      className="h-9 px-5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex gap-1.5 items-center shadow-md shadow-emerald-500/20"
                    >
                      {submitting && <Loader2 className="h-3 w-3 animate-spin" />}
                      {submitting ? "Submitting Request..." : "Submit Quotation Request"}
                    </Button>
                  )}
                </div>
              </div>

              {/* Right Sticky Quotation Summary Sidebar (NO PRICES!) */}
              <aside className="rounded-3xl bg-slate-50/80 p-5 border border-slate-100 self-start space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <h3 className="text-sm font-bold text-slate-800">Quotation Summary</h3>
                  <Zap className="h-4 w-4 text-emerald-600" />
                </div>

                <div className="space-y-2.5 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Category:</span>
                    <span className="font-bold text-slate-800">{serviceCategoryLabel}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Service:</span>
                    <span className="font-bold text-slate-800 truncate max-w-[170px]">{service.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Items Configured:</span>
                    <span className="font-bold text-blue-600">{finalItemsToSubmit.length} items</span>
                  </div>
                </div>

                {/* Items list preview */}
                <div className="border-t border-slate-200 pt-3 space-y-1.5 max-h-[180px] overflow-y-auto pr-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Items in Quote</span>
                  {finalItemsToSubmit.length === 0 ? (
                    <p className="text-[11px] text-slate-400 italic">No items configured yet</p>
                  ) : (
                    finalItemsToSubmit.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center text-[11px] text-slate-700">
                        <span className="truncate max-w-[180px] font-medium">{item.productName}</span>
                        <span className="font-bold text-slate-900 bg-white px-1.5 py-0.5 rounded border border-slate-200/60">
                          ×{item.quantity}
                        </span>
                      </div>
                    ))
                  )}
                </div>

                {/* Schedule & Location preview */}
                <div className="border-t border-slate-200 pt-3 space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Schedule:</span>
                    <span className="font-bold text-slate-800 text-[11px]">{date ? `${date}` : "Not selected"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Voice Note:</span>
                    <span className="font-bold text-slate-800 text-[11px]">
                      {voiceNoteData ? "Attached 🎙️" : "None"}
                    </span>
                  </div>
                </div>

                {/* Explanation badge */}
                <div className="mt-4 rounded-2xl bg-blue-50/70 border border-blue-100 p-3 space-y-1.5">
                  <div className="text-[11px] font-bold text-blue-900 flex items-center gap-1.5">
                    <PackageCheck className="w-3.5 h-3.5 text-blue-600" /> Quotation Workflow
                  </div>
                  <p className="text-[10px] text-blue-700 leading-relaxed font-medium">
                    Itemized pricing and GST are calculated by our engineers following requirement review. You can review and approve pricing in your Customer Portal.
                  </p>
                </div>
              </aside>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default ServiceBookingConfigModal;
