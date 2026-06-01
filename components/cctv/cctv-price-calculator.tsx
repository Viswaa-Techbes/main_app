"use client";

import { useEffect, useMemo, useState } from "react";
import { ShoppingCart, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cctvApi, CctvAddon, CctvCameraType, CctvPriceResult, CctvSubcategory } from "@/lib/cctv-api";
import { addCctvCartItem } from "@/lib/cctv-cart";

function money(value?: number) {
  return `Rs. ${Math.round(value || 0).toLocaleString("en-IN")}`;
}

export function CctvPriceCalculator({ service }: { service: CctvSubcategory }) {
  const [cameraTypes, setCameraTypes] = useState<CctvCameraType[]>([]);
  const [addons, setAddons] = useState<CctvAddon[]>([]);
  const [cameraTypeId, setCameraTypeId] = useState("");
  const [cameraCount, setCameraCount] = useState(1);
  const [installationArea, setInstallationArea] = useState<"indoor" | "outdoor">("indoor");
  const [wireLength, setWireLength] = useState(10);
  const [addonIds, setAddonIds] = useState<string[]>([]);
  const [price, setPrice] = useState<CctvPriceResult | null>(null);
  const [loading, setLoading] = useState(false);
  const categoryId = typeof service.categoryId === "string" ? service.categoryId : service.categoryId?._id;

  useEffect(() => {
    Promise.all([cctvApi.cameraTypes(), cctvApi.addons()]).then(([types, addonList]) => {
      setCameraTypes(types);
      setAddons(addonList);
      setCameraTypeId(types[0]?._id || "");
    });
  }, []);

  const input = useMemo(() => ({
    categoryId,
    subcategoryId: service._id,
    cameraTypeId,
    cameraCount,
    installationArea,
    wireLength,
    addonIds,
  }), [addonIds, cameraCount, cameraTypeId, categoryId, installationArea, service._id, wireLength]);

  useEffect(() => {
    if (!cameraTypeId) return;
    let ignore = false;
    setLoading(true);
    cctvApi.calculate(input)
      .then((result) => { if (!ignore) setPrice(result); })
      .catch(() => { if (!ignore) setPrice(null); })
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
        <label className="grid gap-1 text-sm font-medium text-slate-700">
          Camera type
          <select className="h-10 rounded-md border border-slate-300 px-3" value={cameraTypeId} onChange={(e) => setCameraTypeId(e.target.value)}>
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
    </div>
  );
}

function Line({ label, value }: { label: string; value?: number }) {
  return <div className="flex items-center justify-between"><span className="text-slate-600">{label}</span><span className="font-semibold text-slate-900">{money(value)}</span></div>;
}
