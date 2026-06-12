"use client";

import { useEffect, useState } from "react";
import { PageStatus } from "@/shared/components/feedback/page-status";

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    fetch('/api/auth/me', { credentials: 'include' })
      .then((r) => r.ok ? r.json().catch(() => ({})) : {})
      .then((payload) => {
        if (!mounted) return;
        if (payload && payload.success) setProfile(payload.data);
        else setError('Unable to load profile');
      })
      .catch(() => setError('Unable to load profile'))
      .finally(() => setLoading(false));
    return () => { mounted = false; };
  }, []);

  if (loading) return <PageStatus message="Loading profile..." />;
  if (error) return <div className="p-6">{error}</div>;

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-semibold">My Profile</h1>
      <div className="mt-6 rounded-md border border-slate-200 bg-white p-6">
        <div className="grid gap-3">
          <div><strong>Name: </strong>{profile?.name}</div>
          <div><strong>Email: </strong>{profile?.email || '—'}</div>
          <div><strong>Phone: </strong>{profile?.mobileNumber || profile?.phone || '—'}</div>
          <div><strong>Role: </strong>{profile?.role}</div>
        </div>
      </div>
    </main>
  );
}
