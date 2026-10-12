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
  RotateCcw,
  AlertCircle,
  Wrench,
  Paperclip,
  CheckCircle2,
} from "lucide-react";
import { formatDateTime } from "@/lib/utils";
import { useAuth } from "@/features/auth/context/auth-context";

const RESIDENT_CATEGORIES = [
  "Plumbing/Water",
  "Electrical",
  "Lift",
  "Security",
  "Cleaning",
  "Waste Management",
  "Internet",
  "Civil Maintenance",
  "Other",
];

const STANDARD_CATEGORIES = [
  "Technical",
  "Maintenance",
  "Payment",
  "Booking",
  "Complaint",
  "Other",
];

const PRIORITIES = [
  { value: "Low", label: "Low Priority", color: "bg-blue-50 text-blue-700 border-blue-200" },
  { value: "Medium", label: "Medium Priority", color: "bg-amber-50 text-amber-700 border-amber-200" },
  { value: "High", label: "High Priority", color: "bg-orange-50 text-orange-700 border-orange-200" },
  { value: "Emergency", label: "Emergency (Immediate)", color: "bg-red-50 text-red-700 border-red-300 font-bold" },
];

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
  const [newCategory, setNewCategory] = useState("Plumbing/Water");
  const [newPriority, setNewPriority] = useState("Medium");
  const [newMessage, setNewMessage] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Reopen state
  const [showReopenModal, setShowReopenModal] = useState(false);
  const [reopenReason, setReopenReason] = useState("");
  const [reopening, setReopening] = useState(false);

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
          priority: newPriority,
          description: newMessage,
          messageText: newMessage,
          attachments: photoUrl ? [photoUrl] : [],
        }),
      });

      if (res.success) {
        setTickets([res.data, ...tickets]);
        setIsCreating(false);
        setNewSubject("");
        setNewMessage("");
        setPhotoUrl("");
        setNewPriority("Medium");
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

  async function handleReopenTicket(e: React.FormEvent) {
    e.preventDefault();
    if (!reopenReason.trim() || !activeTicket) return;

    try {
      setReopening(true);
      const res = await fetchAuthApi(`/api/v2/customer/tickets/${activeTicket._id}/reopen`, {
        method: "PUT",
        body: JSON.stringify({ reason: reopenReason }),
      });

      if (res.success) {
        setActiveTicket(res.data);
        setTickets(tickets.map((t) => (t._id === res.data._id ? res.data : t)));
        setShowReopenModal(false);
        setReopenReason("");
      } else {
        alert(res.message || "Failed to reopen ticket");
      }
    } catch (err: any) {
      alert(err.message || "Failed to reopen ticket");
    } finally {
      setReopening(false);
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
    const categories = isResident ? RESIDENT_CATEGORIES : STANDARD_CATEGORIES;

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
                This ticket will be registered for common facilities and will be visible to all association committee members.
              </p>
            </div>
          </div>
        )}

        {isResident && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-emerald-900 text-sm">
            <Home className="text-emerald-600 shrink-0" size={24} />
            <div>
              <p className="font-bold">Raising Resident Flat Ticket</p>
              <p className="text-xs text-emerald-700">
                Tied to your registered flat: <strong>{user?.block ? `Block ${user.block}, ` : ""}Flat #{user?.flatNumber || "N/A"}</strong>
              </p>
            </div>
          </div>
        )}

        <Card className="p-8 rounded-2xl shadow-sm border-gray-100 bg-white">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {isResident ? "Raise Society Maintenance Complaint" : "Create New Support Ticket"}
          </h2>
          <form onSubmit={handleCreateTicket} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Subject / Issue Summary *</label>
              <input
                type="text"
                required
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-blue-500 transition"
                placeholder={
                  isResident
                    ? "e.g. Water leakage in master bathroom ceiling / Lift 2 malfunctioning"
                    : isAssociation
                    ? "e.g. Common Area CCTV Camera 4 Offline"
                    : "Briefly describe your issue"
                }
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Complaint Category *</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-blue-500 transition font-medium"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Urgency / Priority *</label>
                <select
                  value={newPriority}
                  onChange={(e) => setNewPriority(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-blue-500 transition font-medium"
                >
                  {PRIORITIES.map((p) => (
                    <option key={p.value} value={p.value}>{p.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Detailed Description *</label>
              <textarea
                required
                rows={5}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-blue-500 transition resize-none"
                placeholder="Provide detailed description of the issue, location, when it started, and any symptoms..."
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Attachment / Photo URL (Optional)
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  placeholder="https://example.com/photo-of-leakage.jpg"
                  className="flex-1 bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-blue-500 transition text-sm"
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Provide a photo link showing the problem to help the maintenance team diagnose faster.
              </p>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl transition shadow-md shadow-blue-200 disabled:opacity-50"
            >
              {submitting ? "Submitting..." : isResident ? "Submit Society Complaint" : "Submit Ticket"}
            </button>
          </form>
        </Card>
      </div>
    );
  }

  // Render Active Ticket Detail & Chat
  if (activeTicket) {
    const isResolvedOrClosed =
      activeTicket.status === "Resolved" || activeTicket.status === "Closed";

    return (
      <div className="max-w-4xl flex flex-col bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-gray-100 bg-gray-50/70">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveTicket(null)}
                className="p-2 hover:bg-gray-200 rounded-lg text-gray-500 transition shrink-0"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-bold text-gray-900 text-lg">{activeTicket.subject}</h2>
                  <span className="font-mono text-xs font-bold bg-slate-200 text-slate-800 px-2 py-0.5 rounded">
                    #{activeTicket.ticketId || activeTicket._id.slice(-6).toUpperCase()}
                  </span>
                  {activeTicket.priority && (
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase border ${
                        activeTicket.priority === "Emergency"
                          ? "bg-red-100 text-red-800 border-red-200 animate-pulse"
                          : activeTicket.priority === "High"
                          ? "bg-orange-100 text-orange-800 border-orange-200"
                          : "bg-blue-50 text-blue-700 border-blue-200"
                      }`}
                    >
                      {activeTicket.priority} Priority
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Category: <strong>{activeTicket.category}</strong>
                  {activeTicket.flatNumber && (
                    <span> &bull; Flat #{activeTicket.flatNumber}</span>
                  )}
                  {activeTicket.apartmentName && (
                    <span> &bull; {activeTicket.apartmentName}</span>
                  )}
                  <span> &bull; Raised {formatDateTime(activeTicket.createdAt)}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold border ${
                  activeTicket.status === "Resolved"
                    ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                    : activeTicket.status === "Closed"
                    ? "bg-gray-200 text-gray-800 border-gray-300"
                    : activeTicket.status === "Reopened"
                    ? "bg-red-100 text-red-800 border-red-300 font-bold"
                    : activeTicket.status === "In Progress"
                    ? "bg-indigo-100 text-indigo-800 border-indigo-200"
                    : activeTicket.status === "Assigned"
                    ? "bg-blue-100 text-blue-800 border-blue-200"
                    : "bg-amber-100 text-amber-800 border-amber-200"
                }`}
              >
                {activeTicket.status}
              </span>

              {isResolvedOrClosed && (
                <button
                  onClick={() => setShowReopenModal(true)}
                  className="bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition shadow-sm"
                >
                  <RotateCcw size={14} /> Reopen
                </button>
              )}
            </div>
          </div>

          {/* Workflow tracker banner */}
          <div className="mt-4 pt-3 border-t border-gray-200/60 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-gray-400 font-semibold">Workflow:</span>
            {["New", "Acknowledged", "Assigned", "In Progress", "Resolved", "Closed"].map((st, idx) => {
              const currentIdx = [
                "New",
                "Acknowledged",
                "Assigned",
                "In Progress",
                "Resolved",
                "Closed",
              ].indexOf(activeTicket.status);
              const isPastOrCurrent = currentIdx >= idx;
              const isCurrent = activeTicket.status === st;

              return (
                <div key={st} className="flex items-center gap-1">
                  <span
                    className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                      isCurrent
                        ? "bg-blue-600 text-white"
                        : isPastOrCurrent
                        ? "bg-blue-100 text-blue-800"
                        : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    {st}
                  </span>
                  {idx < 5 && <span className="text-gray-300">&rarr;</span>}
                </div>
              );
            })}
            {activeTicket.status === "Reopened" && (
              <span className="bg-red-600 text-white px-2 py-0.5 rounded text-[11px] font-bold">
                Reopened
              </span>
            )}
          </div>

          {/* Assigned staff notice */}
          {activeTicket.assignedStaffName && (
            <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-xl flex items-center gap-3 text-xs text-blue-900">
              <Wrench size={18} className="text-blue-600 shrink-0" />
              <div>
                <p className="font-bold">
                  Assigned Maintenance Staff: {activeTicket.assignedStaffName}
                  {activeTicket.assignedStaffPhone && (
                    <span className="font-normal text-blue-700"> ({activeTicket.assignedStaffPhone})</span>
                  )}
                </p>
                <p className="text-blue-700 text-[11px]">
                  Technician is scheduled to inspect and resolve your issue.
                </p>
              </div>
            </div>
          )}

          {/* Resolution banner */}
          {activeTicket.resolutionNotes && (
            <div className="mt-3 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900">
              <div className="flex items-center gap-2 font-bold mb-1">
                <CheckCircle2 size={16} className="text-emerald-600" />
                Resolution Report:
              </div>
              <p className="text-emerald-800 whitespace-pre-wrap">{activeTicket.resolutionNotes}</p>
            </div>
          )}

          {/* Reopen notice */}
          {activeTicket.isReopened && activeTicket.reopenReason && (
            <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900">
              <div className="flex items-center gap-2 font-bold mb-1">
                <RotateCcw size={14} className="text-amber-700" />
                Complaint Reopened Reason:
              </div>
              <p className="text-amber-800 italic">"{activeTicket.reopenReason}"</p>
            </div>
          )}
        </div>

        {/* Messages */}
        <div className="h-[400px] overflow-y-auto p-6 space-y-4 bg-gray-50/40">
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
                      ? "bg-blue-600 text-white rounded-tr-sm shadow-sm"
                      : "bg-white border border-gray-100 text-gray-800 rounded-tl-sm shadow-sm"
                  }`}
                >
                  <div className="text-[11px] font-bold opacity-80 mb-1">
                    {msg.senderName || (isMe ? "You" : "Support / Committee")}
                  </div>
                  <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.text}</p>
                  <p className={`text-[10px] mt-2 ${isMe ? "text-blue-200" : "text-gray-400"}`}>
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
              placeholder="Type your message or clarification..."
              className="flex-1 bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 outline-none focus:border-blue-400 transition text-sm"
            />
            <button
              type="submit"
              disabled={!replyText}
              className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-xl transition disabled:opacity-50"
            >
              <Send size={18} />
            </button>
          </form>
        </div>

        {/* Reopen Modal */}
        {showReopenModal && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
              <div className="flex items-center gap-2 text-amber-600">
                <RotateCcw size={22} />
                <h3 className="font-bold text-lg text-gray-900">Reopen Complaint</h3>
              </div>
              <p className="text-xs text-gray-500">
                Please provide the reason why this complaint is not yet resolved to your satisfaction. The committee and maintenance team will be notified.
              </p>
              <form onSubmit={handleReopenTicket} className="space-y-4">
                <textarea
                  required
                  rows={4}
                  value={reopenReason}
                  onChange={(e) => setReopenReason(e.target.value)}
                  placeholder="e.g. Issue recurred the next morning / Water leakage started again..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-amber-500 resize-none"
                ></textarea>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowReopenModal(false)}
                    className="px-4 py-2 border border-gray-200 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={reopening || !reopenReason.trim()}
                    className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow transition disabled:opacity-50"
                  >
                    {reopening ? "Reopening..." : "Confirm Reopen"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
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
                You are logged in as an Association Committee Member. All tickets for your apartment complex are visible.
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
              <h3 className="font-bold text-base">
                Resident Portal &bull; {user?.block ? `Block ${user.block}, ` : ""}Flat #{user?.flatNumber || "N/A"}
              </h3>
              <p className="text-xs text-emerald-100">
                Complaints submitted here are tied to your registered flat and tracked by your society management.
              </p>
            </div>
          </div>
          <span className="text-xs font-bold uppercase bg-white/20 px-3 py-1 rounded-full">
            Flat #{user?.flatNumber || "N/A"}
          </span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isResident ? "Society Complaints & Service Tickets" : "Support & Service Tickets"}
          </h1>
          <p className="text-gray-500 text-sm">
            {isResident
              ? "Raise complaints for plumbing, electrical, lift, security or common amenities and track resolution."
              : "Manage your service requests, installation inquiries, and incident reports."}
          </p>
        </div>
        <button
          onClick={() => setIsCreating(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-xl transition flex items-center justify-center gap-2 shadow-sm"
        >
          <Plus size={18} /> {isResident ? "Raise Complaint" : "New Ticket"}
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
                          : t.status === "Reopened"
                          ? "bg-red-100 text-red-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {t.status}
                    </span>
                    {t.priority && (
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                          t.priority === "Emergency"
                            ? "bg-red-100 text-red-700 font-extrabold"
                            : t.priority === "High"
                            ? "bg-orange-100 text-orange-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {t.priority}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 pt-1">
                    <span>Category: <strong>{t.category}</strong></span>
                    {t.apartmentName && <span>&bull; {t.apartmentName}</span>}
                    {t.flatNumber && (
                      <span className="inline-flex items-center gap-1 font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                        <Home size={12} /> Flat #{t.flatNumber}
                      </span>
                    )}
                    {t.assignedStaffName && (
                      <span className="inline-flex items-center gap-1 font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                        <Wrench size={12} /> Tech: {t.assignedStaffName}
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
            <p className="text-sm">
              {isResident
                ? "You haven't submitted any complaints for your flat yet."
                : "You haven't opened any support requests yet."}
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}
