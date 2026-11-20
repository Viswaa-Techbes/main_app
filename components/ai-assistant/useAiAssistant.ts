"use client";

import { useEffect, useState } from "react";

export interface OpenAiAssistantOptions {
  serviceCategory?: string;
  initialPrompt?: string;
  sessionContext?: Record<string, any>;
}

export const AI_ASSISTANT_EVENT = "techbes_open_ai_assistant";

export function openAiAssistant(options?: OpenAiAssistantOptions) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent(AI_ASSISTANT_EVENT, { detail: options || {} })
    );
  }
}

export function useAiAssistantListener() {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<OpenAiAssistantOptions>({});

  useEffect(() => {
    const handler = (event: Event) => {
      const customEvent = event as CustomEvent<OpenAiAssistantOptions>;
      setOptions(customEvent.detail || {});
      setIsOpen(true);
    };

    window.addEventListener(AI_ASSISTANT_EVENT, handler);
    return () => {
      window.removeEventListener(AI_ASSISTANT_EVENT, handler);
    };
  }, []);

  return {
    isOpen,
    setIsOpen,
    options,
  };
}
