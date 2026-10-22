"use client";

import { useEffect, useState, useRef } from "react";
import { useAuth } from "@/features/auth/context/auth-context";
import { fetchAuthApi } from "@/lib/api";
import { AUTH_TOKEN_STORAGE_KEY } from "@/core/api/config";
import { Card } from "@/components/ui/card";
import {
  Building2,
  Home,
  Wrench,
  AlertCircle,
  CheckCircle2,
  Clock,
  Plus,
  Send,
  Upload,
  Image as ImageIcon,
  RotateCcw,
  ArrowRight,
  ShieldCheck,
  Phone,
  User,
  X,
  Search,
  MessageSquare,
  Sparkles,
  ChevronRight,
  LogOut,
  MapPin,
  Calendar,
  Filter,
} from "lucide-react";
import Link from "next/link";
import { formatDateTime } from "@/lib/utils";

const COMPLAINT_CATEGORIES = [
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

const PRIORITY_OPTIONS = [
  { value: "Low", label: "Low (Normal routine)", color: "text-blue-700 bg-blue-50 border-blue-200" },
  { value: "Medium", label: "Medium (Standard attention)", color: "text-amber-700 bg-amber-50 border-amber-200" },
  { value: "High", label: "High (Affecting daily living)", color: "text-orange-700 bg-orange-50 border-orange-200" },
  { value: "Emergency", label: "Emergency (Immediate hazard/burst pipe)", color: "text-red-700 bg-red-50 border-red-300 font-bold" },
];

export default function ResidentPortalPage() {
  const { user, status, logout } = useAuth();

  // Resident & Apartment Profile Data
  const [profileData, setProfileData] = useState<any>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  // Complaints / Tickets Data
  const [tickets, setTickets] = useState<any[]>([]);
  const [loadingTickets, setLoadingTickets] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Create Complaint Modal / Form
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState("Plumbing/Water");
  const [priority, setPriority] = useState("Medium");
  const [description, setDescription] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");

  // Detailed Ticket Inspector Modal / Drawer
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [replyText, setReplyText] = useState("");
  const [sendingReply, setSendingReply] = useState(false);
  const [replyPhotoUrl, setReplyPhotoUrl] = useState("");
  const [uploadingReplyPhoto, setUploadingReplyPhoto] = useState(false);

  // Reopen Modal
  const [showReopenModal, setShowReopenModal] = useState(false);
  const [reopenReason, setReopenReason] = useState("");
  const [reopening, setReopening] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const replyFileInputRef = useRef<HTMLInputElement>(null);

  // Initial Data Fetch
  useEffect(() => {
    if (status === "authenticated") {
      fetchResidentProfile();
      fetchComplaints();
    }
  }, [status]);

  async function fetchResidentProfile() {
    try {
      setLoadingProfile(true);
      const res = await fetchAuthApi("/api/v2/apartments/residents/me");
      if (res.success && res.data) {
        setProfileData(res.data);
      }
    } catch (err) {
      console.warn("Could not load resident apartment profile", err);
    } finally {
      setLoadingProfile(false);
    }
  }

  async function fetchComplaints() {
    try {
      setLoadingTickets(true);
      const res = await fetchAuthApi("/api/v2/apartments/tickets");
      if (res.success && Array.isArray(res.data)) {
        setTickets(res.data);
      }
    } catch (err) {
      console.error("Failed to load complaints", err);
    } finally {
      setLoadingTickets(false);
    }
  }

  // Handle Photo Upload using project's backend upload endpoint
  async function handleFileUpload(file: File, isReply: boolean = false) {
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      alert("File size exceeds 10MB limit. Please choose a smaller photo.");
      return;
    }

    try {
      if (isReply) setUploadingReplyPhoto(true);
      else setUploadingPhoto(true);

      const token =
        localStorage.getItem(AUTH_TOKEN_STORAGE_KEY) ||
        localStorage.getItem("token") ||
        localStorage.getItem("accessToken");

      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/v2/upload", {
        method: "POST",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Photo upload failed");
      }

      const uploadedUrl = data.url || data.fileUrl || data.public_id;
      if (isReply) {
        setReplyPhotoUrl(uploadedUrl);
      } else {
        setPhotoUrl(uploadedUrl);
      }
    } catch (err: any) {
      alert(err.message || "Failed to upload photo. You can still paste an image link.");
    } finally {
      if (isReply) setUploadingReplyPhoto(false);
      else setUploadingPhoto(false);
    }
  }

  // Submit Complaint
  async function handleSubmitComplaint(e: React.FormEvent) {
    e.preventDefault();
    setSubmitError("");
    setSubmitSuccess("");

    if (!subject.trim()) {
      return setSubmitError("Please enter a complaint title/subject.");
    }
    if (!description.trim()) {
      return setSubmitError("Please provide a description of the issue.");
    }

    try {
      setSubmitting(true);
      const res = await fetchAuthApi("/api/v2/apartments/tickets", {
        method: "POST",
        body: JSON.stringify({
          subject: subject.trim(),
          category,
          priority,
          description: description.trim(),
          attachments: photoUrl ? [photoUrl] : [],
        }),
      });

      if (res.success && res.data) {
        setSubmitSuccess("Complaint submitted successfully! Your society maintenance committee has been alerted.");
        setTickets([res.data, ...tickets]);
        setTimeout(() => {
          setShowCreateModal(false);
          setSubject("");
          setDescription("");
          setPhotoUrl("");
          setPriority("Medium");
          setSubmitSuccess("");
        }, 1500);
      } else {
        setSubmitError(res.message || "Failed to submit complaint.");
      }
    } catch (err: any) {
      setSubmitError(err.message || "An unexpected error occurred while submitting.");
    } finally {
      setSubmitting(false);
    }
  }

  // Send Reply in Ticket Thread
  async function handleSendReply(e: React.FormEvent) {
    e.preventDefault();
    if (!replyText.trim() && !replyPhotoUrl) return;
    if (!selectedTicket) return;

    try {
      setSendingReply(true);
      const res = await fetchAuthApi(`/api/v2/apartments/tickets/${selectedTicket._id}/reply`, {
        method: "PUT",
        body: JSON.stringify({
          text: replyText.trim(),
          images: replyPhotoUrl ? [replyPhotoUrl] : [],
        }),
      });

      if (res.success && res.data) {
        setSelectedTicket(res.data);
        setTickets(tickets.map((t) => (t._id === res.data._id ? res.data : t)));
        setReplyText("");
        setReplyPhotoUrl("");
      } else {
        alert(res.message || "Failed to send response");
      }
    } catch (err: any) {
      alert(err.message || "Failed to send message");
    } finally {
      setSendingReply(false);
    }
  }

  // Resident Reopen Complaint
  async function handleReopen(e: React.FormEvent) {
    e.preventDefault();
    if (!reopenReason.trim() || !selectedTicket) return;

    try {
      setReopening(true);
      const res = await fetchAuthApi(`/api/v2/apartments/tickets/${selectedTicket._id}/reopen`, {
        method: "PUT",
        body: JSON.stringify({ reason: reopenReason.trim() }),
      });

      if (res.success && res.data) {
        setSelectedTicket(res.data);
        setTickets(tickets.map((t) => (t._id === res.data._id ? res.data : t)));
        setShowReopenModal(false);
        setReopenReason("");
      } else {
        alert(res.message || "Failed to reopen complaint");
      }
    } catch (err: any) {
      alert(err.message || "Failed to reopen complaint");
    } finally {
      setReopening(false);
    }
  }

  // Close Complaint as Satisfied Resident
  async function handleCloseComplaint() {
    if (!selectedTicket) return;
    if (!confirm("Are you sure you want to mark this complaint as Closed?")) return;

    try {
      const res = await fetchAuthApi(`/api/v2/apartments/tickets/${selectedTicket._id}/reply`, {
        method: "PUT",
        body: JSON.stringify({
          text: "Resident confirmed resolution and closed ticket.",
          status: "Closed",
        }),
      });

      if (res.success && res.data) {
        setSelectedTicket(res.data);
        setTickets(tickets.map((t) => (t._id === res.data._id ? res.data : t)));
      }
    } catch (err: any) {
      alert(err.message || "Failed to close ticket");
    }
  }

  // Filtered complaints list
  const filteredTickets = tickets.filter((t) => {
    // Status filter
    if (filterStatus === "active") {
      if (!["New", "Acknowledged", "Assigned", "In Progress", "Reopened"].includes(t.status)) return false;
    } else if (filterStatus === "resolved") {
      if (t.status !== "Resolved") return false;
    } else if (filterStatus === "closed") {
      if (t.status !== "Closed") return false;
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchSub = t.subject?.toLowerCase().includes(q);
      const matchCat = t.category?.toLowerCase().includes(q);
      const matchId = (t.ticketId || t._id)?.toLowerCase().includes(q);
      return matchSub || matchCat || matchId;
    }

    return true;
  });

  const activeCount = tickets.filter((t) =>
    ["New", "Acknowledged", "Assigned", "In Progress", "Reopened"].includes(t.status)
  ).length;
  const resolvedCount = tickets.filter((t) => t.status === "Resolved").length;
  const closedCount = tickets.filter((t) => t.status === "Closed").length;

  // Unauthenticated view
  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 rounded-3xl bg-slate-800 border border-slate-700 text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-blue-600/20 text-blue-400 flex items-center justify-center mx-auto shadow-inner">
            <Building2 size={36} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Resident Portal</h1>
            <p className="text-sm text-slate-400 mt-2">
              Sign in with your registered mobile number or email to access your society complaints and flat dashboard.
            </p>
          </div>
          <div className="space-y-3 pt-2">
            <Link
              href="/login?redirect=/resident"
              className="block w-full py-3.5 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition shadow-lg shadow-blue-500/20"
            >
              Sign In to Resident Account
            </Link>
            <Link
              href="/resident/activate"
              className="block w-full py-3 px-6 rounded-2xl bg-slate-700/60 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition border border-slate-600"
            >
              Have an activation code? Activate Flat
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  // Loading state
  if (status === "loading" || loadingProfile) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-bold text-slate-500">Loading Resident Portal...</p>
        </div>
      </div>
    );
  }

  const apartmentName =
    profileData?.apartment?.name ||
    user?.apartmentName ||
    (user?.apartment as any)?.name ||
    "Your Apartment Complex";
  const flatNumber =
    profileData?.resident?.flatNumber || user?.flatNumber || "Unassigned";
  const block = profileData?.resident?.block || user?.block || "";
  const residentType = profileData?.resident?.residentType || "Owner";

  return (
    <div className="min-h-screen bg-slate-50/60 pb-16">
      {/* ── Top Hero & Society Banner ────────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.25),transparent_50%)] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs font-semibold">
                <Building2 size={14} className="text-blue-300" />
                <span>TechBes Society Resident Network</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                {apartmentName}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-300">
                <span className="flex items-center gap-1.5 font-bold text-white bg-white/10 px-3 py-1 rounded-lg backdrop-blur-xs">
                  <Home size={15} className="text-emerald-400" />
                  {block ? `Block ${block}, ` : ""}Flat #{flatNumber}
                </span>
                <span className="capitalize px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold text-xs border border-emerald-500/30">
                  {residentType} Resident
                </span>
                <span className="flex items-center gap-1 text-slate-400">
                  <User size={13} /> {user?.name}
                </span>
                {profileData?.apartment?.locality && (
                  <span className="flex items-center gap-1 text-slate-400">
                    <MapPin size={13} /> {profileData.apartment.locality}, {profileData.apartment.city || "Bangalore"}
                  </span>
                )}
              </div>
            </div>

            {/* Quick Actions & Logout */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-5 py-3 rounded-2xl shadow-lg shadow-emerald-500/25 flex items-center gap-2 text-sm transition transform active:scale-95"
              >
                <Plus size={18} /> Lodge Complaint
              </button>
              <button
                onClick={logout}
                title="Log Out Securely"
                className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 text-slate-200 transition"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        {/* ── Status Metric Cards ────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card className="p-4 rounded-2xl bg-white shadow-sm border border-slate-200/60 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <MessageSquare size={22} />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500">Total Filed</p>
              <h3 className="text-xl font-extrabold text-slate-900">{tickets.length}</h3>
            </div>
          </Card>

          <Card className="p-4 rounded-2xl bg-white shadow-sm border border-slate-200/60 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Clock size={22} />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500">In Progress</p>
              <h3 className="text-xl font-extrabold text-amber-600">{activeCount}</h3>
            </div>
          </Card>

          <Card className="p-4 rounded-2xl bg-white shadow-sm border border-slate-200/60 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <CheckCircle2 size={22} />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500">Resolved</p>
              <h3 className="text-xl font-extrabold text-emerald-600">{resolvedCount}</h3>
            </div>
          </Card>

          <Card className="p-4 rounded-2xl bg-white shadow-sm border border-slate-200/60 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
              <ShieldCheck size={22} />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500">Closed</p>
              <h3 className="text-xl font-extrabold text-slate-700">{closedCount}</h3>
            </div>
          </Card>
        </div>

        {/* ── Main Section: Complaints Registry & Details ──────────────────────── */}
        <div className="mt-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">
                Society Complaints & Maintenance Tickets
              </h2>
              <p className="text-xs text-slate-500">
                Track status updates, technician appointments, and resolution reports for your unit.
              </p>
            </div>

            {/* Filter Pills & Search */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search size={15} className="absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search complaint..."
                  className="pl-9 pr-3 py-2 text-xs rounded-xl bg-white border border-slate-200 focus:outline-blue-500 w-44 sm:w-56"
                />
              </div>

              <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200 gap-1 text-xs font-semibold">
                <button
                  onClick={() => setFilterStatus("all")}
                  className={`px-3 py-1.5 rounded-lg transition ${
                    filterStatus === "all" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  All ({tickets.length})
                </button>
                <button
                  onClick={() => setFilterStatus("active")}
                  className={`px-3 py-1.5 rounded-lg transition ${
                    filterStatus === "active" ? "bg-white text-amber-700 shadow-xs font-bold" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Active ({activeCount})
                </button>
                <button
                  onClick={() => setFilterStatus("resolved")}
                  className={`px-3 py-1.5 rounded-lg transition ${
                    filterStatus === "resolved" ? "bg-white text-emerald-700 shadow-xs font-bold" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Resolved ({resolvedCount})
                </button>
              </div>
            </div>
          </div>

          {/* Complaints Table / List */}
          {loadingTickets ? (
            <Card className="p-12 text-center text-slate-400 rounded-3xl bg-white border border-slate-200/60 animate-pulse">
              <p className="text-xs">Loading complaints...</p>
            </Card>
          ) : filteredTickets.length === 0 ? (
            <Card className="p-12 text-center rounded-3xl bg-white border border-slate-200/60 space-y-4">
              <div className="w-16 h-16 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center mx-auto">
                <Wrench size={28} />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-slate-900 text-sm">No complaints found</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  {searchQuery || filterStatus !== "all"
                    ? "Try adjusting your search query or filter criteria."
                    : "No maintenance issues currently logged for your flat. Need assistance?"}
                </p>
              </div>
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 transition"
              >
                <Plus size={16} /> Lodge a New Complaint
              </button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTickets.map((ticket) => {
                const isOverdue = ticket.isOverdue;
                const isResolved = ticket.status === "Resolved";
                const isClosed = ticket.status === "Closed";
                const isReopened = ticket.status === "Reopened";

                return (
                  <Card
                    key={ticket._id}
                    onClick={() => setSelectedTicket(ticket)}
                    className="p-5 rounded-3xl bg-white border border-slate-200/70 hover:border-blue-300 hover:shadow-md transition cursor-pointer flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono text-[11px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                          #{ticket.ticketId || ticket._id.slice(-6).toUpperCase()}
                        </span>

                        <span
                          className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase border ${
                            isResolved
                              ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                              : isClosed
                              ? "bg-slate-100 text-slate-700 border-slate-300"
                              : isReopened
                              ? "bg-red-50 text-red-700 border-red-300"
                              : ticket.status === "In Progress"
                              ? "bg-indigo-50 text-indigo-800 border-indigo-200"
                              : ticket.status === "Assigned"
                              ? "bg-blue-50 text-blue-800 border-blue-200"
                              : "bg-amber-50 text-amber-800 border-amber-200"
                          }`}
                        >
                          {ticket.status}
                        </span>
                      </div>

                      <h3 className="font-bold text-slate-900 text-sm line-clamp-1">
                        {ticket.subject}
                      </h3>

                      <p className="text-xs text-slate-500 line-clamp-2">
                        {ticket.description || "No description provided."}
                      </p>
                    </div>

                    <div className="space-y-2 pt-3 border-t border-slate-100 text-[11px] text-slate-500">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-700 bg-slate-50 px-2 py-0.5 rounded">
                          {ticket.category}
                        </span>
                        <span
                          className={`font-bold ${
                            ticket.priority === "Emergency"
                              ? "text-red-600 animate-pulse"
                              : ticket.priority === "High"
                              ? "text-orange-600"
                              : "text-slate-600"
                          }`}
                        >
                          {ticket.priority}
                        </span>
                      </div>

                      {ticket.assignedStaffName && (
                        <div className="flex items-center gap-1.5 text-blue-700 font-semibold bg-blue-50/70 p-2 rounded-xl">
                          <Wrench size={12} className="shrink-0" />
                          <span className="truncate">Staff: {ticket.assignedStaffName}</span>
                        </div>
                      )}

                      {ticket.resolutionNotes && (
                        <div className="flex items-center gap-1.5 text-emerald-700 font-medium bg-emerald-50/70 p-2 rounded-xl">
                          <CheckCircle2 size={12} className="shrink-0 text-emerald-600" />
                          <span className="truncate">Report: {ticket.resolutionNotes}</span>
                        </div>
                      )}

                      <div className="flex items-center justify-between text-slate-400 pt-1">
                        <span>{formatDateTime(ticket.createdAt)}</span>
                        <span className="text-blue-600 font-bold flex items-center gap-1">
                          View details <ChevronRight size={13} />
                        </span>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── CREATE COMPLAINT MODAL ────────────────────────────────────────────── */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <Card className="max-w-xl w-full p-6 sm:p-8 rounded-3xl bg-white border border-slate-100 shadow-2xl relative my-8 animate-in fade-in zoom-in duration-150">
            <button
              onClick={() => setShowCreateModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 transition"
            >
              <X size={18} />
            </button>

            <div className="space-y-1 mb-6">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full">
                <Wrench size={13} /> New Society Ticket
              </div>
              <h2 className="text-xl font-bold text-slate-900">
                Lodge a Maintenance Complaint
              </h2>
              <p className="text-xs text-slate-500">
                Unit: <strong>{block ? `Block ${block}, ` : ""}Flat #{flatNumber}</strong> &bull; {apartmentName}
              </p>
            </div>

            {submitError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-800 text-xs font-semibold mb-4 flex items-center gap-2">
                <AlertCircle size={16} className="text-red-500 shrink-0" />
                <span>{submitError}</span>
              </div>
            )}

            {submitSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold mb-4 flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                <span>{submitSuccess}</span>
              </div>
            )}

            <form onSubmit={handleSubmitComplaint} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Complaint Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold focus:outline-blue-500 text-slate-800"
                >
                  {COMPLAINT_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Urgency / Priority *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {PRIORITY_OPTIONS.map((p) => (
                    <button
                      type="button"
                      key={p.value}
                      onClick={() => setPriority(p.value)}
                      className={`py-2 px-2.5 rounded-xl text-[11px] font-bold border transition text-center ${
                        priority === p.value
                          ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                          : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      {p.value}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Title / Subject *
                </label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Master bathroom tap dripping, Lift door stuck on 4th floor"
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-200 bg-slate-50 text-xs focus:outline-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Detailed Description *
                </label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the exact location, symptoms, when it started, and any immediate hazard..."
                  className="w-full p-3.5 rounded-xl border border-slate-200 bg-slate-50 text-xs focus:outline-blue-500 resize-none"
                />
              </div>

              {/* Photo Upload Architecture */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Attach Photo (Optional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleFileUpload(f, false);
                  }}
                />

                {photoUrl ? (
                  <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 p-2 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={photoUrl}
                        alt="Attached proof"
                        className="w-14 h-14 object-cover rounded-xl border border-slate-200"
                      />
                      <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                        <CheckCircle2 size={14} /> Photo attached
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setPhotoUrl("")}
                      className="text-xs text-red-600 font-bold hover:underline px-3"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <button
                      type="button"
                      disabled={uploadingPhoto}
                      onClick={() => fileInputRef.current?.click()}
                      className="flex-1 py-3 px-4 rounded-xl border border-dashed border-slate-300 bg-slate-50 hover:bg-slate-100 transition flex items-center justify-center gap-2 text-xs font-bold text-slate-600 cursor-pointer"
                    >
                      <Upload size={16} />
                      {uploadingPhoto ? "Uploading Photo..." : "Choose Image File"}
                    </button>
                    <input
                      type="url"
                      placeholder="Or paste image URL"
                      value={photoUrl}
                      onChange={(e) => setPhotoUrl(e.target.value)}
                      className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50"
                    />
                  </div>
                )}
                <p className="text-[11px] text-slate-400 mt-1">
                  Supported formats: JPG, PNG, WEBP up to 10MB.
                </p>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || uploadingPhoto}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 disabled:opacity-50 transition"
                >
                  {submitting ? "Submitting..." : "Submit Complaint"}
                </button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* ── TICKET DETAIL & CHAT INSPECTOR MODAL ─────────────────────────────── */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-3 sm:p-6 overflow-y-auto">
          <Card className="max-w-3xl w-full max-h-[90vh] flex flex-col rounded-3xl bg-white border border-slate-100 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-150">
            {/* Header */}
            <div className="p-5 border-b border-slate-100 bg-slate-50/80 flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-bold bg-slate-200 text-slate-800 px-2 py-0.5 rounded">
                    #{selectedTicket.ticketId || selectedTicket._id.slice(-6).toUpperCase()}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase border ${
                      selectedTicket.status === "Resolved"
                        ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                        : selectedTicket.status === "Closed"
                        ? "bg-slate-200 text-slate-800 border-slate-300"
                        : selectedTicket.status === "Reopened"
                        ? "bg-red-50 text-red-800 border-red-300 font-bold"
                        : selectedTicket.status === "In Progress"
                        ? "bg-indigo-50 text-indigo-800 border-indigo-200"
                        : "bg-blue-50 text-blue-800 border-blue-200"
                    }`}
                  >
                    {selectedTicket.status}
                  </span>
                  <span className="text-xs font-bold text-slate-600 bg-white px-2.5 py-0.5 rounded-md border border-slate-200">
                    {selectedTicket.category}
                  </span>
                </div>
                <h2 className="text-lg font-bold text-slate-900">
                  {selectedTicket.subject}
                </h2>
                <p className="text-xs text-slate-500">
                  Logged on {formatDateTime(selectedTicket.createdAt)} &bull; Unit #{selectedTicket.flatNumber}
                </p>
              </div>

              <div className="flex items-center gap-2">
                {(selectedTicket.status === "Resolved" || selectedTicket.status === "Closed") && (
                  <button
                    onClick={() => setShowReopenModal(true)}
                    className="bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs px-3 py-1.5 rounded-xl flex items-center gap-1 transition shadow-xs"
                  >
                    <RotateCcw size={13} /> Reopen
                  </button>
                )}
                {selectedTicket.status === "Resolved" && (
                  <button
                    onClick={handleCloseComplaint}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3 py-1.5 rounded-xl flex items-center gap-1 transition shadow-xs"
                  >
                    <CheckCircle2 size={13} /> Confirm & Close
                  </button>
                )}
                <button
                  onClick={() => setSelectedTicket(null)}
                  className="p-1.5 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-600 transition"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Workflow progress line */}
            <div className="px-5 py-3 bg-white border-b border-slate-100 flex flex-wrap items-center gap-2 text-xs">
              <span className="text-slate-400 font-bold text-[10px] uppercase">Workflow:</span>
              {["New", "Acknowledged", "Assigned", "In Progress", "Resolved", "Closed"].map((st, idx) => {
                const stages = ["New", "Acknowledged", "Assigned", "In Progress", "Resolved", "Closed"];
                const currIdx = stages.indexOf(selectedTicket.status);
                const isPastOrCurrent = currIdx >= idx;
                const isCurrent = selectedTicket.status === st;

                return (
                  <div key={st} className="flex items-center gap-1">
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                        isCurrent
                          ? "bg-blue-600 text-white font-bold"
                          : isPastOrCurrent
                          ? "bg-blue-100 text-blue-800"
                          : "bg-slate-100 text-slate-400"
                      }`}
                    >
                      {st}
                    </span>
                    {idx < 5 && <span className="text-slate-300">&rarr;</span>}
                  </div>
                );
              })}
            </div>

            {/* Notifications & Assignment Banner */}
            <div className="px-5 py-2 space-y-2 bg-slate-50/50 border-b border-slate-100 text-xs">
              {selectedTicket.assignedStaffName && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-2xl flex items-center gap-3 text-blue-900">
                  <div className="w-8 h-8 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                    <Wrench size={16} />
                  </div>
                  <div>
                    <p className="font-bold">
                      Assigned Staff: {selectedTicket.assignedStaffName}
                      {selectedTicket.assignedStaffPhone && (
                        <span className="font-normal text-blue-700"> ({selectedTicket.assignedStaffPhone})</span>
                      )}
                    </p>
                    <p className="text-[11px] text-blue-600">
                      The maintenance team is assigned and coordinating the inspection.
                    </p>
                  </div>
                </div>
              )}

              {selectedTicket.resolutionNotes && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-950 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-800">
                    <CheckCircle2 size={16} className="text-emerald-600" />
                    Resolution Summary:
                  </div>
                  <p className="text-emerald-900 whitespace-pre-wrap">{selectedTicket.resolutionNotes}</p>
                  {selectedTicket.resolvedAt && (
                    <p className="text-[10px] text-emerald-700">
                      Resolved on {formatDateTime(selectedTicket.resolvedAt)}
                    </p>
                  )}
                </div>
              )}

              {selectedTicket.isReopened && selectedTicket.reopenReason && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl text-amber-900 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-amber-800">
                    <RotateCcw size={15} className="text-amber-700" />
                    Reopened Reason:
                  </div>
                  <p className="italic text-amber-800">"{selectedTicket.reopenReason}"</p>
                </div>
              )}
            </div>

            {/* Conversation Messages */}
            <div className="flex-1 overflow-y-auto p-5 space-y-3 bg-slate-100/40 min-h-[220px]">
              {(selectedTicket.messages || []).map((msg: any, i: number) => {
                const isMe =
                  msg.sender === user?._id ||
                  msg.sender === user?.id ||
                  msg.sender?._id === user?._id;

                return (
                  <div key={i} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 shadow-xs ${
                        isMe
                          ? "bg-blue-600 text-white rounded-tr-xs"
                          : "bg-white border border-slate-200/80 text-slate-800 rounded-tl-xs"
                      }`}
                    >
                      <div className="text-[11px] font-bold opacity-80 mb-1 flex items-center justify-between gap-4">
                        <span>{isMe ? "You (Resident)" : msg.sender?.name || "Society Committee / Support"}</span>
                      </div>
                      <p className="text-xs sm:text-sm whitespace-pre-wrap leading-relaxed">{msg.text}</p>

                      {Array.isArray(msg.images) && msg.images.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {msg.images.map((img: string, idx: number) => (
                            <a key={idx} href={img} target="_blank" rel="noopener noreferrer">
                              <img
                                src={img}
                                alt="Attachment"
                                className="w-20 h-20 object-cover rounded-xl border border-white/20 hover:opacity-90"
                              />
                            </a>
                          ))}
                        </div>
                      )}

                      <p className={`text-[10px] mt-2 text-right ${isMe ? "text-blue-200" : "text-slate-400"}`}>
                        {formatDateTime(msg.createdAt)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Message input */}
            <div className="p-4 bg-white border-t border-slate-100 space-y-2">
              <input
                type="file"
                accept="image/*"
                ref={replyFileInputRef}
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleFileUpload(f, true);
                }}
              />

              {replyPhotoUrl && (
                <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200 text-xs">
                  <img src={replyPhotoUrl} alt="Attached" className="w-10 h-10 object-cover rounded-lg" />
                  <span className="text-slate-600 flex-1 truncate">Image attached</span>
                  <button
                    type="button"
                    onClick={() => setReplyPhotoUrl("")}
                    className="text-red-600 font-bold text-xs"
                  >
                    Remove
                  </button>
                </div>
              )}

              <form onSubmit={handleSendReply} className="flex gap-2">
                <button
                  type="button"
                  onClick={() => replyFileInputRef.current?.click()}
                  title="Attach image"
                  disabled={uploadingReplyPhoto}
                  className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition"
                >
                  <ImageIcon size={18} />
                </button>
                <input
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Send a response or update to maintenance team..."
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-blue-500"
                />
                <button
                  type="submit"
                  disabled={sendingReply || (!replyText.trim() && !replyPhotoUrl)}
                  className="bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-bold px-4 rounded-xl flex items-center justify-center transition"
                >
                  <Send size={16} />
                </button>
              </form>
            </div>
          </Card>
        </div>
      )}

      {/* ── REOPEN COMPLAINT MODAL ───────────────────────────────────────────── */}
      {showReopenModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <Card className="max-w-md w-full p-6 rounded-3xl bg-white border border-slate-100 shadow-2xl space-y-4">
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-900">Reopen Complaint</h3>
              <p className="text-xs text-slate-500">
                Please describe why this maintenance complaint requires further work.
              </p>
            </div>

            <form onSubmit={handleReopen} className="space-y-4">
              <textarea
                required
                rows={3}
                value={reopenReason}
                onChange={(e) => setReopenReason(e.target.value)}
                placeholder="e.g. Issue recurred, water still leaking after inspection..."
                className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 text-xs focus:outline-blue-500 resize-none"
              />

              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowReopenModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={reopening || !reopenReason.trim()}
                  className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs disabled:opacity-50"
                >
                  {reopening ? "Reopening..." : "Confirm Reopen"}
                </button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
