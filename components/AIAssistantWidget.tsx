"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Minus, Maximize2, Minimize2, CheckCircle2 } from "lucide-react";
import { fetchAuthApi } from "@/lib/api";
import { useRouter } from "next/navigation";

export function AIAssistantWidget() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<{role: string, content: string}[]>([
    { role: 'assistant', content: "Hi! I'm your Techbes Smart Service Advisor. How can I help you today?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [showSupportTicket, setShowSupportTicket] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      setUnreadCount(0);
    }
  }, [messages, isOpen, isMinimized]);

  async function handleSend(e?: React.FormEvent, customMsg?: string) {
    if (e) e.preventDefault();
    const userMsg = (customMsg || input).trim();
    if (!userMsg || isLoading) return;

    setInput("");
    
    const newMessages = [...messages, { role: 'user', content: userMsg }];
    setMessages(newMessages);
    setIsLoading(true);

    let retryCount = 0;
    const maxRetries = 2;
    let success = false;

    while (retryCount <= maxRetries && !success) {
      try {
        const res = await fetchAuthApi("/api/v2/ai/chat", {
          method: "POST",
          body: JSON.stringify({ messages: newMessages })
        });
        
        if (res.success) {
          success = true;
          let replyText = res.data.reply;
          
          // Action Parser
          const actionRegex = /\|\|ACTION:([A-Z_]+)\|\|/g;
          let match;
          while ((match = actionRegex.exec(replyText)) !== null) {
            const action = match[1];
            replyText = replyText.replace(match[0], '').trim();
            
            // Handle specific actions
            if (action === 'TRACK_BOOKING') router.push('/dashboard/bookings');
            if (action === 'BOOK_SERVICE') router.push('/');
            if (action === 'OPEN_WALLET') router.push('/dashboard/wallet');
            if (action === 'OPEN_DASHBOARD') router.push('/dashboard');
            if (action === 'CONTACT_SUPPORT') setShowSupportTicket(true);
          }

          setMessages([...newMessages, { role: 'assistant', content: replyText || "Action triggered successfully." }]);
          if (!isOpen || isMinimized) setUnreadCount(prev => prev + 1);
          setFailedAttempts(0);
          
          if (replyText.toLowerCase().includes("support ticket")) {
            setShowSupportTicket(true);
          }
        } else {
          throw new Error(res.message);
        }
      } catch (err) {
        retryCount++;
        if (retryCount > maxRetries) {
          setFailedAttempts(prev => prev + 1);
          setMessages([...newMessages, { role: 'assistant', content: "AI service is temporarily unavailable. Please try again later or create a support ticket." }]);
          if (failedAttempts >= 1) {
            setShowSupportTicket(true);
          }
        } else {
          // Wait 1 second before retrying
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
    }
    
    setIsLoading(false);
  }

  async function handleCreateTicket() {
    try {
      setIsLoading(true);
      const chatLog = messages.map(m => `${m.role.toUpperCase()}: ${m.content}`).join("\\n");
      const res = await fetchAuthApi("/api/v2/ai/handoff", {
        method: "POST",
        body: JSON.stringify({ summary: "Automated Ticket Creation", chatLog })
      });
      if (res.success) {
        setMessages(prev => [...prev, { role: 'assistant', content: "I've created a support ticket for you. Our team will reach out shortly." }]);
        setShowSupportTicket(false);
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: "Failed to create ticket. Please contact us directly at support@techbes.com." }]);
    } finally {
      setIsLoading(false);
    }
  }

  // Floating Bubble
  if (!isOpen) {
    return (
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => { setIsOpen(true); setIsMinimized(false); }}
        className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 rounded-full shadow-lg shadow-blue-500/40 flex items-center justify-center text-white z-50 hover:bg-blue-700 transition-colors"
      >
        <MessageSquare size={24} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 rounded-full border-2 border-white text-[10px] font-bold flex items-center justify-center">
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
        className={`fixed right-6 z-50 flex flex-col bg-white/90 backdrop-blur-xl shadow-2xl border border-white/20 rounded-2xl overflow-hidden ${
          isMinimized ? 'bottom-6 w-80 h-16' : 'bottom-6 w-80 sm:w-96 h-[500px] max-h-[80vh]'
        }`}
      >
        {/* Header */}
        <div 
          onClick={() => isMinimized && setIsMinimized(false)}
          className={`px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white flex items-center justify-between ${isMinimized ? 'cursor-pointer' : ''}`}
        >
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <MessageSquare size={16} />
              </div>
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-indigo-700"></div>
            </div>
            <div>
              <h3 className="font-bold text-sm">Techbes Assistant</h3>
              <p className="text-[10px] text-blue-100 opacity-80 leading-none mt-0.5">Powered by AI</p>
            </div>
          </div>
          
          <div className="flex items-center gap-1">
            <button 
              onClick={(e) => { e.stopPropagation(); setIsMinimized(!isMinimized); }} 
              className="p-1.5 hover:bg-white/20 rounded text-white transition"
            >
              {isMinimized ? <Maximize2 size={16} /> : <Minus size={16} />}
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); setIsOpen(false); }} 
              className="p-1.5 hover:bg-rose-500/80 rounded text-white transition"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Chat Body */}
        {!isMinimized && (
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
              {messages.map((msg, idx) => {
                const isUser = msg.role === 'user';
                return (
                  <div key={idx} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm shadow-sm ${
                      isUser 
                        ? 'bg-blue-600 text-white rounded-br-sm' 
                        : 'bg-white text-gray-800 border border-gray-100 rounded-bl-sm'
                    }`} style={{ whiteSpace: 'pre-wrap' }}>
                      {msg.content}
                    </div>
                  </div>
                );
              })}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-75"></span>
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-150"></span>
                  </div>
                </div>
              )}
              {showSupportTicket && (
                <div className="flex justify-start">
                   <button onClick={handleCreateTicket} className="bg-rose-50 text-rose-600 border border-rose-200 text-xs font-bold py-2 px-4 rounded-xl shadow-sm hover:bg-rose-100 transition">
                     Create Support Ticket
                   </button>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions & Input Footer */}
            <div className="p-3 bg-white border-t border-gray-100 flex flex-col gap-3">
              <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                {["📹 CCTV Installation", "💻 Laptop Repair", "🌐 Networking", "🏠 Home Automation", "📦 Track Booking", "📞 Contact Support"].map(qa => (
                  <button key={qa} onClick={() => handleSend(undefined, qa.split(' ').slice(1).join(' '))} className="whitespace-nowrap px-3 py-1.5 bg-blue-50 text-blue-600 rounded-full text-[10px] font-bold hover:bg-blue-100 transition shrink-0">
                    {qa}
                  </button>
                ))}
              </div>
              <form onSubmit={(e) => handleSend(e)} className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="Ask about services, tracking..."
                  className="flex-1 bg-gray-100 text-sm border-none rounded-xl py-2 px-3 outline-none focus:ring-2 focus:ring-blue-500/50 transition"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center shrink-0 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition"
                >
                  <Send size={16} className={isLoading ? "animate-pulse" : ""} />
                </button>
              </form>
            </div>
          </>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
