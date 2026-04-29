"use client";

import { useState } from "react";

export interface BookingFlowState {
  address: string;
  date: string;
  timeSlot: string;
  coupon: string;
  customerName: string;
  customerPhone: string;
  description: string;
  bookingId: string | null;
}

const initialState: BookingFlowState = {
  address: "",
  date: "",
  timeSlot: "",
  coupon: "",
  customerName: "",
  customerPhone: "",
  description: "",
  bookingId: null,
};

const BACKEND_URL =
  typeof window !== "undefined"
    ? (process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000")
    : (process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000");

export function useBookingFlow() {
  const [step, setStep] = useState(1);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [state, setState] = useState<BookingFlowState>(initialState);

  function updateState(patch: Partial<BookingFlowState>) {
    setState((current) => ({ ...current, ...patch }));
  }

  function resetFlow() {
    setStep(1);
    setIsConfirmed(false);
    setIsSubmitting(false);
    setBookingError(null);
    setState(initialState);
  }

  function nextStep() {
    setStep((current) => Math.min(current + 1, 5));
  }

  function previousStep() {
    setStep((current) => Math.max(current - 1, 1));
  }

  async function confirm({
    serviceId,
    serviceName,
    advanceAmount,
  }: {
    serviceId: string;
    serviceName: string;
    advanceAmount: number;
  }) {
    setIsSubmitting(true);
    setBookingError(null);

    try {
      // 1. Load Razorpay script
      const loadRazorpay = () => new Promise((resolve) => {
        if ((window as any).Razorpay) return resolve(true);
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
      });

      const isLoaded = await loadRazorpay();
      if (!isLoaded) throw new Error("Failed to load Razorpay. Please check your internet connection.");

      // 2. Create Order
      const orderRes = await fetch(`${BACKEND_URL}/api/v2/payment/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: Math.round(advanceAmount * 100), // convert to paise
          description: `50% Advance for ${serviceName}`,
          receipt: `rcpt_${Date.now()}`
        }),
      });

      const orderPayload = await orderRes.json();
      if (!orderRes.ok || !orderPayload.success) {
        throw new Error(orderPayload.message || "Failed to create payment order");
      }

      // 3. Open Razorpay Checkout
      const options = {
        key: orderPayload.data.keyId || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_YourKeyId",
        amount: orderPayload.data.amount,
        currency: "INR",
        name: "Techbes Services",
        description: `Advance Payment - ${serviceName}`,
        order_id: orderPayload.data.orderId,
        handler: async function (response: any) {
          try {
            await submitBookingFinal(response.razorpay_payment_id, orderPayload.data.orderId);
          } catch (e: any) {
            setBookingError(e.message || "Booking creation failed after payment.");
            setIsSubmitting(false);
          }
        },
        prefill: {
          name: state.customerName,
          contact: state.customerPhone,
        },
        theme: { color: "#0f172a" },
      };

      async function submitBookingFinal(paymentId: string, orderId: string) {
        setIsSubmitting(true);
        const res = await fetch(`${BACKEND_URL}/api/v2/bookings`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            service: serviceName,
            serviceId,
            serviceName,
            address: state.address,
            description: state.description,
            date: state.date,
            timeSlot: state.timeSlot,
            customerName: state.customerName,
            customerPhone: state.customerPhone,
            status: "pending",
            paymentStatus: "advance_paid",
            paymentId: paymentId,
            orderId: orderId,
            amount: advanceAmount,
          })
        });

        if (!res.ok) {
          let message = "Booking failed. Please try again.";
          try {
            const payload = await res.json();
            message = payload.message || message;
          } catch {}

          if (res.status === 401) {
            setIsConfirmed(true);
            return;
          }
          throw new Error(message);
        }

        const payload = await res.json();
        setState(current => ({ ...current, bookingId: payload.data?.id || payload.data?._id || null }));
        setIsConfirmed(true);
        setIsSubmitting(false);
      }

      const rzp = new (window as any).Razorpay(options);
      rzp.on("payment.failed", function (response: any) {
        setBookingError(response.error.description || "Payment failed or cancelled.");
        setIsSubmitting(false);
      });
      rzp.open();
    } catch (err: any) {
      setBookingError(err.message || "Network error. Please check your connection.");
      setIsSubmitting(false);
    }
  }

  return {
    step,
    state,
    isConfirmed,
    isSubmitting,
    bookingError,
    updateState,
    resetFlow,
    nextStep,
    previousStep,
    confirm,
  };
}
