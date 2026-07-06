"use client";

import { useEffect, useState } from "react";
import { fetchAuthApi } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { MessageSquare, Plus, Clock, CheckCircle, AlertTriangle, ArrowLeft, Send } from "lucide-react";
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
  
  useEffect(() => {
    fetchTickets();
  }, []);

  async function fetchTickets() {
    try {
      const res = await fetchAuthApi("/api/v2/customer/tickets");
      if (res.success) {
        setTickets(res.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateTicket(e: React.FormEvent) {
    e.preventDefault();
    if (!newSubject || !newMessage) return;

    try {
      const res = await fetchAuthApi("/api/v2/customer/tickets", {
        method: "POST",
        body: JSON.stringify({
          subject: newSubject,
          category: newCategory,
          messageText: newMessage
        })
      });

      if (res.success) {
        setTickets([res.data, ...tickets]);
        setIsCreating(false);
        setNewSubject("");
        setNewMessage("");
      }
    } catch (err) {
      alert("Failed to create ticket");
    }
  }

  async function handleReply(e: React.FormEvent) {
    e.preventDefault();
    if (!replyText || !activeTicket) return;

    try {
      const res = await fetchAuthApi(`/api/v2/customer/tickets/\${activeTicket._id}/reply`, {
        method: "PUT",
        body: JSON.stringify({ text: replyText })
      });

      if (res.success) {
        setActiveTicket(res.data);
        setTickets(tickets.map(t => t._id === res.data._id ? res.data : t));
        setReplyText("");
      }
    } catch (err) {
      alert("Failed to send reply");
    }
  }

  if (loading) return <div className="h-64 flex items-center justify-center animate-pulse"><MessageSquare size={48} className="text-gray-200" /></div>;

  // Render Create Form
  if (isCreating) {
    return (
      <div className="max-w-3xl">
        <button onClick={() => setIsCreating(false)} className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-6 font-medium">
          <ArrowLeft size={20} /> Back to Tickets
        </button>
        <Card className="p-8 rounded-2xl shadow-sm border-gray-100 bg-white">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Ticket</h2>
          <form onSubmit={handleCreateTicket} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Subject</label>
              <input 
                type="text" required value={newSubject} onChange={e => setNewSubject(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-blue-500 transition"
                placeholder="Briefly describe your issue"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
              <select 
                value={newCategory} onChange={e => setNewCategory(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-blue-500 transition"
              >
                <option value="Technical">Technical Support</option>
                <option value="Payment">Payment/Billing</option>
                <option value="Booking">Booking Issue</option>
                <option value="Complaint">Complaint</option>
                <option value="AMC">AMC Details</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Message</label>
              <textarea 
                required rows={5} value={newMessage} onChange={e => setNewMessage(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-blue-500 transition resize-none"
                placeholder="Provide details about your problem..."
              ></textarea>
            </div>
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl transition shadow-md shadow-blue-200">
              Submit Ticket
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
            <button onClick={() => setActiveTicket(null)} className="p-2 hover:bg-gray-200 rounded-lg text-gray-500 transition">
              <ArrowLeft size={20} />
            </button>
            <div>
              <h2 className="font-bold text-gray-900">{activeTicket.subject}</h2>
              <p className="text-sm text-gray-500">Ticket #{activeTicket._id.slice(-6).toUpperCase()} • {activeTicket.category}</p>
            </div>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-bold \${
            activeTicket.status === 'Resolved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
          }`}>
            {activeTicket.status}
          </span>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/30">
          {(activeTicket.messages || []).map((msg: any, i: number) => {
            const isMe = msg.sender === user?._id || msg.sender === user?.id;
            return (
              <div key={i} className={`flex \${isMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-2xl p-4 \${
                  isMe ? 'bg-blue-600 text-white rounded-tr-sm shadow-md shadow-blue-200' : 'bg-white border border-gray-100 text-gray-800 rounded-tl-sm shadow-sm'
                }`}>
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                  <p className={`text-[11px] mt-2 \${isMe ? 'text-blue-200' : 'text-gray-400'}`}>
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
              type="text" value={replyText} onChange={e => setReplyText(e.target.value)}
              placeholder="Type your reply..."
              className="flex-1 bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 outline-none focus:border-blue-400 transition"
            />
            <button type="submit" disabled={!replyText} className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-xl transition disabled:opacity-50">
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Support Tickets</h1>
          <p className="text-gray-500">Manage your inquiries and complaints</p>
        </div>
        <button 
          onClick={() => setIsCreating(true)}
          className="bg-gray-900 hover:bg-black text-white font-bold py-2.5 px-6 rounded-xl transition flex items-center justify-center gap-2"
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
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-bold text-gray-900">{t.subject}</h3>
                    <span className={`px-2 py-0.5 rounded text-xs font-bold \${
                      t.status === 'Resolved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {t.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">#{t._id.slice(-6).toUpperCase()} • {t.category}</p>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1 text-gray-400">
                    <Clock size={16} /> {new Date(t.updatedAt).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-1 text-blue-600 font-medium bg-blue-50 px-3 py-1 rounded-full">
                    <MessageSquare size={16} /> {t.messages?.length || 0}
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
            <p className="text-gray-900 font-medium">No support tickets</p>
            <p className="text-sm">You haven't opened any support requests yet.</p>
          </div>
        )}
      </Card>
    </div>
  );
}
