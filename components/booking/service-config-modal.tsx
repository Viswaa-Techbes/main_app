"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarCheck, FileText, ShoppingCart, Zap, ShieldAlert, CheckCircle2, Info, Loader2, Upload, MapPin, Check, Wallet, Plus } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cctvApi, CctvSubcategory } from "@/lib/cctv-api";
import { useToast } from "@/hooks/use-toast";
import dynamic from "next/dynamic";
import { fetchAuthApi } from "@/lib/api";
import { AUTH_TOKEN_STORAGE_KEY } from "@/core/api/config";

const LocationPicker = dynamic(() => import("./LocationPicker"), { ssr: false });

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

  // Address and Map location states
  const [savedAddresses, setSavedAddresses] = useState<any[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [stateName, setStateName] = useState("");
  const [pincode, setPincode] = useState("");
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");

  // Structured and manual address details
  const [houseNumber, setHouseNumber] = useState("");
  const [street, setStreet] = useState("");
  const [area, setArea] = useState("");
  const [landmark, setLandmark] = useState("");
  const [district, setDistrict] = useState("");
  const [country, setCountry] = useState("");
  const [floor, setFloor] = useState("");
  const [apartmentName, setApartmentName] = useState("");
  const [deliveryInstructions, setDeliveryInstructions] = useState("");
  const [formattedAddress, setFormattedAddress] = useState("");

  // Coupon states
  const [couponCode, setCouponCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0); // 0 or 10%
  const [couponError, setCouponError] = useState("");
  const [couponSuccess, setCouponSuccess] = useState("");

  // Payment states
  const [paymentMethod, setPaymentMethod] = useState<"online" | "wallet" | "cod">("online");
  const [walletBalance, setWalletBalance] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);

  // CCTV Redesign States
  const isBuyCctvProducts = service.slug === "buy-cctv-products";
  const isInstallNewCctv = service.slug === "install-new-cctv";
  const isCctvServiceRequest = ["install-new-cctv", "repair-existing-cctv", "maintenance-amc", "upgrade-existing-cctv", "free-site-survey"].includes(service.slug);

  const todayStr = useMemo(() => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }, []);

  const isSlotDisabled = (slot: string) => {
    // 1. Check if already booked
    if (bookedSlots.includes(slot)) return true;

    // 2. Check if selected date is today, and slot time has passed
    if (!date) return false;
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    const todayStrLocal = `${year}-${month}-${day}`;

    if (date === todayStrLocal) {
      const startPart = slot.split(" - ")[0] || "";
      const startTimeStr = startPart.replace(/[–-]/g, "").trim();
      const [timeVal, ampm] = startTimeStr.split(" ");
      if (timeVal && ampm) {
        let [hours, minutes] = timeVal.split(":").map(Number);
        if (ampm === "PM" && hours !== 12) hours += 12;
        if (ampm === "AM" && hours === 12) hours = 0;

        const currentHours = today.getHours();
        const currentMinutes = today.getMinutes();

        if (currentHours > hours) return true;
        if (currentHours === hours && currentMinutes >= minutes) return true;
      }
    }

    return false;
  };

  const [availableProducts, setAvailableProducts] = useState<any[]>([]);
  const [selectedProductsCheckboxes, setSelectedProductsCheckboxes] = useState<Record<string, boolean>>({});
  const [selectedProductQuantities, setSelectedProductQuantities] = useState<Record<string, number>>({});
  const [selectedProductVariants, setSelectedProductVariants] = useState<Record<string, string>>({});
  const [selectedProductBrands, setSelectedProductBrands] = useState<Record<string, string>>({});
  const [selectedProductCategory, setSelectedProductCategory] = useState<string>("all");

  // Install New CCTV custom states
  const [cctvPropertyType, setCctvPropertyType] = useState<string>("");
  const [cctvSelectedCameraTypes, setCctvSelectedCameraTypes] = useState<Record<string, boolean>>({});
  const [cctvCameraQuantities, setCctvCameraQuantities] = useState<Record<string, number>>({});
  const [cctvCameraBrands, setCctvCameraBrands] = useState<Record<string, string>>({});
  const [cctvCameraModels, setCctvCameraModels] = useState<Record<string, string>>({});
  const [cctvSdCardEnabled, setCctvSdCardEnabled] = useState<boolean>(false);
  const [cctvSdCardCapacity, setCctvSdCardCapacity] = useState<string>("");
  const [cctvSdCardQuantity, setCctvSdCardQuantity] = useState<number>(1);
  const [cctvInstallationRequired, setCctvInstallationRequired] = useState<boolean>(false);
  const [cctvCableType, setCctvCableType] = useState<string>("");
  const [cctvCableLength, setCctvCableLength] = useState<number>(0);
  const [cctvDvrChannels, setCctvDvrChannels] = useState<string>("None");
  const [cctvDvrManualOverride, setCctvDvrManualOverride] = useState<boolean>(false);

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

  const isRecorderSelected = cctvDvrChannels && cctvDvrChannels !== "None";
  const cctvDvrRequired = isRecorderSelected && hasAnalog;
  const cctvNvrRequired = isRecorderSelected && !hasAnalog;

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
    if (isInstallNewCctv) {
      let rec = "None";
      if (cctvTotalCameras > 0) {
        if (cctvTotalCameras <= 4) rec = "4 Channel";
        else if (cctvTotalCameras <= 8) rec = "8 Channel";
        else if (cctvTotalCameras <= 16) rec = "16 Channel";
        else rec = "32 Channel";
      }
      if (!cctvDvrManualOverride) {
        setCctvDvrChannels(rec);
      }
    }
  }, [cctvTotalCameras, isInstallNewCctv, cctvDvrManualOverride]);
  const [cctvNetworkRack, setCctvNetworkRack] = useState<boolean>(false);
  const [cctvMonitorMounting, setCctvMonitorMounting] = useState<boolean>(false);
  const [cctvHdds, setCctvHdds] = useState<any[]>([]);
  const [cctvRacks, setCctvRacks] = useState<any[]>([]);
  const [cctvHddCapacity, setCctvHddCapacity] = useState<string>("");
  const [cctvRackType, setCctvRackType] = useState<string>("");

  // Dynamic CCTV pricing tables fetched from API
  const [cctvBrands, setCctvBrands] = useState<any[]>([]);
  const [cctvAllModels, setCctvAllModels] = useState<any[]>([]);
  const [cctvSdCards, setCctvSdCards] = useState<any[]>([]);
  const [cctvCables, setCctvCables] = useState<any[]>([]);
  const [cctvInstallationCharges, setCctvInstallationCharges] = useState<any[]>([]);
  const [cctvAccessories, setCctvAccessories] = useState<any[]>([]);
  const [cctvPricingConfig, setCctvPricingConfig] = useState<any>(null);

  // State for calculated price breakdown from backend
  const [cctvCalculatedPrice, setCctvCalculatedPrice] = useState<any>(null);
  const [cctvCalculating, setCctvCalculating] = useState<boolean>(false);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);

  // Reset state when opening/closing
  useEffect(() => {
    if (!open) {
      setStep(1);
      setSelectedPackageId("");
      setQuestionAnswers({});
      setUploadedImages([]);
      setDate("");
      setTime("");
      setNotes("");
      setSelectedProductsCheckboxes({});
      setSelectedProductQuantities({});
      setSelectedProductVariants({});
      setBookedSlots([]);
      
      // Reset install-new-cctv states
      setCctvPropertyType("");
      setCctvSelectedCameraTypes({});
      setCctvCameraQuantities({});
      setCctvCameraBrands({});
      setCctvCameraModels({});
      setCctvSdCardEnabled(false);
      setCctvSdCardCapacity("");
      setCctvSdCardQuantity(1);
      setCctvInstallationRequired(false);
      setCctvCableType("");
      setCctvCableLength(0);
      setCctvDvrChannels("None");
      setCctvDvrManualOverride(false);
      setCctvNetworkRack(false);
      setCctvMonitorMounting(false);
      setCctvHddCapacity("");
      setCctvRackType("");
      setCctvCalculatedPrice(null);
    }
  }, [open]);

  // Load CCTV dynamic pricing/metadata tables
  useEffect(() => {
    if (!open || (!isInstallNewCctv && !isBuyCctvProducts)) return;
    
    Promise.all([
      fetch("/api/v2/cctv/brands").then(r => r.json()),
      fetch("/api/v2/cctv/models").then(r => r.json()),
      fetch("/api/v2/cctv/sd-cards").then(r => r.json()),
      fetch("/api/v2/cctv/cable-pricings").then(r => r.json()),
      fetch("/api/v2/cctv/installation-charges").then(r => r.json()),
      fetch("/api/v2/cctv/accessories").then(r => r.json()),
      fetch("/api/v2/cctv/pricing-config").then(r => r.json()),
      fetch("/api/v2/cctv/hdds").then(r => r.json()),
      fetch("/api/v2/cctv/racks").then(r => r.json()),
    ]).then(([brandsRes, modelsRes, sdRes, cablesRes, instRes, accRes, configRes, hddRes, rackRes]) => {
      if (brandsRes.success) setCctvBrands(brandsRes.data || []);
      if (modelsRes.success) setCctvAllModels(modelsRes.data || []);
      if (sdRes.success) setCctvSdCards(sdRes.data || []);
      if (cablesRes.success) setCctvCables(cablesRes.data || []);
      if (instRes.success) setCctvInstallationCharges(instRes.data || []);
      if (accRes.success) setCctvAccessories(accRes.data || []);
      if (configRes.success) setCctvPricingConfig(configRes.data || null);
      if (hddRes?.success) setCctvHdds(hddRes.data || []);
      if (rackRes?.success) setCctvRacks(rackRes.data || []);
    }).catch(err => console.error("Error loading CCTV dynamic metadata:", err));
  }, [open, isInstallNewCctv, isBuyCctvProducts]);

  // Load Saved Addresses, User details, and Wallet balance
  useEffect(() => {
    if (!open) return;

    const token = typeof window !== "undefined" ? localStorage.getItem(AUTH_TOKEN_STORAGE_KEY) || localStorage.getItem("token") || localStorage.getItem("accessToken") : null;
    if (!token) {
      toast({ title: "Session Expired", description: "Please login to proceed with booking.", variant: "destructive" });
      onOpenChange(false);
      router.push(`/login?redirect=${encodeURIComponent(pathname || "/services")}`);
      return;
    }

    // Load Addresses
    fetch("/api/user/addresses", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((r) => (r.ok ? r.json() : {}))
      .then((json) => {
        if (json.success && Array.isArray(json.data)) {
          setSavedAddresses(json.data);
          const def = json.data.find((a: any) => a.isDefault);
          if (def) {
            handleAddressChange(def._id, json.data);
          }
        }
      })
      .catch((err) => console.error("Addresses load error:", err));

    // Load Profile
    fetch("/api/auth/me", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((r) => (r.ok ? r.json() : {}))
      .then((json) => {
        if (json.success && json.data) {
          setCustomerName(json.data.name || "");
          setCustomerPhone(json.data.mobileNumber || json.data.phone || "");
        }
      })
      .catch((err) => console.error("Profile load error:", err));

    // Load Wallet
    fetchAuthApi("/api/v2/wallet")
      .then((json) => {
        if (json.success && json.data) {
          setWalletBalance(json.data.balance || 0);
        }
      })
      .catch((err) => console.error("Wallet load error:", err));

    // Load CCTV products for purchase flow
    if (isBuyCctvProducts) {
      cctvApi.products()
        .then((json: any) => {
          const list = Array.isArray(json) ? json : (json?.data || []);
          setAvailableProducts(list);
        })
        .catch((err) => console.error("Products load error:", err));
    }
  }, [open, router, toast, pathname, isBuyCctvProducts]);

  // Load booked slots for selected date
  useEffect(() => {
    if (!open || !date || isBuyCctvProducts) {
      setBookedSlots([]);
      return;
    }
    const token = typeof window !== "undefined" ? localStorage.getItem(AUTH_TOKEN_STORAGE_KEY) || localStorage.getItem("token") || localStorage.getItem("accessToken") : null;
    if (!token) return;

    fetch("/api/v2/bookings", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((r) => (r.ok ? r.json() : {}))
      .then((json) => {
        if (json.success && Array.isArray(json.data)) {
          const slots = json.data
            .filter((job: any) => job.bookingDate === date && job.status !== "Cancelled" && job.timeSlot)
            .map((job: any) => job.timeSlot);
          setBookedSlots(slots);
        }
      })
      .catch((err) => console.error("Bookings load error:", err));
  }, [open, date, isBuyCctvProducts]);

  // Call backend price calculation API whenever fields change for Install New CCTV
  useEffect(() => {
    if (!open || service.slug !== "install-new-cctv") return;
    
    // Check if property type and camera types selection are completed
    const hasCameraSelected = Object.values(cctvSelectedCameraTypes).some(v => v);
    if (!cctvPropertyType || !hasCameraSelected) {
      setCctvCalculatedPrice(null);
      return;
    }

    // Check brand & model selection for checked cameras
    const incomplete = Object.entries(cctvSelectedCameraTypes)
      .filter(([_, checked]) => checked)
      .some(([type]) => !cctvCameraBrands[type] || !cctvCameraModels[type]);
      
    if (incomplete) {
      setCctvCalculatedPrice(null);
      return;
    }
    
    // Check cable config if installation is required
    if (cctvInstallationRequired) {
      if (!cctvCableType || !cctvCableLength) {
        setCctvCalculatedPrice(null);
        return;
      }
    }

    // Check SD Card config if enabled
    if (cctvSdCardEnabled) {
      if (!cctvSdCardCapacity || !cctvSdCardQuantity) {
        setCctvCalculatedPrice(null);
        return;
      }
    }
    
    const cameraTypesPayload = Object.entries(cctvSelectedCameraTypes)
      .filter(([_, checked]) => checked)
      .map(([type]) => ({
        type,
        brandId: cctvCameraBrands[type],
        modelId: cctvCameraModels[type],
        quantity: cctvCameraQuantities[type] || 1
      }));
      
    const payload = {
      subcategoryId: service._id,
      subcategorySlug: service.slug,
      propertyType: cctvPropertyType,
      cameraTypes: cameraTypesPayload,
      installationRequired: cctvInstallationRequired,
      cableType: cctvCableType,
      cableLength: cctvCableLength,
      dvrRequired: cctvDvrRequired,
      nvrRequired: cctvNvrRequired,
      networkRack: cctvNetworkRack,
      monitorMounting: cctvMonitorMounting,
      sdCardRequired: cctvSdCardEnabled,
      sdCardCapacity: cctvSdCardCapacity,
      sdCardQuantity: cctvSdCardQuantity,
      selectedDvrChannels: cctvDvrChannels,
      hddCapacity: cctvHddCapacity,
      rackType: cctvRackType
    };
    
    setCctvCalculating(true);
    cctvApi.calculate(payload)
      .then((data: any) => {
        setCctvCalculatedPrice(data);
      })
      .catch((err) => {
        console.error("Price calculation error:", err);
      })
      .finally(() => {
        setCctvCalculating(false);
      });
  }, [
    open,
    service._id,
    service.slug,
    cctvPropertyType,
    cctvSelectedCameraTypes,
    cctvCameraQuantities,
    cctvCameraBrands,
    cctvCameraModels,
    cctvSdCardEnabled,
    cctvSdCardCapacity,
    cctvSdCardQuantity,
    cctvInstallationRequired,
    cctvCableType,
    cctvCableLength,
    cctvDvrChannels,
    cctvDvrRequired,
    cctvNvrRequired,
    cctvNetworkRack,
    cctvMonitorMounting,
    cctvHddCapacity,
    cctvRackType
  ]);

  // Handle saved address changes
  const handleAddressChange = (addrId: string, addressList = savedAddresses) => {
    setSelectedAddressId(addrId);
    if (addrId === "new") {
      setAddress("");
      setCity("");
      setStateName("");
      setPincode("");
      setLatitude(null);
      setLongitude(null);
      setHouseNumber("");
      setStreet("");
      setArea("");
      setLandmark("");
      setDistrict("");
      setCountry("");
      setFloor("");
      setApartmentName("");
      setDeliveryInstructions("");
      setFormattedAddress("");
      return;
    }
    const found = addressList.find((a) => a._id === addrId);
    if (found) {
      const displayAddr = found.formattedAddress || found.address || [found.addressLine1, found.addressLine2].filter(Boolean).join(", ");
      setAddress(displayAddr);
      setCity(found.city || "");
      setStateName(found.state || "");
      setPincode(found.pincode || "");
      setLatitude(found.latitude || null);
      setLongitude(found.longitude || null);
      setHouseNumber(found.houseNumber || "");
      setStreet(found.street || "");
      setArea(found.area || "");
      setLandmark(found.landmark || "");
      setDistrict(found.district || "");
      setCountry(found.country || "");
      setFloor(found.floor || "");
      setApartmentName(found.apartmentName || "");
      setDeliveryInstructions(found.deliveryInstructions || found.manualNotes || "");
      setFormattedAddress(displayAddr);
    }
  };

  // Upload dynamic image fields / custom site images
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, questionKey?: string) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    const token = localStorage.getItem(AUTH_TOKEN_STORAGE_KEY) || localStorage.getItem("token") || localStorage.getItem("accessToken") || "";
    try {
      const file = files[0];
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/v2/upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });
      const json = await res.json();
      if (json.success) {
        if (questionKey) {
          handleAnswerChange(questionKey, json.fileUrl);
        } else {
          setUploadedImages((prev) => [...prev, json.fileUrl]);
        }
        toast({ title: "Success", description: "Image uploaded successfully." });
      } else {
        toast({ title: "Upload Failed", description: json.message || "File upload failed.", variant: "destructive" });
      }
    } catch (err: any) {
      toast({ title: "Upload Error", description: err.message || "Error connecting to upload server.", variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const handleAnswerChange = (question: string, val: any) => {
    setQuestionAnswers((prev) => ({ ...prev, [question]: val }));
  };

  const selectedProductsList = useMemo(() => {
    const list: Array<{ product: string; variant?: string; quantity: number; unitPrice: number; total: number }> = [];
    
    Object.entries(selectedProductsCheckboxes).forEach(([prodName, checked]) => {
      if (!checked) return;
      
      const quantity = selectedProductQuantities[prodName] || 1;
      const variantName = selectedProductVariants[prodName] || "";
      const brand = selectedProductBrands[prodName] || "";
      
      const dbProd = availableProducts.find(p => p.name === prodName);
      let unitPrice = dbProd ? dbProd.price : 800; // default/fallback
      let finalVariant = "";
      
      if (dbProd && dbProd.variants && dbProd.variants.length > 0) {
        const variantObj = dbProd.variants.find((v: any) => v.name === variantName) || dbProd.variants[0];
        if (variantObj) {
          unitPrice = variantObj.price;
          finalVariant = variantObj.name;
        }
      }
      
      list.push({
        product: brand ? `${brand} ${prodName}` : prodName,
        variant: finalVariant || undefined,
        quantity,
        unitPrice,
        total: unitPrice * quantity
      });
    });
    
    return list;
  }, [selectedProductsCheckboxes, selectedProductQuantities, selectedProductVariants, selectedProductBrands, availableProducts]);

  const toggleProductSelection = (prodName: string) => {
    setSelectedProductsCheckboxes(prev => {
      const nextChecked = !prev[prodName];
      if (nextChecked) {
        setSelectedProductQuantities(q => ({ ...q, [prodName]: 1 }));
        const dbProd = availableProducts.find(p => p.name === prodName);
        if (dbProd && dbProd.variants && dbProd.variants.length > 0) {
          setSelectedProductVariants(v => ({ ...v, [prodName]: dbProd.variants[0].name }));
        }
      }
      return { ...prev, [prodName]: nextChecked };
    });
  };

  const recommendedPkg = useMemo(() => {
    if (!isCctvServiceRequest || !service.packages || service.packages.length === 0) return null;
    
    let name = service.packages[0].name;
    
    if (service.slug === "install-new-cctv") {
      const propType = questionAnswers["Select Property Type"];
      const numCam = questionAnswers["How many Cameras"];
      const packageChoice = questionAnswers["Installation Package"];
      
      if (packageChoice === "Basic" || numCam === "2" || numCam === "4") {
        name = "Basic Setup";
      } else if (packageChoice === "Premium" || numCam === "6" || numCam === "8") {
        name = "Premium Setup";
      } else if (packageChoice === "Custom" || numCam === "16+" || numCam === "Custom" || ["Warehouse", "Factory"].includes(propType)) {
        name = "Custom Setup";
      } else {
        name = "Basic Setup";
      }
    } else if (service.slug === "repair-existing-cctv") {
      name = "CCTV Diagnosis & Repair";
    } else if (service.slug === "maintenance-amc") {
      const plan = questionAnswers["Choose AMC Plan"];
      if (plan === "One Time") name = "One Time Support";
      else if (plan === "Quarterly") name = "Quarterly AMC";
      else if (plan === "Half Yearly") name = "Half Yearly AMC";
      else if (plan === "Annual") name = "Annual AMC";
      else name = "Annual AMC";
    } else if (service.slug === "upgrade-existing-cctv") {
      name = "CCTV Upgrade Consultation";
    } else if (service.slug === "free-site-survey") {
      name = "Free Site Survey";
    }
    
    return service.packages.find(p => p.name.toLowerCase() === name.toLowerCase()) || service.packages[0];
  }, [service, questionAnswers, isCctvServiceRequest]);

  // Automatically select the recommended package if none is selected manually
  useEffect(() => {
    if (isCctvServiceRequest && recommendedPkg && !selectedPackageId) {
      setSelectedPackageId(recommendedPkg._id);
    }
  }, [recommendedPkg, selectedPackageId, isCctvServiceRequest]);

  // Automatically select delivery package for Buy CCTV Products
  useEffect(() => {
    if (isBuyCctvProducts && service.packages && service.packages.length > 0 && !selectedPackageId) {
      setSelectedPackageId(service.packages[0]._id);
      handleAnswerChange("Selected Package", service.packages[0].name);
    }
  }, [isBuyCctvProducts, service.packages, selectedPackageId]);

  // Price calculations
  const prices = useMemo(() => {
    if (isInstallNewCctv) {
      const pb = cctvCalculatedPrice?.priceBreakdown || {};
      const fittingChg = pb.installationTotal || 0;
      const cableChg = pb.cableTotal || 0;
      const sdChg = pb.sdCardTotal || 0;
      const dvrChg = pb.dvrTotal || 0;
      const nvrChg = pb.nvrTotal || 0;
      const rackChg = pb.rackTotal || 0;
      const monChg = pb.monitorTotal || 0;
      const hddChg = pb.hddTotal || 0;
      const rackSelectedChg = pb.rackSelectedTotal || 0;
      const visitChg = pb.baseCharge || 0;
      
      const discount = 0;
      const gst = pb.taxTotal || 0;
      const grandTotal = pb.grandTotal || 0;
      
      return {
        packageCost: fittingChg,
        visitCharge: visitChg,
        labourCost: cableChg + sdChg + dvrChg + nvrChg + rackChg + monChg + hddChg + rackSelectedChg,
        discount,
        gst,
        grandTotal,
        rawBreakdown: pb
      };
    } else if (isBuyCctvProducts) {
      const productsTotal = selectedProductsList.reduce((sum, p) => sum + p.total, 0);
      const deliveryCharge = 199;
      const baseTotal = productsTotal + deliveryCharge;
      const discount = 0;
      const totalBeforeTax = baseTotal;
      const gst = Math.round(totalBeforeTax * 0.18);
      const grandTotal = totalBeforeTax + gst;
      return {
        packageCost: productsTotal,
        visitCharge: deliveryCharge,
        labourCost: 0,
        discount,
        gst,
        grandTotal
      };
    } else {
      const s = service as any;
      let packageCost = 0;
      if (s.packages && s.packages.length > 0) {
        const found = s.packages.find((p: any) => p._id === selectedPackageId);
        if (found) packageCost = found.price;
      } else {
        packageCost = s.pricingStartsFrom || 0;
      }

      const visitCharge = service.slug === "free-site-survey" ? 0 : 499;
      const labourCost = 0;
      const baseTotal = packageCost + visitCharge + labourCost;
      const discount = 0;
      const totalBeforeTax = baseTotal;
      const gst = Math.round(totalBeforeTax * 0.18);
      const grandTotal = totalBeforeTax + gst;

      return { packageCost, visitCharge, labourCost, discount, gst, grandTotal };
    }
  }, [isInstallNewCctv, cctvCalculatedPrice, isBuyCctvProducts, selectedProductsList, service, selectedPackageId]);

  // Apply discount coupon code (Disabled - Coupon section removed)
  const handleApplyCoupon = () => {};

  // Step names list
  const stepsList = useMemo(() => {
    if (isBuyCctvProducts) {
      return [
        { step: 1, label: "Select Products" },
        { step: 2, label: "Quantity & Variants" },
        { step: 3, label: "Delivery Date" },
        { step: 4, label: "Delivery Address" },
        { step: 5, label: "Review Cart" },
        { step: 6, label: "Checkout & Pay" }
      ];
    } else if (isCctvServiceRequest) {
      if (isInstallNewCctv) {
        const steps = [
          { step: 1, label: "Details & Questions" },
          { step: 2, label: "Date & Time" }
        ];
        let currentStep = 3;
        steps.push({ step: currentStep++, label: "Upload Images" });
        steps.push({ step: currentStep++, label: "Service Location" });
        steps.push({ step: currentStep++, label: "Review Estimate" });
        steps.push({ step: currentStep++, label: "Checkout & Pay" });
        return steps.map((s, idx) => ({ ...s, step: idx + 1 }));
      }
      const steps = [
        { step: 1, label: "Details & Questions" },
        { step: 2, label: "Choose Package" },
        { step: 3, label: "Date & Time" }
      ];
      let currentStep = 4;
      const hasUpload = ["install-new-cctv", "repair-existing-cctv"].includes(service.slug);
      if (hasUpload) {
        steps.push({ step: currentStep++, label: "Upload Images" });
      }
      steps.push({ step: currentStep++, label: "Service Location" });
      steps.push({ step: currentStep++, label: "Review Estimate" });
      steps.push({ step: currentStep++, label: "Checkout & Pay" });
      return steps.map((s, idx) => ({ ...s, step: idx + 1 }));
    } else {
      return [
        { step: 1, label: "Choose Package" },
        { step: 2, label: "Details & Questions" },
        { step: 3, label: "Date & Time" },
        { step: 4, label: "Upload Images" },
        { step: 5, label: "Service Location" },
        { step: 6, label: "Review Estimate" },
        { step: 7, label: "Checkout & Pay" }
      ];
    }
  }, [service.slug, isBuyCctvProducts, isInstallNewCctv, isCctvServiceRequest]);

  const currentStepLabel = stepsList[step - 1]?.label || "";

  const goNext = () => {
    if (currentStepLabel === "Choose Package") {
      if (service.packages && service.packages.length > 0 && !selectedPackageId) {
        toast({ title: "Required Choice", description: "Please select a service package.", variant: "destructive" });
        return;
      }
    }
    if (currentStepLabel === "Select Products") {
      if (selectedProductsList.length === 0) {
        toast({ title: "Product Required", description: "Please select at least one product to purchase.", variant: "destructive" });
        return;
      }
    }
    if (currentStepLabel === "Details & Questions") {
      if (isInstallNewCctv) {
        const hasCameraSelected = Object.values(cctvSelectedCameraTypes).some(v => v);
        if (!cctvPropertyType) {
          toast({ title: "Property Type Required", description: "Please select a property type.", variant: "destructive" });
          return;
        }
        if (!hasCameraSelected) {
          toast({ title: "Camera Type Required", description: "Please select at least one camera type.", variant: "destructive" });
          return;
        }
        if (cctvTotalCameras > 16) {
          toast({ title: "Enterprise Booking Required", description: "CCTV bookings with more than 16 cameras are blocked online. Please contact our office.", variant: "destructive" });
          return;
        }
        if (cctvInstallationRequired) {
          if (!cctvCableType) {
            toast({ title: "Cable Type Required", description: "Please select a cable type.", variant: "destructive" });
            return;
          }
          if (!cctvCableLength || cctvCableLength <= 0) {
            toast({ title: "Cable Length Required", description: "Please enter a valid cable length.", variant: "destructive" });
            return;
          }
        }
      } else {
        const questions = service.bookingQuestions || [];
        for (const q of questions) {
          if (q.required && !questionAnswers[q.question]) {
            toast({ title: "Incomplete Form", description: `${q.question} is required.`, variant: "destructive" });
            return;
          }
        }
      }
    }
    if ((currentStepLabel === "Date & Time" || currentStepLabel === "Delivery Date") && (!date || (currentStepLabel === "Date & Time" && !time))) {
      toast({ title: "Schedule Required", description: "Please choose your preferred slot details.", variant: "destructive" });
      return;
    }
    if ((currentStepLabel === "Service Location" || currentStepLabel === "Delivery Address") && (!address || !latitude || !longitude)) {
      toast({ title: "Location Required", description: "Please pin your location on the map to proceed.", variant: "destructive" });
      return;
    }
    setStep(step + 1);
  };

  const goPrev = () => {
    setStep(step - 1);
  };

  // Razorpay dynamic loading and execution helper
  const loadRazorpayCheckout = async () => {
    return new Promise((resolve) => {
      if ((window as any).Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // Checkout submission handler
  const handleCheckoutSubmit = async () => {
    setSubmitting(true);
    const token = localStorage.getItem(AUTH_TOKEN_STORAGE_KEY) || localStorage.getItem("token") || localStorage.getItem("accessToken") || "";

    let finalAddressId = selectedAddressId;
    if (selectedAddressId === "new" || !selectedAddressId) {
      try {
        const addrRes = await fetch("/api/user/address", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            name: "Service Location",
            mobile: customerPhone,
            address: formattedAddress || address,
            landmark,
            city,
            state: stateName,
            pincode,
            latitude,
            longitude,
            houseNumber,
            street,
            area,
            district,
            country,
            manualNotes: `Floor: ${floor || '—'}, Apartment: ${apartmentName || '—'}. Instructions: ${deliveryInstructions || '—'}`,
            formattedAddress: formattedAddress || address,
            isDefault: savedAddresses.length === 0
          })
        });
        const addrJson = await addrRes.json();
        if (addrJson.success && addrJson.data?._id) {
          finalAddressId = addrJson.data._id;
        }
      } catch (e) {
        console.error("Failed to save address dynamically:", e);
      }
    }

    const bookingAnswers = Object.entries(questionAnswers).map(([q, a]) => ({ question: q, answer: a }));
    const payload = {
      service: service.name,
      serviceId: service._id,
      serviceName: service.name,
      address: formattedAddress || address,
      description: notes || "Booking requested",
      date,
      timeSlot: isBuyCctvProducts ? undefined : time,
      customerName,
      customerPhone,
      totalAmount: prices.grandTotal,
      serviceType: isBuyCctvProducts ? "other" : (service.slug.includes("repair") ? "repair" : "installation"),
      addressId: finalAddressId !== "new" && finalAddressId ? finalAddressId : undefined,
      latitude,
      longitude,
      city,
      state: stateName,
      pincode,
      bookingAnswers,
      uploadedImages: isBuyCctvProducts ? [] : uploadedImages,
      products: isBuyCctvProducts ? selectedProductsList : undefined,
      // Structured address fields
      houseNumber,
      street,
      area,
      landmark,
      district,
      country,
      floor,
      apartmentName,
      deliveryInstructions,
      manualNotes: `Floor: ${floor || '—'}, Apartment: ${apartmentName || '—'}. Instructions: ${deliveryInstructions || '—'}`,
      formattedAddress: formattedAddress || address,
      cctvDetails: {
        category: { name: "CCTV", slug: "cctv" },
        subcategory: { id: service._id, name: service.name, slug: service.slug },
        priceBreakdown: isInstallNewCctv ? (prices.rawBreakdown || prices) : prices,
        notes,
        products: isBuyCctvProducts ? selectedProductsList : undefined,
        ...(isInstallNewCctv ? {
          propertyType: cctvPropertyType,
          cameraTypes: Object.entries(cctvSelectedCameraTypes)
            .filter(([_, checked]) => checked)
            .map(([type]) => ({
              type,
              brandId: cctvCameraBrands[type],
              modelId: cctvCameraModels[type],
              quantity: cctvCameraQuantities[type] || 1
            })),
          installationRequired: cctvInstallationRequired,
          cableType: cctvCableType,
          cableLength: cctvCableLength,
          dvrRequired: cctvDvrRequired,
          nvrRequired: cctvNvrRequired,
          selectedDvrChannels: cctvDvrChannels,
          networkRack: cctvNetworkRack,
          monitorMounting: cctvMonitorMounting,
          sdCardRequired: cctvSdCardEnabled,
          sdCardCapacity: cctvSdCardCapacity,
          sdCardQuantity: cctvSdCardQuantity,
          hddCapacity: cctvHddCapacity,
          rackType: cctvRackType
        } : {})
      }
    };

    try {
      if (paymentMethod === "online") {
        // online Razorpay flow
        const orderData = await cctvApi.createOrder({ bookingPayload: payload });
        const scriptLoaded = await loadRazorpayCheckout();
        if (!scriptLoaded) {
          throw new Error("Razorpay SDK failed to load. Please check your connectivity.");
        }

        const options = {
          key: orderData.keyId || orderData.key,
          amount: orderData.amount,
          currency: orderData.currency || "INR",
          name: "Techbes Security",
          description: `Booking payment for ${service.name}`,
          order_id: orderData.orderId || orderData.id,
          handler: async (resp: any) => {
            try {
              const verifyRes = await cctvApi.verifyPayment({
                razorpay_order_id: resp.razorpay_order_id,
                razorpay_payment_id: resp.razorpay_payment_id,
                razorpay_signature: resp.razorpay_signature
              });
              const job = verifyRes.job || verifyRes.data?.job || verifyRes.data;
              toast({ title: "Booking Success", description: "Advance payment verified! Booking is scheduled." });
              onOpenChange(false);
              router.push(`/dashboard/bookings/${job._id || job.id}`);
            } catch (err: any) {
              toast({ title: "Payment Verification Failed", description: err.message, variant: "destructive" });
            }
          },
          prefill: { name: customerName, contact: customerPhone }
        };
        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      } else if (paymentMethod === "wallet") {
        // Wallet pay flow
        if (walletBalance === null || walletBalance < prices.grandTotal) {
          throw new Error("Insufficient wallet balance to proceed. Please top up or choose another payment method.");
        }
        // First create direct booking
        const createdJob = await cctvApi.createBooking(payload);
        const jobId = createdJob._id || createdJob.id || createdJob.data?._id;
        
        // Deduct from wallet
        await fetchAuthApi("/api/v2/wallet/pay-booking", {
          method: "POST",
          body: JSON.stringify({ jobId, amount: prices.grandTotal })
        });

        toast({ title: "Booking Success", description: "Deducted balance from wallet. Booking scheduled!" });
        onOpenChange(false);
        router.push(`/dashboard/bookings/${jobId}`);
      } else {
        throw new Error("Invalid payment method selected. Cash on Delivery is not allowed.");
      }
    } catch (err: any) {
      toast({ title: "Booking Failed", description: err.message || "An unexpected checkout error occurred.", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-5xl rounded-[24px] p-6 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.12)] border border-slate-100/80">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black text-slate-900">
            {isBuyCctvProducts ? `Purchase ${service.name}` : `Book ${service.name}`}
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500 font-semibold">
            {isBuyCctvProducts
              ? "Select products, quantities, and schedule delivery address."
              : "Complete the form selection to request security camera installation & setup."}
          </DialogDescription>
        </DialogHeader>

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
          <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm min-h-[350px] flex flex-col justify-between">
            <div>
              {/* Render Steps dynamically based on label */}
              {currentStepLabel === "Choose Package" && (
                <div className="space-y-4">
                  {isCctvServiceRequest && recommendedPkg ? (
                    <div className="space-y-5">
                      <div className="flex gap-2 items-start flex-col">
                        <h3 className="text-base font-black text-slate-800">Recommended Package</h3>
                        <p className="text-xs text-slate-400 font-medium">We calculated this package based on your questionnaire responses</p>
                      </div>

                      {/* Prominent Recommended Package Card */}
                      <div
                        onClick={() => {
                          setSelectedPackageId(recommendedPkg._id);
                          handleAnswerChange("Selected Package", recommendedPkg.name);
                        }}
                        className={`cursor-pointer rounded-2xl border-2 p-5 transition-all relative overflow-hidden bg-gradient-to-br from-blue-50/20 to-sky-50/10 shadow-sm ${
                          selectedPackageId === recommendedPkg._id
                            ? "border-blue-600 ring-1 ring-blue-600 bg-blue-50/20"
                            : "border-slate-200 hover:border-blue-200 bg-white"
                        }`}
                      >
                        <span className="absolute top-0 right-0 bg-blue-600 text-white text-[9px] font-black uppercase px-3 py-1 rounded-bl-xl tracking-wider shadow-sm font-sans">
                          Auto Recommended
                        </span>
                        
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="font-extrabold text-base text-slate-900">{recommendedPkg.name}</h4>
                          <span className="font-black text-blue-600 text-base">₹{recommendedPkg.price}</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-2 leading-relaxed">{recommendedPkg.description}</p>
                        {recommendedPkg.duration && (
                          <div className="text-[10px] text-slate-400 mt-3 font-bold">Estimated duration: {recommendedPkg.duration}</div>
                        )}
                        {recommendedPkg.includes && recommendedPkg.includes.length > 0 && (
                          <div className="mt-3.5 pt-3.5 border-t border-slate-100">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">What's Included:</span>
                            <ul className="text-[11px] text-slate-600 mt-2 space-y-1.5 list-disc pl-4 font-medium">
                              {recommendedPkg.includes.map((inc: string, idx: number) => (
                                <li key={idx}>{inc}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>

                      {/* Other Packages section */}
                      {service.packages && service.packages.length > 1 && (
                        <div className="space-y-3 pt-3 border-t border-slate-100">
                          <h4 className="text-xs font-bold text-slate-700">Other Available Packages</h4>
                          <div className="grid gap-3 sm:grid-cols-2">
                            {service.packages
                              .filter((p: any) => p._id !== recommendedPkg._id)
                              .map((pkg: any) => {
                                const isSelected = selectedPackageId === pkg._id;
                                return (
                                  <div
                                    key={pkg._id}
                                    onClick={() => {
                                      setSelectedPackageId(pkg._id);
                                      handleAnswerChange("Selected Package", pkg.name);
                                    }}
                                    className={`cursor-pointer rounded-2xl border p-4 transition-all hover:shadow-md ${
                                      isSelected ? "border-blue-600 bg-blue-50/10 ring-1 ring-blue-600" : "border-slate-200 bg-white"
                                    }`}
                                  >
                                    <div className="flex justify-between items-start gap-2">
                                      <h5 className="font-bold text-sm text-slate-900">{pkg.name}</h5>
                                      <span className="font-black text-blue-600 text-sm">₹{pkg.price}</span>
                                    </div>
                                    <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">{pkg.description}</p>
                                    {pkg.duration && (
                                      <div className="text-[10px] text-slate-400 mt-2.5 font-bold">Duration: {pkg.duration}</div>
                                    )}
                                  </div>
                                );
                              })}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    // Original Choose Package list for non-CCTV (or Buy CCTV Products demonstration package)
                    <div className="space-y-4">
                      <div className="flex gap-2 items-start flex-col">
                        <h3 className="text-base font-black text-slate-800">Select a Service Package</h3>
                        <p className="text-xs text-slate-400 font-medium">Choose a setup tier optimized for your requirements</p>
                      </div>
                      {service.packages && service.packages.length > 0 ? (
                        <div className="grid gap-3 sm:grid-cols-2">
                          {service.packages.map((pkg: any) => {
                            const isSelected = selectedPackageId === pkg._id;
                            return (
                              <div
                                key={pkg._id}
                                onClick={() => {
                                  setSelectedPackageId(pkg._id);
                                  handleAnswerChange("Selected Package", pkg.name);
                                }}
                                className={`cursor-pointer rounded-2xl border p-4 transition-all hover:shadow-md ${
                                  isSelected ? "border-blue-600 bg-blue-50/10 ring-1 ring-blue-600" : "border-slate-200 bg-white"
                                }`}
                              >
                                <div className="flex justify-between items-start gap-2">
                                  <h4 className="font-bold text-sm text-slate-900">{pkg.name}</h4>
                                  <span className="font-black text-blue-600 text-sm">₹{pkg.price}</span>
                                </div>
                                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">{pkg.description}</p>
                                {pkg.duration && (
                                  <div className="text-[10px] text-slate-400 mt-2.5 font-bold">Duration: {pkg.duration}</div>
                                )}
                                {pkg.includes && pkg.includes.length > 0 && (
                                  <ul className="text-[10px] text-slate-500 mt-2 space-y-1 list-disc pl-4">
                                    {pkg.includes.map((inc: string, idx: number) => (
                                      <li key={idx}>{inc}</li>
                                    ))}
                                  </ul>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-6 text-center">
                          <Info className="h-6 w-6 text-slate-400 mx-auto mb-2" />
                          <p className="text-xs text-slate-500 font-semibold">This service uses dynamic cost calculation. Please continue to custom questions.</p>
                          <Button className="mt-3 bg-blue-600 text-white font-bold text-xs" onClick={() => setStep(2)}>Continue</Button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {currentStepLabel === "Details & Questions" && (
                <div className="space-y-4">
                  {isInstallNewCctv ? (
                    <div className="space-y-6">
                      <div className="flex gap-1 items-start flex-col">
                        <h3 className="text-base font-black text-slate-800">Dynamic Installation Specifications</h3>
                        <p className="text-xs text-slate-400 font-medium">Specify your security camera installation preferences to calculate dynamic pricing.</p>
                      </div>

                      {/* 1. Property Type */}
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                          Property Type <span className="rounded-full bg-rose-50 px-1.5 py-0.5 text-[8px] font-bold text-rose-700 ring-1 ring-inset ring-rose-600/10">Required</span>
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {["Home", "Apartment", "Office", "Shop", "Warehouse", "Factory", "Other"].map((t) => {
                            const isSelected = cctvPropertyType === t;
                            return (
                              <button
                                type="button"
                                key={t}
                                onClick={() => setCctvPropertyType(t)}
                                className={`px-4 py-2 text-xs font-bold rounded-xl border transition ${
                                  isSelected
                                    ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                                    : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                                }`}
                              >
                                {t}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* 2. Camera Type Selection */}
                      <div className="space-y-2.5">
                        <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                          Select Camera Types <span className="rounded-full bg-rose-50 px-1.5 py-0.5 text-[8px] font-bold text-rose-700 ring-1 ring-inset ring-rose-600/10">Required</span>
                        </label>
                        <div className="grid gap-2 sm:grid-cols-2">
                          {["IP Camera", "Analog Camera", "WiFi Indoor Camera", "WiFi Outdoor Camera", "4G Camera", "Solar Camera"].map((type) => {
                            const checked = cctvSelectedCameraTypes[type] || false;
                            return (
                              <div
                                key={type}
                                onClick={() => {
                                  setCctvSelectedCameraTypes(prev => {
                                    const next = !prev[type];
                                    if (next && !cctvCameraQuantities[type]) {
                                      setCctvCameraQuantities(q => ({ ...q, [type]: 1 }));
                                    }
                                    return { ...prev, [type]: next };
                                  });
                                }}
                                className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer select-none transition ${
                                  checked ? "border-blue-600 bg-blue-50/10 ring-1 ring-blue-600" : "border-slate-200 bg-white hover:shadow-xs"
                                }`}
                              >
                                <div className="flex items-center gap-2.5">
                                  <input
                                    type="checkbox"
                                    checked={checked}
                                    onChange={() => {}}
                                    className="h-4.5 w-4.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                  />
                                  <span className="font-bold text-xs text-slate-800">{type}</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* 3. Camera Details (Brand, Model, Qty) */}
                      {Object.entries(cctvSelectedCameraTypes).filter(([_, checked]) => checked).length > 0 && (
                        <div className="space-y-4 bg-slate-50/50 rounded-2xl p-4 border border-slate-100">
                          <label className="text-xs font-bold text-slate-700 block">Configure Selected Cameras</label>
                          <div className="space-y-4">
                            {Object.entries(cctvSelectedCameraTypes)
                              .filter(([_, checked]) => checked)
                              .map(([type]) => {
                                const qty = cctvCameraQuantities[type] || 1;
                                const selectedBrandId = cctvCameraBrands[type] || "";
                                const selectedModelId = cctvCameraModels[type] || "";
                                
                                // Filter models by type and selected brand
                                const filteredModels = cctvAllModels.filter(
                                  (m) => m.cameraType === type && String(m.brandId?._id || m.brandId) === selectedBrandId
                                );

                                return (
                                  <div key={type} className="p-3.5 bg-white rounded-xl border border-slate-200/80 space-y-3 shadow-xs">
                                    <div className="flex justify-between items-center">
                                      <span className="text-xs font-black text-slate-800 uppercase tracking-wider">{type}</span>
                                      
                                      {/* Quantity Counter */}
                                      <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                                        <button
                                          type="button"
                                          onClick={() => setCctvCameraQuantities(prev => ({ ...prev, [type]: Math.max((prev[type] || 1) - 1, 1) }))}
                                          className="h-8 w-8 text-xs font-bold text-slate-600 hover:bg-slate-100 transition"
                                        >
                                          -
                                        </button>
                                        <span className="w-8 text-center text-xs font-extrabold text-slate-700">{qty}</span>
                                        <button
                                          type="button"
                                          onClick={() => setCctvCameraQuantities(prev => ({ ...prev, [type]: (prev[type] || 1) + 1 }))}
                                          className="h-8 w-8 text-xs font-bold text-slate-600 hover:bg-slate-100 transition"
                                        >
                                          +
                                        </button>
                                      </div>
                                    </div>

                                    <div className="grid gap-3 sm:grid-cols-2">
                                      {/* Brand Dropdown */}
                                      <div className="space-y-1">
                                        <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Brand *</label>
                                        <select
                                          value={selectedBrandId}
                                          onChange={(e) => {
                                            const bId = e.target.value;
                                            setCctvCameraBrands(prev => ({ ...prev, [type]: bId }));
                                            setCctvCameraModels(prev => ({ ...prev, [type]: "" })); // Reset selected model
                                          }}
                                          className="h-9 w-full rounded-lg border border-slate-200 px-2.5 bg-slate-50 text-[11px] font-semibold text-slate-700 focus:outline-none"
                                          required
                                        >
                                          <option value="">Select Brand</option>
                                          {cctvBrands.map((b) => (
                                            <option key={b._id} value={b._id}>{b.name}</option>
                                          ))}
                                        </select>
                                      </div>

                                      {/* Model Dropdown */}
                                      <div className="space-y-1">
                                        <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Model Variant *</label>
                                        <select
                                          value={selectedModelId}
                                          onChange={(e) => {
                                            setCctvCameraModels(prev => ({ ...prev, [type]: e.target.value }));
                                          }}
                                          disabled={!selectedBrandId}
                                          className="h-9 w-full rounded-lg border border-slate-200 px-2.5 bg-slate-50 text-[11px] font-semibold text-slate-700 focus:outline-none disabled:opacity-60"
                                          required
                                        >
                                          <option value="">Select Model</option>
                                          {filteredModels.map((m) => (
                                            <option key={m._id} value={m._id}>
                                              {m.resolution} {m.name} (₹{m.price})
                                            </option>
                                          ))}
                                        </select>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                          </div>
                        </div>
                      )}

                      {/* 4. Wiring Configuration */}
                      <div className="space-y-4 bg-slate-50/50 rounded-2xl p-4 border border-slate-100">
                        <label className="flex items-center gap-2 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={cctvInstallationRequired}
                            onChange={(e) => {
                              setCctvInstallationRequired(e.target.checked);
                              if (!e.target.checked) {
                                setCctvCableType("");
                                setCctvCableLength(0);
                              }
                            }}
                            className="h-4.5 w-4.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="font-bold text-xs text-slate-800">Installation Required?</span>
                        </label>

                        {cctvInstallationRequired && (
                          <div className="space-y-4 pt-3 border-t border-slate-100 animate-fadeIn">
                            {/* Cable Type selection */}
                            <div className="space-y-2">
                              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                                Cable Type <span className="rounded-full bg-rose-50 px-1.5 py-0.5 text-[8px] font-bold text-rose-700 ring-1 ring-inset ring-rose-600/10">Required</span>
                              </label>
                              <div className="grid gap-2.5 sm:grid-cols-2">
                                {[
                                  { name: "CAT6 Cable", price: cctvCables.find(c => c.name.includes("CAT6"))?.price || 60 },
                                  { name: "3+1 CCTV Cable", price: cctvCables.find(c => c.name.includes("3+1"))?.price || 18 }
                                ].map((c) => {
                                  const isSelected = cctvCableType === c.name;
                                  return (
                                    <div
                                      key={c.name}
                                      onClick={() => setCctvCableType(c.name)}
                                      className={`flex flex-col p-3 rounded-xl border text-xs cursor-pointer transition select-none ${
                                        isSelected
                                          ? "border-blue-600 bg-blue-50/10 ring-1 ring-blue-600"
                                          : "border-slate-200 bg-white hover:border-slate-300"
                                      }`}
                                    >
                                      <span className="font-extrabold text-slate-800">{c.name}</span>
                                      <span className="text-[10px] text-slate-400 mt-1 font-semibold">Charged at ₹{c.price} / meter</span>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>

                            {/* Cable Length */}
                            <div className="space-y-1.5">
                              <label className="text-xs font-bold text-slate-700">Cable Length (Meters)</label>
                              <input
                                type="number"
                                min="1"
                                value={cctvCableLength || ""}
                                onChange={(e) => setCctvCableLength(Math.max(Number(e.target.value) || 0, 0))}
                                placeholder="e.g. 50"
                                className="h-10 w-full rounded-xl border border-slate-200 px-3 bg-white text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* 5. DVR / NVR Dropdown */}
                      <div className="space-y-3 bg-slate-50/50 rounded-2xl p-4 border border-slate-100">
                        <label className="text-xs font-bold text-slate-700 block">DVR / NVR Recorder Channel</label>
                        <div className="space-y-2">
                          <select
                            value={cctvDvrChannels}
                            onChange={(e) => {
                              setCctvDvrChannels(e.target.value);
                              setCctvDvrManualOverride(true);
                            }}
                            className="h-10 w-full rounded-xl border border-slate-200 px-3 bg-white text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                          >
                            <option value="None">None / Not Required</option>
                            <option value="4 Channel">4 Channel</option>
                            <option value="8 Channel">8 Channel</option>
                            <option value="16 Channel">16 Channel</option>
                            <option value="32 Channel">32 Channel</option>
                          </select>
                          {cctvTotalCameras > 0 && (
                            <p className="text-[10px] text-blue-700 font-bold mt-1">
                              Recommended: {cctvTotalCameras <= 4 ? "4 Channel" : cctvTotalCameras <= 8 ? "8 Channel" : cctvTotalCameras <= 16 ? "16 Channel" : "32 Channel"} DVR/NVR based on your selected cameras.
                            </p>
                          )}
                        </div>
                      </div>

                      {/* 6. Optional Add-ons */}
                      <div className="space-y-3 bg-slate-50/50 rounded-2xl p-4 border border-slate-100">
                        <label className="text-xs font-bold text-slate-700">Optional Add-ons</label>
                        <div className="space-y-3 pt-1">
                          <label className="flex items-center gap-2 cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={cctvNetworkRack}
                              onChange={(e) => setCctvNetworkRack(e.target.checked)}
                              className="h-4.5 w-4.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                            />
                            <div className="text-xs">
                              <span className="font-bold text-slate-800">Network Rack Mounting</span>
                              <span className="text-[10px] text-slate-400 font-bold ml-1.5">
                                (+ ₹{cctvAccessories.find(a => a.name.toLowerCase().includes("rack"))?.price || 500})
                              </span>
                            </div>
                          </label>

                          <label className="flex items-center gap-2 cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={cctvMonitorMounting}
                              onChange={(e) => setCctvMonitorMounting(e.target.checked)}
                              className="h-4.5 w-4.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                            />
                            <div className="text-xs">
                              <span className="font-bold text-slate-800">Monitor Mounting</span>
                              <span className="text-[10px] text-slate-400 font-bold ml-1.5">
                                (+ ₹{cctvAccessories.find(a => a.name.toLowerCase().includes("monitor"))?.price || 350})
                              </span>
                            </div>
                          </label>

                          {/* SD Card (Memory Card) Add-on */}
                          {showSdCardSection && (
                            <div className="border-t border-slate-200/60 pt-3 mt-3 space-y-3">
                              <label className="flex items-center gap-2 cursor-pointer select-none">
                                <input
                                  type="checkbox"
                                  checked={cctvSdCardEnabled}
                                  onChange={(e) => {
                                    setCctvSdCardEnabled(e.target.checked);
                                    if (e.target.checked && cctvSdCards.length > 0 && !cctvSdCardCapacity) {
                                      setCctvSdCardCapacity(cctvSdCards[0].capacity);
                                    }
                                  }}
                                  className="h-4.5 w-4.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                />
                                <span className="font-bold text-xs text-slate-800">Add Memory Card (SD Card)</span>
                              </label>

                              {cctvSdCardEnabled && (
                                <div className="grid gap-3 sm:grid-cols-2 pl-6.5 animate-fadeIn">
                                  <div className="space-y-1">
                                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Capacity *</label>
                                    <select
                                      value={cctvSdCardCapacity}
                                      onChange={(e) => setCctvSdCardCapacity(e.target.value)}
                                      className="h-9 w-full rounded-lg border border-slate-200 px-2.5 bg-white text-[11px] font-semibold text-slate-700 focus:outline-none"
                                      required
                                    >
                                      {cctvSdCards.map((sd) => (
                                        <option key={sd._id} value={sd.capacity}>
                                          {sd.capacity} (₹{sd.price})
                                        </option>
                                      ))}
                                    </select>
                                  </div>
                                  <div className="space-y-1">
                                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Quantity</label>
                                    <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-white h-9 w-24">
                                      <button
                                        type="button"
                                        onClick={() => setCctvSdCardQuantity(q => Math.max(q - 1, 1))}
                                        className="h-full w-8 text-xs font-bold text-slate-600 hover:bg-slate-50 transition"
                                      >
                                        -
                                      </button>
                                      <span className="flex-1 text-center text-xs font-extrabold text-slate-700">{cctvSdCardQuantity}</span>
                                      <button
                                        type="button"
                                        onClick={() => setCctvSdCardQuantity(q => q + 1)}
                                        className="h-full w-8 text-xs font-bold text-slate-600 hover:bg-slate-50 transition"
                                      >
                                        +
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {/* HDD Capacity selection */}
                              <div className="border-t border-slate-200/60 pt-3 mt-3 space-y-1.5 animate-fadeIn">
                                <label className="text-[11px] font-bold text-slate-700 block">HDD / Storage</label>
                                <select
                                  value={cctvHddCapacity}
                                  onChange={(e) => setCctvHddCapacity(e.target.value)}
                                  className="h-10 w-full rounded-xl border border-slate-200 px-3 bg-white text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                >
                                  <option value="">None / Not Required</option>
                                  {cctvHdds.filter(h => h.status === 'active').map((hdd) => (
                                    <option key={hdd._id} value={hdd.capacity}>
                                      {hdd.capacity} — ₹{hdd.price.toLocaleString("en-IN")} + GST
                                    </option>
                                  ))}
                                </select>
                              </div>

                              {/* Rack selection */}
                              <div className="border-t border-slate-200/60 pt-3 mt-3 space-y-1.5 animate-fadeIn">
                                <label className="text-[11px] font-bold text-slate-700 block">Rack Option</label>
                                <select
                                  value={cctvRackType}
                                  onChange={(e) => setCctvRackType(e.target.value)}
                                  className="h-10 w-full rounded-xl border border-slate-200 px-3 bg-white text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                >
                                  <option value="">None / Not Required</option>
                                  {cctvRacks.filter(r => r.status === 'active').map((rack) => (
                                    <option key={rack._id} value={rack.type}>
                                      {rack.type} — ₹{rack.price.toLocaleString("en-IN")} + GST
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Large Enterprise Installation Block */}
                      {cctvTotalCameras > 16 && (
                        <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white rounded-2xl p-5 shadow-xl border border-blue-900 mt-4 space-y-4 animate-fadeIn">
                          <div className="flex items-start gap-3">
                            <div className="p-2 bg-white/10 rounded-xl mt-0.5">
                              <ShieldAlert className="h-5 w-5 text-blue-300 animate-pulse" />
                            </div>
                            <div className="space-y-1">
                              <h3 className="font-extrabold text-sm uppercase tracking-wider text-blue-300">Large Enterprise Installation</h3>
                              <p className="text-[11px] text-slate-300 font-bold leading-relaxed">
                                Installations above 16 cameras require a customized site assessment and quotation. Please contact our office to arrange a site survey.
                              </p>
                            </div>
                          </div>
                          <div className="border-t border-white/10 pt-3 flex flex-wrap gap-2.5">
                            <a
                              href="tel:+919900012345"
                              className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-[10px] uppercase tracking-wider transition"
                            >
                              <CalendarCheck className="h-3.5 w-3.5" /> Call Now
                            </a>
                            <a
                              href="https://wa.me/919900012345?text=Hi%20Techbes,%20I%20need%20a%20custom%20quote%20for%20a%20large%20CCTV%20installation%20with%20more%20than%2016%20cameras."
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-[10px] uppercase tracking-wider transition"
                            >
                              WhatsApp
                            </a>
                            <a
                              href="/quote?service=install-new-cctv"
                              className="flex items-center gap-1.5 px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-[10px] uppercase tracking-wider transition"
                            >
                              Get a Quote
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    // Default questions render
                    <div className="space-y-4">
                      {(service.bookingQuestions || []).length > 0 ? (
                        <div className="space-y-4">
                          {service.bookingQuestions?.map((q: any, idx: number) => {
                            const val = questionAnswers[q.question] || "";
                            const inputId = `q-${idx}`;
                            return (
                              <div key={idx} className="space-y-2">
                                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5 flex-wrap">
                                  {q.question}
                                  {q.required && (
                                    <span className="rounded-full bg-rose-50 px-1.5 py-0.5 text-[8px] font-bold text-rose-700 ring-1 ring-inset ring-rose-600/10">Required</span>
                                  )}
                                </label>

                                {q.type === "select" ? (
                                  <select
                                    id={inputId}
                                    value={val}
                                    onChange={(e) => handleAnswerChange(q.question, e.target.value)}
                                    className="h-11 w-full rounded-xl border border-slate-200 px-3 bg-slate-50 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                  >
                                    <option value="">{q.placeholder || "Select option..."}</option>
                                    {q.options?.map((opt: string) => (
                                      <option key={opt} value={opt}>{opt}</option>
                                    ))}
                                  </select>
                                ) : q.type === "multiselect" ? (
                                  <div className="grid gap-2 sm:grid-cols-2 rounded-2xl border border-slate-100 p-3 bg-slate-50/50">
                                    {q.options?.map((opt: string) => {
                                      const list = Array.isArray(val) ? val : [];
                                      const checked = list.includes(opt);
                                      return (
                                        <label key={opt} className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 bg-white text-xs cursor-pointer select-none">
                                          <input
                                            type="checkbox"
                                            checked={checked}
                                            onChange={() => {
                                              const nextList = checked ? list.filter((x) => x !== opt) : [...list, opt];
                                              handleAnswerChange(q.question, nextList);
                                            }}
                                            className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                          />
                                          {opt}
                                        </label>
                                      );
                                    })}
                                  </div>
                                ) : q.type === "image" ? (
                                  <div className="flex items-center gap-4">
                                    <label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 px-4 py-2.5 text-xs font-bold cursor-pointer transition">
                                      <Upload className="h-4 w-4 text-slate-500" />
                                      {val ? "Replace Picture" : "Choose File"}
                                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, q.question)} />
                                    </label>
                                    {val && (
                                      <div className="relative h-12 w-12 rounded-xl overflow-hidden border border-slate-200">
                                        <img src={val} alt="Uploaded preview" className="object-cover h-full w-full" />
                                      </div>
                                    )}
                                  </div>
                                ) : (
                                  <input
                                    id={inputId}
                                    type={q.type === "number" ? "number" : "text"}
                                    value={val}
                                    placeholder={q.placeholder || "Enter details..."}
                                    onChange={(e) => handleAnswerChange(q.question, e.target.value)}
                                    className="h-11 w-full rounded-xl border border-slate-200 px-3 bg-slate-50 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                  />
                                )}
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <p className="text-xs text-slate-500 font-semibold bg-slate-50 p-4 rounded-xl">No custom specifications required for this subcategory. Please continue.</p>
                      )}
                    </div>
                  )}
                </div>
              )}

              {currentStepLabel === "Select Products" && (
                <div className="space-y-4">
                  <div className="flex gap-2 items-start flex-col">
                    <h3 className="text-base font-black text-slate-800">Select CCTV Products</h3>
                    <p className="text-xs text-slate-400 font-medium">Choose multiple products to add to your purchase order</p>
                  </div>

                  {/* Category Filter Tabs */}
                  <div className="flex overflow-x-auto gap-2 pb-2 mt-2 -mx-1 px-1">
                    {[
                      { id: "all", label: "All Products" },
                      { id: "camera", label: "Cameras" },
                      { id: "recorder", label: "Recorders" },
                      { id: "storage", label: "Hard Disks" },
                      { id: "cable", label: "Cables" },
                      { id: "power", label: "Power Supplies" },
                      { id: "accessory", label: "Accessories" }
                    ].map(cat => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setSelectedProductCategory(cat.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                          selectedProductCategory === cat.id
                            ? 'bg-blue-900 text-white shadow-sm'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>

                  <div className="grid gap-2.5 sm:grid-cols-2 mt-2">
                    {availableProducts.filter(p => selectedProductCategory === "all" || p.type === selectedProductCategory).map((prod) => {
                      const prodName = prod.name;
                      const checked = selectedProductsCheckboxes[prodName] || false;
                      return (
                        <div
                          key={prod._id || prodName}
                          onClick={() => toggleProductSelection(prodName)}
                          className={`flex items-center justify-between p-4 rounded-2xl border transition cursor-pointer select-none ${
                            checked ? "border-blue-600 bg-blue-50/10 ring-1 ring-blue-600" : "border-slate-200 bg-white hover:shadow-sm"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => {}} // handled by parent div click
                              className="h-4.5 w-4.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                            />
                            <div>
                              <span className="font-bold text-xs text-slate-800 block">{prodName}</span>
                              <span className="text-[10px] text-slate-400 font-semibold mt-0.5 block">Starting at Rs. {prod.price}</span>
                            </div>
                          </div>
                          {checked && <Check className="h-4 w-4 text-blue-600" />}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {currentStepLabel === "Quantity & Variants" && (
                <div className="space-y-6">
                  <div className="flex gap-2 items-start flex-col">
                    <h3 className="text-base font-black text-slate-800">Choose Quantity & Variants</h3>
                    <p className="text-xs text-slate-400 font-medium">Specify order volume and technical options for your selected products</p>
                  </div>
                  
                  {selectedProductsList.length === 0 ? (
                    <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-6 text-center">
                      <p className="text-xs text-slate-500 font-semibold">No products selected. Please go back and select at least one product.</p>
                    </div>
                  ) : (
                    <div className="space-y-6 divide-y divide-slate-100">
                      {selectedProductsList.map((item, idx) => {
                        const dbProd = availableProducts.find(p => p.name === item.product);
                        const hasVariants = dbProd && dbProd.variants && dbProd.variants.length > 0;
                        
                        return (
                          <div key={item.product} className={`pt-4 ${idx === 0 ? 'pt-0' : ''} space-y-4`}>
                            <div className="flex justify-between items-center flex-wrap gap-2">
                              <h4 className="font-black text-sm text-slate-800 flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full bg-blue-600" /> {item.product}
                              </h4>
                              
                              {/* Quantity Selector */}
                              <div className="flex items-center gap-2.5">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Quantity</span>
                                <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                                  <button
                                    onClick={() => {
                                      const nextQty = Math.max(item.quantity - 1, 1);
                                      setSelectedProductQuantities(prev => ({ ...prev, [item.product]: nextQty }));
                                    }}
                                    className="h-8 w-8 text-xs font-bold text-slate-600 hover:bg-slate-100 active:bg-slate-200 transition"
                                  >
                                    -
                                  </button>
                                  <span className="w-8 text-center text-xs font-bold text-slate-700">{item.quantity}</span>
                                  <button
                                    onClick={() => {
                                      const nextQty = item.quantity + 1;
                                      setSelectedProductQuantities(prev => ({ ...prev, [item.product]: nextQty }));
                                    }}
                                    className="h-8 w-8 text-xs font-bold text-slate-600 hover:bg-slate-100 active:bg-slate-200 transition"
                                  >
                                    +
                                  </button>
                                </div>
                              </div>
                            </div>
                            
                            {/* Brand Selector */}
                            <div className="space-y-1">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Brand</span>
                              <select
                                value={selectedProductBrands[item.product] || ""}
                                onChange={(e) => {
                                  setSelectedProductBrands(prev => ({ ...prev, [item.product]: e.target.value }));
                                }}
                                className="h-9 w-full sm:w-64 rounded-xl border border-slate-200 px-2.5 bg-slate-50 text-[11px] font-semibold text-slate-700 focus:outline-none"
                              >
                                <option value="">Select Brand...</option>
                                {cctvBrands.map((b: any) => (
                                  <option key={b._id} value={b.name}>{b.name}</option>
                                ))}
                              </select>
                            </div>

                            {/* Variant Selector */}
                            {hasVariants && dbProd.variants && (
                              <div className="space-y-2">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Type / Capacity</span>
                                <div className="grid gap-2 sm:grid-cols-3">
                                  {dbProd.variants.map((vObj: any) => {
                                    const isSelected = item.variant === vObj.name;
                                    return (
                                      <div
                                        key={vObj.name}
                                        onClick={() => {
                                          setSelectedProductVariants(prev => ({ ...prev, [item.product]: vObj.name }));
                                        }}
                                        className={`flex flex-col p-3 rounded-xl border text-xs cursor-pointer transition select-none ${
                                          isSelected
                                            ? "border-blue-600 bg-blue-50/10 ring-1 ring-blue-600"
                                            : "border-slate-200 bg-white hover:border-slate-300"
                                        }`}
                                      >
                                        <span className="font-bold text-slate-800">{vObj.name}</span>
                                        <span className="text-[10px] text-slate-400 mt-1 font-semibold">{money(vObj.price)}</span>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {(currentStepLabel === "Date & Time" || currentStepLabel === "Delivery Date") && (
                <div className="space-y-4">
                  <div className="flex gap-1 items-start flex-col">
                    <h3 className="text-base font-black text-slate-800">
                      {isBuyCctvProducts ? "Select Delivery Date" : "Schedule Service Slot"}
                    </h3>
                    <p className="text-xs text-slate-400 font-medium">
                      {isBuyCctvProducts
                        ? "Pick your preferred date for product shipment & delivery"
                        : "Select a date and technician arrival window"}
                    </p>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="text-xs font-bold text-slate-700">
                        {isBuyCctvProducts ? "Delivery Date" : "Preferred Date"}
                      </label>
                      <input
                        type="date"
                        min={todayStr}
                        value={date}
                        onChange={(e) => {
                          setDate(e.target.value);
                          setTime(""); // reset selected time slot when date changes
                        }}
                        className="h-11 w-full rounded-xl border border-slate-200 px-3 mt-2 bg-slate-50 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      />
                    </div>
                    {!isBuyCctvProducts && (
                      <div>
                        <label className="text-xs font-bold text-slate-700">Arrival Window</label>
                        <select
                          value={time}
                          onChange={(e) => setTime(e.target.value)}
                          className="h-11 w-full rounded-xl border border-slate-200 px-3 mt-2 bg-slate-50 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        >
                          <option value="">Select slot...</option>
                          {[
                            "09:00 AM - 10:00 AM",
                            "10:00 AM - 11:00 AM",
                            "11:00 AM - 12:00 PM",
                            "12:00 PM - 01:00 PM",
                            "01:00 PM - 02:00 PM",
                            "02:00 PM - 03:00 PM",
                            "03:00 PM - 04:00 PM",
                            "04:00 PM - 05:00 PM",
                            "05:00 PM - 06:00 PM"
                          ].map((slot) => {
                            const disabled = isSlotDisabled(slot);
                            return (
                              <option key={slot} value={slot} disabled={disabled}>
                                {slot} {disabled ? "(Unavailable)" : ""}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {currentStepLabel === "Upload Images" && (
                <div className="space-y-4">
                  <div className="flex gap-1 items-start flex-col">
                    <h3 className="text-base font-black text-slate-800">Upload Site Photos (Optional)</h3>
                    <p className="text-xs text-slate-400 font-medium">Upload images of the installation area to help our engineers prepare</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 rounded-xl border border-dashed border-slate-300 bg-slate-50/50 hover:bg-slate-50 px-6 py-8 text-xs font-bold cursor-pointer transition flex-col w-full text-center">
                      <Upload className="h-6 w-6 text-slate-400" />
                      <span>{uploading ? "Uploading..." : "Click to upload installation site photos"}</span>
                      <input type="file" accept="image/*" className="hidden" disabled={uploading} onChange={(e) => handleImageUpload(e)} />
                    </label>
                  </div>
                  {uploadedImages.length > 0 && (
                    <div className="grid gap-2 grid-cols-5 mt-4">
                      {uploadedImages.map((imgUrl, i) => (
                        <div key={i} className="relative h-16 w-16 rounded-xl overflow-hidden border border-slate-200">
                          <img src={imgUrl} alt="site" className="object-cover h-full w-full" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {(currentStepLabel === "Service Location" || currentStepLabel === "Delivery Address") && (
                <div className="space-y-4">
                  <div className="flex gap-1 items-start flex-col">
                    <h3 className="text-base font-black text-slate-800">
                      {isBuyCctvProducts ? "Confirm Delivery Address" : "Confirm Service Address"}
                    </h3>
                    <p className="text-xs text-slate-400 font-medium">
                      Select a saved address or pin a new location.
                    </p>
                  </div>

                  {savedAddresses.length > 0 && (
                    <div className="space-y-3">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Saved Locations</label>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {savedAddresses.map((addr) => {
                          const isSelected = selectedAddressId === addr._id;
                          return (
                            <div
                              key={addr._id}
                              onClick={() => handleAddressChange(addr._id)}
                              className={`p-3.5 rounded-2xl border text-xs cursor-pointer transition-all flex flex-col justify-between min-h-[96px] ${
                                isSelected
                                  ? "border-blue-600 bg-blue-50/10 ring-1 ring-blue-600 shadow-sm"
                                  : "border-slate-200 bg-white hover:border-slate-300"
                              }`}
                            >
                              <div>
                                <span className="font-extrabold text-slate-800 block text-xs mb-1">{addr.label || addr.name || "Saved Address"}</span>
                                <span className="text-slate-500 font-semibold line-clamp-2 leading-relaxed">
                                  {addr.formattedAddress || addr.address}
                                </span>
                              </div>
                              {isSelected && (
                                <span className="text-blue-600 text-[10px] font-extrabold mt-2 flex items-center gap-1">
                                  <Check className="h-3.5 w-3.5" /> Selected
                                </span>
                              )}
                            </div>
                          );
                        })}
                        
                        <div
                          onClick={() => handleAddressChange("new")}
                          className={`p-3.5 rounded-2xl border border-dashed text-xs cursor-pointer transition flex items-center justify-center min-h-[96px] ${
                            selectedAddressId === "new" || !selectedAddressId
                              ? "border-blue-600 bg-blue-50/10 ring-1 ring-blue-600"
                              : "border-slate-300 bg-slate-50 hover:bg-slate-100"
                          }`}
                        >
                          <span className="font-bold text-slate-600 flex items-center gap-1.5">
                            <Plus className="h-4 w-4" /> Add New Address
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Show Leaflet Picker only if adding a new address or no saved addresses exist */}
                  {(savedAddresses.length === 0 || selectedAddressId === "new" || !selectedAddressId) && (
                    <div className="rounded-2xl border border-slate-200/80 p-2 bg-white relative animate-fadeIn">
                      <LocationPicker
                        onLocationSelected={(data: any) => {
                          setAddress(data.address);
                          setCity(data.city);
                          setStateName(data.state);
                          setPincode(data.pincode);
                          setLatitude(data.latitude);
                          setLongitude(data.longitude);
                          setHouseNumber(data.houseNumber || "");
                          setStreet(data.street || "");
                          setArea(data.area || "");
                          setLandmark(data.landmark || "");
                          setDistrict(data.district || "");
                          setCountry(data.country || "");
                          setFloor(data.floor || "");
                          setApartmentName(data.apartmentName || "");
                          setDeliveryInstructions(data.deliveryInstructions || "");
                          setFormattedAddress(data.formattedAddress || "");
                        }}
                        initialCoords={latitude && longitude ? { lat: latitude, lng: longitude } : null}
                        initialAddressData={
                          selectedAddressId !== "new" && selectedAddressId
                            ? savedAddresses.find((a) => a._id === selectedAddressId)
                            : {
                                houseNumber,
                                street,
                                area,
                                landmark,
                                city,
                                district,
                                state: stateName,
                                pincode,
                                country,
                                floor,
                                apartmentName,
                                deliveryInstructions,
                                formattedAddress
                              }
                        }
                      />
                    </div>
                  )}

                  {address && (
                    <div className="rounded-xl bg-slate-50 p-3 text-xs border border-slate-100 leading-relaxed text-slate-600">
                      <strong>Current Address Pinned:</strong> {address}
                    </div>
                  )}
                </div>
              )}

              {(currentStepLabel === "Review Estimate" || currentStepLabel === "Review Cart") && (
                <div className="space-y-4">
                  <div className="flex gap-1 items-start flex-col">
                    <h3 className="text-base font-black text-slate-800">
                      {isBuyCctvProducts ? "Verify Cart & Price" : "Verify Estimate Details"}
                    </h3>
                    <p className="text-xs text-slate-400 font-medium">
                      {isBuyCctvProducts
                        ? "Review your purchased products and delivery charges"
                        : "Review your service cost and checkout details"}
                    </p>
                  </div>

                  {isInstallNewCctv ? (
                    <div className="space-y-4">
                      {/* Selected Cameras Summary */}
                      <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-3.5 space-y-1.5">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Property & Cameras</span>
                        <div className="text-xs font-semibold text-slate-700">
                          Property Type: <span className="font-extrabold text-slate-900">{cctvPropertyType}</span>
                        </div>
                        <div className="text-xs text-slate-600 space-y-1 mt-1 border-t border-slate-200/50 pt-2">
                          {Object.entries(cctvSelectedCameraTypes)
                            .filter(([_, checked]) => checked)
                            .map(([type]) => (
                              <div key={type} className="flex justify-between font-medium">
                                <span>{type}</span>
                                <span className="font-bold text-slate-800">Qty: {cctvCameraQuantities[type] || 1}</span>
                              </div>
                            ))}
                        </div>
                      </div>

                      {/* Itemized pricing breakdown */}
                      <div className="rounded-2xl border border-slate-100 bg-white divide-y divide-slate-100 overflow-hidden shadow-sm">
                        <div className="p-4 space-y-3.5">
                          {/* Selected Camera Models List */}
                          {Object.entries(cctvSelectedCameraTypes)
                            .filter(([_, checked]) => checked)
                            .map(([type]) => {
                              const qty = cctvCameraQuantities[type] || 1;
                              const bId = cctvCameraBrands[type];
                              const mId = cctvCameraModels[type];
                              const brandObj = cctvBrands.find(b => b._id === bId);
                              const modelObj = cctvAllModels.find(m => m._id === mId);
                              
                              if (!modelObj) return null;
                              
                              return (
                                <div key={type} className="flex justify-between text-xs text-slate-600 font-semibold">
                                  <div className="flex flex-col">
                                    <span className="font-extrabold text-slate-800">{brandObj?.name || "Camera"} {modelObj.resolution} {modelObj.name}</span>
                                    <span className="text-[10px] text-slate-400 font-bold">{type} — Qty: {qty} × {money(modelObj.price)}</span>
                                  </div>
                                </div>
                              );
                            })}

                          {/* Camera Fitting & Installation */}
                          {prices.rawBreakdown?.installationTotal > 0 && (
                            <div className="flex justify-between text-xs text-slate-600 font-semibold">
                              <div className="flex flex-col">
                                <span className="font-bold text-slate-800">Fitting & Installation Labour</span>
                                <span className="text-[10px] text-slate-400 font-medium">
                                  {Object.entries(cctvSelectedCameraTypes).filter(([_, checked]) => checked).reduce((sum, [type]) => sum + (cctvCameraQuantities[type] || 1), 0)} cameras × ₹{cctvInstallationCharges[0]?.price || 400}
                                </span>
                              </div>
                              <span className="font-black text-slate-800 self-center">{money(prices.rawBreakdown.installationTotal)}</span>
                            </div>
                          )}

                          {/* Cable Charge */}
                          {cctvInstallationRequired && cctvCableLength > 0 && (
                            <div className="flex justify-between text-xs text-slate-600 font-semibold">
                              <div className="flex flex-col">
                                <span className="font-bold text-slate-800">{cctvCableType} Wiring</span>
                                <span className="text-[10px] text-slate-400 font-medium">
                                  {cctvCableLength} meters × ₹{cctvCables.find(c => c.name === cctvCableType)?.price || (cctvCableType.includes("CAT6") ? 50 : 18)}
                                </span>
                              </div>
                              <span className="font-black text-slate-800 self-center">{money(prices.rawBreakdown.cableTotal || 0)}</span>
                            </div>
                          )}

                          {/* DVR Installation */}
                          {cctvDvrRequired && (
                            <div className="flex justify-between text-xs text-slate-600 font-semibold">
                              <div className="flex flex-col">
                                <span className="font-bold text-slate-800">DVR Installation</span>
                                <span className="text-[10px] text-slate-400 font-medium">Fitting & setup charge</span>
                              </div>
                              <span className="font-black text-slate-800 self-center">{money(prices.rawBreakdown.dvrTotal || 0)}</span>
                            </div>
                          )}

                          {/* NVR Installation */}
                          {cctvNvrRequired && (
                            <div className="flex justify-between text-xs text-slate-600 font-semibold">
                              <div className="flex flex-col">
                                <span className="font-bold text-slate-800">NVR Installation</span>
                                <span className="text-[10px] text-slate-400 font-medium">Fitting & setup charge</span>
                              </div>
                              <span className="font-black text-slate-800 self-center">{money(prices.rawBreakdown.nvrTotal || 0)}</span>
                            </div>
                          )}

                          {/* Network Rack Mount */}
                          {cctvNetworkRack && (
                            <div className="flex justify-between text-xs text-slate-600 font-semibold animate-fadeIn">
                              <div className="flex flex-col">
                                <span className="font-bold text-slate-800">Network Rack Mounting</span>
                                <span className="text-[10px] text-slate-400 font-medium">Cabinet fitting & dressing</span>
                              </div>
                              <span className="font-black text-slate-800 self-center">{money(prices.rawBreakdown.rackTotal || 0)}</span>
                            </div>
                          )}

                          {/* Monitor Mounting */}
                          {cctvMonitorMounting && (
                            <div className="flex justify-between text-xs text-slate-600 font-semibold animate-fadeIn">
                              <div className="flex flex-col">
                                <span className="font-bold text-slate-800">Monitor Mounting</span>
                                <span className="text-[10px] text-slate-400 font-medium">Wall/desk installation</span>
                              </div>
                              <span className="font-black text-slate-800 self-center">{money(prices.rawBreakdown.monitorTotal || 0)}</span>
                            </div>
                          )}

                          {/* SD Memory Cards */}
                          {cctvSdCardEnabled && (
                            <div className="flex justify-between text-xs text-slate-600 font-semibold animate-fadeIn">
                              <div className="flex flex-col">
                                <span className="font-bold text-slate-800">SD Memory Card ({cctvSdCardCapacity})</span>
                                <span className="text-[10px] text-slate-400 font-medium">
                                  Qty: {cctvSdCardQuantity} × ₹{cctvSdCards.find(sd => sd.capacity === cctvSdCardCapacity)?.price || 750}
                                </span>
                              </div>
                              <span className="font-black text-slate-800 self-center">{money(prices.rawBreakdown.sdCardTotal || 0)}</span>
                            </div>
                          )}

                          {/* HDD Storage Selection */}
                          {cctvHddCapacity && (prices.rawBreakdown?.hddTotal > 0) && (
                            <div className="flex justify-between text-xs text-slate-600 font-semibold animate-fadeIn">
                              <div className="flex flex-col">
                                <span className="font-bold text-slate-800">HDD Storage ({cctvHddCapacity})</span>
                                <span className="text-[10px] text-slate-400 font-medium">CCTV base storage</span>
                              </div>
                              <span className="font-black text-slate-800 self-center">{money(prices.rawBreakdown.hddTotal)}</span>
                            </div>
                          )}

                          {/* Rack Selection */}
                          {cctvRackType && (prices.rawBreakdown?.rackSelectedTotal > 0) && (
                            <div className="flex justify-between text-xs text-slate-600 font-semibold animate-fadeIn">
                              <div className="flex flex-col">
                                <span className="font-bold text-slate-800">Rack Option ({cctvRackType})</span>
                                <span className="text-[10px] text-slate-400 font-medium">Server/DVR enclosure</span>
                              </div>
                              <span className="font-black text-slate-800 self-center">{money(prices.rawBreakdown.rackSelectedTotal)}</span>
                            </div>
                          )}

                          {/* Miscellaneous Charges */}
                          {prices.rawBreakdown?.miscCharges > 0 && (
                            <div className="flex justify-between text-xs text-slate-600 font-semibold animate-fadeIn">
                              <div className="flex flex-col">
                                <span className="font-bold text-slate-800">Miscellaneous Charges</span>
                                <span className="text-[10px] text-slate-400 font-medium">Service fee</span>
                              </div>
                              <span className="font-black text-slate-800 self-center">{money(prices.rawBreakdown.miscCharges)}</span>
                            </div>
                          )}
                        </div>

                        <div className="p-4 bg-slate-50/50 space-y-2.5">
                          <div className="flex justify-between text-xs font-medium text-slate-600">
                            <span>Subtotal</span>
                            <span>{money(prices.rawBreakdown?.subtotal || 0)}</span>
                          </div>
                          
                          <div className="flex justify-between text-xs font-medium text-slate-600">
                            <span>Visit & Logistics Charges</span>
                            <span>{money(prices.rawBreakdown?.visitCharge || 499)}</span>
                          </div>
                          
                          {prices.discount > 0 && (
                            <div className="flex justify-between text-xs font-bold text-emerald-600">
                              <span>Promo discount</span>
                              <span>-{money(prices.discount)}</span>
                            </div>
                          )}
                          <div className="flex justify-between text-xs font-medium text-slate-600">
                            <span>GST ({cctvPricingConfig?.tax?.percentage || 18}%)</span>
                            <span>{money(prices.gst)}</span>
                          </div>
                          <div className="flex justify-between text-sm font-black text-slate-900 border-t border-slate-200 pt-2.5">
                            <span>Grand Total</span>
                            <span>{money(prices.grandTotal)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : isBuyCctvProducts ? (
                    <div className="rounded-2xl border border-slate-100 bg-white divide-y divide-slate-100 overflow-hidden shadow-sm">
                      {selectedProductsList.map((item) => (
                        <div key={item.product} className="p-4 flex justify-between items-center text-xs">
                          <div>
                            <span className="font-extrabold text-slate-800">{item.product}</span>
                            {item.variant && <p className="text-[10px] text-slate-400 font-semibold">{item.variant}</p>}
                          </div>
                          <div className="text-right">
                            <span className="font-bold text-slate-500">{item.quantity} × {money(item.unitPrice)}</span>
                            <p className="font-black text-blue-600 mt-0.5">{money(item.total)}</p>
                          </div>
                        </div>
                      ))}
                      <div className="p-4 bg-slate-50/50 space-y-2.5">
                        <div className="flex justify-between text-xs font-medium text-slate-600">
                          <span>Delivery Charge</span>
                          <span>{money(prices.visitCharge)}</span>
                        </div>
                        {prices.discount > 0 && (
                          <div className="flex justify-between text-xs font-bold text-emerald-600">
                            <span>Promo discount</span>
                            <span>-{money(prices.discount)}</span>
                          </div>
                        )}
                        <div className="flex justify-between text-xs font-medium text-slate-600">
                          <span>GST (18%)</span>
                          <span>{money(prices.gst)}</span>
                        </div>
                        <div className="flex justify-between text-sm font-black text-slate-900 border-t border-slate-200 pt-2.5">
                          <span>Grand Total</span>
                          <span>{money(prices.grandTotal)}</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4 space-y-2.5">
                      <div className="flex justify-between text-xs font-medium text-slate-600">
                        <span>Service package cost</span>
                        <span>{money(prices.packageCost)}</span>
                      </div>
                      <div className="flex justify-between text-xs font-medium text-slate-600">
                        <span>Technician visitation fee</span>
                        <span>{money(prices.visitCharge)}</span>
                      </div>
                      {prices.labourCost > 0 && (
                        <div className="flex justify-between text-xs font-medium text-slate-600">
                          <span>Labor cost</span>
                          <span>{money(prices.labourCost)}</span>
                        </div>
                      )}
                      {prices.discount > 0 && (
                        <div className="flex justify-between text-xs font-bold text-emerald-600">
                          <span>Promo discount</span>
                          <span>-{money(prices.discount)}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-xs font-medium text-slate-600">
                        <span>GST (18%)</span>
                        <span>{money(prices.gst)}</span>
                      </div>
                      <div className="flex justify-between text-sm font-black text-slate-900 border-t border-slate-200 pt-2.5">
                        <span>Grand Total</span>
                        <span>{money(prices.grandTotal)}</span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {currentStepLabel === "Checkout & Pay" && (
                <div className="space-y-4">
                  <div className="flex gap-1 items-start flex-col">
                    <h3 className="text-base font-black text-slate-800">Choose Payment Option</h3>
                    <p className="text-xs text-slate-400 font-medium font-semibold">Select a secure settlement method for the order</p>
                  </div>

                  <div className="grid gap-3">
                    {/* Razorpay Online */}
                    <label
                      onClick={() => setPaymentMethod("online")}
                      className={`flex items-center gap-3.5 rounded-2xl border p-4 cursor-pointer transition ${
                        paymentMethod === "online" ? "border-blue-600 bg-blue-50/10 ring-1 ring-blue-600" : "border-slate-200"
                      }`}
                    >
                      <input type="radio" checked={paymentMethod === "online"} readOnly className="h-4 w-4 text-blue-600 focus:ring-blue-500" />
                      <div className="text-xs">
                        <h4 className="font-bold text-slate-900">Pay Online (Razorpay)</h4>
                        <p className="text-slate-400 font-semibold mt-0.5">Secure credit card, debit card, UPI, or net banking checkout.</p>
                      </div>
                    </label>

                    {/* Wallet deduction */}
                    <label
                      onClick={() => {
                        if (walletBalance !== null && walletBalance >= prices.grandTotal) {
                          setPaymentMethod("wallet");
                        }
                      }}
                      className={`flex items-center gap-3.5 rounded-2xl border p-4 cursor-pointer transition ${
                        walletBalance !== null && walletBalance < prices.grandTotal ? "opacity-50 cursor-not-allowed" : ""
                      } ${paymentMethod === "wallet" ? "border-blue-600 bg-blue-50/10 ring-1 ring-blue-600" : "border-slate-200"}`}
                    >
                      <input type="radio" checked={paymentMethod === "wallet"} readOnly disabled={walletBalance !== null && walletBalance < prices.grandTotal} className="h-4 w-4 text-blue-600 focus:ring-blue-500" />
                      <div className="text-xs flex-1">
                        <div className="flex justify-between items-center">
                          <h4 className="font-bold text-slate-900 flex items-center gap-1.5"><Wallet className="h-3.5 w-3.5 text-slate-500" /> Wallet Balance</h4>
                          <span className="font-bold text-slate-500">Available: ₹{walletBalance ?? 0}</span>
                        </div>
                        <p className="text-slate-400 font-semibold mt-0.5">Deduct the total balance directly from your registered Techbes wallet.</p>
                        {walletBalance !== null && walletBalance < prices.grandTotal && (
                          <p className="text-[10px] text-rose-500 font-bold mt-1">Insufficient funds. Need ₹{prices.grandTotal - walletBalance} more.</p>
                        )}
                      </div>
                    </label>
                  </div>
                </div>
              )}
            </div>

            {/* Navigation Actions */}
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
                  disabled={isInstallNewCctv && cctvTotalCameras > 16}
                  className="h-9 px-5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs"
                >
                  Continue
                </Button>
              ) : (
                <Button
                  size="sm"
                  disabled={submitting}
                  onClick={handleCheckoutSubmit}
                  className="h-9 px-5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex gap-1.5 items-center shadow-sm shadow-emerald-500/20"
                >
                  {submitting && <Loader2 className="h-3 w-3 animate-spin" />}
                  {submitting ? "Confirming..." : "Confirm & Pay"}
                </Button>
              )}
            </div>
          </div>

          {/* Right Sticky Pricing Sidebar */}
          <aside className="rounded-3xl bg-slate-50 p-5 border border-slate-100 self-start">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-800">
                {isBuyCctvProducts ? "Order Cart" : "Booking Summary"}
              </h3>
              <Zap className="h-4 w-4 text-emerald-600" />
            </div>

            {isInstallNewCctv ? (
              <div className="mt-4 space-y-3.5 border-b border-slate-200 pb-4 text-xs font-medium text-slate-500 max-h-[220px] overflow-y-auto pr-1">
                <div className="flex justify-between items-center">
                  <span>Property</span>
                  <span className="font-bold text-slate-800">{cctvPropertyType || "—"}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Installation Required?</span>
                  <span className="font-bold text-slate-800">{cctvInstallationRequired ? "Yes" : "No"}</span>
                </div>
                {cctvInstallationRequired && (
                  <>
                    <div className="flex justify-between items-center">
                      <span>Cable Type</span>
                      <span className="font-bold text-slate-800">{cctvCableType || "—"}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Cable Length</span>
                      <span className="font-bold text-slate-800">{cctvCableLength ? `${cctvCableLength}m` : "—"}</span>
                    </div>
                  </>
                )}
                {Object.entries(cctvSelectedCameraTypes).filter(([_, checked]) => checked).map(([type]) => (
                  <div key={type} className="flex justify-between items-center">
                    <span>{type}</span>
                    <span className="font-bold text-slate-800">Qty: {cctvCameraQuantities[type] || 1}</span>
                  </div>
                ))}
              </div>
            ) : isBuyCctvProducts ? (
              <div className="mt-4 space-y-3.5 border-b border-slate-200 pb-4 text-xs font-medium text-slate-500 max-h-[220px] overflow-y-auto pr-1">
                {selectedProductsList.length === 0 ? (
                  <p className="text-[11px] text-slate-400 italic">No products selected yet</p>
                ) : (
                  selectedProductsList.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-start gap-2">
                      <div>
                        <span className="font-bold text-slate-800">{item.product}</span>
                        {item.variant && <p className="text-[10px] text-slate-400 font-medium">{item.variant}</p>}
                        <p className="text-[10px] text-slate-400 mt-0.5">Qty: {item.quantity}</p>
                      </div>
                      <span className="font-black text-slate-700 text-right text-[11px]">
                        {money(item.total)}
                      </span>
                    </div>
                  ))
                )}
              </div>
            ) : (
              <div className="mt-4 space-y-3.5 border-b border-slate-200 pb-4 text-xs font-medium text-slate-500">
                <div className="flex justify-between items-center">
                  <span>Category</span>
                  <span className="font-bold text-slate-800">CCTV Security</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Sub Category</span>
                  <span className="font-bold text-slate-800">{service.name}</span>
                </div>
                {selectedPackageId && (
                  <div className="flex justify-between items-center">
                    <span>Package</span>
                    <span className="font-bold text-slate-800">
                      {service.packages?.find((p) => p._id === selectedPackageId)?.name}
                    </span>
                  </div>
                )}
                {date && (
                  <div className="flex justify-between items-center">
                    <span>Slot Scheduled</span>
                    <span className="font-bold text-slate-800">
                      {date} {time && `(${time.split(" ")[0]})`}
                    </span>
                  </div>
                )}
              </div>
            )}

            <div className="mt-4 space-y-2.5 text-xs">
              {isInstallNewCctv ? (
                <>
                  {/* Camera Cost (sum of selected camera hardware) */}
                  {(prices.rawBreakdown?.cameraTotal || 0) > 0 && (
                    <Line label="Camera Cost" value={prices.rawBreakdown.cameraTotal} />
                  )}
                  {/* Installation Cost (Camera Fitting) */}
                  {(prices.rawBreakdown?.installationTotal || 0) > 0 && (
                    <Line label="Installation Cost" value={prices.rawBreakdown.installationTotal} />
                  )}
                  {/* Cable Cost */}
                  {(prices.rawBreakdown?.cableTotal || 0) > 0 && (
                    <Line label="Cable Cost" value={prices.rawBreakdown.cableTotal} />
                  )}
                  {/* DVR Cost */}
                  {(prices.rawBreakdown?.dvrTotal || 0) > 0 && (
                    <Line label="DVR Cost" value={prices.rawBreakdown.dvrTotal} />
                  )}
                  {/* NVR Cost */}
                  {(prices.rawBreakdown?.nvrTotal || 0) > 0 && (
                    <Line label="NVR Cost" value={prices.rawBreakdown.nvrTotal} />
                  )}
                  {/* Rack Mount */}
                  {(prices.rawBreakdown?.rackTotal || 0) > 0 && (
                    <Line label="Rack Mount" value={prices.rawBreakdown.rackTotal} />
                  )}
                  {/* Monitor Mount */}
                  {(prices.rawBreakdown?.monitorTotal || 0) > 0 && (
                    <Line label="Monitor Mount" value={prices.rawBreakdown.monitorTotal} />
                  )}
                  {/* SD Card */}
                  {(prices.rawBreakdown?.sdCardTotal || 0) > 0 && (
                    <Line label="SD Card" value={prices.rawBreakdown.sdCardTotal} />
                  )}
                  {/* Visit Charge */}
                  <Line label="Visit Charge" value={prices.rawBreakdown?.baseCharge || 499} />
                </>
              ) : (
                <>
                  <Line label={isBuyCctvProducts ? "Delivery Cost" : "Base Cost"} value={isBuyCctvProducts ? prices.visitCharge : prices.packageCost} />
                  {!isBuyCctvProducts && <Line label="Visit Charge" value={prices.visitCharge} />}
                  {isBuyCctvProducts && selectedProductsList.length > 0 && (
                    <Line label="Items Cost" value={prices.packageCost} />
                  )}
                </>
              )}
              {prices.discount > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Discount Applied</span>
                  <span className="font-semibold text-emerald-600">-{money(prices.discount)}</span>
                </div>
              )}
              <Line label="GST (18%)" value={prices.gst} />
              <div className="flex items-center justify-between border-t border-slate-200 pt-3.5 text-base font-black text-slate-900">
                <span>Grand Total</span>
                <span>{money(prices.grandTotal)}</span>
              </div>
            </div>

            {/* Note details */}
            <div className="mt-5 rounded-2xl bg-amber-50/50 border border-amber-100 p-3 flex gap-2">
              <Info className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-[10px] text-amber-800 font-medium leading-relaxed">
                {isBuyCctvProducts
                  ? "Standard product warranties and door-step shipment guidelines apply. Delivery slots are subject to transit timelines."
                  : "Prices cover baseline technician service & travel fees. Spare components or additional camera lengths recommended on-site will be billed separately."}
              </div>
            </div>
          </aside>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Line({ label, value }: { label: string; value?: number }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-slate-500">{label}</span>
      <span className="font-bold text-slate-800">{money(value)}</span>
    </div>
  );
}

function money(value?: number) {
  return `Rs. ${Math.round(value || 0).toLocaleString("en-IN")}`;
}

export default ServiceBookingConfigModal;
