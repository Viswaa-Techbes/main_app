"use client";

import { useEffect, useState } from "react";
import { fetchAuthApi } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Bell, CheckCircle, Clock } from "lucide-react";
import { formatDateTime } from "@/lib/utils";
import Link from "next/link";
import { PageStatus } from "@/shared/components/feedback/page-status";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  async function fetchNotifications() {
    try {
      const res = await fetchAuthApi("/api/v2/notifications");
      if (res.success && res.data) {
        setNotifications(res.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function markAllAsRead() {
    try {
      await fetchAuthApi("/api/v2/notifications/read-all", { method: 'PATCH' });
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (e) {
      console.error(e);
    }
  }

  if (loading) return <PageStatus message="Loading notifications..." className="min-h-[70vh]" />;

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-500">Stay updated on your service requests</p>
        </div>
        {notifications.some(n => !n.isRead) && (
          <button 
            onClick={markAllAsRead}
            className="px-4 py-2 bg-blue-50 text-blue-700 font-bold text-sm rounded-lg hover:bg-blue-100 transition"
          >
            Mark all as read
          </button>
        )}
      </div>

      <div className="space-y-4">
        {notifications.length > 0 ? (
          notifications.map((n) => (
            <Card key={n._id} className={`p-6 rounded-2xl shadow-sm border-gray-100 transition ${n.isRead ? 'bg-white' : 'bg-blue-50/30 border-blue-100'}`}>
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${n.isRead ? 'bg-gray-50 text-gray-400' : 'bg-blue-100 text-blue-600'}`}>
                  <Bell size={24} />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex justify-between items-start gap-2">
                    <h3 className={`text-lg ${n.isRead ? 'font-medium text-gray-800' : 'font-bold text-gray-900'}`}>{n.title || 'Notification'}</h3>
                    <span className="text-xs font-medium text-gray-500 flex items-center gap-1 shrink-0 mt-1">
                      <Clock size={12} /> {formatDateTime(n.createdAt)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{n.message}</p>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <Card className="p-12 text-center border-dashed border-2 border-gray-200 shadow-none">
            <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-4">
              <Bell size={32} className="text-gray-300" />
            </div>
            <h3 className="font-bold text-gray-900 mb-1">No notifications</h3>
            <p className="text-gray-500 text-sm">You are all caught up! We will notify you about your bookings here.</p>
          </Card>
        )}
      </div>
    </div>
  );
}
