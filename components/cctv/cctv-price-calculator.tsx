"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarCheck, FileText, ShoppingCart, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { calculateFallbackCctvPrice, cctvApi, CctvAddon, CctvCameraType, CctvPriceResult, CctvSubcategory, fallbackAddons, fallbackCameraTypes } from "@/lib/cctv-api";
import { addCctvCartItem } from "@/lib/cctv-cart";

function money(value?: number) {
  return `Rs. ${Math.round(value || 0).toLocaleString("en-IN")}`;
}

export function CctvPriceCalculator({ service, onRequestQuote }: { service: CctvSubcategory; onRequestQuote?: () => void }) {
  const router = useRouter();
  const [cameraTypes, setCameraTypes] = useState<CctvCameraType[]>([]);
  const [addons, setAddons] = useState<CctvAddon[]>([]);
  const [optionsLoading, setOptionsLoading] = useState(true);
  const [optionsError, setOptionsError] = useState("");
  const [cameraTypeId, setCameraTypeId] = useState("");
  const [cameraCount, setCameraCount] = useState(1);
  const [installationArea, setInstallationArea] = useState<"indoor" | "outdoor">("indoor");
  const [wireLength, setWireLength] = useState(10);
  const [addonIds, setAddonIds] = useState<string[]>([]);
  const [price, setPrice] = useState<CctvPriceResult | null>(null);
  const [loading, setLoading] = useState(false);
  const categoryId = typeof service.categoryId === "string" && service.categoryId.length === 24 ? service.categoryId : typeof service.categoryId === "object" ? service.categoryId?._id : undefined;
  const subcategoryId = service._id && service._id.length === 24 ? service._id : undefined;

  useEffect(() => {
    setOptionsLoading(true);
    Promise.all([cctvApi.cameraTypes(), cctvApi.addons()])
      .then(([types, addonList]) => {
        setCameraTypes(types.length ? types : fallbackCameraTypes);
        let availableAddons = addonList.length ? addonList : fallbackAddons;
        if ((service as any)?.supportedAddons && (service as any).supportedAddons.length) {
          availableAddons = availableAddons.filter((a) => (service as any).supportedAddons.includes(a.name));
        }
        setAddons(availableAddons);
        setCameraTypeId((types[0] || fallbackCameraTypes[0])?._id || "");
        setOptionsError("");
      })
      .catch(() => {
        setCameraTypes(fallbackCameraTypes);
        setAddons(fallbackAddons);
        setCameraTypeId(fallbackCameraTypes[0]._id);
        setOptionsError("Unable to load live camera types. Showing default pricing options.");
      })
      .finally(() => setOptionsLoading(false));
  }, []);

  const input = useMemo(() => ({
    categoryId,
    subcategoryId,
    cameraTypeId,
    cameraCount,
    installationArea,
    wireLength,
    addonIds,
  }), [addonIds, cameraCount, cameraTypeId, categoryId, installationArea, subcategoryId, wireLength]);

  useEffect(() => {
    if (!cameraTypeId) return;
    let ignore = false;
    setLoading(true);
    cctvApi.calculate(input)
      .then((result) => { if (!ignore) setPrice(result); })
      .catch(() => { if (!ignore) setPrice(calculateFallbackCctvPrice(input, cameraTypes, addons)); })
      .finally(() => { if (!ignore) setLoading(false); });
    return () => { ignore = true; };
  }, [input, cameraTypeId]);

  function toggleAddon(id: string) {
    setAddonIds((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  }

  function addToCart() {
    if (!price) return;
    addCctvCartItem({
      serviceSlug: service.slug,
      serviceName: service.name,
      categoryId,
      subcategoryId: service._id,
      input,
      price,
    });
  }

  function bookNow() {
    addToCart();
    router.push("/checkout");
  }

  const breakdown = price?.priceBreakdown;

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-950">Pricing Calculator</h2>
          <p className="text-sm text-slate-500">Live estimate updates as you change CCTV requirements.</p>
        </div>
        <Zap className="h-5 w-5 text-emerald-600" />
      </div>

      <div className="mt-5 grid gap-4">
        {optionsLoading && <p className="rounded-md bg-slate-50 px-3 py-2 text-sm text-slate-500">Loading camera types...</p>}
        {optionsError && <p className="rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-700">{optionsError}</p>}
        <label className="grid gap-1 text-sm font-medium text-slate-700">
          Camera type
          <select className="h-10 rounded-md border border-slate-300 px-3" value={cameraTypeId} onChange={(e) => setCameraTypeId(e.target.value)} disabled={optionsLoading || !cameraTypes.length}>
            {!cameraTypes.length && <option value="">Unable to load camera types</option>}
            {cameraTypes.map((type) => <option key={type._id} value={type._id}>{type.name} - {money(type.installationPrice)}</option>)}
          </select>
        </label>
        <div className="grid grid-cols-2 gap-3">
          <label className="grid gap-1 text-sm font-medium text-slate-700">
            Cameras
            <input className="h-10 rounded-md border border-slate-300 px-3" type="number" min={1} value={cameraCount} onChange={(e) => setCameraCount(Number(e.target.value) || 1)} />
          </label>
          <label className="grid gap-1 text-sm font-medium text-slate-700">
            Wire length (m)
            <input className="h-10 rounded-md border border-slate-300 px-3" type="number" min={0} value={wireLength} onChange={(e) => setWireLength(Number(e.target.value) || 0)} />
          </label>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {(["indoor", "outdoor"] as const).map((area) => (
            <button key={area} type="button" onClick={() => setInstallationArea(area)} className={`h-10 rounded-md border text-sm font-semibold capitalize ${installationArea === area ? "border-emerald-600 bg-emerald-50 text-emerald-700" : "border-slate-200 text-slate-600"}`}>
              {area}
            </button>
          ))}
        </div>
        <div>
          <p className="text-sm font-medium text-slate-700">Add-ons</p>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            {addons.map((addon) => (
              <label key={addon._id} className="flex items-center justify-between gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm">
                <span><input className="mr-2" type="checkbox" checked={addonIds.includes(addon._id)} onChange={() => toggleAddon(addon._id)} />{addon.name}</span>
                <span className="font-semibold">{money(addon.price)}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-5 rounded-md bg-slate-50 p-4">
        {loading ? <p className="text-sm text-slate-500">Calculating...</p> : (
          <div className="space-y-2 text-sm">
            <Line label="Base charge" value={breakdown?.baseCharge} />
            <Line label="Camera total" value={breakdown?.cameraTotal} />
            <Line label="Area charge" value={breakdown?.areaCharge} />
            <Line label="Wire total" value={breakdown?.wireTotal} />
            <Line label="Add-ons" value={breakdown?.addonsTotal} />
            <Line label="Discount" value={-(breakdown?.discountTotal || 0)} />
            <Line label="Tax" value={breakdown?.taxTotal} />
            <div className="flex items-center justify-between border-t border-slate-200 pt-3 text-base font-bold text-slate-950">
              <span>Grand total</span>
              <span>{money(breakdown?.grandTotal)}</span>
            </div>
          </div>
        )}
      </div>

      <Button className="mt-4 w-full bg-emerald-600 text-white hover:bg-emerald-700" onClick={addToCart} disabled={!price}>
        <ShoppingCart className="h-4 w-4" /> Add To Cart
      </Button>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        <Button className="bg-slate-950 text-white hover:bg-slate-800" onClick={bookNow} disabled={!price}>
          <CalendarCheck className="h-4 w-4" /> Book Now
        </Button>
        <Button variant="outline" onClick={onRequestQuote}>
          <FileText className="h-4 w-4" /> Request Quote
        </Button>
      </div>
    </div>
  );
}

export function CctvBookingConfigModal({
  open,
  onOpenChange,
  service,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  service: CctvSubcategory;
}) {
  const router = useRouter();
  const [cameraTypes, setCameraTypes] = useState<CctvCameraType[]>([]);
  const [addons, setAddons] = useState<CctvAddon[]>([]);
  const [cameraTypeId, setCameraTypeId] = useState("");
  const [cameraCount, setCameraCount] = useState(1);
  const [installationArea, setInstallationArea] = useState<"indoor" | "outdoor">("indoor");
  const [wireLength, setWireLength] = useState(10);
  const [addonIds, setAddonIds] = useState<string[]>([]);
  const [price, setPrice] = useState<CctvPriceResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [optionsLoading, setOptionsLoading] = useState(true);
  const [optionsError, setOptionsError] = useState("");
  const [miniCartOpen, setMiniCartOpen] = useState(false);
  const categoryId = typeof service.categoryId === "string" && service.categoryId.length === 24 ? service.categoryId : typeof service.categoryId === "object" ? service.categoryId?._id : undefined;
  const subcategoryId = service._id && service._id.length === 24 ? service._id : undefined;

  useEffect(() => {
    if (!open || cameraTypes.length) return;
    setOptionsLoading(true);
    Promise.all([cctvApi.cameraTypes(), cctvApi.addons()])
      .then(([types, addonList]) => {
        const nextTypes = types.length ? types : fallbackCameraTypes;
        setCameraTypes(nextTypes);
        let availableAddons = addonList.length ? addonList : fallbackAddons;
        if ((service as any)?.supportedAddons && (service as any).supportedAddons.length) {
          availableAddons = availableAddons.filter((a) => (service as any).supportedAddons.includes(a.name));
        }
        setAddons(availableAddons);
        setCameraTypeId(nextTypes[0]?._id || "");
        setOptionsError("");
      })
      .catch(() => {
        setCameraTypes(fallbackCameraTypes);
        setAddons(fallbackAddons);
        setCameraTypeId(fallbackCameraTypes[0]._id);
        setOptionsError("Unable to load live camera types. Showing default pricing options.");
      })
      .finally(() => setOptionsLoading(false));
  }, [open, cameraTypes.length]);

  const input = useMemo(() => ({
    categoryId,
    subcategoryId,
    cameraTypeId,
    cameraCount,
    installationArea,
    wireLength,
    addonIds,
  }), [addonIds, cameraCount, cameraTypeId, categoryId, installationArea, subcategoryId, wireLength]);

  useEffect(() => {
    if (!open || !cameraTypeId) return;
    let ignore = false;
    setLoading(true);
    cctvApi.calculate(input)
      .then((result) => { if (!ignore) setPrice(result); })
      .catch(() => { if (!ignore) setPrice(calculateFallbackCctvPrice(input, cameraTypes, addons)); })
      .finally(() => { if (!ignore) setLoading(false); });
    return () => { ignore = true; };
  }, [addons, cameraTypes, cameraTypeId, input, open]);

  function toggleAddon(id: string) {
    setAddonIds((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  }

  function storeConfiguration() {
    if (!price) return false;
    addCctvCartItem({
      serviceSlug: service.slug,
      serviceName: service.name,
      categoryId,
      subcategoryId: service._id,
      input,
      price,
    });
    return true;
  }

  function addToCart() {
    if (storeConfiguration()) setMiniCartOpen(true);
  }

  function continueBooking() {
    if (!storeConfiguration()) return;
    onOpenChange(false);
    router.push("/checkout");
  }

  const breakdown = price?.priceBreakdown;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-5xl">
          <DialogHeader>
            <DialogTitle>Configure {service.name}</DialogTitle>
            <DialogDescription>Select installation options before adding to cart or continuing to checkout.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-5 lg:grid-cols-[1fr,320px]">
            <div className="grid gap-4">
              {optionsLoading && <p className="rounded-md bg-slate-50 px-3 py-2 text-sm text-slate-500">Loading camera types...</p>}
              {optionsError && <p className="rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-700">{optionsError}</p>}
              <label className="grid gap-1 text-sm font-medium text-slate-700">
                Step 1: Camera Type
                <select className="h-11 rounded-md border border-slate-300 px-3" value={cameraTypeId} onChange={(event) => setCameraTypeId(event.target.value)} disabled={optionsLoading || !cameraTypes.length}>
                  {!cameraTypes.length && <option value="">Unable to load camera types</option>}
                  {cameraTypes.map((type) => <option key={type._id} value={type._id}>{type.name} - {money(type.installationPrice)}</option>)}
                </select>
              </label>
              <label className="grid gap-1 text-sm font-medium text-slate-700">
                Step 2: Camera Count
                <input className="h-11 rounded-md border border-slate-300 px-3" type="number" min={1} value={cameraCount} onChange={(event) => setCameraCount(Number(event.target.value) || 1)} />
              </label>
              <div>
                <p className="text-sm font-medium text-slate-700">Step 3: Indoor / Outdoor</p>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {(["indoor", "outdoor"] as const).map((area) => (
                    <button key={area} type="button" onClick={() => setInstallationArea(area)} className={`h-11 rounded-md border text-sm font-semibold capitalize ${installationArea === area ? "border-emerald-600 bg-emerald-50 text-emerald-700" : "border-slate-200 text-slate-600"}`}>
                      {area}
                    </button>
                  ))}
                </div>
              </div>
              <label className="grid gap-1 text-sm font-medium text-slate-700">
                Step 4: Wire Length
                <input className="h-11 rounded-md border border-slate-300 px-3" type="number" min={0} value={wireLength} onChange={(event) => setWireLength(Number(event.target.value) || 0)} />
              </label>
              <div>
                <p className="text-sm font-medium text-slate-700">Step 5: Add-ons</p>
                <div className="mt-2 grid gap-2 sm:grid-cols-2">
                  {addons.map((addon) => (
                    <label key={addon._id} className="flex items-center justify-between gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm">
                      <span><input className="mr-2" type="checkbox" checked={addonIds.includes(addon._id)} onChange={() => toggleAddon(addon._id)} />{addon.name}</span>
                      <span className="font-semibold">{money(addon.price)}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <aside className="rounded-lg bg-slate-50 p-4 lg:sticky lg:top-4 lg:self-start">
              <h3 className="text-lg font-semibold text-slate-950">Live Price Summary</h3>
              {loading ? <p className="mt-3 text-sm text-slate-500">Calculating...</p> : (
                <div className="mt-4 space-y-2 text-sm">
                  <Line label="Base Price" value={breakdown?.baseCharge} />
                  <Line label="Camera Total" value={breakdown?.cameraTotal} />
                  <Line label="Wire Total" value={breakdown?.wireTotal} />
                  <Line label="Addon Total" value={breakdown?.addonsTotal} />
                  <Line label="Tax" value={breakdown?.taxTotal} />
                  <div className="flex items-center justify-between border-t border-slate-200 pt-3 text-lg font-bold text-slate-950">
                    <span>Grand Total</span>
                    <span>{money(breakdown?.grandTotal)}</span>
                  </div>
                </div>
              )}
            </aside>
          </div>
          <div className="flex flex-col gap-2 border-t border-slate-200 pt-4 sm:flex-row sm:justify-end">
            <Button variant="outline" onClick={addToCart} disabled={!price}><ShoppingCart className="h-4 w-4" /> Add To Cart</Button>
            <Button className="bg-emerald-600 text-white hover:bg-emerald-700" onClick={continueBooking} disabled={!price}><CalendarCheck className="h-4 w-4" /> Continue Booking</Button>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={miniCartOpen} onOpenChange={setMiniCartOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Added to Cart</DialogTitle>
            <DialogDescription>{service.name} has been added with the selected configuration.</DialogDescription>
          </DialogHeader>
          <div className="rounded-md bg-slate-50 p-4 text-sm">
            <Line label="Grand Total" value={breakdown?.grandTotal} />
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            <Button variant="outline" onClick={() => setMiniCartOpen(false)}>Continue Browsing</Button>
            <Button className="bg-emerald-600 text-white hover:bg-emerald-700" onClick={() => router.push("/cart")}>View Cart</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

function Line({ label, value }: { label: string; value?: number }) {
  return <div className="flex items-center justify-between"><span className="text-slate-600">{label}</span><span className="font-semibold text-slate-900">{money(value)}</span></div>;
}
