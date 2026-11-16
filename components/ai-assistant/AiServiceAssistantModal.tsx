"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  Sparkles,
  X,
  RotateCcw,
  Bot,
  User,
  ShieldCheck,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Sliders,
  Camera,
  Layers,
  HardDrive,
  Info,
  PackageCheck,
  Globe,
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { VoiceSpeechInput, AssistantLocale } from "./VoiceSpeechInput";
import {
  PackageCustomizerModal,
  RecommendationPackage,
} from "./PackageCustomizerModal";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  recommendations?: RecommendationPackage[];
  clarificationQuestions?: Array<{
    id: string;
    title: string;
    question: string;
    options: Array<{ label: string; value: string }>;
  }>;
  timestamp: string;
}

const WELCOME_MESSAGES: Record<AssistantLocale, ChatMessage> = {
  "en-IN": {
    id: "welcome-en",
    role: "assistant",
    content:
      "Hello & Welcome! 🙏 I am your **TechBes Smart AI Service Advisor**.\n\n" +
      "Explain what service you need in **English, தமிழ் (Tamil), or ಕನ್ನಡ (Kannada)** without any technical jargon.\n\n" +
      "*Examples:*\n" +
      "• *\"I need 4 CCTV cameras for my duplex home\"*\n" +
      "• *\"ನನಗೆ ಮನೆಯ CCTV ಬೇಕು\"*\n" +
      "• *\"En veetuku camera venum\"*\n" +
      "• *\"Office-ku WiFi coverage venum\"*\n\n" +
      "How can I help you today?",
    clarificationQuestions: [
      {
        id: "quick_start_en",
        title: "Popular Requirements",
        question: "Quick start with common requirements:",
        options: [
          { label: "🏠 Home CCTV (4 Cameras)", value: "I need 4 CCTV cameras for my home" },
          { label: "🛍️ Shop / Store CCTV", value: "Need CCTV setup for my retail shop" },
          { label: "🏢 Office Wi-Fi / LAN", value: "Need high-speed office WiFi coverage" },
          { label: "❓ Unsure (Help me plan)", value: "I don't know how many cameras I need, help me plan" },
        ],
      },
    ],
    timestamp: new Date().toISOString(),
  },
  "kn-IN": {
    id: "welcome-kn",
    role: "assistant",
    content:
      "ನಮಸ್ಕಾರ! 🙏 ನಾನು ನಿಮ್ಮ **TechBes ಸ್ಮಾರ್ಟ್ AI ಸೇವಾ ಸಹಾಯಕ**.\n\n" +
      "ಯಾವುದೇ ತಾಂತ್ರಿಕ ಗೊಂದಲವಿಲ್ಲದೆ ನಿಮ್ಮ ಅಗತ್ಯವನ್ನು ಸರಳ **ಕನ್ನಡದಲ್ಲಿ** ತಿಳಿಸಿ.\n\n" +
      "*ಉದಾಹರಣೆಗಳು:*\n" +
      "• *\"ನನಗೆ ಮನೆಯ CCTV ಬೇಕು\"*\n" +
      "• *\"ನನ್ನ ಮನೆಗೆ ಕ್ಯಾಮೆರಾ ಹಾಕಿಸಬೇಕು\"*\n" +
      "• *\"ನಾಲ್ಕು ಕ್ಯಾಮೆರಾ ಬೇಕು\"*\n" +
      "• *\"ನನಗೆ WiFi ಬೇಕು\"*\n\n" +
      "ಇಂದು ನಿಮಗೆ ಯಾವ ಸೇವೆ ಬೇಕಾಗಿದೆ?",
    clarificationQuestions: [
      {
        id: "quick_start_kn",
        title: "ಜನಪ್ರಿಯ ಅಗತ್ಯಗಳು (Quick Start)",
        question: "ಸಾಮಾನ್ಯ ಸೇವೆಗಳನ್ನು ಆಯ್ಕೆಮಾಡಿ:",
        options: [
          { label: "🏠 ಮನೆಗೆ CCTV (4 ಕ್ಯಾಮೆರಾ)", value: "ನನಗೆ ಮನೆಯ CCTV ಬೇಕು, 4 ಕ್ಯಾಮೆರಾ" },
          { label: "🛍️ ಅಂಗಡಿಗೆ ಕ್ಯಾಮೆರಾ", value: "ನನ್ನ ಅಂಗಡಿಗೆ ಕ್ಯಾಮೆರಾ ಹಾಕಿಸಬೇಕು" },
          { label: "🏢 ಆಫೀಸ್ Wi-Fi / ನೆಟ್‌ವರ್ಕ್", value: "ನನಗೆ WiFi ಬೇಕು ಆಫೀಸ್‌ಗೆ" },
          { label: "❓ ಅಂದಾಜು ಮಾಡಲು ಸಹಾಯ ಮಾಡಿ", value: "ಎಷ್ಟು ಕ್ಯಾಮೆರಾ ಬೇಕು ತಿಳಿಯುತ್ತಿಲ್ಲ, ಸಹಾಯ ಮಾಡಿ" },
        ],
      },
    ],
    timestamp: new Date().toISOString(),
  },
  "ta-IN": {
    id: "welcome-ta",
    role: "assistant",
    content:
      "வணக்கம்! 🙏 நான் உங்கள் **TechBes Smart AI Service Advisor**.\n\n" +
      "உங்கள் தேவையை எளிய **தமிழில்** கூறுங்கள்.\n\n" +
      "*உதாரணங்கள்:*\n" +
      "• *\"En veetuku camera venum\"*\n" +
      "• *\"வீட்டுக்கு 4 கேமரா வேண்டும்\"*\n" +
      "• *\"Office-ku WiFi coverage venum\"*\n\n" +
      "நான் உங்களுக்கு எவ்வாறு உதவ முடியும்?",
    clarificationQuestions: [
      {
        id: "quick_start_ta",
        title: "முக்கிய தேவைகள்",
        question: "தேவைகளை நேரடியாக தேர்வு செய்யவும்:",
        options: [
          { label: "🏠 வீட்டுக்கு CCTV (4 கேமரா)", value: "En veetuku 4 camera venum" },
          { label: "🛍️ கடைக்கு CCTV", value: "Kadai-ku camera setup theva" },
          { label: "🏢 Office Wi-Fi / LAN", value: "Office-ku WiFi coverage venum" },
          { label: "❓ முடிவு செய்ய உதவி தேவை", value: "Ethana camera venum therila, help pannunga" },
        ],
      },
    ],
    timestamp: new Date().toISOString(),
  },
};

