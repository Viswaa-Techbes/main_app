"use client";

import { useEffect, useState } from "react";
import { fetchAuthApi } from "@/lib/api";
import { Card } from "@/components/ui/card";
import {
  MessageSquare,
  Plus,
  Clock,
  CheckCircle,
  AlertTriangle,
  ArrowLeft,
  Send,
  Building2,
  Home,
  ShieldCheck,
  UserCheck,
} from "lucide-react";
import { formatDateTime } from "@/lib/utils";
import { useAuth } from "@/features/auth/context/auth-context";

export default function SupportPage() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // View states
  const [activeTicket, setActiveTicket] = useState<any>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Forms
  const [replyText, setReplyText] = useState("");
  const [newSubject, setNewSubject] = useState("");
  const [newCategory, setNewCategory] = useState("Technical");
  const [newMessage, setNewMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const isAssociation = user?.role === "association";
  const isResident = user?.role === "resident";

  useEffect(() => {
    fetchTickets();
  }, []);

  async function fetchTickets() {
    try {
      setLoading(true);
      const res = await fetchAuthApi("/api/v2/customer/tickets");
      if (res.success && Array.isArray(res.data)) {
        setTickets(res.data);
      }
    } catch (e) {
      console.error("Failed to load tickets:", e);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateTicket(e: React.FormEvent) {
    e.preventDefault();
    if (!newSubject || !newMessage) return;

    try {
      setSubmitting(true);
      const res = await fetchAuthApi("/api/v2/customer/tickets", {
        method: "POST",
        body: JSON.stringify({
          subject: newSubject,
          category: newCategory,
          description: newMessage,
          messageText: newMessage,
        }),
      });

      if (res.success) {
        setTickets([res.data, ...tickets]);
        setIsCreating(false);
        setNewSubject("");
        setNewMessage("");
      } else {
        alert(res.message || "Failed to create ticket");
      }
    } catch (err: any) {
      alert(err.message || "Failed to create ticket");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleReply(e: React.FormEvent) {
    e.preventDefault();
    if (!replyText || !activeTicket) return;

    try {
      const res = await fetchAuthApi(`/api/v2/customer/tickets/${activeTicket._id}/reply`, {
        method: "PUT",
        body: JSON.stringify({ text: replyText }),
      });

      if (res.success) {
        setActiveTicket(res.data);
        setTickets(tickets.map((t) => (t._id === res.data._id ? res.data : t)));
        setReplyText("");
      }
    } catch (err: any) {
      alert("Failed to send reply");
    }
  }

  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center animate-pulse">
        <MessageSquare size={48} className="text-gray-200" />
      </div>
    );
  }

  // Render Create Form
  if (isCreating) {
    return (
      <div className="max-w-3xl space-y-4">
        <button
          onClick={() => setIsCreating(false)}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 font-medium"
        >
          <ArrowLeft size={20} /> Back to Tickets
        </button>

        {isAssociation && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl flex items-center gap-3 text-blue-900 text-sm">
            <Building2 className="text-blue-600 shrink-0" size={24} />
            <div>
              <p className="font-bold">Raising Apartment Association Ticket</p>
              <p className="text-xs text-blue-700">
                This ticket will be registered for common facilities and will be visible to all 3 association committee members.
              </p>
            </div>
          </div>
        )}

        {isResident && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-emerald-900 text-sm">
            <Home className="text-emerald-600 shrink-0" size={24} />
            <div>
              <p className="font-bold">Raising Resident Flat Ticket (Flat #{user?.flatNumber})</p>
              <p className="text-xs text-emerald-700">
                In accordance with apartment policy, resident tickets are tied exclusively to your registered flat.
              </p>
            </div>
          </div>
        )}

        <Card className="p-8 rounded-2xl shadow-sm border-gray-100 bg-white">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Support Ticket</h2>
          <form onSubmit={handleCreateTicket} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Subject / Issue Summary</label>
              <input
                type="text"
                required
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-blue-500 transition"
                placeholder={
                  isAssociation
                    ? "e.g. Common Area CCTV Camera 4 Offline"
                    : isResident
                    ? "e.g. Intercom / Wi-Fi cabling issue in bedroom"
                    : "Briefly describe your issue"
                }
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-blue-500 transition"
              >
                <option value="Technical">Technical Support (CCTV / Networking)</option>
                <option value="Maintenance">Maintenance & Service</option>
                <option value="Payment">Payment / Billing</option>
                <option value="Booking">Installation / Booking</option>
                <option value="Complaint">Complaint</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Detailed Description</label>
              <textarea
                required
                rows={5}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-blue-500 transition resize-none"
                placeholder="Provide detailed description of the issue or requirement..."
              ></textarea>
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl transition shadow-md shadow-blue-200 disabled:opacity-50"
            >
              {submitting ? "Submitting..." : "Submit Ticket"}
            </button>
          </form>
        </Card>
      </div>
    );
  }

  // Render Active Ticket Chat
  if (activeTicket) {
    return (
      <div className="max-w-4xl h-[80vh] flex flex-col bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveTicket(null)}
              className="p-2 hover:bg-gray-200 rounded-lg text-gray-500 transition"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-gray-900">{activeTicket.subject}</h2>
                {activeTicket.raisedByType === "association" && (
                  <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-full">
                    Association
                  </span>
                )}
                {activeTicket.raisedByType === "resident" && (
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                    Flat {activeTicket.flatNumber}
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500">
                Ticket #{activeTicket.ticketId || activeTicket._id.slice(-6).toUpperCase()} &bull;{" "}
                {activeTicket.category}
                {activeTicket.apartmentName && <span> &bull; {activeTicket.apartmentName}</span>}
              </p>
            </div>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold ${
              activeTicket.status === "Resolved" || activeTicket.status === "Closed"
                ? "bg-emerald-100 text-emerald-800"
                : "bg-amber-100 text-amber-800"
            }`}
          >
            {activeTicket.status}
          </span>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/30">
          {(activeTicket.messages || []).map((msg: any, i: number) => {
            const isMe =
              msg.sender === user?._id ||
              msg.sender === user?.id ||
              msg.sender?._id === user?._id;
            return (
              <div key={i} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] rounded-2xl p-4 ${
                    isMe
                      ? "bg-blue-600 text-white rounded-tr-sm shadow-md shadow-blue-200"
                      : "bg-white border border-gray-100 text-gray-800 rounded-tl-sm shadow-sm"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                  <p className={`text-[11px] mt-2 ${isMe ? "text-blue-200" : "text-gray-400"}`}>
                    {formatDateTime(msg.createdAt)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-100 bg-white">
          <form onSubmit={handleReply} className="flex gap-2">
            <input
              type="text"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Type your reply..."
              className="flex-1 bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 outline-none focus:border-blue-400 transition"
            />
            <button
              type="submit"
              disabled={!replyText}
              className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-xl transition disabled:opacity-50"
            >
              <Send size={20} />
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Render Ticket List
  return (
    <div className="space-y-6 max-w-5xl">
      {/* Role Notice Banners */}
      {isAssociation && (
        <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-2xl shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Building2 size={28} className="text-blue-200" />
            <div>
              <h3 className="font-bold text-base">Apartment Association Portal</h3>
              <p className="text-xs text-blue-100">
                You are logged in as an Association Member. All tickets for your apartment complex are visible to all 3 association committee accounts.
              </p>
            </div>
          </div>
          <span className="text-xs font-bold uppercase bg-white/20 px-3 py-1 rounded-full">
            Role: Association
          </span>
        </div>
      )}

      {isResident && (
        <div className="p-4 bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-2xl shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Home size={28} className="text-emerald-200" />
            <div>
              <h3 className="font-bold text-base">Resident Portal &bull; Flat {user?.flatNumber}</h3>
              <p className="text-xs text-emerald-100">
                Tickets created here are specifically tied to your flat. Association issues are managed by the building committee.
              </p>
            </div>
          </div>
          <span className="text-xs font-bold uppercase bg-white/20 px-3 py-1 rounded-full">
            Flat {user?.flatNumber}
          </span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Support & Service Tickets</h1>
          <p className="text-gray-500 text-sm">
            Manage your service requests, installation inquiries, and incident reports.
          </p>
        </div>
        <button
          onClick={() => setIsCreating(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-xl transition flex items-center justify-center gap-2 shadow-sm"
        >
          <Plus size={18} /> New Ticket
        </button>
      </div>

      <Card className="p-0 overflow-hidden border-gray-100 shadow-sm rounded-2xl bg-white">
        {tickets.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {tickets.map((t) => (
              <div
                key={t._id}
                onClick={() => setActiveTicket(t)}
                className="p-6 hover:bg-gray-50 transition cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold bg-slate-100 text-slate-800 px-2.5 py-0.5 rounded">
                      {t.ticketId || `#${t._id.slice(-6).toUpperCase()}`}
                    </span>
                    <h3 className="font-bold text-gray-900">{t.subject}</h3>
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-bold ${
                        t.status === "Resolved" || t.status === "Closed"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {t.status}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 pt-1">
                    <span>Category: {t.category}</span>
                    {t.apartmentName && <span>&bull; {t.apartmentName}</span>}
                    {t.raisedByType === "association" && (
                      <span className="inline-flex items-center gap-1 font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                        <Building2 size={12} /> Raised By: Association
                      </span>
                    )}
                    {t.raisedByType === "resident" && (
                      <span className="inline-flex items-center gap-1 font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                        <Home size={12} /> Flat {t.flatNumber} (Resident)
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm shrink-0">
                  <div className="flex items-center gap-1 text-gray-400 text-xs">
                    <Clock size={14} /> {new Date(t.updatedAt || t.createdAt).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-1 text-blue-600 font-medium bg-blue-50 px-3 py-1 rounded-full text-xs">
                    <MessageSquare size={14} /> {t.messages?.length || 1}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center text-gray-500">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare size={28} className="text-gray-300" />
            </div>
            <p className="text-gray-900 font-medium">No tickets found</p>
            <p className="text-sm">You haven't opened any support requests yet.</p>
          </div>
        )}
      </Card>
    </div>
  );
}
