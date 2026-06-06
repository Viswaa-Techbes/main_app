"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarCheck, FileText, ShoppingCart, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { addCctvCartItem } from "@/lib/cctv-cart";
import { cctvApi, CctvAddon, CctvSubcategory, fallbackAddons } from "@/lib/cctv-api";

function money(value?: number) {
  return `Rs. ${Math.round(value || 0).toLocaleString("en-IN")}`;
}

import { getCctvCart } from "@/lib/cctv-cart";

export function CctvBookingConfigModal({
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

  const [step, setStep] = useState(1);
  const serviceTypes = [
    "Wired Camera Installation",
    "Wireless Camera Installation",
    "Dome Camera Installation",
    "Bullet Camera Installation",
    "PTZ Camera Installation",
    "DVR Installation",
    "NVR Installation",
    "CCTV Repair",
    "CCTV Maintenance",
  ];
  const [serviceType, setServiceType] = useState<string>(serviceTypes[0]);

  const MATERIALS = [
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
  ];

  const [selectedMaterials, setSelectedMaterials] = useState<Record<string, number>>({});
  const [mapLink, setMapLink] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");
  const [priceBreakdown, setPriceBreakdown] = useState<{ serviceCost: number; materialCost: number; labourCost: number; grandTotal: number }>({ serviceCost: 0, materialCost: 0, labourCost: 0, grandTotal: 0 });
  const [miniCartOpen, setMiniCartOpen] = useState(false);
  const [replaceConfirmOpen, setReplaceConfirmOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<"cart" | "checkout" | null>(null);

  const categoryId = typeof service.categoryId === "string" && service.categoryId.length === 24 ? service.categoryId : typeof service.categoryId === "object" ? service.categoryId?._id : undefined;
  const subcategoryId = service._id && service._id.length === 24 ? service._id : undefined;

  useEffect(() => {
    if (!open) return;
    if (editItem) {
      setServiceType(editItem.input?.serviceType || serviceTypes[0]);
      
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
      setServiceType(serviceTypes[0]);
      setSelectedMaterials({});
      setMapLink("");
      setDate("");
      setTime("");
      setNotes("");
      setStep(1);
    }
  }, [editItem, open]);

  useEffect(() => {
    if (!open) return;
    setOptionsLoading(true);
    cctvApi.materials()
      .then((list) => {
        let available = list.length ? list : fallbackAddons;
        // If subcategory exposes supportedMaterialIds, filter by those ids
        if ((service as any)?.supportedMaterialIds && (service as any).supportedMaterialIds.length) {
          available = available.filter((a) => (service as any).supportedMaterialIds.includes(a._id));
        } else if ((service as any)?.supportedAddons && (service as any).supportedAddons.length) {
          // fallback to legacy supportedAddons name-match
          available = available.filter((a) => (service as any).supportedAddons.includes(a.name));
        }
        setAddons(available);
        setOptionsError("");
      })
      .catch(() => {
        setAddons(fallbackAddons);
        setOptionsError("Unable to load live material prices, using defaults.");
      })
      .finally(() => setOptionsLoading(false));
  }, [open, service]);

  function priceForMaterial(matId: string) {
    const mat = MATERIALS.find((m) => m.id === matId);
    if (!mat) return 0;
    const candidate = addons.find((a) => a.name && a.name.toLowerCase().includes(mat.name.toLowerCase()));
    if (candidate && typeof candidate.price === "number" && candidate.price > 0) return candidate.price;
    return mat.defaultPrice || 0;
  }

  useEffect(() => {
    let materialCost = 0;
    let labourCost = 0;
    Object.entries(selectedMaterials).forEach(([id, qty]) => {
      const price = priceForMaterial(id);
      if (id === "labour") labourCost += price * qty; else materialCost += price * qty;
    });
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
    const serviceCost = serviceCostMap[serviceType] || 499;
    const grandTotal = serviceCost + materialCost + labourCost;
    setPriceBreakdown({ serviceCost, materialCost, labourCost, grandTotal });
  }, [selectedMaterials, serviceType, addons]);

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

  function goNext() { if (step < 5) setStep(step + 1); }
  function goPrev() { if (step > 1) setStep(step - 1); }

  function buildMaterialsArray() {
    // convert selectedMaterials map to array with addon mapping and unit prices
    return Object.entries(selectedMaterials).map(([matId, qty]) => {
      const matDef = formattedMaterials.find((m) => m.id === matId) || { id: matId, name: matId, unit: 'each', price: 0 };
      const matchedAddon = addons.find((a) => a.name && matDef.name && a.name.toLowerCase().includes(matDef.name.toLowerCase()));
      return {
        id: matDef.id,
        name: matDef.name,
        unit: matDef.unit,
        qty,
        unitPrice: matDef.price,
        addonId: matchedAddon?._id || null,
        total: (matDef.price || 0) * qty,
      };
    });
  }

  function storeConfiguration(replaceExisting = false) {
    const materialsArray = buildMaterialsArray();
    const payload = {
      id: editItem ? editItem.id : undefined,
      serviceSlug: service.slug,
      serviceName: service.name,
      categoryId,
      subcategoryId: service._id,
      input: { serviceType, materials: materialsArray, mapLink, date, time, notes },
      price: { priceBreakdown },
    };
    addCctvCartItem(payload as any, replaceExisting);
    return payload;
  }

  function isValidMapLink(link: string) {
    return link && link.trim().length > 0;
  }

  function isValidTime(t: string) {
    return t && t.trim().length > 0;
  }

  function isConfigValid() {
    if (!serviceType || !serviceType.trim()) return false;
    if (!Object.keys(selectedMaterials).length) return false;
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
      window.alert('Please complete all required configuration fields (materials, map link, date, and time).');
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

  const materialsByServiceType: Record<string, string[]> = {
    "Wired Camera Installation": ["cable_3p1", "cat6", "labour", "box_5x5"],
    "Wireless Camera Installation": ["cat6_premium", "connector_set", "labour"],
    "Dome Camera Installation": ["cat6", "labour", "box_5x5"],
    "Bullet Camera Installation": ["cat6", "labour", "box_5x5"],
    "PTZ Camera Installation": ["ptz_camera", "smps", "poe_switch", "network_rack"],
    "DVR Installation": ["dvr", "hdd", "connector_set", "smps"],
    "NVR Installation": ["nvr", "hdd", "connector_set", "smps"],
    "CCTV Repair": ["connector_set", "junction_box", "labour"],
    "CCTV Maintenance": ["connector_set", "labour"],
  };

  const formattedMaterials = MATERIALS
    .filter((m) => (materialsByServiceType[serviceType] || []).includes(m.id))
    .map((m) => ({ ...m, price: priceForMaterial(m.id) }));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-5xl">
        <DialogHeader>
          <DialogTitle>Configure CCTV Installation</DialogTitle>
          <DialogDescription>Select options below — pricing updates live.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-5 lg:grid-cols-[1fr,320px]">
          <div className="grid gap-4">
            {step === 1 && (
              <div>
                <label className="grid gap-1 text-sm font-medium text-slate-700">Step 1: Service Type</label>
                <select className="h-11 w-full rounded-md border border-slate-300 px-3" value={serviceType} onChange={(e) => setServiceType(e.target.value)}>
                  {serviceTypes.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            )}

            {step === 2 && (
              <div>
                <p className="text-sm font-medium text-slate-700">Step 2: Materials Required</p>
                <div className="mt-3 grid gap-3">
                  {formattedMaterials.map((m) => (
                    <div key={m.id} className="flex items-center gap-3 rounded-md border border-slate-200 px-3 py-2">
                      <input type="checkbox" checked={!!selectedMaterials[m.id]} onChange={() => toggleMaterial(m.id)} />
                      <div className="flex-1">
                        <div className="font-medium">{m.name} <span className="text-sm text-slate-500">({m.unit})</span></div>
                        <div className="text-sm text-slate-500">Price: ₹{m.price} per {m.unit}</div>
                      </div>
                      {selectedMaterials[m.id] && (
                        <input type="number" min={0} value={selectedMaterials[m.id]} onChange={(e) => setMaterialQty(m.id, Number(e.target.value))} className="w-28 rounded-md border px-2 py-1" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {step === 3 && (
              <div>
                <label className="grid gap-1 text-sm font-medium text-slate-700">Step 3: Location (Google Maps URL)</label>
                <input className="h-11 w-full rounded-md border border-slate-300 px-3" placeholder="https://maps.google.com/..." value={mapLink} onChange={(e) => setMapLink(e.target.value)} />
              </div>
            )}

            {step === 4 && (
              <div>
                <label className="grid gap-1 text-sm font-medium text-slate-700">Step 4: Preferred Date</label>
                <input className="h-11 w-full rounded-md border border-slate-300 px-3" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                <label className="grid gap-1 text-sm font-medium text-slate-700 mt-3">Preferred Time</label>
                <input className="h-11 w-full rounded-md border border-slate-300 px-3" type="time" value={time} onChange={(e) => setTime(e.target.value)} />
              </div>
            )}

            {step === 5 && (
              <div>
                <label className="grid gap-1 text-sm font-medium text-slate-700">Step 5: Notes</label>
                <textarea className="w-full rounded-md border border-slate-300 px-3 py-2" placeholder="Any additional requirements" value={notes} onChange={(e) => setNotes(e.target.value)} />
                <div className="text-sm text-slate-500 mt-2">Examples: Need concealed wiring; Existing DVR available; Need 4 additional cameras; Need cable replacement.</div>
              </div>
            )}

            <div className="mt-4 flex items-center gap-2">
              {step > 1 && <Button variant="outline" onClick={goPrev}>Back</Button>}
              {step < 5 && <Button onClick={goNext}>Next</Button>}
            </div>
          </div>

          <aside className="rounded-lg bg-slate-50 p-4 lg:sticky lg:top-4 lg:self-start">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-950">Live Price Summary</h3>
              <Zap className="h-4 w-4 text-emerald-600" />
            </div>
            {optionsLoading && <p className="mt-3 text-sm text-slate-500">Loading material prices...</p>}
            {optionsError && <p className="mt-3 rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-700">{optionsError}</p>}
            <div className="mt-4 space-y-2 text-sm">
              <Line label="Service Cost" value={priceBreakdown.serviceCost} />
              <Line label="Material Cost" value={priceBreakdown.materialCost} />
              <Line label="Labour Cost" value={priceBreakdown.labourCost} />
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
            <DialogDescription>{service.name} has been added with the selected configuration.</DialogDescription>
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
            <DialogDescription>Your cart contains existing configurations. Would you like to replace them or add this new configuration to your existing cart?</DialogDescription>
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

export default CctvBookingConfigModal;
