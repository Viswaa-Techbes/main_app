"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarCheck, FileText, ShoppingCart, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { addCctvCartItem } from "@/lib/cctv-cart";
import { cctvApi, CctvAddon, CctvSubcategory } from "@/lib/cctv-api";
import { API_BASE_URL } from "@/core/api/config";

function money(value?: number) {
  return `Rs. ${Math.round(value || 0).toLocaleString("en-IN")}`;
}

import { getCctvCart } from "@/lib/cctv-cart";

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
  const [addons, setAddons] = useState<CctvAddon[]>([]);
  const [optionsLoading, setOptionsLoading] = useState(true);
  const [optionsError, setOptionsError] = useState("");
  const [configData, setConfigData] = useState<{
    serviceTypes: { name: string; price: number; description?: string }[];
    materials: { id: string; name: string; slug: string; price: number; unit: string; isLabour?: boolean; description?: string }[];
    pricingRules: any;
  } | null>(null);

  const [step, setStep] = useState(1);

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
      
      const matMap: Record<string, number> = {};
      (editItem.input?.materials || []).forEach((m: any) => {
        matMap[m.id] = m.qty;
      });
      setSelectedMaterials(matMap);
      setMapLink(editItem.input?.mapLink || "");
      setDate(editItem.input?.date || "");
      setTime(editItem.input?.time || "");
      setNotes(editItem.input?.notes || "");
      setStep(1);
    } else {
      setServiceType(serviceTypes[0] || "");
      setSelectedMaterials({});
      setMapLink("");
      setDate("");
      setTime("");
      setNotes("");
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

    let baseCharge = s.pricingRules?.baseCharge ?? serviceCost;
    const grandTotal = baseCharge + materialCost + labourCost;
    setPriceBreakdown({ serviceCost: baseCharge, materialCost, labourCost, grandTotal });
  }, [selectedMaterials, serviceType, addons, service, allAvailableFormattedItems]);

  function toggleMaterial(id: string) {
    setSelectedMaterials((s) => {
      const copy = { ...s };
      if (copy[id]) delete copy[id]; else copy[id] = 1;
      return copy;
    });
  }

  function setMaterialQty(id: string, qty: number) {
    setSelectedMaterials((s) => ({ ...s, [id]: Math.max(0, Math.floor(qty || 0)) }));
  }

  function goNext() { if (step < maxStep) setStep(step + 1); }
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
      serviceName: service.name,
      categoryId,
      subcategoryId: service._id,
      input: {
        serviceType,
        materials: materialsArray,
        mapLink,
        date,
        time,
        notes,
        isMaterialsRequired: hasAddonSchema
      },
      price: {
        category: { id: categoryId, name: service.name, slug: service.slug },
        subcategory: { id: service._id, name: service.name, slug: service.slug },
        cameraType: { id: serviceType, name: serviceType, slug: serviceType, unitPrice: priceBreakdown.serviceCost },
        cameraCount: 0,
        installationArea: "",
        wireLength: 0,
        addons: materialsArray.map(m => ({ id: m.addonId || m.id, name: m.name, slug: m.id, price: m.unitPrice, quantity: m.qty, total: m.total })),
        priceBreakdown: {
          baseCharge: priceBreakdown.serviceCost,
          cameraUnitPrice: priceBreakdown.serviceCost,
          cameraCount: 0,
          cameraTotal: 0,
          indoorCharge: 0,
          outdoorCharge: 0,
          areaCharge: 0,
          wireLength: 0,
          wirePricePerMeter: 0,
          wireTotal: 0,
          addonsTotal: priceBreakdown.materialCost + priceBreakdown.labourCost,
          discountTotal: 0,
          couponTotal: 0,
          offerAdjustment: 0,
          taxableAmount: priceBreakdown.grandTotal,
          taxTotal: 0,
          grandTotal: priceBreakdown.grandTotal
        }
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

  function isConfigValid() {
    // Only require serviceType when service type options actually exist
    const hasServiceTypeOptions = serviceTypes.length > 0;
    if (hasServiceTypeOptions && (!serviceType || !serviceType.trim())) return false;
    
    const s = service as any;
    const isStep2Required = s.formSchema?.step2?.options && s.formSchema.step2.options.length > 0;
    if (isStep2Required && !Object.keys(selectedMaterials).length) {
      return false;
    }
    
    if (!mapLink || !isValidMapLink(mapLink)) return false;
    if (!date) return false;
    if (!time || !isValidTime(time)) return false;
    return true;
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

  function addToCart() {
    if (!isConfigValid()) {
      window.alert('Please complete all required configuration fields (requirements/materials, valid Google Map link, date, and time).');
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
    if (!isConfigValid()) {
      window.alert('Please complete all required configuration fields before booking.');
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-5xl">
        <DialogHeader>
          <DialogTitle>Configure {service.name}</DialogTitle>
          <DialogDescription>Select choices below — pricing updates live.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-5 lg:grid-cols-[1fr,320px]">
          <div className="grid gap-4">
            
            {/* Step 1: Dynamic Service Types */}
            {step === 1 && (
              <div>
                <label className="grid gap-1 text-sm font-medium text-slate-700">
                  {s.formSchema?.step1?.title || "Step 1: Service Type"}
                </label>
                <select className="h-11 w-full rounded-md border border-slate-300 px-3 mt-2" value={serviceType} onChange={(e) => setServiceType(e.target.value)}>
                  {serviceTypes.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
                {s.formSchema?.step1?.options && (
                  <div className="mt-4 grid gap-2">
                    {s.formSchema.step1.options.map((opt: any) => (
                      <div key={opt.name || opt.label} className="text-xs text-slate-500 bg-slate-50 p-2 rounded-md">
                        <strong>{opt.label || opt.name}</strong>: {opt.description || "Basic support"} · Base Price: ₹{opt.price || 0}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Dynamic Requirements / Materials */}
            {step === 2 && (
              <div>
                <p className="text-sm font-medium text-slate-700">{s.formSchema?.step2?.title || "Step 2: Materials Required"}</p>
                <div className="mt-3 grid gap-3">
                  {formattedMaterials.map((m) => {
                    const hasQty = m.unit !== "none" && m.unit !== "checkbox" && m.unit !== "each";
                    return (
                      <div key={m.id} className="flex items-center gap-3 rounded-md border border-slate-200 px-3 py-2">
                        <input type="checkbox" checked={!!selectedMaterials[m.id]} onChange={() => toggleMaterial(m.id)} />
                        <div className="flex-1">
                          <div className="font-medium">{m.name} {m.unit !== "none" && m.unit !== "checkbox" && <span className="text-sm text-slate-500">({m.unit})</span>}</div>
                          {m.price > 0 && <div className="text-sm text-slate-500">Price: ₹{m.price} {m.unit !== "none" && m.unit !== "checkbox" ? `per ${m.unit}` : ""}</div>}
                        </div>
                        {selectedMaterials[m.id] && hasQty && (
                          <input type="number" min={1} value={selectedMaterials[m.id]} onChange={(e) => setMaterialQty(m.id, Number(e.target.value))} className="w-28 rounded-md border px-2 py-1" />
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
                <p className="text-sm font-medium text-slate-700">{s.formSchema?.step3?.title || "Step 3: Parts Selection"}</p>
                <div className="mt-3 grid gap-3">
                  {formattedStep3Items.map((m) => {
                    const hasQty = m.unit !== "none" && m.unit !== "checkbox" && m.unit !== "each";
                    return (
                      <div key={m.id} className="flex items-center gap-3 rounded-md border border-slate-200 px-3 py-2">
                        <input type="checkbox" checked={!!selectedMaterials[m.id]} onChange={() => toggleMaterial(m.id)} />
                        <div className="flex-1">
                          <div className="font-medium">{m.name} {m.unit !== "none" && m.unit !== "checkbox" && <span className="text-sm text-slate-500">({m.unit})</span>}</div>
                          {m.price > 0 && <div className="text-sm text-slate-500">Price: ₹{m.price} {m.unit !== "none" && m.unit !== "checkbox" ? `per ${m.unit}` : ""}</div>}
                        </div>
                        {selectedMaterials[m.id] && hasQty && (
                          <input type="number" min={1} value={selectedMaterials[m.id]} onChange={(e) => setMaterialQty(m.id, Number(e.target.value))} className="w-28 rounded-md border px-2 py-1" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Dynamic Step Location */}
            {currentStepDef?.label === "Location" && (
              <div>
                <label className="grid gap-1 text-sm font-medium text-slate-700">Location (Google Maps Link)</label>
                <input className="h-11 w-full rounded-md border border-slate-300 px-3 mt-2" placeholder="https://maps.google.com/..." value={mapLink} onChange={(e) => setMapLink(e.target.value)} />
                <p className="text-xs text-slate-500 mt-2">Example: Search for your address in Google Maps, click "Share", copy the link, and paste it here.</p>
              </div>
            )}

            {/* Dynamic Step Schedule */}
            {currentStepDef?.label === "Schedule" && (
              <div>
                <label className="grid gap-1 text-sm font-medium text-slate-700">Preferred Date</label>
                <input className="h-11 w-full rounded-md border border-slate-300 px-3 mt-2" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                <label className="grid gap-1 text-sm font-medium text-slate-700 mt-4">Preferred Time (24-Hour)</label>
                <input className="h-11 w-full rounded-md border border-slate-300 px-3 mt-2" type="time" value={time} onChange={(e) => setTime(e.target.value)} />
              </div>
            )}

            {/* Dynamic Step Notes */}
            {currentStepDef?.label === "Notes" && (
              <div>
                <label className="grid gap-1 text-sm font-medium text-slate-700">Special Notes</label>
                <textarea className="w-full rounded-md border border-slate-300 px-3 py-2 mt-2" placeholder="Any additional details or requirements" value={notes} onChange={(e) => setNotes(e.target.value)} />
                <div className="text-sm text-slate-500 mt-2">Example: Any device models, issue descriptions, parking details, or safety directives.</div>
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
              <Button variant="outline" onClick={addToCart} disabled={!isConfigValid()}><ShoppingCart className="h-4 w-4" /> Add To Cart</Button>
              <Button className="bg-emerald-600 text-white hover:bg-emerald-700" onClick={continueBooking} disabled={!isConfigValid()}><CalendarCheck className="h-4 w-4" /> Continue Booking</Button>
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
