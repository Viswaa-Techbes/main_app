"use client";

import { useEffect, useState } from "react";
import { fetchAuthApi } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Wallet, Plus, ArrowUpRight, ArrowDownRight, History, CreditCard, Banknote } from "lucide-react";
import { formatCurrency, formatDateTime } from "@/lib/utils";

export default function WalletPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [addAmount, setAddAmount] = useState("");
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetchWallet();
  }, []);

  async function fetchWallet() {
    setLoading(true);
    try {
      const res = await fetchAuthApi("/api/v2/customer/wallet");
      if (res.success) {
        setData(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddFunds() {
    const amt = parseFloat(addAmount);
    if (!amt || amt <= 0) return alert("Enter a valid amount");
    
    setAdding(true);
    try {
      // For now, mock a successful payment gateway response by hitting backend directly
      const res = await fetchAuthApi("/api/v2/customer/wallet/add", {
        method: "POST",
        body: JSON.stringify({ amount: amt, description: "Wallet Top-up via Credit Card" })
      });
      if (res.success) {
        setAddAmount("");
        fetchWallet(); // Refresh
      } else {
        alert(res.message);
      }
    } catch (e) {
      console.error(e);
      alert("Failed to add funds");
    } finally {
      setAdding(false);
    }
  }

  if (loading) {
    return <div className="h-64 flex items-center justify-center animate-pulse"><Wallet size={48} className="text-gray-200" /></div>;
  }

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600">
          <Wallet size={20} />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">My Wallet</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Balance Card */}
        <div className="md:col-span-2 bg-gradient-to-br from-emerald-600 to-teal-800 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-emerald-100 font-medium mb-1">Available Balance</p>
            <h2 className="text-5xl font-black mb-6">{formatCurrency(data?.wallet?.balance || 0)}</h2>
            
            <div className="flex gap-4">
              <div className="bg-emerald-900/40 backdrop-blur-md rounded-xl p-4 flex-1 border border-emerald-500/30">
                <p className="text-sm text-emerald-200">Loyalty Points</p>
                <p className="text-xl font-bold">{data?.wallet?.loyaltyPoints || 0} pts</p>
              </div>
              <div className="bg-emerald-900/40 backdrop-blur-md rounded-xl p-4 flex-1 border border-emerald-500/30">
                <p className="text-sm text-emerald-200">Total Saved</p>
                <p className="text-xl font-bold">₹0.00</p>
              </div>
            </div>
          </div>
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-emerald-500 rounded-full mix-blend-overlay filter blur-3xl opacity-50"></div>
        </div>

        {/* Add Funds */}
        <Card className="p-6 rounded-2xl shadow-sm border-gray-100 flex flex-col justify-center bg-white">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Plus size={18} className="text-blue-600" /> Add Funds
          </h3>
          <div className="space-y-4">
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">₹</span>
              <input 
                type="number" 
                value={addAmount}
                onChange={(e) => setAddAmount(e.target.value)}
                placeholder="1000"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-8 pr-4 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-lg font-bold text-gray-900"
              />
            </div>
            <div className="flex gap-2">
              {[500, 1000, 2000].map(amt => (
                <button 
                  key={amt}
                  onClick={() => setAddAmount(amt.toString())}
                  className="flex-1 py-1.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition"
                >
                  +{amt}
                </button>
              ))}
            </div>
            <button 
              onClick={handleAddFunds}
              disabled={adding || !addAmount}
              className="w-full bg-gray-900 hover:bg-black text-white font-bold py-3 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {adding ? "Processing..." : "Proceed to Pay"}
            </button>
          </div>
        </Card>
      </div>

      {/* Transactions */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <History size={18} className="text-gray-400" />
          <h3 className="text-lg font-bold text-gray-900">Transaction History</h3>
        </div>
        
        <Card className="p-0 overflow-hidden border-gray-100 shadow-sm rounded-2xl bg-white">
          {data?.transactions?.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {data.transactions.map((tx: any) => {
                const isCredit = tx.type === 'credit';
                return (
                  <div key={tx._id} className="p-4 sm:p-6 hover:bg-gray-50 transition flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 \${isCredit ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                        {isCredit ? <ArrowDownRight size={24} /> : <ArrowUpRight size={24} />}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 capitalize">{tx.category} {tx.referenceModel ? `• ${tx.referenceModel}` : ''}</p>
                        <p className="text-sm text-gray-500 mt-1">{tx.description}</p>
                        <p className="text-xs text-gray-400 mt-1">{formatDateTime(tx.createdAt)}</p>
                      </div>
                    </div>
                    <div className={`text-lg font-black \${isCredit ? 'text-emerald-600' : 'text-gray-900'}`}>
                      {isCredit ? '+' : '-'}{formatCurrency(tx.amount)}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-12 text-center text-gray-500">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Banknote size={28} className="text-gray-300" />
              </div>
              <p className="text-gray-900 font-medium">No transactions yet</p>
              <p className="text-sm">When you add funds or make payments, they will appear here.</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