interface AiServiceAssistantModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialServiceCategory?: string;
  initialPrompt?: string;
}

export function AiServiceAssistantModal({
  open,
  onOpenChange,
  initialServiceCategory,
  initialPrompt,
}: AiServiceAssistantModalProps) {
  const [locale, setLocale] = useState<AssistantLocale>("en-IN");
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGES["en-IN"]]);
  const [isLoading, setIsLoading] = useState(false);
  const [activePackageForCustomizer, setActivePackageForCustomizer] =
    useState<RecommendationPackage | null>(null);
  const [customizerOpen, setCustomizerOpen] = useState(false);
  const [expandedPackageId, setExpandedPackageId] = useState<string | null>("recommended-smart-color");

  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (open) {
      setTimeout(scrollToBottom, 100);
    }
  }, [open, messages]);

  // Handle initialPrompt if passed
  useEffect(() => {
    if (open && initialPrompt && messages.length === 1) {
      handleSendMessage(initialPrompt);
    }
  }, [open, initialPrompt]);

  // When locale is changed and conversation is fresh, switch welcome message
  const handleLocaleChange = (newLocale: AssistantLocale) => {
    setLocale(newLocale);
    if (messages.length <= 1) {
      setMessages([WELCOME_MESSAGES[newLocale]]);
    }
  };

  const handleReset = () => {
    setMessages([WELCOME_MESSAGES[locale]]);
    setExpandedPackageId("recommended-smart-color");
  };

  const handleSendMessage = async (userText: string, specificLocale?: AssistantLocale) => {
    if (!userText.trim() || isLoading) return;

    const activeLoc = specificLocale || locale;

    // Detect if text is in Kannada script or Tamil script and auto-sync locale
    if (/[\u0C80-\u0CFF]/.test(userText) && activeLoc !== "kn-IN") {
      setLocale("kn-IN");
    } else if (/[\u0B80-\u0BFF]/.test(userText) && activeLoc !== "ta-IN") {
      setLocale("ta-IN");
    }

    const userMessage: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: "user",
      content: userText.trim(),
      timestamp: new Date().toISOString(),
    };

    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setIsLoading(true);

    try {
      const payloadMessages = nextMessages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch("/api/v2/ai/recommend-services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: payloadMessages,
          serviceCategory: initialServiceCategory || null,
          customerLocale: activeLoc,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || "Failed to get AI recommendation");
      }

      const { reply, recommendations, clarificationQuestions } = json.data;

      const assistantMessage: ChatMessage = {
        id: `asst-${Date.now()}`,
        role: "assistant",
        content: reply || "Here are recommendations tailored to your requirements:",
        recommendations: recommendations && recommendations.length > 0 ? recommendations : undefined,
        clarificationQuestions: clarificationQuestions,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, assistantMessage]);

      if (recommendations && recommendations.length > 0) {
        const pop = recommendations.find((r: any) => r.isPopular) || recommendations[0];
        setExpandedPackageId(pop.id);
      }
    } catch (err: any) {
      console.error("[AI Assistant Error]:", err);
      const errorMessage: ChatMessage = {
        id: `err-${Date.now()}`,
        role: "assistant",
        content:
          activeLoc === "kn-IN"
            ? "ಸರ್ವರ್ ಸಂಪರ್ಕದಲ್ಲಿ ಸಣ್ಣ ಸಮಸ್ಯೆಯಾಗಿದೆ. ನೀವು ಕೆಳಗಿನ ಸಾಮಾನ್ಯ ಪ್ಯಾಕೇಜ್‌ಗಳನ್ನು ಆಯ್ಕೆ ಮಾಡಬಹುದು ಅಥವಾ ನೇರವಾಗಿ ಕೊಟೇಶನ್ ಸಲ್ಲಿಸಬಹುದು."
            : "I'm experiencing a brief connection issue. You can still select from standard CCTV packages or submit an instant quotation request below.",
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectPackage = (pkg: RecommendationPackage) => {
    setActivePackageForCustomizer(pkg);
    setCustomizerOpen(true);
  };

  const isKannada = locale === "kn-IN";

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="w-[95vw] max-w-5xl h-[90dvh] max-h-[90dvh] flex flex-col p-0 overflow-hidden rounded-2xl sm:rounded-3xl bg-slate-50 border border-slate-200 shadow-2xl">
          {/* Header */}
          <DialogHeader className="px-4 sm:px-6 py-3.5 sm:py-4 bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 text-white shrink-0 sticky top-0 z-20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-amber-300 shadow-inner shrink-0">
                  <Sparkles className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <DialogTitle className="text-base font-black text-white tracking-tight">
                      {isKannada ? "TechBes AI ಸೇವಾ ಸಹಾಯಕ" : "TechBes AI Service Advisor"}
                    </DialogTitle>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[9px] font-black uppercase tracking-wider">
                      {isKannada ? "ಲೈವ್ ಇನ್ವೆಂಟರಿ" : "Live Grounded Data"}
                    </span>
                  </div>
                  <p className="text-[11px] text-blue-200 font-medium">
                    English • தமிழ் • ಕನ್ನಡ • Grounded in Bangalore Stock &amp; Pricing
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleReset}
                  className="p-2 rounded-xl text-blue-200 hover:text-white hover:bg-white/10 transition"
                  title="Reset conversation"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>
          </DialogHeader>

          {/* Chat Message Scrollable Container */}
          <div className="flex-1 overflow-y-auto px-3 sm:px-6 py-4 space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className="space-y-3">
                {/* Role Row */}
                <div
                  className={`flex gap-3 ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {msg.role === "assistant" && (
                    <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed ${
                      msg.role === "user"
                        ? "bg-blue-600 text-white font-medium shadow-sm rounded-br-xs"
                        : "bg-white text-slate-800 border border-slate-200/80 shadow-xs rounded-bl-xs"
                    }`}
                  >
                    <div className="whitespace-pre-line font-normal">
                      {msg.content}
                    </div>
                  </div>

                  {msg.role === "user" && (
                    <div className="w-8 h-8 rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>

                {/* Clarification Chips (if present) */}
                {msg.clarificationQuestions &&
                  msg.clarificationQuestions.map((q) => (
                    <div
                      key={q.id}
                      className="ml-0 sm:ml-11 bg-white border border-slate-200/90 rounded-2xl p-3.5 space-y-2 shadow-xs"
                    >
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                        {q.question}
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {q.options.map((opt, oIdx) => (
                          <button
                            key={oIdx}
                            type="button"
                            onClick={() => handleSendMessage(opt.value)}
                            className="px-3 py-1.5 rounded-xl border border-blue-200/70 bg-blue-50/50 hover:bg-blue-600 hover:text-white hover:border-blue-600 text-slate-700 text-xs font-bold transition-all shadow-2xs hover:scale-[1.02]"
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}

                {/* Recommendation Packages Cards (if present) */}
                {msg.recommendations && msg.recommendations.length > 0 && (
                  <div className="ml-0 sm:ml-11 space-y-3 pt-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <PackageCheck className="w-4 h-4 text-blue-600" />
                        <span className="text-xs font-black uppercase tracking-wider text-slate-800">
                          {isKannada
                            ? `ಲಭ್ಯವಿರುವ ಸ್ಟಾಕ್ ಆಧಾರಿತ ಶಿಫಾರಸುಗಳು (${msg.recommendations.length} ಪ್ಯಾಕೇಜ್‌ಗಳು)`
                            : `Recommended Configurations Grounded in Stock (${msg.recommendations.length} Tiers)`}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-semibold">
                        {isKannada ? "ಬೆಂಗಳೂರು ಇನ್ವೆಂಟರಿ" : "Grounded in Bangalore Catalog"}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {msg.recommendations.map((pkg) => {
                        const isExpanded = expandedPackageId === pkg.id;
                        return (
                          <div
                            key={pkg.id}
                            className={`rounded-2xl border transition-all duration-300 flex flex-col justify-between overflow-hidden ${
                              pkg.isPopular
                                ? "bg-gradient-to-b from-blue-50/40 via-white to-white border-blue-500 shadow-md ring-2 ring-blue-500/10"
                                : "bg-white border-slate-200 hover:border-blue-300 shadow-xs"
                            }`}
                          >
                            {/* Card Header & Badge */}
                            <div className="p-4 border-b border-slate-100/80 space-y-1.5">
                              <div className="flex items-center justify-between">
                                <span
                                  className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                                    pkg.isPopular
                                      ? "bg-blue-600 text-white"
                                      : pkg.tier === "Premium"
                                      ? "bg-purple-100 text-purple-800"
                                      : "bg-slate-100 text-slate-700"
                                  }`}
                                >
                                  {pkg.tier}
                                </span>
                                {pkg.badge && (
                                  <span className="text-[9px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/50">
                                    {pkg.badge}
                                  </span>
                                )}
                              </div>

                              <h4 className="text-xs font-black text-slate-900 tracking-tight leading-snug">
                                {pkg.title}
                              </h4>
                              <p className="text-[11px] text-slate-500 font-medium line-clamp-2">
                                {pkg.tagline}
                              </p>
                            </div>

                            {/* Card Specs Body */}
                            <div className="p-4 space-y-3 flex-1">
                              {/* Price block */}
                              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-baseline justify-between gap-2">
                                <div>
                                  <span className="text-[9px] font-bold uppercase text-slate-400 block tracking-wider">
                                    {isKannada ? "ಅಂದಾಜು ವೆಚ್ಚ" : "Investment"}
                                  </span>
                                  <span className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                                    {pkg.pricing?.priceDisplay || (isKannada ? "ಕೊಟೇಶನ್ ಅಗತ್ಯವಿದೆ" : "Quotation required")}
                                  </span>
                                </div>
                                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded-md whitespace-nowrap shrink-0">
                                  {pkg.pricing?.hasAuthoritativePricing
                                    ? (isKannada ? "GST & ಲೇಬರ್ ಸೇರಿ" : "incl. GST & Labour")
                                    : (isKannada ? "ಕಸ್ಟಮ್ ಸ್ಕೋಪ್" : "Custom Scope")}
                                </span>
                              </div>

                              {/* Key Highlights */}
                              <div className="space-y-1.5 text-[11px]">
                                <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                                  <Camera className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                                  <span className="truncate">{pkg.cameraType}</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                                  <HardDrive className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                                  <span className="truncate">{pkg.storage}</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                                  <span className="truncate">{pkg.warranty}</span>
                                </div>
                              </div>

                              {/* Toggle items accordion */}
                              <button
                                type="button"
                                onClick={() =>
                                  setExpandedPackageId(isExpanded ? null : pkg.id)
                                }
                                className="w-full text-left flex items-center justify-between text-[10px] font-bold text-blue-600 hover:text-blue-800 pt-1"
                              >
                                <span>
                                  {isExpanded
                                    ? (isKannada ? "ಹಾರ್ಡ್‌ವೇರ್ ಪಟ್ಟಿ ಮರೆಮಾಡಿ" : "Hide Itemized Hardware")
                                    : (isKannada ? `ಹಾರ್ಡ್‌ವೇರ್ ಪಟ್ಟಿ ವೀಕ್ಷಿಸಿ (${pkg.items.length} ಸಾಮಗ್ರಿಗಳು)` : `View Itemized Inventory (${pkg.items.length} Items)`)}
                                </span>
                                {isExpanded ? (
                                  <ChevronUp className="w-3 h-3" />
                                ) : (
                                  <ChevronDown className="w-3 h-3" />
                                )}
                              </button>

                              {isExpanded && (
                                <div className="pt-2 border-t border-slate-100 space-y-1.5 text-[10px]">
                                  {pkg.items.map((it, idx) => (
                                    <div
                                      key={idx}
                                      className="flex justify-between items-center text-slate-600 bg-slate-50/80 px-2 py-1 rounded"
                                    >
                                      <span className="truncate max-w-[130px] font-medium" title={it.productName}>
                                        {it.productName}
                                      </span>
                                      <span className="font-bold text-slate-800 shrink-0 ml-1">
                                        x{it.quantity} {it.unit || ""}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>

                            {/* Card Footer Actions */}
                            <div className="p-3 bg-slate-50/60 border-t border-slate-100 flex flex-col gap-1.5">
                              <Button
                                type="button"
                                size="sm"
                                onClick={() => handleSelectPackage(pkg)}
                                className={`w-full h-8 text-xs font-black rounded-xl transition-all ${
                                  pkg.isPopular
                                    ? "bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                                    : "bg-slate-900 hover:bg-slate-800 text-white"
                                }`}
                              >
                                {isKannada ? "ಆಯ್ಕೆಮಾಡಿ & ಕೊಟೇಶನ್ ವಿನಂತಿಸಿ" : "Select & Request Quote"}
                              </Button>

                              <button
                                type="button"
                                onClick={() => handleSelectPackage(pkg)}
                                className="w-full text-center text-[10px] font-bold text-slate-500 hover:text-blue-600 py-0.5 transition flex items-center justify-center gap-1"
                              >
                                <Sliders className="w-2.5 h-2.5" />
                                <span>{isKannada ? "ಕಸ್ಟಮೈಸ್ ಮಾಡಿ" : "Customize Hardware & Notes"}</span>
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-3 items-center text-xs text-slate-500 font-medium">
                <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center animate-spin">
                  <Sparkles className="w-4 h-4" />
                </div>
                <span>
                  {isKannada
                    ? "ನಿಮ್ಮ ಅಗತ್ಯವನ್ನು ವಿಶ್ಲೇಷಿಸಲಾಗುತ್ತಿದೆ & ಸ್ಟಾಕ್ ಪರಿಶೀಲಿಸಲಾಗುತ್ತಿದೆ..."
                    : "Analyzing requirement & matching Bangalore inventory items..."}
                </span>
              </div>
            )}

            <div ref={chatBottomRef} />
          </div>

          {/* Voice & Text Input Footer with Language Switcher */}
          <div className="p-3 sm:p-4 bg-white border-t border-slate-200 shrink-0 sticky bottom-0 z-20 shadow-lg">
            <VoiceSpeechInput
              onSendMessage={handleSendMessage}
              isLoading={isLoading}
              locale={locale}
              onLocaleChange={handleLocaleChange}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Package Customizer & Submission Modal */}
      <PackageCustomizerModal
        open={customizerOpen}
        onOpenChange={setCustomizerOpen}
        packageData={activePackageForCustomizer}
        onQuotationSuccess={(reqId) => {
          const confirmMsg: ChatMessage = {
            id: `quo-success-${Date.now()}`,
            role: "assistant",
            content: isKannada
              ? `🎉 **ಕೊಟೇಶನ್ ವಿನಂತಿ ಯಶಸ್ವಿಯಾಗಿ ಸಲ್ಲಿಕೆಯಾಗಿದೆ!**\n\nಉಲ್ಲೇಖ ಸಂಖ್ಯೆ (Reference ID): **${reqId}**\n\nನಮ್ಮ ತಾಂತ್ರಿಕ ಎಂಜಿನಿಯರ್ ಶೀಘ್ರದಲ್ಲೇ ನಿಮ್ಮನ್ನು ಸಂಪರ್ಕಿಸಿ ಸೈಟ್ ಭೇಟಿಯ ಸಮಯ ಮತ್ತು ಅಂತಿಮ ಕೊಟೇಶನ್ ದೃಢೀಕರಿಸುತ್ತಾರೆ.`
              : `🎉 **Quotation Request Dispatched!**\n\nReference ID: **${reqId}**\n\nOur field engineer has received your request and will contact you shortly to confirm the site survey and finalized quote.`,
            timestamp: new Date().toISOString(),
          };
          setMessages((prev) => [...prev, confirmMsg]);
        }}
      />
    </>
  );
}
