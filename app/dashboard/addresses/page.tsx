"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Home,
  Briefcase,
  MoreHorizontal,
  ArrowLeft,
  AlertTriangle,
  RefreshCw,
  MapPin,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { InlineAlert } from "@/shared/components/feedback/inline-alert";
import { PageStatus } from "@/shared/components/feedback/page-status";
import { fetchAuthApi } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/features/auth/context/auth-context";

import dynamic from "next/dynamic";
const LocationPicker = dynamic(() => import("@/components/booking/LocationPicker"), {
  ssr: false,
  loading: () => (
    <div className="h-64 flex items-center justify-center bg-slate-50 rounded-2xl text-xs text-slate-400 font-semibold border border-slate-200">
      Loading map...
    </div>
  ),
});

export default function AddressesPage() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [addresses, setAddresses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAddr, setEditingAddr] = useState<any | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form states matching simplified requirements
  const [form, setForm] = useState({
    label: "Home",
    addressType: "Home",
    name: "",
    mobile: "",
    fullAddress: "",
    address: "",
    area: "",
    landmark: "",
    city: "Bangalore",
    state: "Karnataka",
    pincode: "",
    latitude: 0,
    longitude: 0,
    manualNotes: "",
    additionalInstructions: "",
    isDefault: false,
  });

  const loadAddresses = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetchAuthApi("/api/v2/user/addresses");
      if (res && res.success) {
        setAddresses(Array.isArray(res.data) ? res.data : []);
        setError("");
      } else {
        setError(res?.message || "Failed to load addresses.");
      }
    } catch (err: any) {
      console.error("Addresses load error:", err);
      setError(err.message || "Failed to load addresses. Please check your network and retry.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAddresses();
  }, []);

  function handleOpenAdd() {
    setEditingAddr(null);
    setForm({
      label: "Home",
      addressType: "Home",
      name: user?.name || "",
      mobile: user?.mobileNumber || user?.phone || "",
      fullAddress: "",
      address: "",
      area: "",
      landmark: "",
      city: "Bangalore",
      state: "Karnataka",
      pincode: "",
      latitude: 12.9716,
      longitude: 77.5946,
      manualNotes: "",
      additionalInstructions: "",
      isDefault: addresses.length === 0,
    });
    setModalOpen(true);
  }

  function handleOpenEdit(addr: any) {
    setEditingAddr(addr);
    const resolvedType = addr.label || addr.addressType || "Home";
    const resolvedAddress = addr.address || addr.fullAddress || addr.formattedAddress || [addr.addressLine1, addr.addressLine2].filter(Boolean).join(", ");
    setForm({
      label: resolvedType,
      addressType: resolvedType,
      name: addr.name || user?.name || "",
      mobile: addr.mobile || user?.mobileNumber || "",
      fullAddress: resolvedAddress,
      address: resolvedAddress,
      area: addr.area || "",
      landmark: addr.landmark || "",
      city: addr.city || "Bangalore",
      state: addr.state || "Karnataka",
      pincode: addr.pincode || "",
      latitude: addr.latitude || 12.9716,
      longitude: addr.longitude || 77.5946,
      manualNotes: addr.manualNotes || addr.deliveryInstructions || "",
      additionalInstructions: addr.manualNotes || addr.deliveryInstructions || "",
      isDefault: !!addr.isDefault,
    });
    setModalOpen(true);
  }

  function handleLocationSelected(data: any) {
    setForm((prev) => ({
      ...prev,
      label: data.addressType || data.label || prev.label,
      addressType: data.addressType || data.label || prev.addressType,
      fullAddress: data.fullAddress || data.address || prev.fullAddress,
      address: data.fullAddress || data.address || prev.address,
      area: data.area || prev.area,
      landmark: data.landmark !== undefined ? data.landmark : prev.landmark,
      city: data.city || prev.city,
      state: data.state || prev.state,
      pincode: data.pincode || prev.pincode,
      latitude: data.latitude || prev.latitude,
      longitude: data.longitude || prev.longitude,
      manualNotes: data.additionalInstructions || data.manualNotes || prev.manualNotes,
      additionalInstructions: data.additionalInstructions || data.manualNotes || prev.additionalInstructions,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!form.fullAddress.trim() && !form.address.trim()) {
      toast({
        title: "Address Required",
        description: "Please enter your full address.",
        variant: "destructive",
      });
      return;
    }

    if (!form.latitude || !form.longitude) {
      toast({
        title: "Location Missing",
        description: "Please select your location on the map.",
        variant: "destructive",
      });
      return;
    }

    if (!form.pincode || form.pincode.length < 6) {
      toast({
        title: "Invalid Pincode",
        description: "Please enter a valid 6-digit pincode.",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    try {
      const isEdit = !!editingAddr;
      const url = isEdit
        ? `/api/v2/user/address/${editingAddr._id}`
        : "/api/v2/user/address";
      const method = isEdit ? "PUT" : "POST";

      const finalAddress = form.fullAddress.trim() || form.address.trim();
      const compiledFormatted = [
        finalAddress,
        form.area.trim(),
        form.landmark.trim() ? `Near ${form.landmark.trim()}` : "",
        `${form.city.trim() || "Bangalore"}${form.pincode.trim() ? ` - ${form.pincode.trim()}` : ""}`,
        form.state.trim() || "Karnataka",
      ]
        .filter(Boolean)
        .join(", ");

      const payload = {
        name: form.name.trim() || user?.name || "Customer",
        mobile: form.mobile.trim() || user?.mobileNumber || "",
        label: form.addressType || form.label || "Home",
        addressType: form.addressType || form.label || "Home",
        address: finalAddress,
        addressLine1: finalAddress,
        addressLine2: "",
        area: form.area.trim(),
        landmark: form.landmark.trim(),
        city: form.city.trim() || "Bangalore",
        state: form.state.trim() || "Karnataka",
        pincode: form.pincode.trim(),
        latitude: Number(form.latitude),
        longitude: Number(form.longitude),
        manualNotes: (form.additionalInstructions || form.manualNotes).trim(),
        formattedAddress: compiledFormatted,
        isDefault: form.isDefault,
        googleMapLink: `https://maps.google.com/?q=${form.latitude},${form.longitude}`,
      };

      const res = await fetchAuthApi(url, {
        method,
        body: JSON.stringify(payload),
      });

      if (!res.success) {
        throw new Error(res.message || "Failed to save address.");
      }

      setModalOpen(false);
      loadAddresses();
      toast({
        title: isEdit ? "Address Updated" : "Address Saved",
        description: isEdit
          ? "Your saved address has been updated."
          : "New address added successfully.",
      });
    } catch (err: any) {
      toast({
        title: "Save Failed",
        description: err.message || "Failed to save address.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  }

  async function handleSetDefault(addrId: string) {
    try {
      const res = await fetchAuthApi(`/api/v2/user/address/${addrId}`, {
        method: "PUT",
        body: JSON.stringify({ isDefault: true }),
      });
      if (!res.success) throw new Error(res.message || "Failed to update default status.");
      loadAddresses();
      toast({
        title: "Default Updated",
        description: "Your default installation address has been updated.",
      });
    } catch (err: any) {
      toast({
        title: "Update Failed",
        description: err.message || "Failed to update default address.",
        variant: "destructive",
      });
    }
  }

  async function handleDelete() {
    if (!deleteConfirmId) return;
    try {
      const res = await fetchAuthApi(`/api/v2/user/address/${deleteConfirmId}`, {
        method: "DELETE",
      });
      if (!res.success) throw new Error(res.message || "Failed to delete address.");
      setDeleteConfirmId(null);
      loadAddresses();
      toast({
        title: "Address Deleted",
        description: "Saved address has been removed successfully.",
      });
    } catch (err: any) {
      toast({
        title: "Delete Failed",
        description: err.message || "Failed to delete address.",
        variant: "destructive",
      });
    }
  }

  if (loading && !addresses.length && !error) {
    return <PageStatus message="Loading saved addresses..." className="min-h-[70vh]" />;
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button asChild variant="outline" size="icon" className="rounded-full shrink-0">
            <Link href="/dashboard">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-950">Saved Addresses</h1>
            <p className="text-xs sm:text-sm text-slate-600">
              Manage your installation locations for bookings and quotations.
            </p>
          </div>
        </div>
        <Button
          onClick={handleOpenAdd}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs"
        >
          <Plus className="mr-2 h-4 w-4" /> Add New Address
        </Button>
      </div>

      {/* Error Message with Retry Option */}
      {error && (
        <Card className="mb-6 border-rose-200 bg-rose-50/50">
          <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-rose-800 text-xs sm:text-sm">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={loadAddresses}
              className="border-rose-300 text-rose-700 hover:bg-rose-100/70 font-semibold shrink-0"
            >
              <RefreshCw className="mr-1.5 h-3.5 w-3.5" /> Retry
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {!loading && !error && addresses.length === 0 ? (
        <Card className="border-dashed border-slate-300 bg-white">
          <CardContent className="py-16 text-center text-slate-500">
            <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4">
              <MapPin className="h-8 w-8" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">No Saved Addresses Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mb-5 leading-relaxed">
              Add your home, office, or site address to streamline scheduling technician visits and service quotations.
            </p>
            <Button onClick={handleOpenAdd} className="bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl">
              <Plus className="mr-2 h-4 w-4" /> Add Your First Address
            </Button>
          </CardContent>
        </Card>
      ) : (
        /* Address Cards Grid */
        <div className="grid gap-4 sm:grid-cols-2">
          {addresses.map((addr) => {
            const type = addr.label || addr.addressType || "Home";
            const TypeIcon =
              type.toLowerCase() === "office"
                ? Briefcase
                : type.toLowerCase() === "other"
                ? MoreHorizontal
                : Home;

            return (
              <Card
                key={addr._id}
                className="relative overflow-hidden border-slate-200 bg-white shadow-xs hover:shadow-md transition rounded-2xl"
              >
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                          <TypeIcon className="h-3 w-3" />
                          {type}
                        </span>
                        {addr.isDefault && (
                          <span className="rounded-full bg-emerald-100 border border-emerald-200 px-2 py-0.5 text-[11px] font-bold text-emerald-800">
                            Default
                          </span>
                        )}
                      </div>

                      <div className="mt-3 text-xs text-slate-800 font-bold truncate">
                        {addr.name || "Customer"} {addr.mobile ? `• ${addr.mobile}` : ""}
                      </div>

                      <p className="mt-1 text-xs text-slate-700 font-medium line-clamp-2 leading-relaxed">
                        {addr.address || addr.fullAddress || [addr.addressLine1, addr.addressLine2].filter(Boolean).join(", ")}
                      </p>

                      <p className="text-[11px] text-slate-500 mt-1">
                        {[addr.area, addr.landmark ? `Near ${addr.landmark}` : "", addr.city, addr.state, addr.pincode]
                          .filter(Boolean)
                          .join(", ")}
                      </p>

                      {addr.manualNotes && (
                        <p className="text-[11px] text-slate-500 italic mt-1.5 bg-slate-50 p-2 rounded-lg border border-slate-100">
                          Note: {addr.manualNotes}
                        </p>
                      )}

                      {addr.latitude && addr.longitude && (
                        <span className="text-[10px] text-slate-400 mt-2 block font-mono">
                          📍 Pin: {Number(addr.latitude).toFixed(4)}, {Number(addr.longitude).toFixed(4)}
                        </span>
                      )}
                    </div>

                    <div className="flex gap-1 shrink-0">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 rounded-lg hover:bg-slate-100"
                        onClick={() => handleOpenEdit(addr)}
                      >
                        <Edit className="h-3.5 w-3.5 text-slate-600" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 rounded-lg text-rose-600 border-rose-200 hover:bg-rose-50"
                        onClick={() => setDeleteConfirmId(addr._id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>

                  {!addr.isDefault && (
                    <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-xs font-bold text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        onClick={() => handleSetDefault(addr._id)}
                      >
                        Set as Default Address
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Clean Address Dialog */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-2xl max-h-[92vh] overflow-y-auto rounded-3xl p-6 sm:p-7">
          <DialogHeader className="border-b border-slate-100 pb-3">
            <DialogTitle className="text-xl font-bold text-slate-900">
              {editingAddr ? "Edit Saved Address" : "Add New Address"}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Pin your location on the map and confirm address details below.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            {/* Contact Person Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700 block mb-1">
                  Contact Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rajesh Kumar"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700 block mb-1">
                  Contact Mobile <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="10-digit mobile number"
                  value={form.mobile}
                  onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                  className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>

            {/* Embedded LocationPicker: Interactive Map + Clean Simplified Address Form */}
            <LocationPicker
              initialCoords={
                form.latitude && form.longitude
                  ? { lat: form.latitude, lng: form.longitude }
                  : null
              }
              initialAddressData={{
                addressType: form.addressType,
                fullAddress: form.fullAddress || form.address,
                area: form.area,
                landmark: form.landmark,
                city: form.city,
                state: form.state,
                pincode: form.pincode,
                additionalInstructions: form.additionalInstructions || form.manualNotes,
              }}
              onLocationSelected={handleLocationSelected}
            />

            {/* Set as Default Checkbox */}
            <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
              <input
                type="checkbox"
                id="isDefaultCheckbox"
                checked={form.isDefault}
                onChange={(e) => setForm({ ...form, isDefault: e.target.checked })}
                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="isDefaultCheckbox" className="text-xs font-medium text-slate-700 cursor-pointer">
                Make this my default address for all future bookings
              </label>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
              <Button
                type="button"
                variant="outline"
                onClick={() => setModalOpen(false)}
                className="rounded-xl font-bold text-xs h-10 px-4"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={saving}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs h-10 px-6 rounded-xl shadow-xs"
              >
                {saving ? "Saving..." : editingAddr ? "Update Address" : "Save Address"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirmId !== null}
        onOpenChange={(open) => !open && setDeleteConfirmId(null)}
      >
        <DialogContent className="max-w-md rounded-3xl p-6">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-rose-600 text-lg font-bold">
              <AlertTriangle className="h-5 w-5" /> Delete Address
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500 mt-1">
              Are you sure you want to remove this saved address? Existing confirmed bookings will not be affected.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-5 flex justify-end gap-3">
            <Button
              variant="outline"
              className="rounded-xl font-bold text-xs"
              onClick={() => setDeleteConfirmId(null)}
            >
              Cancel
            </Button>
            <Button
              className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl"
              onClick={handleDelete}
            >
              Confirm Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
}
