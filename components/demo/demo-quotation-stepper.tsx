"use client";

import React, { useState } from "react";
import {
  Layers,
  ListCheck,
  UserCheck,
  FileEdit,
  Send,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Clock,
  ShieldCheck,
} from "lucide-react";

interface DemoQuotationStepperProps {
  onStartFlow: () => void;
}

export function DemoQuotationStepper({ onStartFlow }: DemoQuotationStepperProps) {
  const [activeStep, setActiveStep] = useState(1);

  const steps = [
    {
      num: 1,
      title: "Select Service",
      icon: Layers,
      highlight: "10 Core Domains",
      desc: "Customer selects their core requirement: CCTV, Networking, Laptop, Desktop, Server, Electrical, Automation, or Web Development.",
      preview: "CCTV Surveillance System chosen by customer",
    },
    {
      num: 2,
      title: "Select Subcategory",
      icon: ListCheck,
      highlight: "Granular Scope",
      desc: "Picks specific job scope: Install New CCTV, Camera Repair, AMC Contract, Hardware Upgrade, or Free Site Survey.",
      preview: "Subcategory scope: Install New CCTV (4x 4K IP Dome Cameras)",
    },
    {
      num: 3,
      title: "Mobile Verification",
      icon: UserCheck,
      highlight: "Zero Friction Login",
      desc: "Fast OTP verification via mobile number. Creates persistent customer profile and links quotation to WhatsApp notifications.",
      preview: "Verified mobile: +91 98765 43210 (Linked to WhatsApp)",
    },
    {
      num: 4,
      title: "Enter Requirement",
      icon: FileEdit,
      highlight: "Custom Notes & Map",
      desc: "Customer specifies Bangalore address, property type (Home/Office/Shop), preferred visit date/slot, and free site inspection opt-in.",
      preview: "Location: Indiranagar, Bangalore • Free Site Visit: Checked",
    },
    {
      num: 5,
      title: "Request Quotation",
      icon: Send,
      highlight: "Digital Quotation",
      desc: "Central dispatch system assigns local hub engineer. Admin provides itemized prices, calculates GST, and sends instant PDF quote via WhatsApp.",
      preview: "Quotation #TB-QT-7492 dispatched within 15 minutes",
    },
  ];

  const current = steps[activeStep - 1];
  const Icon = current.icon;

  return (
    <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 lg:p-10 shadow-2xl space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-bold text-blue-400 uppercase tracking-widest flex items-center gap-1.5 mb-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            End-to-End Customer Experience
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            5-Stage Quotation & Dispatch Architecture
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-xl">
            Click any step below to explore what happens across each stage of the customer onboarding & quotation flow.
          </p>
        </div>

        <button
          onClick={onStartFlow}
          className="py-2.5 px-5 rounded-xl font-bold text-xs bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-md shadow-blue-500/20 transition flex items-center gap-2 shrink-0"
        >
          <span>Launch Interactive Demo</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 5-Step Stepper Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
        {steps.map((st) => {
          const StepIcon = st.icon;
          const isSelected = activeStep === st.num;

          return (
            <button
              key={st.num}
              onClick={() => setActiveStep(st.num)}
              className={`p-3.5 rounded-xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? "bg-blue-600/20 border-blue-500 text-white shadow-lg shadow-blue-500/10 ring-1 ring-blue-500/40"
                  : "bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    isSelected ? "bg-blue-600 text-white" : "bg-slate-800 text-slate-400"
                  }`}
                >
                  {st.num}
                </span>
                <StepIcon className={`w-4 h-4 ${isSelected ? "text-blue-400" : "text-slate-500"}`} />
              </div>
              <div>
                <div className="text-xs font-bold text-white tracking-tight">{st.title}</div>
                <div className="text-[10px] text-slate-400 font-medium truncate mt-0.5">{st.highlight}</div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Step Deep-Dive Showcase Card */}
      <div className="rounded-2xl bg-slate-950 border border-slate-800/90 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-start gap-4 max-w-xl">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
            <Icon className="w-6 h-6" />
          </div>
          <div className="space-y-1.5">
            <div className="text-xs font-bold text-blue-400 uppercase tracking-wider">
              Step {current.num} of 5 • {current.highlight}
            </div>
            <h4 className="text-lg font-bold text-white">{current.title}</h4>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{current.desc}</p>
          </div>
        </div>

        {/* Live System State Preview */}
        <div className="w-full md:w-auto p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-1.5 shrink-0">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            Simulated System Output
          </div>
          <div className="font-semibold text-white">{current.preview}</div>
          <div className="text-[11px] text-slate-400 flex items-center gap-1 pt-0.5">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
            <span>Bangalore Local Hub Dispatch Ready</span>
          </div>
        </div>
      </div>
    </div>
  );
}
