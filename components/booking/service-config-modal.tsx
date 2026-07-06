"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarCheck, FileText, ShoppingCart, Zap, ShieldAlert, CheckCircle2, Info } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { addCctvCartItem } from "@/lib/cctv-cart";
import { cctvApi, CctvAddon, CctvSubcategory } from "@/lib/cctv-api";
import { useToast } from "@/hooks/use-toast";

function money(value?: number) {
  return `Rs. ${Math.round(value || 0).toLocaleString("en-IN")}`;
}

import { getCctvCart } from "@/lib/cctv-cart";
import dynamic from "next/dynamic";
const LocationPicker = dynamic(() => import("@/components/booking/LocationPicker"), { ssr: false });


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
  const { toast } = useToast();
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [addons, setAddons] = useState<CctvAddon[]>([]);

  const [optionsLoading, setOptionsLoading] = useState(true);
  const [optionsError, setOptionsError] = useState("");
  const [configData, setConfigData] = useState<{
    serviceTypes: { name: string; price: number; description?: string }[];
    materials: { id: string; name: string; slug: string; price: number; unit: string; isLabour?: boolean; description?: string }[];
    pricingRules: any;
  } | null>(null);

  const [step, setStep] = useState(1);
  const [selectedPackageId, setSelectedPackageId] = useState<string>("");
  const [questionAnswers, setQuestionAnswers] = useState<Record<string, any>>({});

  const handleAnswerChange = (question: string, value: any) => {
    setQuestionAnswers(prev => ({
      ...prev,
      [question]: value
    }));
    setValidationErrors(prev => {
      const copy = { ...prev };
      delete copy[question];
      return copy;
    });
  };

  // Dynamic Service Types
  const serviceTypes = useMemo(() => {
    const s = service as any;
    if (s.serviceTypes && s.serviceTypes.length > 0) {
      return s.serviceTypes.map((t: any) => t.name);
    }
    if (configData?.serviceTypes && configData.serviceTypes.length > 0) {
      return configData.serviceTypes.map((t) => t.name);
    }
    if (s.formSchema?.step1?.options && s.formSchema.step1.options.length > 0) {
      return s.formSchema.step1.options.map((t: any) => t.label || t.name);
    }
    if (s.cameraTypes && s.cameraTypes.length > 0) {
      return s.cameraTypes;
    }
    return [];
  }, [service, configData]);

  const [serviceType, setServiceType] = useState<string>("");

  const MATERIALS = useMemo(() => [
    { id: "cable_3p1", name: "3+1 Cable", unit: "meter", defaultPrice: 18 },
    { id: "cat6", name: "CAT6 Cable", unit: "meter", defaultPrice: 40 },
    { id: "cat6_premium", name: "CAT6 Premium", unit: "meter", defaultPrice: 35 },
    { id: "labour", name: "Installation Labour", unit: "meter", defaultPrice: 15 },
    { id: "box_5x5", name: "Camera Box 5x5", unit: "each", defaultPrice: 60 },
    { id: "dvr", name: "DVR", unit: "each", defaultPrice: 0 },
    { id: "nvr", name: "NVR", unit: "each", defaultPrice: 0 },
    { id: "hdd", name: "Hard Disk", unit: "each", defaultPrice: 0 },
    { id: "smps", name: "SMPS", unit: "each", defaultPrice: 0 },
    { id: "connector_set", name: "Connector Set", unit: "each", defaultPrice: 0 },
    { id: "junction_box", name: "Junction Box", unit: "each", defaultPrice: 0 },
    { id: "wifi_camera", name: "WiFi Camera", unit: "each", defaultPrice: 0 },
    { id: "memory_card", name: "Memory Card", unit: "each", defaultPrice: 0 },
    { id: "router", name: "Router", unit: "each", defaultPrice: 0 },
    { id: "mounting_kit", name: "Mounting Kit", unit: "each", defaultPrice: 0 },
    { id: "ptz_camera", name: "PTZ Camera", unit: "each", defaultPrice: 0 },
    { id: "ptz_controller", name: "PTZ Controller", unit: "each", defaultPrice: 0 },
    { id: "poe_switch", name: "PoE Switch", unit: "each", defaultPrice: 0 },
    { id: "network_rack", name: "Network Rack", unit: "each", defaultPrice: 0 },
    { id: "adapter", name: "Adapter", unit: "each", defaultPrice: 0 },
    { id: "connector_kit", name: "Connector Kit", unit: "each", defaultPrice: 0 },
  ], []);

  const [selectedMaterials, setSelectedMaterials] = useState<Record<string, number>>({});
  const [mapLink, setMapLink] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [pincode, setPincode] = useState("");
  const [fullAddress, setFullAddress] = useState("");
  const [city, setCity] = useState("");
  const [stateName, setStateName] = useState("");
  const [priceBreakdown, setPriceBreakdown] = useState<{ serviceCost: number; materialCost: number; labourCost: number; grandTotal: number }>({ serviceCost: 0, materialCost: 0, labourCost: 0, grandTotal: 0 });
  const [miniCartOpen, setMiniCartOpen] = useState(false);
  const [replaceConfirmOpen, setReplaceConfirmOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<"cart" | "checkout" | null>(null);

  const categoryId = typeof service.categoryId === "string" && service.categoryId.length === 24 ? service.categoryId : typeof service.categoryId === "object" ? (service.categoryId as any)?._id : undefined;

  useEffect(() => {
    if (serviceTypes.length > 0 && !serviceType) {
      setServiceType(serviceTypes[0]);
    }
  }, [serviceTypes, serviceType]);

  useEffect(() => {
    if (!open) return;
    if (editItem) {
      setServiceType(editItem.input?.serviceType || serviceTypes[0] || "");
      setSelectedPackageId(editItem.input?.selectedPackageId || "");
      setQuestionAnswers(editItem.input?.questionAnswers || {});
      
      const matMap: Record<string, number> = {};
      (editItem.input?.materials || []).forEach((m: any) => {
        matMap[m.id] = m.qty;
      });
      setSelectedMaterials(matMap);
      setMapLink(editItem.input?.mapLink || "");
      setDate(editItem.input?.date || "");
      setTime(editItem.input?.time || "");
      setNotes(editItem.input?.notes || "");
      setLatitude(editItem.input?.latitude || null);
      setLongitude(editItem.input?.longitude || null);
      setPincode(editItem.input?.pincode || "");
      setFullAddress(editItem.input?.fullAddress || "");
      setCity(editItem.input?.city || "");
      setStateName(editItem.input?.state || "");
      setStep(1);
    } else {
      setServiceType(serviceTypes[0] || "");
      setSelectedPackageId("");
      setQuestionAnswers({});
      setSelectedMaterials({});
      setMapLink("");
      setDate("");
      setTime("");
      setNotes("");
      setLatitude(null);
      setLongitude(null);
      setPincode("");
      setFullAddress("");
      setCity("");
      setStateName("");
      setStep(1);
    }
  }, [editItem, open, serviceTypes]);

  useEffect(() => {
    if (!open) return;
    setOptionsLoading(true);
    cctvApi.getConfig(service.slug || service._id)
      .then((res: any) => {
        const data = res;
        setConfigData(data);
        if (data && data.materials) {
          setAddons(data.materials.map((m: any) => ({
            _id: m.id || m.slug,
            name: m.name,
            slug: m.slug,
            price: m.price,
            unit: m.unit || "each",
            description: m.description || "",
          })));
        }
        setOptionsError("");
      })
      .catch((err: any) => {
        console.error("Failed to load service config:", err.message);
        if (err.isNetworkError) {
          setOptionsError("Backend server is not reachable. Using default pricing.");
        } else {
          setOptionsError("Unable to load service configuration");
        }
      })
      .finally(() => setOptionsLoading(false));
  }, [open, service]);

  function priceForMaterial(matId: string) {
    const candidate = addons.find((a) => a._id === matId || a.slug === matId || (a.name && a.name.toLowerCase().includes(matId.toLowerCase())));
    if (candidate && typeof candidate.price === "number") return candidate.price;
    const configMat = configData?.materials?.find(m => m.id === matId || m.slug === matId || (m.name && m.name.toLowerCase().includes(matId.toLowerCase())));
    if (configMat && typeof configMat.price === "number") return configMat.price;
    const mat = MATERIALS.find((m) => m.id === matId);
    return mat ? mat.defaultPrice : 0;
  }

  // Dynamic step structure definition
  const stepsList = useMemo(() => {
    const s = service as any;

    const isGeneralCatalogService = (s.packages && s.packages.length > 0) || (s.bookingQuestions && s.bookingQuestions.length > 0);
    if (isGeneralCatalogService) {
      const list = [];
      let currentStep = 1;
      if (s.packages && s.packages.length > 0) {
        list.push({ step: currentStep, label: "Package Selection" });
        currentStep++;
      }
      if (s.bookingQuestions && s.bookingQuestions.length > 0) {
        list.push({ step: currentStep, label: "Custom Questions" });
        currentStep++;
      }
      list.push({ step: currentStep, label: "Location" });
      currentStep++;
      list.push({ step: currentStep, label: "Schedule" });
      currentStep++;
      list.push({ step: currentStep, label: "Notes" });
      return list;
    }

    const list = [
      { step: 1, label: s.formSchema?.step1?.title || "Service Type" },
      { step: 2, label: s.formSchema?.step2?.title || "Requirements" }
    ];
    let currentStep = 3;
    if (s.formSchema?.step3) {
      list.push({ step: currentStep, label: s.formSchema.step3.title || "Options" });
      currentStep++;
    }
    list.push({ step: currentStep, label: "Location" });
    currentStep++;
    list.push({ step: currentStep, label: "Schedule" });
    currentStep++;
    list.push({ step: currentStep, label: "Notes" });
    return list;
  }, [service]);

  const maxStep = stepsList.length;

  const formattedMaterials = useMemo(() => {
    const s = service as any;
    if (s.formSchema?.step2?.options) {
      return s.formSchema.step2.options.map((opt: any) => {
        const idVal = opt.id || opt.value;
        const matched = configData?.materials?.find(m => m.id === idVal || m.slug === idVal || m.name === opt.label);
        return {
          id: matched?.id || idVal,
          name: opt.label || opt.name,
          unit: opt.unit || "each",
          price: matched?.price ?? opt.price ?? 0,
          isLabour: opt.isLabour || false,
        };
      });
    }

    const list = configData?.materials || [];
    if (s.formSchema?.step3?.options) {
      const step3Ids = s.formSchema.step3.options.map((opt: any) => opt.id || opt.value);
      return list.filter(m => !step3Ids.includes(m.id) && !step3Ids.includes(m.slug)).map((m: any) => ({
        id: m.id,
        name: m.name,
        unit: m.unit,
        price: m.price,
        isLabour: m.isLabour || false,
      }));
    }
    return list.map((m: any) => ({
      id: m.id,
      name: m.name,
      unit: m.unit,
      price: m.price,
      isLabour: m.isLabour || false,
    }));
  }, [service, configData]);

  const formattedStep3Items = useMemo(() => {
    const s = service as any;
    if (s.formSchema?.step3?.options) {
      return s.formSchema.step3.options.map((opt: any) => {
        const idVal = opt.id || opt.value;
        const matched = configData?.materials?.find(m => m.id === idVal || m.slug === idVal || m.name === opt.label);
        return {
          id: matched?.id || idVal,
          name: opt.label || opt.name,
          unit: opt.unit || "each",
          price: matched?.price ?? opt.price ?? 0,
          isLabour: opt.isLabour || false,
        };
      });
    }
    return [];
  }, [service, configData]);

  const allAvailableFormattedItems = useMemo(() => {
    return [...formattedMaterials, ...formattedStep3Items];
  }, [formattedMaterials, formattedStep3Items]);

  useEffect(() => {
    let materialCost = 0;
    let labourCost = 0;
    Object.entries(selectedMaterials).forEach(([id, qty]) => {
      const price = priceForMaterial(id);
      const matDef = allAvailableFormattedItems.find((m) => m.id === id);
      const isLabour = id === "labour" || (matDef && (matDef as any).isLabour);
      
      if (isLabour) {
        labourCost += price * qty;
      } else {
        materialCost += price * qty;
      }
    });

    let serviceCost = 499;
    const s = service as any;
    const isGeneralCatalogService = (s.packages && s.packages.length > 0) || (s.bookingQuestions && s.bookingQuestions.length > 0);

    if (isGeneralCatalogService) {
      if (s.packages && s.packages.length > 0) {
        const found = s.packages.find((p: any) => p._id === selectedPackageId);
        if (found) serviceCost = found.price;
        else serviceCost = 0;
      } else {
        serviceCost = service.pricingStartsFrom || 499;
      }
    } else {
      if (s.serviceTypes && s.serviceTypes.length > 0) {
        const found = s.serviceTypes.find((t: any) => t.name === serviceType);
        if (found) serviceCost = found.price;
      } else if (s.formSchema?.step1?.options) {
        const found = s.formSchema.step1.options.find((opt: any) => (opt.label || opt.name) === serviceType);
        if (found && typeof found.price === "number") serviceCost = found.price;
      } else if (service.pricingStartsFrom) {
        serviceCost = service.pricingStartsFrom;
      } else {
        const serviceCostMap: Record<string, number> = {
          "Wired Camera Installation": 499,
          "Wireless Camera Installation": 599,
          "Dome Camera Installation": 549,
          "Bullet Camera Installation": 529,
          "PTZ Camera Installation": 1299,
          "DVR Installation": 799,
          "NVR Installation": 899,
          "CCTV Repair": 399,
          "CCTV Maintenance": 299,
        };
        serviceCost = serviceCostMap[serviceType] || 499;
      }
    }

    let baseCharge = s.pricingRules?.baseCharge ?? serviceCost;
    const grandTotal = baseCharge + materialCost + labourCost;
    setPriceBreakdown({ serviceCost: baseCharge, materialCost, labourCost, grandTotal });
  }, [selectedMaterials, serviceType, selectedPackageId, addons, service, allAvailableFormattedItems]);

  function toggleMaterial(id: string) {
    setSelectedMaterials((s) => {
      const copy = { ...s };
      if (copy[id]) delete copy[id]; else copy[id] = 1;
      return copy;
    });
    setValidationErrors((prev) => {
      const copy = { ...prev };
      delete copy.requirements;
      return copy;
    });
  }

  function setMaterialQty(id: string, qty: number) {
    setSelectedMaterials((s) => ({ ...s, [id]: Math.max(0, Math.floor(qty || 0)) }));
  }

  function goNext() {
    const currentStepLabel = currentStepDef?.label;
    const allErrors = getValidationErrors();
    const currentErrors = allErrors.filter(e => e.stepLabel === currentStepLabel);

    if (currentErrors.length > 0) {
      const newErrors = { ...validationErrors };
      currentErrors.forEach(e => {
        newErrors[e.fieldKey] = e.message;
      });
      setValidationErrors(newErrors);

      toast({
        title: `${currentStepLabel} Incomplete`,
        description: currentErrors[0].message,
        variant: "destructive",
      });

      setTimeout(() => {
        const element = document.getElementById(currentErrors[0].elementId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
          element.focus();
        }
      }, 100);
      return;
    }

    if (step < maxStep) setStep(step + 1);
  }

  function goPrev() { if (step > 1) setStep(step - 1); }

  function buildMaterialsArray() {
    return Object.entries(selectedMaterials).map(([matId, qty]) => {
      const matDef = allAvailableFormattedItems.find((m) => m.id === matId) || { id: matId, name: matId, unit: 'each', price: 0 };
      const matchedAddon = addons.find((a) => a._id === matId || a.slug === matId || (a.name && matDef.name && a.name.toLowerCase().includes(matDef.name.toLowerCase())));
      return {
        id: matDef.id,
        name: matDef.name,
        unit: matDef.unit,
        qty,
        unitPrice: priceForMaterial(matId),
        addonId: matchedAddon?._id || null,
        total: priceForMaterial(matId) * qty,
      };
    });
  }

  function storeConfiguration(replaceExisting = false) {
    const materialsArray = buildMaterialsArray();
    const hasAddonSchema = (service as any).formSchema?.step2?.options?.length > 0 || formattedMaterials.length > 0;
    
    const payload = {
      id: editItem ? editItem.id : undefined,
      serviceSlug: service.slug,
      serviceTitle: service.name,
      price: priceBreakdown,
      input: {
        serviceType,
        selectedPackageId,
        questionAnswers,
        materials: materialsArray,
        mapLink,
        date,
        time,
        notes,
        latitude,
        longitude,
        pincode,
        fullAddress,
        city,
        state: stateName,
        addressType: "home",
      },
    };
    addCctvCartItem(payload as any, replaceExisting);
    return payload;
  }

  function isValidMapLink(link: string) {
    return link && link.trim().length > 0 && link.includes("http");
  }

  function isValidTime(t: string) {
    return t && t.trim().length > 0;
  }

  function getValidationErrors(): { fieldKey: string; message: string; stepLabel: string; elementId: string }[] {
    const errors: { fieldKey: string; message: string; stepLabel: string; elementId: string }[] = [];
    const s = service as any;

    const isGeneralCatalogService = (s.packages && s.packages.length > 0) || (s.bookingQuestions && s.bookingQuestions.length > 0);
    if (isGeneralCatalogService) {
      if (s.packages && s.packages.length > 0 && !selectedPackageId) {
        errors.push({
          fieldKey: "package",
          message: "Please select a service package.",
          stepLabel: "Package Selection",
          elementId: "package-selection-container",
        });
      }
      if (s.bookingQuestions && s.bookingQuestions.length > 0) {
        s.bookingQuestions.forEach((q: any) => {
          const val = questionAnswers[q.question];
          if (q.required && (!val || (typeof val === "string" && !val.trim()) || (Array.isArray(val) && val.length === 0))) {
            errors.push({
              fieldKey: q.question,
              message: `${q.question} is required.`,
              stepLabel: "Custom Questions",
              elementId: `question-input-${q.question.replace(/\s+/g, "-")}`,
            });
          }
        });
      }
    } else {
      const hasServiceTypeOptions = serviceTypes.length > 0;
      if (hasServiceTypeOptions && (!serviceType || !serviceType.trim())) {
        errors.push({
          fieldKey: "serviceType",
          message: "Please select a service type.",
          stepLabel: "Service Type",
          elementId: "service-type-select",
        });
      }
      const isStep2Required = s.formSchema?.step2?.options && s.formSchema.step2.options.length > 0;
      if (isStep2Required && !Object.keys(selectedMaterials).length) {
        errors.push({
          fieldKey: "requirements",
          message: "Please select at least one requirement/material.",
          stepLabel: s.formSchema?.step2?.title || "Requirements",
          elementId: "step2-requirements-container",
        });
      }
    }

    if (!mapLink || !isValidMapLink(mapLink) || !latitude || !longitude) {
      errors.push({
        fieldKey: "location",
        message: "Please pin your location and click Confirm Location.",
        stepLabel: "Location",
        elementId: "location-picker-container",
      });
    }
    if (!date) {
      errors.push({
        fieldKey: "date",
        message: "Preferred date is required.",
        stepLabel: "Schedule",
        elementId: "schedule-date-input",
      });
    }
    if (!time || !isValidTime(time)) {
      errors.push({
        fieldKey: "time",
        message: "Preferred time is required.",
        stepLabel: "Schedule",
        elementId: "schedule-time-input",
      });
    }
    return errors;
  }

  function isConfigValid() {
    return getValidationErrors().length === 0;
  }

  function handleReplaceConfirm(replace: boolean) {
    setReplaceConfirmOpen(false);
    storeConfiguration(replace);
    if (pendingAction === "cart") {
      setMiniCartOpen(true);
    } else if (pendingAction === "checkout") {
      onOpenChange(false);
      router.push("/checkout");
    }
    setPendingAction(null);
  }

  function handleValidationFailure(errors: any[]) {
    const newErrors: Record<string, string> = {};
    errors.forEach(e => {
      newErrors[e.fieldKey] = e.message;
    });
    setValidationErrors(newErrors);

    toast({
      title: "Required Fields Missing",
      description: "Please complete all required fields highlighted in red.",
      variant: "destructive",
    });

    const firstError = errors[0];
    const firstErrorStep = stepsList.find(s => s.label === firstError.stepLabel);
    if (firstErrorStep) {
      setStep(firstErrorStep.step);
      setTimeout(() => {
        const element = document.getElementById(firstError.elementId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
          element.focus();
        }
      }, 150);
    }
  }

  function addToCart() {
    const errors = getValidationErrors();
    if (errors.length > 0) {
      handleValidationFailure(errors);
      return;
    }

    if (editItem) {
      storeConfiguration(false);
      setMiniCartOpen(true);
      return;
    }

    const cartItems = getCctvCart();
    if (cartItems.length > 0) {
      setPendingAction("cart");
      setReplaceConfirmOpen(true);
    } else {
      storeConfiguration(false);
      setMiniCartOpen(true);
    }
  }

  function continueBooking() {
    const errors = getValidationErrors();
    if (errors.length > 0) {
      handleValidationFailure(errors);
      return;
    }

    if (editItem) {
      storeConfiguration(false);
      onOpenChange(false);
      router.push("/checkout");
      return;
    }


    const cartItems = getCctvCart();
    if (cartItems.length > 0) {
      setPendingAction("checkout");
      setReplaceConfirmOpen(true);
    } else {
      storeConfiguration(false);
      onOpenChange(false);
      router.push("/checkout");
    }
  }

  const s = service as any;
  const currentStepDef = stepsList.find((x) => x.step === step);
  const isGeneralCatalogService = (s.packages && s.packages.length > 0) || (s.bookingQuestions && s.bookingQuestions.length > 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-5xl">
        <DialogHeader>
          <DialogTitle>Configure {service.name}</DialogTitle>
          <DialogDescription>Select choices below — pricing updates live.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-5 lg:grid-cols-[1fr,320px]">
          <div className="grid gap-4">
            
            {/* Step: Package Selection */}
            {isGeneralCatalogService && currentStepDef?.label === "Package Selection" && (
              <div id="package-selection-container">
                <label className="flex items-center gap-1.5 text-sm font-semibold text-slate-700">
                  Select a Service Package
                  <span className="inline-flex items-center rounded-full bg-rose-50 px-1.5 py-0.5 text-[10px] font-medium text-rose-700 ring-1 ring-inset ring-rose-600/10">Required</span>
                </label>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  {(s.packages || []).map((pkg: any) => {
                    const isSelected = selectedPackageId === pkg._id;
                    return (
                      <div
                        key={pkg._id}
                        onClick={() => {
                          setSelectedPackageId(pkg._id);
                          setServiceType(pkg.name);
                          setValidationErrors(prev => {
                            const copy = { ...prev };
                            delete copy.package;
                            return copy;
                          });
                        }}
                        className={`cursor-pointer rounded-xl border p-4 transition-all hover:shadow-sm ${isSelected ? "border-blue-600 bg-blue-50/10 ring-1 ring-blue-600" : "border-slate-200 bg-white"}`}
                      >
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="font-bold text-sm text-slate-900">{pkg.name}</h4>
                          <span className="font-black text-blue-600 text-sm">₹{pkg.price}</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">{pkg.description}</p>
                        {pkg.duration && (
                          <div className="text-[10px] text-slate-400 mt-2 font-medium">Duration: {pkg.duration}</div>
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
                {validationErrors.package && (
                  <p className="text-xs text-rose-500 font-medium mt-1.5 flex items-center gap-1"><ShieldAlert className="h-3.5 w-3.5" /> {validationErrors.package}</p>
                )}
              </div>
            )}

            {/* Step: Custom Questions */}
            {isGeneralCatalogService && currentStepDef?.label === "Custom Questions" && (
              <div className="space-y-4">
                <p className="text-sm font-semibold text-slate-700">Please answer the following booking details</p>
                {(s.bookingQuestions || []).map((q: any, index: number) => {
                  const val = questionAnswers[q.question] || "";
                  const inputId = `question-input-${q.question.replace(/\s+/g, "-")}`;
                  return (
                    <div key={index} className="space-y-2">
                      <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                        {q.question}
                        {q.required && <span className="inline-flex items-center rounded-full bg-rose-50 px-1.5 py-0.5 text-[10px] font-medium text-rose-700 ring-1 ring-inset ring-rose-600/10">Required</span>}
                      </label>
                      {q.type === "select" ? (
                        <select
                          id={inputId}
                          className={`h-11 w-full rounded-md border px-3 text-sm bg-white focus:outline-none ${validationErrors[q.question] ? "border-rose-500 bg-rose-50/10 focus:ring-rose-500/20" : "border-slate-300"}`}
                          value={val}
                          onChange={(e) => handleAnswerChange(q.question, e.target.value)}
                        >
                          <option value="">{q.placeholder || "Select option..."}</option>
                          {q.options.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                      ) : q.type === "multiselect" ? (
                        <div id={inputId} className={`grid gap-2 sm:grid-cols-2 rounded-xl p-2 ${validationErrors[q.question] ? "border border-rose-300 bg-rose-50/5" : ""}`}>
                          {q.options.map((opt: string) => {
                            const list = Array.isArray(val) ? val : [];
                            const checked = list.includes(opt);
                            return (
                              <label key={opt} className="flex items-center gap-2 rounded-md border border-slate-200 px-3 py-2 bg-white text-xs cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={checked}
                                  onChange={() => {
                                    const nextList = checked ? list.filter(x => x !== opt) : [...list, opt];
                                    handleAnswerChange(q.question, nextList);
                                  }}
                                  className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                />
                                {opt}
                              </label>
                            );
                          })}
                        </div>
                      ) : (
                        <input
                          id={inputId}
                          type={q.type === "number" ? "number" : "text"}
                          placeholder={q.placeholder || "Enter details..."}
                          className={`h-11 w-full rounded-md border px-3 text-sm bg-white focus:outline-none ${validationErrors[q.question] ? "border-rose-500 bg-rose-50/10 focus:ring-rose-500/20" : "border-slate-300"}`}
                          value={val}
                          onChange={(e) => handleAnswerChange(q.question, e.target.value)}
                        />
                      )}
                      {validationErrors[q.question] && (
                        <p className="text-xs text-rose-500 font-medium flex items-center gap-1"><ShieldAlert className="h-3.5 w-3.5" /> {validationErrors[q.question]}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Step 1: Dynamic Service Types */}
            {!isGeneralCatalogService && step === 1 && (
              <div>
                <label className="flex items-center gap-1.5 text-sm font-semibold text-slate-700">
                  {s.formSchema?.step1?.title || "Step 1: Service Type"}
                  <span className="inline-flex items-center rounded-full bg-rose-50 px-1.5 py-0.5 text-[10px] font-medium text-rose-700 ring-1 ring-inset ring-rose-600/10">Required</span>
                </label>
                <select
                  id="service-type-select"
                  className={`h-11 w-full rounded-md border px-3 mt-2 text-sm bg-white ${validationErrors.serviceType ? "border-rose-500 bg-rose-50/10 focus:ring-rose-500/20" : "border-slate-300"}`}
                  value={serviceType}
                  onChange={(e) => {
                    setServiceType(e.target.value);
                    setValidationErrors(prev => {
                      const copy = { ...prev };
                      delete copy.serviceType;
                      return copy;
                    });
                  }}
                >
                  <option value="">Select Service Type...</option>
                  {serviceTypes.map((t: string) => <option key={t} value={t}>{t}</option>)}
                </select>
                {validationErrors.serviceType && (
                  <p className="text-xs text-rose-500 font-medium mt-1.5 flex items-center gap-1"><ShieldAlert className="h-3.5 w-3.5" /> {validationErrors.serviceType}</p>
                )}
                {s.formSchema?.step1?.options && (
                  <div className="mt-4 grid gap-2">
                    {s.formSchema.step1.options.map((opt: any) => (
                      <div key={opt.name || opt.label} className="text-xs text-slate-500 bg-slate-50 p-2.5 rounded-md">
                        <strong>{opt.label || opt.name}</strong>: {opt.description || "Basic support"} · Base Price: ₹{opt.price || 0}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Dynamic Requirements / Materials */}
            {!isGeneralCatalogService && step === 2 && (
              <div id="step2-requirements-container" className={`rounded-xl ${validationErrors.requirements ? "border border-rose-300 p-4 bg-rose-50/5" : ""}`}>
                <p className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
                  {s.formSchema?.step2?.title || "Step 2: Materials Required"}
                  <span className="inline-flex items-center rounded-full bg-rose-50 px-1.5 py-0.5 text-[10px] font-medium text-rose-700 ring-1 ring-inset ring-rose-600/10">Required</span>
                </p>
                {validationErrors.requirements && (
                  <p className="text-xs text-rose-500 font-medium mt-1.5 mb-2 flex items-center gap-1"><ShieldAlert className="h-3.5 w-3.5" /> {validationErrors.requirements}</p>
                )}
                <div className="mt-3 grid gap-3">
                  {formattedMaterials.map((m: any) => {
                    const hasQty = m.unit !== "none" && m.unit !== "checkbox" && m.unit !== "each";
                    return (
                      <div key={m.id} className="flex items-center gap-3 rounded-md border border-slate-200 px-3 py-2 bg-white">
                        <input type="checkbox" checked={!!selectedMaterials[m.id]} onChange={() => toggleMaterial(m.id)} className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                        <div className="flex-1">
                          <div className="font-medium text-xs">{m.name} {m.unit !== "none" && m.unit !== "checkbox" && <span className="text-[10px] text-slate-500">({m.unit})</span>}</div>
                          {m.price > 0 && <div className="text-[10px] text-slate-500">Price: ₹{m.price} {m.unit !== "none" && m.unit !== "checkbox" ? `per ${m.unit}` : ""}</div>}
                        </div>
                        {selectedMaterials[m.id] && hasQty && (
                          <input type="number" min={1} value={selectedMaterials[m.id]} onChange={(e) => setMaterialQty(m.id, Number(e.target.value))} className="w-20 rounded-md border border-slate-200 px-2 py-1 text-xs text-right" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 3: Dynamic Step 3 Options (Optional) */}
            {currentStepDef?.label === (s.formSchema?.step3?.title || "Options") && (
              <div>
                <p className="text-sm font-semibold text-slate-700">{s.formSchema?.step3?.title || "Step 3: Parts Selection"}</p>
                <div className="mt-3 grid gap-3">
                  {formattedStep3Items.map((m: any) => {
                    const hasQty = m.unit !== "none" && m.unit !== "checkbox" && m.unit !== "each";
                    return (
                      <div key={m.id} className="flex items-center gap-3 rounded-md border border-slate-200 px-3 py-2 bg-white">
                        <input type="checkbox" checked={!!selectedMaterials[m.id]} onChange={() => toggleMaterial(m.id)} className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                        <div className="flex-1">
                          <div className="font-medium text-xs">{m.name} {m.unit !== "none" && m.unit !== "checkbox" && <span className="text-[10px] text-slate-500">({m.unit})</span>}</div>
                          {m.price > 0 && <div className="text-[10px] text-slate-500">Price: ₹{m.price} {m.unit !== "none" && m.unit !== "checkbox" ? `per ${m.unit}` : ""}</div>}
                        </div>
                        {selectedMaterials[m.id] && hasQty && (
                          <input type="number" min={1} value={selectedMaterials[m.id]} onChange={(e) => setMaterialQty(m.id, Number(e.target.value))} className="w-20 rounded-md border border-slate-200 px-2 py-1 text-xs text-right" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Dynamic Step Location */}
            {currentStepDef?.label === "Location" && (
              <div id="location-picker-container" className={`rounded-xl ${validationErrors.location ? "border border-rose-300 p-4 bg-rose-50/5" : ""}`}>
                <label className="flex flex-col gap-1 text-sm font-semibold text-slate-700 mb-2">
                  <span className="flex items-center gap-1.5">
                    Locate your service area
                    <span className="inline-flex items-center rounded-full bg-rose-50 px-1.5 py-0.5 text-[10px] font-medium text-rose-700 ring-1 ring-inset ring-rose-600/10">Required</span>
                  </span>
                </label>
                {validationErrors.location && (
                  <p className="text-xs text-rose-500 font-medium mb-3 flex items-center gap-1"><ShieldAlert className="h-3.5 w-3.5" /> {validationErrors.location}</p>
                )}
                <LocationPicker 
                  onLocationSelected={(data) => {
                    setMapLink(`https://maps.google.com/?q=${data.latitude},${data.longitude}`);
                    setLatitude(data.latitude);
                    setLongitude(data.longitude);
                    setPincode(data.pincode);
                    setFullAddress(data.address);
                    setCity(data.city);
                    setStateName(data.state);
                    setNotes((prev) => {
                      const prefix = prev ? prev + "\n" : "";
                      return `${prefix}Address selected: ${data.address}`;
                    });

                    // Clear validation error on confirmation
                    setValidationErrors((prev) => {
                      const copy = { ...prev };
                      delete copy.location;
                      return copy;
                    });

                    toast({
                      title: "Location Confirmed",
                      description: "Your address details have been successfully confirmed. Automatically continuing to schedule details...",
                    });

                    // Auto-advance step after 500ms
                    setTimeout(() => {
                      setStep((s) => Math.min(s + 1, maxStep));
                    }, 500);
                  }} 
                  initialCoords={latitude && longitude ? { lat: latitude, lng: longitude } : null}
                />
              </div>
            )}

            {/* Dynamic Step Schedule */}
            {currentStepDef?.label === "Schedule" && (
              <div className="space-y-4">
                <div>
                  <label className="flex items-center gap-1.5 text-sm font-semibold text-slate-700">
                    Preferred Date
                    <span className="inline-flex items-center rounded-full bg-rose-50 px-1.5 py-0.5 text-[10px] font-medium text-rose-700 ring-1 ring-inset ring-rose-600/10">Required</span>
                  </label>
                  <input
                    id="schedule-date-input"
                    className={`h-11 w-full rounded-md border px-3 mt-2 text-sm bg-white focus:outline-none ${validationErrors.date ? "border-rose-500 bg-rose-50/10 focus:ring-rose-500/20" : "border-slate-300"}`}
                    type="date"
                    value={date}
                    onChange={(e) => {
                      setDate(e.target.value);
                      setValidationErrors(prev => {
                        const copy = { ...prev };
                        delete copy.date;
                        return copy;
                      });
                    }}
                  />
                  {validationErrors.date && (
                    <p className="text-xs text-rose-500 font-medium mt-1.5 flex items-center gap-1"><ShieldAlert className="h-3.5 w-3.5" /> {validationErrors.date}</p>
                  )}
                </div>

                <div>
                  <label className="flex items-center gap-1.5 text-sm font-semibold text-slate-700">
                    Preferred Time (24-Hour)
                    <span className="inline-flex items-center rounded-full bg-rose-50 px-1.5 py-0.5 text-[10px] font-medium text-rose-700 ring-1 ring-inset ring-rose-600/10">Required</span>
                  </label>
                  <input
                    id="schedule-time-input"
                    className={`h-11 w-full rounded-md border px-3 mt-2 text-sm bg-white focus:outline-none ${validationErrors.time ? "border-rose-500 bg-rose-50/10 focus:ring-rose-500/20" : "border-slate-300"}`}
                    type="time"
                    value={time}
                    onChange={(e) => {
                      setTime(e.target.value);
                      setValidationErrors(prev => {
                        const copy = { ...prev };
                        delete copy.time;
                        return copy;
                      });
                    }}
                  />
                  {validationErrors.time && (
                    <p className="text-xs text-rose-500 font-medium mt-1.5 flex items-center gap-1"><ShieldAlert className="h-3.5 w-3.5" /> {validationErrors.time}</p>
                  )}
                </div>
              </div>
            )}

            {/* Dynamic Step Notes */}
            {currentStepDef?.label === "Notes" && (
              <div>
                <label className="grid gap-1 text-sm font-semibold text-slate-700">Special Notes</label>
                <textarea className="w-full rounded-md border border-slate-300 px-3 py-2 mt-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-white" placeholder="Any additional details or requirements" value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} />
                <div className="text-xs text-slate-400 mt-2">Example: Any device models, issue descriptions, parking details, or safety directives.</div>
              </div>
            )}


            <div className="mt-4 flex items-center gap-2">
              {step > 1 && <Button variant="outline" onClick={goPrev}>Back</Button>}
              {step < maxStep && <Button onClick={goNext}>Next</Button>}
            </div>
          </div>

          <aside className="rounded-lg bg-slate-50 p-4 lg:sticky lg:top-4 lg:self-start">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-950">Live Price Summary</h3>
              <Zap className="h-4 w-4 text-emerald-600" />
            </div>
            {optionsLoading && <p className="mt-3 text-sm text-slate-500">Loading service prices...</p>}
            {optionsError && <p className="mt-3 rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-700">{optionsError}</p>}
            <div className="mt-4 space-y-2 text-sm">
              <Line label="Base Fee" value={priceBreakdown.serviceCost} />
              <Line label="Add-ons / Parts" value={priceBreakdown.materialCost} />
              <Line label="Labour Charges" value={priceBreakdown.labourCost} />
              <div className="flex items-center justify-between border-t border-slate-200 pt-3 text-lg font-bold text-slate-950">
                <span>Grand Total</span>
                <span>{money(priceBreakdown.grandTotal)}</span>
              </div>
            </div>
            <div className="mt-4 grid gap-2">
              <Button variant="outline" onClick={addToCart}><ShoppingCart className="h-4 w-4" /> Add To Cart</Button>
              <Button className="bg-emerald-600 text-white hover:bg-emerald-700" onClick={continueBooking}><CalendarCheck className="h-4 w-4" /> Continue Booking</Button>
              <Button variant="ghost" onClick={onRequestQuote}><FileText className="h-4 w-4" /> Request Quote</Button>
            </div>
          </aside>
        </div>
      </DialogContent>
      <Dialog open={miniCartOpen} onOpenChange={setMiniCartOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Added to Cart</DialogTitle>
            <DialogDescription>{service.name} has been added to your cart with your selections.</DialogDescription>
          </DialogHeader>
          <div className="rounded-md bg-slate-50 p-4 text-sm">
            <Line label="Grand Total" value={priceBreakdown.grandTotal} />
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            <Button variant="outline" onClick={() => setMiniCartOpen(false)}>Continue Browsing</Button>
            <Button className="bg-emerald-600 text-white hover:bg-emerald-700" onClick={() => router.push("/cart")}>View Cart</Button>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={replaceConfirmOpen} onOpenChange={setReplaceConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cart Already Has Items</DialogTitle>
            <DialogDescription>Your cart contains existing service configurations. Would you like to keep both or replace your cart with this selection?</DialogDescription>
          </DialogHeader>
          <div className="grid gap-2 sm:grid-cols-2">
            <Button variant="outline" onClick={() => handleReplaceConfirm(false)}>Add To Existing Cart</Button>
            <Button className="bg-emerald-600 text-white hover:bg-emerald-700" onClick={() => handleReplaceConfirm(true)}>Replace Existing Cart</Button>
          </div>
        </DialogContent>
      </Dialog>
    </Dialog>
  );
}

function Line({ label, value }: { label: string; value?: number }) {
  return <div className="flex items-center justify-between"><span className="text-slate-600">{label}</span><span className="font-semibold text-slate-900">{money(value)}</span></div>;
}

export default ServiceBookingConfigModal;
