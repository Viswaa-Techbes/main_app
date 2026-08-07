"use client";

import { useEffect, useState } from "react";
import { fetchAuthApi } from "@/lib/api";
import { Shield, ShieldAlert, ShieldCheck, User, Calendar, MapPin, CheckCircle, RefreshCw, Phone, Clock, FileText } from "lucide-react";
import { formatDateTime } from "@/lib/utils";

export default function AmcPage() {
  const [contracts, setContracts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [reschedulingVisit, setReschedulingVisit] = useState<any>(null);
  const [newDate, setNewDate] = useState("");
  const [resubmitLoading, setResubmitLoading] = useState(false);

  useEffect(() => {
    fetchContracts();
  }, []);

  async function fetchContracts() {
    try {
      const res = await fetchAuthApi("/api/v2/amc/customer/contracts");
      if (res.success && res.data) {
        setContracts(res.data);
      }
    } catch (e) {
      console.error("Error fetching AMC contracts:", e);
    } finally {
      setLoading(false);
    }
  }

  async function handlePurchase(plan: string) {
    try {
      setPurchasing(true);
      const res = await fetchAuthApi("/api/v2/amc/purchase", {
        method: "POST",
        body: JSON.stringify({
          amcPlan: plan,
          customerName: "", // defaults to user name in backend
          customerPhone: "",
          address: "",
        }),
      });

      if (res.success) {
        alert(`TechBes ${plan} AMC Plan purchased and activated successfully!`);
        fetchContracts();
      } else {
        alert(res.message || "Failed to purchase AMC");
      }
    } catch (e) {
      console.error(e);
      alert("Error purchasing plan.");
    } finally {
      setPurchasing(false);
    }
  }

  async function handleRenew(contractId: string) {
    if (!window.confirm("Would you like to renew your AMC contract for another year?")) return;
    try {
      setPurchasing(true);
      const res = await fetchAuthApi(`/api/v2/amc/contracts/${contractId}/renew`, {
        method: "POST",
      });
      if (res.success) {
        alert("AMC contract renewed successfully!");
        fetchContracts();
      } else {
        alert(res.message || "Failed to renew contract");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setPurchasing(false);
    }
  }

  async function handleRescheduleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!newDate || !reschedulingVisit) return;
    try {
      setResubmitLoading(true);
      const res = await fetchAuthApi(`/api/v2/amc/contracts/${reschedulingVisit.contractId}/reschedule`, {
        method: "POST",
        body: JSON.stringify({
          visitId: reschedulingVisit.visitId,
          newDate: newDate,
          remarks: "Rescheduled by customer",
        }),
      });

      if (res.success) {
        alert("Visit rescheduled successfully!");
        setReschedulingVisit(null);
        setNewDate("");
        fetchContracts();
      } else {
        alert(res.message || "Failed to reschedule visit");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setResubmitLoading(false);
    }
  }

  async function handleEarlyVisitRequest(contractId: string) {
    if (!window.confirm("Request an early checkup visit? This will schedule a visit for tomorrow.")) return;
    try {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const res = await fetchAuthApi(`/api/v2/amc/contracts/${contractId}/schedule`, {
        method: "POST",
        body: JSON.stringify({
          visitDate: tomorrow.toISOString().substring(0, 10),
          remarks: "Requested early visit by customer",
        }),
      });

      if (res.success) {
        alert("Early checkup visit scheduled for tomorrow!");
        fetchContracts();
      } else {
        alert(res.message || "Failed to schedule early checkup");
      }
    } catch (e) {
      console.error(e);
    }
  }

  if (loading) {
    return (
      <div className="h-64 flex flex-col items-center justify-center space-y-4 animate-pulse">
        <Shield size={48} className="text-blue-200 animate-spin" />
        <span className="text-gray-400 font-medium">Loading your AMC Shield portal...</span>
      </div>
    );
  }

  const activeContract = contracts.find(c => c.status === "Active" || c.status === "Suspended");

  return (
    <div className="space-y-8 max-w-6xl">
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
          <ShieldCheck className="text-blue-600 w-9 h-9" />
          TechBes AMC Shield Portal
        </h1>
        <p className="text-gray-505 mt-1 text-sm md:text-base">
          Maintain your IT infrastructure and surveillance hardware with dedicated, automated preventative visits.
        </p>
      </div>

      {activeContract ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Contract overview & Engineer */}
          <div className="lg:col-span-2 space-y-8">
            {/* Active Contract Info */}
            <div className="bg-gradient-to-br from-blue-900 to-indigo-955 text-white rounded-3xl p-8 shadow-xl relative overflow-hidden border border-blue-900">
              <div className="absolute right-0 bottom-0 opacity-10 transform translate-y-6 translate-x-6">
                <ShieldCheck size={280} />
              </div>
              <div className="relative z-10 flex flex-col justify-between h-full space-y-6">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="bg-blue-800 text-blue-200 font-bold px-3 py-1 rounded-full text-xs uppercase tracking-wider">
                      Active Subscription
                    </span>
                    <h2 className="text-3xl font-extrabold mt-3">{activeContract.amcPlan} Shield Plan</h2>
                    <p className="text-blue-300 text-sm mt-1">Contract ID: {activeContract.contractId}</p>
                  </div>
                  <div className="bg-green-500 text-white font-black px-4 py-1.5 rounded-full text-xs shadow-md">
                    ACTIVE
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-4 border-t border-blue-800">
                  <div>
                    <span className="text-blue-300 text-xs block uppercase font-semibold">Checks Remaining</span>
                    <span className="text-2xl font-bold">{activeContract.remainingVisits} / {activeContract.totalVisits} left</span>
                  </div>
                  <div>
                    <span className="text-blue-300 text-xs block uppercase font-semibold">Completed Visits</span>
                    <span className="text-2xl font-bold">{activeContract.completedVisits} checks</span>
                  </div>
                  <div>
                    <span className="text-blue-300 text-xs block uppercase font-semibold">Expiry Date</span>
                    <span className="text-lg font-bold text-orange-400">{new Date(activeContract.expiryDate).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 pt-4">
                  <button 
                    onClick={() => handleEarlyVisitRequest(activeContract._id)}
                    className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-5 py-3 rounded-xl shadow-md text-sm transition-all duration-200"
                  >
                    Request Early Visit
                  </button>
                  <button 
                    onClick={() => handleRenew(activeContract._id)}
                    className="bg-green-600 hover:bg-green-500 text-white font-bold px-5 py-3 rounded-xl shadow-md text-sm transition-all duration-200"
                  >
                    Renew Contract
                  </button>
                </div>
              </div>
            </div>

            {/* Visits History Timeline */}
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-6">
              <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-4">Checkup Visit Schedule Timeline</h3>
              <div className="relative border-l border-gray-100 pl-6 ml-2 space-y-8">
                {activeContract.visits.map((v: any, idx: number) => {
                  const isDone = v.status === "Completed";
                  const isCancelled = v.status === "Cancelled";
                  
                  return (
                    <div key={v._id || idx} className="relative">
                      {/* Bullet icon */}
                      <span className={`absolute -left-10 top-0.5 rounded-full w-8 h-8 flex items-center justify-center text-xs font-bold ${
                        isDone ? "bg-green-100 text-green-700" : isCancelled ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"
                      }`}>
                        {isDone ? <CheckCircle size={14} /> : idx + 1}
                      </span>
                      
                      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                        <div>
                          <h4 className="font-bold text-gray-900 flex items-center gap-2">
                            Checkup visit: {new Date(v.visitDate).toLocaleDateString()}
                            <span className={`text-[10px] font-black px-2 py-0.5 rounded ${
                              isDone ? "bg-green-100 text-green-800" : isCancelled ? "bg-red-100 text-red-800" : "bg-blue-100 text-blue-800"
                            }`}>
                              {v.status.toUpperCase()}
                            </span>
                          </h4>
                          <p className="text-gray-505 text-xs mt-1">{v.remarks || "Regular maintenance checkup scheduled."}</p>
                          {v.completionDetails && v.completionDetails.completedAt && (
                            <div className="mt-3 bg-gray-50 p-4 rounded-xl space-y-2 border border-gray-100 text-xs text-gray-600">
                              <p className="font-bold text-gray-800 flex items-center gap-1.5"><Clock size={12} /> Service Observation Notes:</p>
                              <p className="italic">"{v.completionDetails.notes}"</p>
                              {v.completionDetails.partsUsed?.length > 0 && (
                                <p className="mt-1"><strong>Parts Replaced:</strong> {v.completionDetails.partsUsed.join(", ")}</p>
                              )}
                              {v.completionDetails.recommendations && (
                                <p className="mt-1 text-blue-600"><strong>Recommendation:</strong> {v.completionDetails.recommendations}</p>
                              )}
                            </div>
                          )}
                        </div>

                        {!isDone && !isCancelled && (
                          <button
                            onClick={() => setReschedulingVisit({ contractId: activeContract._id, visitId: v._id, date: v.visitDate })}
                            className="text-xs bg-gray-50 hover:bg-blue-50 text-blue-600 border border-gray-200 hover:border-blue-100 font-bold px-3 py-1.5 rounded-lg transition-all"
                          >
                            Reschedule
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Dedicated Engineer */}
          <div className="space-y-8">
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-6">
              <h3 className="text-base font-bold text-gray-900">Your Dedicated Engineer</h3>
              {activeContract.assignedEngineer ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-4 bg-gradient-to-br from-blue-50/50 to-indigo-50/20 p-4 rounded-2xl border border-blue-50/40">
                    <div className="bg-blue-600 text-white rounded-xl w-12 h-12 flex items-center justify-center text-lg font-bold shadow-md">
                      {activeContract.assignedEngineer.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm">{activeContract.assignedEngineer.name}</h4>
                      <p className="text-gray-505 text-xs">{activeContract.assignedEngineer.specialty || "Senior Tech Engineer"}</p>
                      {activeContract.assignedEngineer.rating && (
                        <p className="text-yellow-600 text-xs font-semibold mt-1">★ {activeContract.assignedEngineer.rating.toFixed(1)} rating</p>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2.5">
                    <a 
                      href={`tel:${activeContract.assignedEngineer.mobileNumber}`}
                      className="flex items-center justify-center gap-2 w-full py-3 bg-blue-50 hover:bg-blue-100 text-blue-600 font-bold rounded-xl text-xs transition-all duration-200 border border-blue-100/50"
                    >
                      <Phone size={14} /> Call Engineer
                    </a>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 space-y-3">
                  <ShieldAlert className="text-orange-400 mx-auto w-10 h-10" />
                  <p className="text-xs text-gray-505 px-4">
                    Our admin panel is currently evaluating nearby technicians. An engineer will be assigned dedicatedly shortly.
                  </p>
                </div>
              )}
            </div>

            {/* Benefits box */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50/30 rounded-3xl p-6 border border-green-100 space-y-4">
              <h4 className="font-bold text-green-900 text-sm flex items-center gap-2">
                <ShieldCheck className="text-green-600 w-5 h-5" />
                Your Active Benefits
              </h4>
              <ul className="space-y-2 text-xs text-green-700 font-medium">
                <li className="flex items-center gap-2">✓ Priority SLA tickets queue</li>
                <li className="flex items-center gap-2">✓ Zero call-out inspection fees</li>
                <li className="flex items-center gap-2">✓ Regular camera cleaning checks</li>
                <li className="flex items-center gap-2">✓ 15% discount on repair parts</li>
              </ul>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm text-center max-w-3xl mx-auto space-y-6">
            <Shield className="text-blue-600 w-16 h-16 mx-auto animate-bounce" />
            <h2 className="text-3xl font-extrabold text-gray-900">Secure Your IT Infrastructure with TechBes Shield</h2>
            <p className="text-gray-500 text-sm max-w-xl mx-auto">
              Preventive maintenance, regular checkups, priority support, and discounted spare parts. Choose a plan to activate your TechBes AMC Shield subscription.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Silver Plan */}
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm flex flex-col justify-between space-y-6 relative overflow-hidden hover:shadow-md transition-shadow">
              <div>
                <h3 className="text-xl font-bold text-gray-950">Silver Shield</h3>
                <p className="text-gray-505 text-xs mt-1">Perfect for homes & small offices</p>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-blue-600">4</span>
                  <span className="text-gray-505 text-sm font-semibold">visits / year</span>
                </div>
                <ul className="mt-6 space-y-3 text-xs text-gray-600 font-medium">
                  <li className="flex items-center gap-2">✓ Regular camera cleaning & checks</li>
                  <li className="flex items-center gap-2">✓ Priority SLA tickets queue</li>
                  <li className="flex items-center gap-2">✓ Zero call-out inspection fees</li>
                  <li className="flex items-center gap-2">✓ 10% discount on repair parts</li>
                </ul>
              </div>
              <button
                disabled={purchasing}
                onClick={() => handlePurchase("Silver")}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-bold rounded-xl text-xs shadow-md transition-all"
              >
                {purchasing ? "Processing..." : "Select Silver Plan"}
              </button>
            </div>

            {/* Gold Plan */}
            <div className="bg-white rounded-3xl p-8 border-2 border-indigo-600 shadow-lg flex flex-col justify-between space-y-6 relative overflow-hidden transform hover:-translate-y-1 transition-all">
              <div className="absolute top-0 right-0 bg-indigo-600 text-white text-[10px] font-black px-3 py-1 rounded-bl-xl uppercase tracking-wider">
                Popular
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-950">Gold Shield</h3>
                <p className="text-gray-505 text-xs mt-1">Best for medium enterprises</p>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-indigo-600">6</span>
                  <span className="text-gray-505 text-sm font-semibold">visits / year</span>
                </div>
                <ul className="mt-6 space-y-3 text-xs text-gray-600 font-medium">
                  <li className="flex items-center gap-2">✓ Bi-monthly preventative visits</li>
                  <li className="flex items-center gap-2">✓ 4-hour emergency SLA response</li>
                  <li className="flex items-center gap-2">✓ Free replacement backup equipment</li>
                  <li className="flex items-center gap-2">✓ 15% discount on repair parts</li>
                </ul>
              </div>
              <button
                disabled={purchasing}
                onClick={() => handlePurchase("Gold")}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-bold rounded-xl text-xs shadow-md transition-all"
              >
                {purchasing ? "Processing..." : "Select Gold Plan"}
              </button>
            </div>

            {/* Diamond Plan */}
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm flex flex-col justify-between space-y-6 relative overflow-hidden hover:shadow-md transition-shadow">
              <div>
                <h3 className="text-xl font-bold text-gray-950">Diamond Shield</h3>
                <p className="text-gray-505 text-xs mt-1">Premium 24/7 round-the-clock shield</p>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-emerald-600">12</span>
                  <span className="text-gray-505 text-sm font-semibold">visits / year</span>
                </div>
                <ul className="mt-6 space-y-3 text-xs text-gray-600 font-medium">
                  <li className="flex items-center gap-2">✓ Monthly dedicated physical audits</li>
                  <li className="flex items-center gap-2">✓ 2-hour premium SLA support</li>
                  <li className="flex items-center gap-2">✓ Dedicated account manager</li>
                  <li className="flex items-center gap-2">✓ 20% discount on repair parts</li>
                </ul>
              </div>
              <button
                disabled={purchasing}
                onClick={() => handlePurchase("Diamond")}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 text-white font-bold rounded-xl text-xs shadow-md transition-all"
              >
                {purchasing ? "Processing..." : "Select Diamond Plan"}
              </button>
            </div>
          </div>
        </div>
      )}


      {/* RESCHEDULE MODAL */}
      {reschedulingVisit && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-lg font-extrabold text-gray-900 mb-4">Reschedule Checkup Visit</h3>
            <form onSubmit={handleRescheduleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-600 uppercase block mb-1">Current Scheduled Date</label>
                <input 
                  type="text" 
                  disabled
                  value={new Date(reschedulingVisit.date).toLocaleDateString()}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-500 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600 uppercase block mb-1">Choose New Date</label>
                <input 
                  type="date" 
                  required
                  min={new Date().toISOString().substring(0, 10)}
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-xl text-sm font-semibold text-gray-800"
                />
              </div>
              <div className="flex gap-3 justify-end pt-3 border-t border-gray-100 mt-6">
                <button
                  type="button"
                  onClick={() => { setReschedulingVisit(null); setNewDate(""); }}
                  className="px-4 py-2 border border-gray-200 rounded-xl text-xs font-bold text-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={resubmitLoading}
                  className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold"
                >
                  {resubmitLoading ? "Saving..." : "Save Reschedule"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
