"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Minus, Maximize2, RotateCcw, Sparkles } from "lucide-react";
import { fetchAuthApi } from "@/lib/api";
import { useRouter } from "next/navigation";

interface Message {
  role: "user" | "assistant";
  content: string;
  quickActions?: string[];
}

const STORAGE_KEY = "techbes_ai_chat_messages";

const DEFAULT_GREETING: Message = {
  role: "assistant",
  content: "Hi! I'm your Techbes Smart Service Advisor. How can I help you today? I can help you with CCTV installation, repair, AMC plans, structured cabling, or instant price estimates!",
  quickActions: ["📹 CCTV Installation", "🔧 CCTV Repair", "🛡️ AMC Plans", "📐 Free Site Survey", "💰 Instant Quote", "📦 Track Booking"]
};

export function AIAssistantWidget() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([DEFAULT_GREETING]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [showSupportTicket, setShowSupportTicket] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isMountedRef = useRef(false);

  // Load chat history from session storage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = sessionStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setMessages(parsed);
          }
        }
      } catch (e) {
        console.warn("Failed to load chat history:", e);
      }
      isMountedRef.current = true;
    }
  }, []);

  // Save chat history to session storage on change
  useEffect(() => {
    if (isMountedRef.current && typeof window !== "undefined") {
      try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
      } catch (e) {
        console.warn("Failed to persist chat history:", e);
      }
    }
  }, [messages]);

  // Scroll to bottom when new messages arrive or modal opens
  useEffect(() => {
    if (isOpen && !isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      setUnreadCount(0);
    }
  }, [messages, isOpen, isMinimized]);

  const handleResetChat = useCallback(() => {
    setMessages([DEFAULT_GREETING]);
    setShowSupportTicket(false);
    setFailedAttempts(0);
    if (typeof window !== "undefined") {
      sessionStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  async function handleSend(e?: React.FormEvent, customMsg?: string) {
    if (e) e.preventDefault();
    const userMsg = (customMsg || input).trim();
    if (!userMsg || isLoading) return;

    setInput("");

    // Prepare message history to send
    const userEntry: Message = { role: "user", content: userMsg };
    const updatedMessages = [...messages, userEntry];
    setMessages(updatedMessages);
    setIsLoading(true);

    let retryCount = 0;
    const maxRetries = 1;
    let success = false;

    // Send payload containing message history (omitting quickActions UI data)
    const payloadMessages = updatedMessages.map((m) => ({
      role: m.role,
      content: m.content,
    }));

    while (retryCount <= maxRetries && !success) {
      try {
        const res = await fetchAuthApi("/api/v2/ai/chat", {
          method: "POST",
          body: JSON.stringify({ messages: payloadMessages }),
        });

        if (res && res.success && res.data) {
          success = true;
          let replyText = res.data.reply || "";
          let quickActions: string[] = [];

          // 1. Parse Quick Actions
          const qaRegex = /\|\|QUICK_ACTIONS:([^|]+)\|\|/g;
          let qaMatch;
          while ((qaMatch = qaRegex.exec(replyText)) !== null) {
            quickActions = qaMatch[1].split(",").map((s) => s.trim()).filter(Boolean);
            replyText = replyText.replace(qaMatch[0], "").trim();
          }

          // 2. Parse Explicit Navigate Tokens
          const navRegex = /\|\|NAVIGATE:([^|]+)\|\|/g;
          let navMatch;
          let targetRoute = "";
          while ((navMatch = navRegex.exec(replyText)) !== null) {
            targetRoute = navMatch[1].trim();
            replyText = replyText.replace(navMatch[0], "").trim();
          }

          // 3. Parse Named Action Tokens
          const actionRegex = /\|\|ACTION:([A-Z_]+)\|\|/g;
          let match;
          while ((match = actionRegex.exec(replyText)) !== null) {
            const action = match[1];
            replyText = replyText.replace(match[0], "").trim();

            if (action === "TRACK_BOOKING") targetRoute = "/dashboard/bookings";
            if (action === "BOOK_SERVICE") targetRoute = targetRoute || "/services";
            if (action === "BOOK_CCTV_NEW") targetRoute = "/services/install-new-cctv";
            if (action === "BOOK_CCTV_REPAIR") targetRoute = "/services/repair-existing-cctv";
            if (action === "BOOK_CCTV_AMC") targetRoute = "/services/maintenance-amc";
            if (action === "BOOK_CCTV_SURVEY") targetRoute = "/services/free-site-survey";
            if (action === "BOOK_CCTV_UPGRADE") targetRoute = "/services/upgrade-existing-cctv";
            if (action === "BOOK_CCTV_PRODUCTS") targetRoute = "/services/buy-cctv-products";
            if (action === "GET_QUOTE") targetRoute = "/get-a-quote";
            if (action === "OPEN_WALLET") targetRoute = "/dashboard/wallet";
            if (action === "OPEN_DASHBOARD") targetRoute = "/dashboard";
            if (action === "CONTACT_SUPPORT") setShowSupportTicket(true);
          }

          if (targetRoute && (userMsg.toLowerCase().includes("book") || userMsg.toLowerCase() === "yes" || userMsg.toLowerCase().includes("proceed"))) {
            // Smoothly navigate if user explicitly expressed booking intent
            setTimeout(() => {
              router.push(targetRoute);
            }, 600);
          }

          const assistantEntry: Message = {
            role: "assistant",
            content: replyText || "I can help you with CCTV installation, repair, and pricing. Let me know what you need!",
            quickActions: quickActions.length > 0 ? quickActions : undefined,
          };

          setMessages([...updatedMessages, assistantEntry]);
          if (!isOpen || isMinimized) setUnreadCount((prev) => prev + 1);
          setFailedAttempts(0);

          if (replyText.toLowerCase().includes("support ticket")) {
            setShowSupportTicket(true);
          }
        } else {
          throw new Error(res?.message || "Invalid response");
        }
      } catch (err) {
        retryCount++;
        if (retryCount > maxRetries) {
          setFailedAttempts((prev) => prev + 1);
          const fallbackEntry: Message = {
            role: "assistant",
            content: "I'm having trouble connecting right now, but I can still help! You can book a CCTV service, get an instant estimate, or create a support ticket.",
            quickActions: ["📹 Install New CCTV", "🔧 Repair CCTV", "📐 Free Site Survey", "📞 Contact Support"],
          };
          setMessages([...updatedMessages, fallbackEntry]);
          if (failedAttempts >= 1) {
            setShowSupportTicket(true);
          }
        } else {
          await new Promise((resolve) => setTimeout(resolve, 800));
        }
      }
    }

    setIsLoading(false);
  }

  async function handleCreateTicket() {
    try {
      setIsLoading(true);
      const chatLog = messages.map((m) => `${m.role.toUpperCase()}: ${m.content}`).join("\n");
      const res = await fetchAuthApi("/api/v2/ai/handoff", {
        method: "POST",
        body: JSON.stringify({ summary: "Automated Ticket Creation", chatLog }),
      });
      if (res && res.success) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: "✅ I've created a support ticket for you. Our Bangalore support team will reach out shortly." },
        ]);
        setShowSupportTicket(false);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Failed to create ticket automatically. Please reach out to us directly at support@techbes.com." },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  // Floating Bubble Button
  if (!isOpen) {
    return (
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          setIsOpen(true);
          setIsMinimized(false);
        }}
        aria-label="Open AI Assistant"
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-full shadow-xl shadow-blue-500/30 flex items-center justify-center text-white z-50 hover:from-blue-700 hover:to-indigo-700 transition-all border border-white/20"
      >
        <MessageSquare size={24} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 rounded-full border-2 border-white text-[10px] font-bold flex items-center justify-center shadow-sm">
            {unreadCount}
          </span>
        )}
      </motion.button>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        className={`fixed right-4 sm:right-6 z-50 flex flex-col bg-white shadow-2xl border border-gray-200/80 rounded-2xl overflow-hidden transition-all duration-300 ${
          isMinimized
            ? "bottom-6 w-72 sm:w-80 h-14"
            : "bottom-4 sm:bottom-6 w-[calc(100vw-2rem)] sm:w-96 h-[540px] max-h-[85vh]"
        }`}
      >
        {/* Header */}
        <div
          onClick={() => isMinimized && setIsMinimized(false)}
          className={`px-4 py-3 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white flex items-center justify-between shadow-sm ${
            isMinimized ? "cursor-pointer" : ""
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <Sparkles size={16} className="text-amber-300" />
              </div>
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-indigo-700"></div>
            </div>
            <div>
              <h3 className="font-bold text-sm tracking-tight leading-tight">Techbes Smart Advisor</h3>
              <p className="text-[10px] text-blue-100/90 font-medium">Bangalore CCTV & IT Specialist</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {!isMinimized && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleResetChat();
                }}
                title="Start New Conversation"
                aria-label="New Conversation"
                className="p-1.5 hover:bg-white/20 rounded-lg text-white/90 hover:text-white transition"
              >
                <RotateCcw size={15} />
              </button>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsMinimized(!isMinimized);
              }}
              aria-label={isMinimized ? "Maximize assistant" : "Minimize assistant"}
              className="p-1.5 hover:bg-white/20 rounded-lg text-white/90 hover:text-white transition"
            >
              {isMinimized ? <Maximize2 size={15} /> : <Minus size={15} />}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(false);
              }}
              aria-label="Close assistant"
              className="p-1.5 hover:bg-rose-500/80 rounded-lg text-white/90 hover:text-white transition"
            >
              <X size={15} />
            </button>
          </div>
        </div>

        {/* Chat Body */}
        {!isMinimized && (
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/70">
              {messages.map((msg, idx) => {
                const isUser = msg.role === "user";
                return (
                  <div key={idx} className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}>
                    <div
                      className={`max-w-[88%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm ${
                        isUser
                          ? "bg-blue-600 text-white rounded-br-sm"
                          : "bg-white text-slate-800 border border-slate-200/70 rounded-bl-sm"
                      }`}
                      style={{ whiteSpace: "pre-wrap" }}
                    >
                      {msg.content}
                    </div>

                    {/* Quick Action Chips attached to assistant message */}
                    {!isUser && msg.quickActions && msg.quickActions.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2 max-w-[95%]">
                        {msg.quickActions.map((qa, qIdx) => (
                          <button
                            key={qIdx}
                            onClick={() => handleSend(undefined, qa.replace(/^[^\w]+/, "").trim())}
                            disabled={isLoading}
                            className="text-xs px-2.5 py-1 bg-white hover:bg-blue-50 text-blue-700 border border-blue-200 rounded-lg font-medium shadow-xs transition-colors hover:border-blue-300 active:scale-95 disabled:opacity-50"
                          >
                            {qa}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-slate-200/70 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:150ms]"></span>
                    <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:300ms]"></span>
                  </div>
                </div>
              )}

              {showSupportTicket && (
                <div className="flex justify-start pt-1">
                  <button
                    onClick={handleCreateTicket}
                    disabled={isLoading}
                    className="bg-rose-50 text-rose-700 border border-rose-200 text-xs font-semibold py-2 px-3.5 rounded-xl shadow-sm hover:bg-rose-100 transition-colors flex items-center gap-1.5"
                  >
                    <span>📞</span> Create Support Ticket
                  </button>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions & Input Footer */}
            <div className="p-3 bg-white border-t border-slate-100 flex flex-col gap-2.5">
              {/* Default Quick Actions */}
              <div
                className="flex gap-1.5 overflow-x-auto pb-0.5"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                {[
                  "📹 CCTV Installation",
                  "🔧 CCTV Repair",
                  "🛡️ AMC Plans",
                  "📐 Free Site Survey",
                  "💰 Instant Quote",
                  "📦 Track Booking",
                ].map((qa) => (
                  <button
                    key={qa}
                    onClick={() => handleSend(undefined, qa.replace(/^[^\w]+/, "").trim())}
                    disabled={isLoading}
                    className="whitespace-nowrap px-2.5 py-1 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 rounded-lg text-[11px] font-medium transition-colors shrink-0 disabled:opacity-50"
                  >
                    {qa}
                  </button>
                ))}
              </div>

              <form onSubmit={(e) => handleSend(e)} className="flex gap-2 items-center">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  aria-label="Ask Techbes Assistant"
                  placeholder="Ask about CCTV, price, booking, repair..."
                  className="flex-1 bg-slate-100 text-slate-800 text-sm border border-transparent rounded-xl py-2 px-3.5 outline-none focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 transition placeholder:text-slate-400"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  aria-label="Send message"
                  className="w-9 h-9 bg-blue-600 hover:bg-blue-700 text-white rounded-xl flex items-center justify-center shrink-0 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm transition-all active:scale-95"
                >
                  <Send size={15} className={isLoading ? "animate-pulse" : ""} />
                </button>
              </form>
            </div>
          </>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
