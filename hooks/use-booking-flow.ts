"use client";

import { useState } from "react";
import { getApiBaseUrl, AUTH_TOKEN_STORAGE_KEY } from "@/core/api/config";

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

function getAuthToken() {
  if (typeof window === "undefined") return "";
  return window.localStorage.getItem(AUTH_TOKEN_STORAGE_KEY) || "";
}

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
      const token = getAuthToken();
      const apiBaseUrl = getApiBaseUrl();
      const res = await fetch(`${apiBaseUrl}/api/bookings/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
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

        if (res.status === 401) {
          const authError = new Error(message || "Please login to continue booking.") as Error & { status?: number };
          authError.status = 401;
          throw authError;
        }

        setBookingError(message);
        return;
      }

      const payload = await res.json();
      // Return booking data for the caller to continue to payment
      return payload.data;
    } catch (err: any) {
      setBookingError(err.message || "Network error. Please check your connection.");
      if (err?.status === 401) {
        throw err;
      }
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
