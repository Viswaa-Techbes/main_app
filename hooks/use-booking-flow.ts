"use client";

import { useState } from "react";

export interface BookingFlowState {
  address: string;
  date: string;
  timeSlot: string;
  coupon: string;
}

const initialState: BookingFlowState = {
  address: "",
  date: "",
  timeSlot: "",
  coupon: "",
};

export function useBookingFlow() {
  const [step, setStep] = useState(1);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [state, setState] = useState<BookingFlowState>(initialState);

  function updateState(patch: Partial<BookingFlowState>) {
    setState((current) => ({ ...current, ...patch }));
  }

  function resetFlow() {
    setStep(1);
    setIsConfirmed(false);
    setState(initialState);
  }

  function nextStep() {
    setStep((current) => Math.min(current + 1, 4));
  }

  function previousStep() {
    setStep((current) => Math.max(current - 1, 1));
  }

  function confirm() {
    setIsConfirmed(true);
  }

  return {
    step,
    state,
    isConfirmed,
    updateState,
    resetFlow,
    nextStep,
    previousStep,
    confirm,
  };
}
