"use client";

import { useState } from "react";
import { Sparkles, MessageSquare, Bot } from "lucide-react";
import {
  AiServiceAssistantModal,
} from "./ai-assistant/AiServiceAssistantModal";
import { useAiAssistantListener, openAiAssistant } from "./ai-assistant/useAiAssistant";

export function AIAssistantWidget() {
  const { isOpen, setIsOpen, options } = useAiAssistantListener();

  return (
    <>
      {/* Floating Bottom-Right Launcher Button */}
      <div className="fixed bottom-6 right-6 z-40 group">
        <button
          type="button"
          onClick={() => openAiAssistant()}
          aria-label="Open AI Service Assistant"
          className="relative flex items-center gap-2.5 rounded-full bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 px-4 py-3 text-white shadow-xl shadow-blue-600/30 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-600/40 active:scale-95 border border-white/20"
        >
          {/* Pulsing indicator */}
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-white" />
          </span>

          <div className="rounded-full bg-white/15 p-1 backdrop-blur-xs">
            <Sparkles className="h-4 w-4 text-amber-300 animate-pulse" />
          </div>

          <div className="flex flex-col text-left">
            <span className="text-[10px] font-black uppercase tracking-wider text-blue-200 leading-none">
              Not Sure?
            </span>
            <span className="text-xs font-black tracking-tight text-white leading-tight">
              Ask AI Assistant
            </span>
          </div>
        </button>
      </div>

      {/* Modern AI Service Assistant Modal */}
      <AiServiceAssistantModal
        open={isOpen}
        onOpenChange={setIsOpen}
        initialServiceCategory={options.serviceCategory}
        initialPrompt={options.initialPrompt}
      />
    </>
  );
}
