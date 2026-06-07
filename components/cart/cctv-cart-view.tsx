"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Trash2, Edit3, Info, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CctvCartItem, getCctvCart, removeCctvCartItem, clearCctvCart } from "@/lib/cctv-cart";
import { cctvApi, CctvSubcategory } from "@/lib/cctv-api";
import { ServiceBookingConfigModal } from "@/components/booking/service-config-modal";

function money(value?: number) {
  return `Rs. ${Math.round(value || 0).toLocaleString("en-IN")}`;
}

export function CctvCartView() {
  const [items, setItems] = useState<CctvCartItem[]>([]);
  
  // Modals & Popups States
  const [deleteConfirmItem, setDeleteConfirmItem] = useState<CctvCartItem | null>(null);
  const [clearCartConfirmOpen, setClearCartConfirmOpen] = useState(false);
  const [viewDetailsItem, setViewDetailsItem] = useState<CctvCartItem | null>(null);
  
  // Editing states
  const [editingItem, setEditingItem] = useState<CctvCartItem | null>(null);
  const [editService, setEditService] = useState<CctvSubcategory | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [loadingService, setLoadingService] = useState(false);

  const reload = () => setItems(getCctvCart());

  useEffect(() => {
    reload();
    window.addEventListener("cctv-cart-updated", reload);
    return () => window.removeEventListener("cctv-cart-updated", reload);
  }, []);

  const total = items.reduce((sum, item) => sum + ((item.price?.priceBreakdown?.grandTotal) || 0), 0);

  async function handleEditClick(item: CctvCartItem) {
    try {
      setLoadingService(true);
      const serviceData = await cctvApi.subcategory(item.serviceSlug);
      setEditService(serviceData);
      setEditingItem(item);
      setEditModalOpen(true);
    } catch (err) {
      console.error("Failed to load service config for editing", err);
      alert("Unable to edit configuration at this moment.");
    } finally {
      setLoadingService(false);
    }
  }

  function handleConfirmDelete() {
    if (deleteConfirmItem) {
      removeCctvCartItem(deleteConfirmItem.id);
      setDeleteConfirmItem(null);
      reload();
    }
  }

  function handleConfirmClear() {
    clearCctvCart();
    setClearCartConfirmOpen(false);
    reload();
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-slate-950">Cart</h1>
          <p className="mt-2 text-sm text-slate-600">Review and configure your CCTV service selections.</p>
        </div>
        <div className="flex items-center gap-3">
          {items.length > 0 && (
            <Button variant="outline" className="border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700" onClick={() => setClearCartConfirmOpen(true)}>
              Clear Cart
            </Button>
          )}
          <Link href="/services?category=cctv" className="text-sm font-semibold text-emerald-700 hover:text-emerald-800">Add more services</Link>
        </div>
      </div>

      {!items.length ? (
        <div className="rounded-lg border border-slate-200 bg-white p-8 text-center">
          <p className="text-slate-600">Your cart is empty.</p>
          <Button className="mt-4 bg-emerald-600 text-white" asChild><Link href="/services?category=cctv">Browse CCTV Services</Link></Button>
        </div>
      ) : (
        <div className="grid gap-5 lg:grid-cols-[1fr,320px]">
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.id} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="font-semibold text-slate-950 text-lg">{item.serviceName}</h2>
                    {item.categoryId === "cctv" ? (
                      <p className="mt-1 text-sm text-slate-600">
                        {item.price?.cameraType?.name || 'Camera'} • {item.price?.cameraCount || 0} camera(s) • {item.price?.installationArea || '—'} • {item.price?.wireLength ?? 0}m wire
                      </p>
                    ) : (
                      <p className="mt-1 text-sm text-slate-600">
                        {item.price?.cameraType?.name || 'Standard Service'}
                      </p>
                    )}
                    <p className="mt-2 text-sm text-slate-500">Add-ons / Options: {(item.price?.addons && item.price.addons.length) ? item.price.addons.map((a) => `${a.name} (x${a.quantity || 1})`).join(", ") : "None"}</p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button aria-label="View details" variant="outline" size="icon" onClick={() => setViewDetailsItem(item)}>
                      <Info className="h-4 w-4" />
                    </Button>
                    <Button aria-label="Edit configuration" variant="outline" size="icon" disabled={loadingService} onClick={() => handleEditClick(item)}>
                      <Edit3 className="h-4 w-4" />
                    </Button>
                    <Button aria-label="Remove item" variant="outline" size="icon" className="text-rose-600 hover:bg-rose-50 hover:text-rose-700 border-rose-200" onClick={() => setDeleteConfirmItem(item)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                  <span className="text-sm text-slate-500">Scheduled: {item.input?.date || "No date"} at {item.input?.time || "No time"}</span>
                  <div className="text-lg font-bold text-slate-950">{money(item.price?.priceBreakdown?.grandTotal)}</div>
                </div>
              </div>
            ))}
          </div>
          <aside className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm lg:self-start">
            <h2 className="text-lg font-semibold text-slate-950">Order Summary</h2>
            <div className="mt-4 flex justify-between text-sm"><span>Items</span><span>{items.length}</span></div>
            <div className="mt-3 flex justify-between border-t border-slate-200 pt-3 text-lg font-bold"><span>Total</span><span>{money(total)}</span></div>
            <Button className="mt-5 w-full bg-emerald-600 text-white hover:bg-emerald-700" asChild><Link href="/checkout">Checkout</Link></Button>
          </aside>
        </div>
      )}

      {/* 1. Item Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmItem !== null} onOpenChange={(open) => !open && setDeleteConfirmItem(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-rose-600">
              <AlertTriangle className="h-5 w-5" /> Confirm Deletion
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to remove <strong>{deleteConfirmItem?.serviceName}</strong> from your cart? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 flex justify-end gap-3">
            <Button variant="outline" onClick={() => setDeleteConfirmItem(null)}>Cancel</Button>
            <Button className="bg-rose-600 text-white hover:bg-rose-700" onClick={handleConfirmDelete}>Remove Item</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 2. Clear Cart Confirmation Dialog */}
      <Dialog open={clearCartConfirmOpen} onOpenChange={setClearCartConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-rose-600">
              <AlertTriangle className="h-5 w-5" /> Clear All Cart Items?
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to clear your cart? All configured services will be permanently removed.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 flex justify-end gap-3">
            <Button variant="outline" onClick={() => setClearCartConfirmOpen(false)}>Cancel</Button>
            <Button className="bg-rose-600 text-white hover:bg-rose-700" onClick={handleConfirmClear}>Yes, Clear Cart</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 3. View Details Dialog */}
      <Dialog open={viewDetailsItem !== null} onOpenChange={(open) => !open && setViewDetailsItem(null)}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Configuration Details</DialogTitle>
            <DialogDescription>{viewDetailsItem?.serviceName}</DialogDescription>
          </DialogHeader>
          {viewDetailsItem && (
            <div className="mt-3 space-y-4 text-sm text-slate-700">
              <div className="grid grid-cols-2 gap-2 rounded-lg bg-slate-50 p-3">
                <div><strong>Service Type:</strong></div>
                <div>{viewDetailsItem.input?.serviceType}</div>
                {viewDetailsItem.categoryId === "cctv" && (
                  <>
                    <div><strong>Camera Model:</strong></div>
                    <div>{viewDetailsItem.price?.cameraType?.name} (Count: {viewDetailsItem.price?.cameraCount})</div>
                    <div><strong>Area Type:</strong></div>
                    <div className="capitalize">{viewDetailsItem.price?.installationArea}</div>
                    <div><strong>Cabling length:</strong></div>
                    <div>{viewDetailsItem.price?.wireLength} meters</div>
                  </>
                )}
              </div>

              <div>
                <strong className="block mb-1">Materials Selected:</strong>
                {viewDetailsItem.input?.materials?.length ? (
                  <div className="border border-slate-200 rounded-md divide-y divide-slate-100 max-h-48 overflow-y-auto">
                    {viewDetailsItem.input.materials.map((m: any) => (
                      <div key={m.id} className="flex justify-between px-3 py-1.5 text-xs">
                        <span>{m.name} (×{m.qty} {m.unit})</span>
                        <span className="font-semibold">₹{m.total}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500 text-xs">No extra materials selected.</p>
                )}
              </div>

              <div className="border-t pt-3">
                <div className="grid grid-cols-2 gap-y-1 text-xs text-slate-500">
                  <div>Service Base Labour:</div>
                  <div className="text-right font-medium text-slate-900">{money(viewDetailsItem.price?.priceBreakdown?.serviceCost)}</div>
                  <div>Additional Cabling Labour:</div>
                  <div className="text-right font-medium text-slate-900">{money(viewDetailsItem.price?.priceBreakdown?.labourCost)}</div>
                  <div>Material Cost:</div>
                  <div className="text-right font-medium text-slate-900">{money(viewDetailsItem.price?.priceBreakdown?.materialCost)}</div>
                  <div className="text-sm font-bold text-slate-900 mt-2">Grand Total:</div>
                  <div className="text-sm font-bold text-slate-900 text-right mt-2">{money(viewDetailsItem.price?.priceBreakdown?.grandTotal)}</div>
                </div>
              </div>

              <div className="border-t pt-3 space-y-2 text-xs">
                <div><strong>Google Map Link:</strong> <a href={viewDetailsItem.input?.mapLink} target="_blank" rel="noreferrer" className="text-blue-600 underline break-all">{viewDetailsItem.input?.mapLink || "None"}</a></div>
                <div><strong>Scheduled slot:</strong> {viewDetailsItem.input?.date} at {viewDetailsItem.input?.time}</div>
                <div><strong>Special Notes:</strong> {viewDetailsItem.input?.notes || "None"}</div>
              </div>
            </div>
          )}
          <div className="mt-4 flex justify-end">
            <Button onClick={() => setViewDetailsItem(null)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 4. Edit Configuration Config Modal */}
      {editService && (
        <ServiceBookingConfigModal
          open={editModalOpen}
          onOpenChange={setEditModalOpen}
          service={editService}
          editItem={editingItem}
        />
      )}
    </main>
  );
}
