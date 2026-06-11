"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Plus, Edit, Trash2, Home, ArrowLeft, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { InlineAlert } from "@/shared/components/feedback/inline-alert";
import { PageStatus } from "@/shared/components/feedback/page-status";

import dynamic from "next/dynamic";
const LocationPicker = dynamic(() => import("@/components/booking/LocationPicker"), { ssr: false });

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAddr, setEditingAddr] = useState<any | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form states
  const [form, setForm] = useState({
    label: "Home",
    name: "",
    mobile: "",
    address: "",
    landmark: "",
    city: "",
    state: "",
    pincode: "",
    latitude: 0,
    longitude: 0,
    isDefault: false,
  });

  const loadAddresses = () => {
    setLoading(true);
    fetch("/api/user/addresses")
      .then((r) => r.json())
      .then((json) => {
        if (json.success) {
          setAddresses(json.data || []);
          setError("");
        } else {
          setError(json.message || "Failed to load addresses.");
        }
      })
      .catch((err) => setError("Network error. Please try again."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadAddresses();
  }, []);

  function handleOpenAdd() {
    setEditingAddr(null);
    setForm({
      label: "Home",
      name: "",
      mobile: "",
      address: "",
      landmark: "",
      city: "",
      state: "",
      pincode: "",
      latitude: 0,
      longitude: 0,
      isDefault: false,
    });
    setModalOpen(true);
  }

  function handleOpenEdit(addr: any) {
    setEditingAddr(addr);
    setForm({
      label: addr.label || "Home",
      name: addr.name || "",
      mobile: addr.mobile || "",
      address: addr.address || [addr.addressLine1, addr.addressLine2].filter(Boolean).join(", "),
      landmark: addr.landmark || "",
      city: addr.city || "",
      state: addr.state || "",
      pincode: addr.pincode || "",
      latitude: addr.latitude || 0,
      longitude: addr.longitude || 0,
      isDefault: !!addr.isDefault,
    });
    setModalOpen(true);
  }

  function handleLocationSelected(data: {
    address: string;
    city: string;
    state: string;
    pincode: string;
    latitude: number;
    longitude: number;
  }) {
    setForm((prev) => ({
      ...prev,
      address: data.address,
      city: data.city,
      state: data.state,
      pincode: data.pincode,
      latitude: data.latitude,
      longitude: data.longitude,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.latitude || !form.longitude) {
      alert("Please locate your address on the map first.");
      return;
    }

    try {
      const isEdit = !!editingAddr;
      const url = isEdit ? `/api/user/address/${editingAddr._id}` : "/api/user/address";
      const method = isEdit ? "PUT" : "POST";
      
      // Sync label/lines for compatibility
      const payload = {
        ...form,
        addressLine1: form.address,
        addressLine2: "",
        googleMapLink: `https://maps.google.com/?q=${form.latitude},${form.longitude}`,
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      
      if (!res.ok) throw new Error(json.message || "Failed to save address.");
      
      setModalOpen(false);
      loadAddresses();
    } catch (err: any) {
      alert(err.message || "Failed to save address.");
    }
  }

  async function handleSetDefault(addrId: string) {
    try {
      const res = await fetch(`/api/user/address/${addrId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isDefault: true }),
      });
      if (!res.ok) throw new Error("Failed to update default status.");
      loadAddresses();
    } catch (err: any) {
      alert(err.message || "Failed to update default address.");
    }
  }

  async function handleDelete() {
    if (!deleteConfirmId) return;
    try {
      const res = await fetch(`/api/user/address/${deleteConfirmId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete address.");
      setDeleteConfirmId(null);
      loadAddresses();
    } catch (err: any) {
      alert(err.message || "Failed to delete address.");
    }
  }

  if (loading && !addresses.length) return <PageStatus message="Loading saved addresses..." className="min-h-[70vh]" />;

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button asChild variant="outline" size="icon" className="rounded-full">
            <Link href="/dashboard"><ArrowLeft className="h-4 w-4" /></Link>
          </Button>
          <div>
            <h1 className="text-3xl font-semibold text-slate-950">Manage Addresses</h1>
            <p className="text-sm text-slate-600">Add or edit installation locations for your bookings.</p>
          </div>
        </div>
        <Button onClick={handleOpenAdd} className="bg-emerald-600 text-white hover:bg-emerald-700">
          <Plus className="mr-2 h-4 w-4" /> Add Address
        </Button>
      </div>

      {error && <InlineAlert message={error} className="mb-4" />}

      {!addresses.length ? (
        <Card className="border-dashed border-slate-300">
          <CardContent className="py-12 text-center text-slate-500">
            <Home className="mx-auto h-12 w-12 text-slate-300 mb-3" />
            <p>No saved addresses found. Add a location to get started.</p>
            <Button onClick={handleOpenAdd} className="mt-4 bg-emerald-600 text-white">Add First Address</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {addresses.map((addr) => (
            <Card key={addr._id} className="relative overflow-hidden border-slate-200">
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-950 text-base">{addr.label}</span>
                      {addr.isDefault && (
                        <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                          Default
                        </span>
                      )}
                    </div>
                    <div className="mt-3 text-sm text-slate-700 font-medium">{addr.name} — {addr.mobile}</div>
                    <p className="mt-1 text-sm text-slate-600">{addr.address || [addr.addressLine1, addr.addressLine2].filter(Boolean).join(", ")}</p>
                    <p className="text-sm text-slate-500">{[addr.landmark, addr.city, addr.state, addr.pincode].filter(Boolean).join(", ")}</p>
                    {addr.latitude && addr.longitude && (
                      <span className="text-xs text-slate-400 mt-2 block">
                        Coordinates: {addr.latitude.toFixed(4)}, {addr.longitude.toFixed(4)}
                      </span>
                    )}
                  </div>
                  <div className="flex gap-1">
                    <Button variant="outline" size="icon" onClick={() => handleOpenEdit(addr)}><Edit className="h-4 w-4" /></Button>
                    <Button variant="outline" size="icon" className="text-rose-600 border-rose-200 hover:bg-rose-50" onClick={() => setDeleteConfirmId(addr._id)}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </div>
                {!addr.isDefault && (
                  <Button variant="outline" size="sm" className="mt-4" onClick={() => handleSetDefault(addr._id)}>
                    Set As Default
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Address Form Dialog */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-xl max-h-[92vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingAddr ? "Edit Address" : "Add Address"}</DialogTitle>
            <DialogDescription>Locate your address on the map and confirm details.</DialogDescription>
          </DialogHeader>
          
          <div className="mt-2 border-b border-slate-100 pb-4">
            <LocationPicker 
              onLocationSelected={handleLocationSelected}
              initialCoords={editingAddr ? { lat: form.latitude, lng: form.longitude } : null}
            />
          </div>

          <form onSubmit={handleSubmit} className="mt-3 space-y-3">
            <div>
              <label className="block text-sm font-medium text-slate-700">Label (e.g., Home, Office)</label>
              <input type="text" className="h-10 w-full rounded-md border border-slate-300 px-3 mt-1 text-sm bg-white" value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} required />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-slate-700">Name</label>
                <input type="text" className="h-10 w-full rounded-md border border-slate-300 px-3 mt-1 text-sm bg-white" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Mobile Number</label>
                <input type="tel" className="h-10 w-full rounded-md border border-slate-300 px-3 mt-1 text-sm bg-white" value={form.mobile} onChange={(e) => setForm({ ...form, mobile: e.target.value })} required />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Address Line</label>
              <textarea className="min-h-20 w-full rounded-md border border-slate-300 px-3 py-2 mt-1 text-sm bg-white" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} required />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-slate-700">Landmark</label>
                <input type="text" className="h-10 w-full rounded-md border border-slate-300 px-3 mt-1 text-sm bg-white" value={form.landmark} onChange={(e) => setForm({ ...form, landmark: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Pincode</label>
                <input type="text" className="h-10 w-full rounded-md border border-slate-300 px-3 mt-1 text-sm bg-white" value={form.pincode} onChange={(e) => setForm({ ...form, pincode: e.target.value })} required />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-slate-700">City</label>
                <input type="text" className="h-10 w-full rounded-md border border-slate-300 px-3 mt-1 text-sm bg-white" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">State</label>
                <input type="text" className="h-10 w-full rounded-md border border-slate-300 px-3 mt-1 text-sm bg-white" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} required />
              </div>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <input type="checkbox" checked={form.isDefault} id="isDefault" onChange={(e) => setForm({ ...form, isDefault: e.target.checked })} />
              <label htmlFor="isDefault" className="text-sm font-medium text-slate-700">Set as default address</label>
            </div>
            <Button className="w-full bg-emerald-600 text-white hover:bg-emerald-700 mt-4">Save Address</Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmId !== null} onOpenChange={(open) => !open && setDeleteConfirmId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-rose-600"><AlertTriangle className="h-5 w-5" /> Confirm Deletion</DialogTitle>
            <DialogDescription>Are you sure you want to delete this address? Any pending bookings to this address will not be affected.</DialogDescription>
          </DialogHeader>
          <div className="mt-4 flex justify-end gap-3">
            <Button variant="outline" onClick={() => setDeleteConfirmId(null)}>Cancel</Button>
            <Button className="bg-rose-600 text-white hover:bg-rose-700" onClick={handleDelete}>Delete</Button>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
}
