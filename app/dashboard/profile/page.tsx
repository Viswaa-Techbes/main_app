"use client";

import { useAuth } from "@/features/auth/context/auth-context";
import { Card } from "@/components/ui/card";
import { User, Mail, Phone, MapPin, Edit2, Shield } from "lucide-react";

export default function ProfilePage() {
  const { user, logout } = useAuth();

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Profile Settings</h1>
        <p className="text-gray-500">Manage your account details and security</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <Card className="p-6 rounded-2xl shadow-sm border-gray-100 bg-white">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-bold text-gray-900 text-lg">Personal Information</h2>
              <button className="text-blue-600 hover:text-blue-800 text-sm font-bold flex items-center gap-1">
                <Edit2 size={14} /> Edit
              </button>
            </div>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-8">
              <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-3xl font-bold">
                {user?.name?.charAt(0) || "U"}
              </div>
              <div>
                <button className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-bold hover:bg-black transition mb-2">
                  Change Photo
                </button>
                <p className="text-xs text-gray-500">JPG, GIF or PNG. Max size of 2MB</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-500 flex items-center gap-2"><User size={14} /> Full Name</label>
                <p className="font-semibold text-gray-900">{user?.name || "Not set"}</p>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-500 flex items-center gap-2"><Phone size={14} /> Mobile Number</label>
                <p className="font-semibold text-gray-900">{user?.mobileNumber || "Not set"}</p>
              </div>
              <div className="space-y-1 sm:col-span-2">
                <label className="text-sm font-medium text-gray-500 flex items-center gap-2"><Mail size={14} /> Email Address</label>
                <p className="font-semibold text-gray-900">{user?.email || "Not set"}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 rounded-2xl shadow-sm border-gray-100 bg-white">
            <h2 className="font-bold text-gray-900 text-lg mb-6 flex items-center gap-2">
              <Shield size={18} className="text-emerald-600" /> Security
            </h2>
            <div className="flex items-center justify-between py-4 border-b border-gray-100">
              <div>
                <h3 className="font-medium text-gray-900">Password</h3>
                <p className="text-sm text-gray-500">Last changed 3 months ago</p>
              </div>
              <button className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50 transition">
                Update
              </button>
            </div>
            <div className="flex items-center justify-between py-4">
              <div>
                <h3 className="font-medium text-gray-900">Two-Factor Authentication</h3>
                <p className="text-sm text-gray-500">Add an extra layer of security</p>
              </div>
              <button className="px-4 py-2 border border-blue-200 bg-blue-50 rounded-lg text-sm font-bold text-blue-700 hover:bg-blue-100 transition">
                Enable
              </button>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6 rounded-2xl shadow-sm border-gray-100 bg-white bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mb-4">
              <MapPin size={24} />
            </div>
            <h2 className="font-bold text-xl mb-2">Saved Addresses</h2>
            <p className="text-blue-100 text-sm mb-6">Manage your home, office, and other locations for faster booking.</p>
            <button className="w-full py-2.5 bg-white text-blue-900 font-bold rounded-xl hover:bg-gray-50 transition">
              Manage Addresses
            </button>
          </Card>

          <Card className="p-6 rounded-2xl shadow-sm border-gray-100 bg-white">
            <h2 className="font-bold text-gray-900 text-lg mb-4">Account Actions</h2>
            <div className="space-y-2">
              <button onClick={logout} className="w-full text-left px-4 py-3 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition">
                Sign Out
              </button>
              <button className="w-full text-left px-4 py-3 rounded-xl font-medium text-rose-600 hover:bg-rose-50 transition">
                Delete Account
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
