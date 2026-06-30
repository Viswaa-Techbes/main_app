"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Trash2, Edit3, Info, AlertTriangle, ArrowLeft, ShoppingBag, Plus, Minus, Tag, Check, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CctvCartItem, getCctvCart, removeCctvCartItem, clearCctvCart } from "@/lib/cctv-cart";
import { CctvSubcategory } from "@/lib/cctv-api";
import { fetchSubcategoryDetail } from "@/lib/catalog-api";
import { ServiceBookingConfigModal } from "@/components/booking/service-config-modal";
import { getRecommendedServices, services } from "@/lib/marketplace-data";

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

  // Coupon state
  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState("");

  const reload = () => setItems(getCctvCart());

  useEffect(() => {
    reload();
    window.addEventListener("cctv-cart-updated", reload);
    return () => window.removeEventListener("cctv-cart-updated", reload);
  }, []);

  const subtotal = items.reduce((sum, item) => sum + ((item.price?.priceBreakdown?.grandTotal) || 0), 0);
  const gstAmount = Math.round(subtotal * 0.18); // 18% GST
  const discount = couponApplied ? Math.round(subtotal * 0.10) : 0; // 10% Coupon Discount
  const grandTotal = subtotal + gstAmount - discount;

  const recommendedServices = services.slice(0, 3); // curate 3 recommended services

  async function handleEditClick(item: CctvCartItem) {
    try {
      setLoadingService(true);
      const serviceData = await fetchSubcategoryDetail(item.serviceSlug);
      setEditService(serviceData as any);
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

  function applyCoupon() {
    setCouponError("");
    if (couponCode.trim().toUpperCase() === "TECHBES10") {
      setCouponApplied(true);
    } else {
      setCouponError("Invalid coupon code. Try TECHBES10");
    }
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 bg-slate-50/30 space-y-8">
      
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
        <Link href="/" className="hover:text-blue-600">Home</Link>
        <ChevronRight className="h-3 w-3" />
        <Link href="/services" className="hover:text-blue-600">Services</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-slate-600">Cart</span>
      </nav>

      {/* Back to Shopping CTA */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Button asChild variant="ghost" className="self-start text-xs font-bold text-slate-500 hover:text-blue-600 transition">
          <Link href="/services">
            <ArrowLeft className="mr-1.5 h-4 w-4" /> Continue Shopping
          </Link>
        </Button>
        {items.length > 0 && (
          <Button variant="outline" className="h-9 rounded-xl border-rose-100 text-rose-600 hover:bg-rose-50 hover:text-rose-700 text-xs font-bold" onClick={() => setClearCartConfirmOpen(true)}>
            Clear Cart
          </Button>
        )}
      </div>

      {!items.length ? (
        /* Empty Cart State */
        <div className="space-y-12">
          <div className="rounded-3xl border border-slate-100 bg-white p-12 text-center flex flex-col items-center max-w-xl mx-auto shadow-sm">
            <div className="rounded-full bg-blue-50 p-5 text-blue-600 w-fit border border-blue-50">
              <ShoppingBag className="h-8 w-8" />
            </div>
            <h1 className="mt-5 text-lg font-bold text-slate-900">Your Cart is Empty</h1>
            <p className="mt-2 text-xs text-slate-400 font-semibold max-w-xs leading-relaxed">
              Explore our verified IT, CCTV, networking, and support catalog to configure and book certified technicians.
            </p>
            <Button className="mt-6 h-10 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-6 shadow-sm" asChild>
              <Link href="/services">Browse CCTV Services</Link>
            </Button>
          </div>

          {/* Recommended/Frequently Booked Carousels */}
          <div className="space-y-6">
            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider text-center">Frequently Booked Solutions</h2>
            <div className="grid gap-6 md:grid-cols-3">
              {recommendedServices.map((service) => (
                <Link 
                  key={service.slug} 
                  href={`/services/${service.slug}`} 
                  className="group rounded-2xl border border-slate-100 bg-white p-4.5 transition-all duration-300 hover:-translate-y-1 hover:border-blue-100 hover:shadow-sm flex gap-4 items-center"
                >
                  <div className="relative h-14 w-14 rounded-xl overflow-hidden bg-slate-50 shrink-0 border border-slate-100">
                    <Image src={service.image || "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=200&auto=format&fit=crop&q=80"} alt={service.title} fill className="object-cover" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-1">{service.title}</h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-wider">{service.category}</p>
                    <p className="text-[11px] font-black text-slate-800 mt-1">{service.price}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Cart Items Available */
        <div className="grid gap-6 lg:grid-cols-[1fr,360px]">
          {/* Cart items list */}
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex gap-4">
                    {/* Placeholder visual image based on CCTV or default */}
                    <div className="relative h-16 w-16 rounded-xl overflow-hidden bg-slate-50 border border-slate-100 shrink-0">
                      <Image 
                        src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=200&auto=format&fit=crop&q=80" 
                        alt={item.serviceName} 
                        fill 
                        className="object-cover" 
                      />
                    </div>
                    <div>
                      <h2 className="font-bold text-slate-800 text-xs uppercase tracking-wider">{item.serviceName}</h2>
                      {item.categoryId === "cctv" ? (
                        <p className="mt-1.5 text-xs font-semibold text-slate-400">
                          {item.price?.cameraType?.name || 'Camera'} • {item.price?.cameraCount || 0} camera(s) • {item.price?.installationArea || '—'}
                        </p>
                      ) : (
                        <p className="mt-1.5 text-xs font-semibold text-slate-400">
                          {item.price?.cameraType?.name || 'Standard Service'}
                        </p>
                      )}
                      <p className="mt-1 text-[11px] text-slate-400 font-semibold leading-relaxed">
                        Add-ons: {(item.price?.addons && item.price.addons.length) ? item.price.addons.map((a) => `${a.name} (x${a.quantity || 1})`).join(", ") : "None"}
                      </p>
                    </div>
                  </div>
                  
                  {/* Action buttons */}
                  <div className="flex items-center gap-1 shrink-0">
                    <Button aria-label="View details" variant="ghost" className="h-8 w-8 p-0 rounded-lg text-slate-400 hover:text-slate-800" onClick={() => setViewDetailsItem(item)}>
                      <Info className="h-4 w-4" />
                    </Button>
                    <Button aria-label="Edit configuration" variant="ghost" className="h-8 w-8 p-0 rounded-lg text-slate-400 hover:text-slate-800" disabled={loadingService} onClick={() => handleEditClick(item)}>
                      <Edit3 className="h-4 w-4" />
                    </Button>
                    <Button aria-label="Remove item" variant="ghost" className="h-8 w-8 p-0 rounded-lg text-rose-500 hover:text-rose-700" onClick={() => setDeleteConfirmItem(item)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-slate-50 pt-3 text-[11px] font-semibold text-slate-500">
                  <span>Scheduled Visit: <strong className="text-slate-700">{item.input?.date || "No date selected"}</strong> at <strong className="text-slate-700">{item.input?.time || "No slot selected"}</strong></span>
                  <div className="text-xs font-black text-slate-800">{money(item.price?.priceBreakdown?.grandTotal)}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Checkout summary panel */}
          <aside className="lg:self-start space-y-4">
            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm space-y-4">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 pb-3 border-b border-slate-50">Order Summary</h2>
              
              {/* Coupon inputs */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Promo Code</label>
                <div className="flex gap-2">
                  <Input 
                    type="text" 
                    placeholder="e.g. TECHBES10" 
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="h-9 rounded-xl border-slate-200 bg-slate-50 text-xs focus:ring-blue-500/20"
                    disabled={couponApplied}
                  />
                  <Button 
                    type="button" 
                    onClick={applyCoupon} 
                    disabled={couponApplied || !couponCode}
                    className="h-9 rounded-xl bg-slate-900 hover:bg-slate-850 text-white text-xs font-bold px-4 shadow-sm"
                  >
                    {couponApplied ? <Check className="h-4 w-4" /> : "Apply"}
                  </Button>
                </div>
                {couponError && <p className="text-[10px] font-semibold text-rose-600 mt-1">{couponError}</p>}
                {couponApplied && <p className="text-[10px] font-semibold text-emerald-600 mt-1">10% Promo Discount Applied!</p>}
              </div>

              {/* Detailed Breakdown */}
              <div className="space-y-2.5 text-xs font-semibold text-slate-500 pt-2 border-t border-slate-50">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-slate-800">{money(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>GST (18% Service Tax)</span>
                  <span className="text-slate-800">{money(gstAmount)}</span>
                </div>
                {couponApplied && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Coupon Discount</span>
                    <span>-{money(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between pt-3 border-t border-slate-100 text-slate-800 font-extrabold">
                  <span>Grand Total</span>
                  <span className="text-blue-600 font-black text-sm">{money(grandTotal)}</span>
                </div>
              </div>

              <Button className="w-full h-10 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold mt-2 shadow-sm" asChild>
                <Link href="/checkout">Proceed to Checkout</Link>
              </Button>
            </div>
          </aside>
        </div>
      )}

      {/* 1. Item Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmItem !== null} onOpenChange={(open) => !open && setDeleteConfirmItem(null)}>
        <DialogContent className="rounded-2xl border border-slate-100">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-rose-600 text-base font-bold">
              <AlertTriangle className="h-5 w-5" /> Remove Configuration?
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-400 leading-relaxed">
              Are you sure you want to remove <strong>{deleteConfirmItem?.serviceName}</strong> from your cart? You will lose all custom wire and equipment specifications.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 flex justify-end gap-2 text-xs">
            <Button variant="outline" className="rounded-xl h-9 text-xs font-bold" onClick={() => setDeleteConfirmItem(null)}>Cancel</Button>
            <Button className="bg-rose-600 text-white hover:bg-rose-700 rounded-xl h-9 text-xs font-bold px-4" onClick={handleConfirmDelete}>Remove Item</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 2. Clear Cart Confirmation Dialog */}
      <Dialog open={clearCartConfirmOpen} onOpenChange={setClearCartConfirmOpen}>
        <DialogContent className="rounded-2xl border border-slate-100">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-rose-600 text-base font-bold">
              <AlertTriangle className="h-5 w-5" /> Clear Cart?
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-400 leading-relaxed">
              Are you sure you want to clear your cart? All configured CCTV and networking specifications will be permanently removed.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 flex justify-end gap-2 text-xs">
            <Button variant="outline" className="rounded-xl h-9 text-xs font-bold" onClick={() => setClearCartConfirmOpen(false)}>Cancel</Button>
            <Button className="bg-rose-600 text-white hover:bg-rose-700 rounded-xl h-9 text-xs font-bold px-4" onClick={handleConfirmClear}>Yes, Clear Cart</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 3. View Details Dialog */}
      <Dialog open={viewDetailsItem !== null} onOpenChange={(open) => !open && setViewDetailsItem(null)}>
        <DialogContent className="max-w-xl rounded-2xl border border-slate-100">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-slate-800">Configuration Details</DialogTitle>
            <DialogDescription className="text-xs text-slate-400">{viewDetailsItem?.serviceName}</DialogDescription>
          </DialogHeader>
          {viewDetailsItem && (
            <div className="mt-3 space-y-4 text-xs text-slate-600 font-semibold leading-relaxed">
              <div className="grid grid-cols-2 gap-2.5 rounded-xl bg-slate-50 p-4 border border-slate-100/50">
                <div><strong>Service Type:</strong></div>
                <div className="text-slate-800 capitalize">{viewDetailsItem.input?.serviceType}</div>
                {viewDetailsItem.categoryId === "cctv" && (
                  <>
                    <div><strong>Camera Model:</strong></div>
                    <div className="text-slate-800">{viewDetailsItem.price?.cameraType?.name} (Count: {viewDetailsItem.price?.cameraCount})</div>
                    <div><strong>Installation Area:</strong></div>
                    <div className="text-slate-800 capitalize">{viewDetailsItem.price?.installationArea}</div>
                    <div><strong>Cable Spec:</strong></div>
                    <div className="text-slate-800">{viewDetailsItem.price?.wireLength} meters</div>
                  </>
                )}
              </div>

              <div>
                <strong className="block mb-2 text-slate-700">Materials Selected:</strong>
                {viewDetailsItem.input?.materials?.length ? (
                  <div className="border border-slate-100 rounded-xl divide-y divide-slate-100 max-h-48 overflow-y-auto bg-slate-50/30">
                    {viewDetailsItem.input.materials.map((m: any) => (
                      <div key={m.id} className="flex justify-between px-3 py-2">
                        <span>{m.name} (x{m.qty} {m.unit})</span>
                        <span className="font-bold text-slate-800">₹{m.total}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-400 italic">No extra materials selected.</p>
                )}
              </div>

              <div className="border-t border-slate-100 pt-3">
                <div className="grid grid-cols-2 gap-y-1.5 text-xs">
                  <div>Base Labour Cost:</div>
                  <div className="text-right text-slate-800 font-bold">{money(viewDetailsItem.price?.priceBreakdown?.serviceCost)}</div>
                  <div>Cabling Work Cost:</div>
                  <div className="text-right text-slate-800 font-bold">{money(viewDetailsItem.price?.priceBreakdown?.labourCost)}</div>
                  <div>Material Cost:</div>
                  <div className="text-right text-slate-800 font-bold">{money(viewDetailsItem.price?.priceBreakdown?.materialCost)}</div>
                  <div className="text-xs font-black text-slate-800 mt-2 pt-2 border-t border-slate-100">Total Billed:</div>
                  <div className="text-xs font-black text-blue-600 text-right mt-2 pt-2 border-t border-slate-100">{money(viewDetailsItem.price?.priceBreakdown?.grandTotal)}</div>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-3 space-y-1.5 text-[10px] text-slate-400">
                <div><strong>Coordinates Link:</strong> <a href={viewDetailsItem.input?.mapLink} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline break-all">{viewDetailsItem.input?.mapLink || "None"}</a></div>
                <div><strong>Notes:</strong> {viewDetailsItem.input?.notes || "None"}</div>
              </div>
            </div>
          )}
          <div className="mt-4 flex justify-end">
            <Button className="rounded-xl h-9 text-xs font-bold" onClick={() => setViewDetailsItem(null)}>Close</Button>
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
