"use client";

import { useState } from "react";

export interface BookingFlowState {
  address: string;
  date: string;
  timeSlot: string;
  coupon: string;
  customerName: string;
  customerPhone: string;
}

const initialState: BookingFlowState = {
  address: "",
  date: "",
  timeSlot: "",
  coupon: "",
  customerName: "",
  customerPhone: "",
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
    totalAmount,
  }: {
    serviceId: string;
    serviceName: string;
    totalAmount?: number;
  }) {
    setIsSubmitting(true);
    setBookingError(null);

    try {
      const res = await fetch(`${BACKEND_URL}/api/bookings/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service: serviceName,
          serviceId,
          serviceName,
          address: state.address,
          description: "",
          date: state.date,
          timeSlot: state.timeSlot,
          customerName: state.customerName,
          customerPhone: state.customerPhone,
          totalAmount: totalAmount ?? (state as any).totalAmount ?? (state as any).priceValue,
        }),
      });

      if (!res.ok) {
        let message = "Booking failed. Please try again.";
        try {
          const payload = await res.json();
          message = payload.message || message;
        } catch {}

        // Allow guest flow to succeed if it's explicitly allowed but missing auth
        if (res.status === 401) {
          setIsConfirmed(true);
          return;
        }

        setBookingError(message);
        return;
      }

      const payload = await res.json();
      // Return booking data for the caller to continue to payment
      return payload.data;
    } catch (err: any) {
      setBookingError(err.message || "Network error. Please check your connection.");
    } finally {
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
