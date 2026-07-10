"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarCheck, FileText, ShoppingCart, Zap, ShieldAlert, CheckCircle2, Info, Loader2, Upload, MapPin, Check, Wallet } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cctvApi, CctvSubcategory } from "@/lib/cctv-api";
import { useToast } from "@/hooks/use-toast";
import dynamic from "next/dynamic";
import { fetchAuthApi } from "@/lib/api";
import { AUTH_TOKEN_STORAGE_KEY } from "@/core/api/config";

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
  }, [open, router, toast, pathname]);

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

  // Price calculations
  const prices = useMemo(() => {
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
    const discount = Math.round(baseTotal * (discountPercent / 100));
    const totalBeforeTax = baseTotal - discount;
    const gst = Math.round(totalBeforeTax * 0.18);
    const grandTotal = totalBeforeTax + gst;

    return { packageCost, visitCharge, labourCost, discount, gst, grandTotal };
  }, [service, selectedPackageId, discountPercent]);

  // Apply discount coupon code
  const handleApplyCoupon = () => {
    setCouponError("");
    setCouponSuccess("");
    const cleaned = couponCode.trim().toUpperCase();
    if (cleaned === "WELCOME10" || cleaned === "TECHBES10") {
      setDiscountPercent(10);
      setCouponSuccess("Coupon successfully applied! 10% Discount applied to your order.");
    } else {
      setDiscountPercent(0);
      setCouponError("Invalid coupon code. Try WELCOME10 or TECHBES10");
    }
  };

  // Step names list
  const stepsList = [
    { step: 1, label: "Choose Package" },
    { step: 2, label: "Details & Questions" },
    { step: 3, label: "Date & Time" },
    { step: 4, label: "Upload Images" },
    { step: 5, label: "Service Location" },
    { step: 6, label: "Review Estimate" },
    { step: 7, label: "Checkout & Pay" }
  ];

  const goNext = () => {
    if (step === 1 && service.packages && service.packages.length > 0 && !selectedPackageId) {
      toast({ title: "Required Choice", description: "Please select an installation or service package.", variant: "destructive" });
      return;
    }
    if (step === 2) {
      const questions = service.bookingQuestions || [];
      for (const q of questions) {
        if (q.required && !questionAnswers[q.question]) {
          toast({ title: "Incomplete Form", description: `${q.question} is required.`, variant: "destructive" });
          return;
        }
      }
    }
    if (step === 3 && (!date || !time)) {
      toast({ title: "Schedule Required", description: "Please pick both preferred date and time slot.", variant: "destructive" });
      return;
    }
    if (step === 5 && (!address || !latitude || !longitude)) {
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
      timeSlot: time,
      customerName,
      customerPhone,
      totalAmount: prices.grandTotal,
      serviceType: service.slug.includes("repair") ? "repair" : "installation",
      addressId: finalAddressId !== "new" && finalAddressId ? finalAddressId : undefined,
      latitude,
      longitude,
      city,
      state: stateName,
      pincode,
      bookingAnswers,
      uploadedImages,
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
        priceBreakdown: prices,
        notes
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
        // Cash on delivery (COD) flow
        const createdJob = await cctvApi.createBooking(payload);
        const jobId = createdJob._id || createdJob.id || createdJob.data?._id;

        toast({ title: "Booking Confirmed", description: "Booking confirmed. Cash on Delivery selected." });
        onOpenChange(false);
        router.push(`/dashboard/bookings/${jobId}`);
      }
    } catch (err: any) {
      toast({ title: "Booking Failed", description: err.message || "An unexpected checkout error occurred.", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[95vh] overflow-y-auto sm:max-w-5xl rounded-3xl p-6 bg-slate-50/50">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black text-slate-900">Book {service.name}</DialogTitle>
          <DialogDescription className="text-xs text-slate-500 font-semibold">
            Complete the form selection to request security camera installation & setup.
          </DialogDescription>
        </DialogHeader>

        {/* Stepper Progress Bar */}
        <div className="flex flex-wrap gap-1.5 pb-4 border-b border-slate-100 items-center">
          {stepsList.map((sDef) => (
            <div
              key={sDef.step}
              className={`rounded-full px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider transition ${
                step === sDef.step
                  ? "bg-blue-600 text-white shadow-sm shadow-blue-500/20"
                  : step > sDef.step
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                  : "bg-slate-100 text-slate-400"
              }`}
            >
              {sDef.step}. {sDef.label}
            </div>
          ))}
        </div>

        <div className="grid gap-6 mt-4 lg:grid-cols-[1fr,340px]">
          {/* Main Step Wizard Form */}
          <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm min-h-[350px] flex flex-col justify-between">
            <div>
              {/* Step 1: Package Selection */}
              {step === 1 && (
                <div className="space-y-4">
                  <div className="flex gap-2 items-start flex-col">
                    <h3 className="text-base font-black text-slate-800">Select a Service Package</h3>
                    <p className="text-xs text-slate-400 font-medium">Choose a setup tier optimized for your property</p>
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

              {/* Step 2: Dynamic Questions */}
              {step === 2 && (
                <div className="space-y-4">
                  <div className="flex gap-1 items-start flex-col">
                    <h3 className="text-base font-black text-slate-800">Job Specifications</h3>
                    <p className="text-xs text-slate-400 font-medium">Please answer the questions below to customize your estimate</p>
                  </div>
                  {(service.bookingQuestions || []).length > 0 ? (
                    <div className="space-y-4">
                      {service.bookingQuestions?.map((q: any, idx: number) => {
                        const val = questionAnswers[q.question] || "";
                        const inputId = `q-${idx}`;
                        return (
                          <div key={idx} className="space-y-2">
                            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
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

              {/* Step 3: Date & Time */}
              {step === 3 && (
                <div className="space-y-4">
                  <div className="flex gap-1 items-start flex-col">
                    <h3 className="text-base font-black text-slate-800">Schedule Service Slot</h3>
                    <p className="text-xs text-slate-400 font-medium">Select a date and technician arrival window</p>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="text-xs font-bold text-slate-700">Preferred Date</label>
                      <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="h-11 w-full rounded-xl border border-slate-200 px-3 mt-2 bg-slate-50 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700">Arrival Window</label>
                      <select
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        className="h-11 w-full rounded-xl border border-slate-200 px-3 mt-2 bg-slate-50 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      >
                        <option value="">Select slot...</option>
                        <option value="09:00 AM - 11:30 AM">09:00 AM - 11:30 AM</option>
                        <option value="11:30 AM - 02:00 PM">11:30 AM - 02:00 PM</option>
                        <option value="02:00 PM - 04:30 PM">02:00 PM - 04:30 PM</option>
                        <option value="04:30 PM - 07:00 PM">04:30 PM - 07:00 PM</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Site Images */}
              {step === 4 && (
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

              {/* Step 5: Location Picker */}
              {step === 5 && (
                <div className="space-y-4">
                  <div className="flex gap-1 items-start flex-col">
                    <h3 className="text-base font-black text-slate-800">Confirm Service Address</h3>
                    <p className="text-xs text-slate-400 font-medium">Pin your precise installation location on the map</p>
                  </div>

                  {savedAddresses.length > 0 && (
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Select Saved Location</label>
                      <select
                        value={selectedAddressId}
                        onChange={(e) => handleAddressChange(e.target.value)}
                        className="h-10 w-full rounded-xl border border-slate-200 px-3 bg-slate-50 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      >
                        <option value="" disabled>-- Select saved address --</option>
                        {savedAddresses.map((a) => (
                          <option key={a._id} value={a._id}>
                            {a.label} ({a.address || a.city})
                          </option>
                        ))}
                        <option value="new">-- Pin New Address --</option>
                      </select>
                    </div>
                  )}

                  <div className="rounded-2xl border border-slate-200/80 p-2 bg-white relative">
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
                        toast({ title: "Location Confirmed", description: "Pinned address successfully." });
                        goNext();
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

                  {address && (
                    <div className="rounded-xl bg-slate-50 p-3 text-xs border border-slate-100 leading-relaxed text-slate-600">
                      <strong>Pinned Address:</strong> {address}
                    </div>
                  )}
                </div>
              )}

              {/* Step 6: Review Price */}
              {step === 6 && (
                <div className="space-y-4">
                  <div className="flex gap-1 items-start flex-col">
                    <h3 className="text-base font-black text-slate-800">Verify Estimate Details</h3>
                    <p className="text-xs text-slate-400 font-medium">Review your service cost and apply promo codes</p>
                  </div>

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

                  {/* Coupon section */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700">Promo Code</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="WELCOME10"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        className="h-10 flex-1 rounded-xl border border-slate-200 px-3 bg-slate-50 text-xs font-bold focus:outline-none"
                      />
                      <Button size="sm" onClick={handleApplyCoupon} className="bg-slate-900 text-white font-bold h-10 px-4 rounded-xl text-xs">
                        Apply
                      </Button>
                    </div>
                    {couponError && <p className="text-[10px] text-rose-500 font-semibold">{couponError}</p>}
                    {couponSuccess && <p className="text-[10px] text-emerald-600 font-semibold">{couponSuccess}</p>}
                  </div>
                </div>
              )}

              {/* Step 7: Make Payment */}
              {step === 7 && (
                <div className="space-y-4">
                  <div className="flex gap-1 items-start flex-col">
                    <h3 className="text-base font-black text-slate-800">Choose Payment Option</h3>
                    <p className="text-xs text-slate-400 font-medium">Select a secure settlement method for the booking</p>
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
                        if (walletBalance !== null) {
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

                    {/* Cash on delivery */}
                    <label
                      onClick={() => setPaymentMethod("cod")}
                      className={`flex items-center gap-3.5 rounded-2xl border p-4 cursor-pointer transition ${
                        paymentMethod === "cod" ? "border-blue-600 bg-blue-50/10 ring-1 ring-blue-600" : "border-slate-200"
                      }`}
                    >
                      <input type="radio" checked={paymentMethod === "cod"} readOnly className="h-4 w-4 text-blue-600" />
                      <div className="text-xs">
                        <h4 className="font-bold text-slate-900">Cash on Delivery (COD)</h4>
                        <p className="text-slate-400 font-semibold mt-0.5">Pay standard service amount in cash to the technician upon completion.</p>
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
              {step < 7 ? (
                <Button size="sm" onClick={goNext} className="h-9 px-5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs">
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
              <h3 className="text-sm font-bold text-slate-800">Booking Summary</h3>
              <Zap className="h-4 w-4 text-emerald-600" />
            </div>

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

            <div className="mt-4 space-y-2.5 text-xs">
              <Line label="Base Cost" value={prices.packageCost} />
              <Line label="Visit Charge" value={prices.visitCharge} />
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
                Prices cover baseline technician service & travel fees. Spare components or additional camera lengths recommended on-site will be billed separately.
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
