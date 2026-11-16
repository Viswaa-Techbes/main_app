"use client";

import { useState, useEffect, useRef } from "react";
import { Mic, MicOff, Send, Globe, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export type AssistantLocale = "en-IN" | "ta-IN" | "kn-IN";

interface VoiceSpeechInputProps {
  onSendMessage: (text: string, locale?: AssistantLocale) => void;
  isLoading?: boolean;
  placeholder?: string;
  locale: AssistantLocale;
  onLocaleChange: (locale: AssistantLocale) => void;
}

export function VoiceSpeechInput({
  onSendMessage,
  isLoading = false,
  placeholder = "Describe your requirement (e.g. En veetuku camera venum, or 4 CCTV cameras for home)...",
  locale,
  onLocaleChange,
}: VoiceSpeechInputProps) {
  const [text, setText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        setSpeechSupported(true);
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = locale;

        recognition.onstart = () => {
          setIsListening(true);
          setSpeechError(null);
        };

        recognition.onresult = (event: any) => {
          let currentTranscript = "";
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            currentTranscript += event.results[i][0].transcript;
          }
          if (currentTranscript) {
            setText(currentTranscript);
          }
        };

        recognition.onerror = (event: any) => {
          console.warn("[SpeechRecognition error]:", event.error);
          setIsListening(false);
          if (event.error === "not-allowed") {
            setSpeechError("Microphone permission was denied. Please allow mic access.");
          } else if (event.error === "no-speech") {
            setSpeechError("No speech detected. Please try again.");
          } else {
            setSpeechError("Speech recognition error. You can type instead.");
          }
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (_) {}
      }
    };
  }, [locale]);

  const toggleListening = () => {
    if (!speechSupported || !recognitionRef.current) {
      setSpeechError("Speech recognition is not supported in this browser. Please type your message.");
      return;
    }

    if (isListening) {
      try {
        recognitionRef.current.stop();
      } catch (_) {}
      setIsListening(false);
    } else {
      setSpeechError(null);
      try {
        recognitionRef.current.lang = locale;
        recognitionRef.current.start();
      } catch (err) {
        console.error("Failed to start speech recognition:", err);
      }
    }
  };

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;
    if (isListening && recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (_) {}
      setIsListening(false);
    }
    onSendMessage(trimmed, locale);
    setText("");
    setSpeechError(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const getDynamicPlaceholder = () => {
    if (locale === "kn-IN") {
      return "ನಿಮ್ಮ ಅಗತ್ಯವನ್ನು ಕನ್ನಡದಲ್ಲಿ ಮಾತನಾಡಿ ಅಥವಾ ಟೈಪ್ ಮಾಡಿ (ಉದಾ: ನನಗೆ ಮನೆಯ CCTV ಬೇಕು / ನಾಲ್ಕು ಕ್ಯಾಮೆರಾ ಬೇಕು)...";
    }
    if (locale === "ta-IN") {
      return "உங்கள் தேவையை தமிழில் கூறவும் (எ.கா: என் வீட்டுக்கு 4 கேமரா வேண்டும்)...";
    }
    return placeholder;
  };

  const getLocaleLabel = () => {
    if (locale === "kn-IN") return "ಕನ್ನಡ";
    if (locale === "ta-IN") return "தமிழ்";
    return "English";
  };

  return (
    <div className="w-full space-y-2">
      {/* Speech error or active listening notice */}
      {speechError && (
        <div className="text-[11px] text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-xl flex items-center justify-between">
          <span>{speechError}</span>
          <button
            type="button"
            onClick={() => setSpeechError(null)}
            className="text-amber-900 font-bold ml-2 hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {isListening && (
        <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-xl text-blue-700 text-xs font-semibold animate-pulse">
          <div className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
          <span>
            Listening ({getLocaleLabel()})... Speak naturally into your mic.
          </span>
          <button
            type="button"
            onClick={toggleListening}
            className="ml-auto text-xs font-bold text-rose-600 hover:underline"
          >
            Stop
          </button>
        </div>
      )}

      {/* Main Input Container */}
      <div className="relative flex flex-col rounded-2xl border border-slate-200 bg-white p-2 shadow-sm focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
        <textarea
          rows={2}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={getDynamicPlaceholder()}
          className="w-full resize-none border-0 bg-transparent px-2 py-1 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-0 leading-relaxed font-medium"
        />

        <div className="flex items-center justify-between pt-1 border-t border-slate-100 mt-1 flex-wrap gap-2">
          {/* Language selector toggle: English | தமிழ் | ಕನ್ನಡ */}
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Globe className="w-3 h-3 text-slate-400" /> Language:
            </span>
            <div className="flex items-center bg-slate-100 rounded-lg p-0.5 text-[10px] font-bold">
              <button
                type="button"
                onClick={() => onLocaleChange("en-IN")}
                className={`px-2 py-0.5 rounded-md transition ${
                  locale === "en-IN"
                    ? "bg-white text-blue-700 shadow-xs font-black"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => onLocaleChange("ta-IN")}
                className={`px-2 py-0.5 rounded-md transition ${
                  locale === "ta-IN"
                    ? "bg-white text-blue-700 shadow-xs font-black"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                தமிழ்
              </button>
              <button
                type="button"
                onClick={() => onLocaleChange("kn-IN")}
                className={`px-2 py-0.5 rounded-md transition ${
                  locale === "kn-IN"
                    ? "bg-white text-blue-700 shadow-xs font-black"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                ಕನ್ನಡ
              </button>
            </div>
          </div>

          {/* Right Action buttons: Mic & Send */}
          <div className="flex items-center gap-1.5 ml-auto">
            {speechSupported && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={toggleListening}
                className={`h-8 w-8 p-0 rounded-xl transition ${
                  isListening
                    ? "bg-rose-500 text-white hover:bg-rose-600 animate-pulse"
                    : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                }`}
                title={isListening ? "Stop voice listening" : `Click to speak voice requirement in ${getLocaleLabel()}`}
              >
                {isListening ? (
                  <MicOff className="w-4 h-4 text-white" />
                ) : (
                  <Mic className="w-4 h-4" />
                )}
              </Button>
            )}

            <Button
              type="button"
              size="sm"
              disabled={!text.trim() || isLoading}
              onClick={handleSend}
              className="h-8 px-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs gap-1.5 shadow-sm transition"
            >
              {isLoading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <>
                  <span>Send</span>
                  <Send className="w-3.5 h-3.5" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
