"use client";

import { useEffect, useState } from "react";
import { fetchAuthApi } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Wallet, Plus, ArrowUpRight, ArrowDownRight, History, Banknote } from "lucide-react";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/features/auth/context/auth-context";

// Helper to dynamically load a script
const loadScript = (src: string) => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function WalletPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [data, setData] = useState<any>({ wallet: null, transactions: [] });
  const [loading, setLoading] = useState(true);
  const [addAmount, setAddAmount] = useState("");
  const [adding, setAdding] = useState(false);
  const [successTx, setSuccessTx] = useState<string | null>(null);

  useEffect(() => {
    fetchWalletData();
  }, []);

  async function fetchWalletData() {
    setLoading(true);
    try {
      const [walletRes, txRes] = await Promise.all([
        fetchAuthApi("/api/v2/wallet"),
        fetchAuthApi("/api/v2/wallet/transactions")
      ]);
      
      setData({
        wallet: walletRes.success ? walletRes.data : null,
        transactions: txRes.success ? txRes.data : []
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddFunds() {
    const amt = parseFloat(addAmount);
    if (!amt || amt <= 0) {
      toast({ title: "Invalid Amount", description: "Please enter a valid amount.", variant: "destructive" });
      return;
    }
    
    setAdding(true);
    setSuccessTx(null);
    try {
      const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
      if (!res) {
        toast({ title: "Initialization Failed", description: "Razorpay SDK failed to load. Are you online?", variant: "destructive" });
        return;
      }

      // Step 1: Create Order
      const orderRes = await fetchAuthApi("/api/v2/wallet/create-order", {
        method: "POST",
        body: JSON.stringify({ amount: amt })
      });

      if (!orderRes.success || !orderRes.data) {
        toast({ title: "Payment Failed", description: orderRes.message || "Could not initialize payment.", variant: "destructive" });
        setAdding(false);
        return;
      }

      const { order_id, amount: orderAmount, currency, key_id } = orderRes.data;

      // Step 2: Open Checkout
      const options = {
        key: key_id,
        amount: orderAmount,
        currency: currency,
        name: "Techbes",
        description: "Wallet Top-up",
        order_id: order_id,
        handler: async function (response: any) {
          // Step 3: Verify Payment
          try {
            const verifyRes = await fetchAuthApi("/api/v2/wallet/verify-payment", {
              method: "POST",
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                amount: amt,
                description: "Wallet Top-up via Razorpay"
              })
            });

            if (verifyRes.success) {
              setAddAmount("");
              setSuccessTx(response.razorpay_payment_id);
              fetchWalletData(); // Refresh balance and history
              toast({ title: "Success", description: "Funds added to your wallet successfully." });
            } else {
              toast({ title: "Payment Failed", description: "Please try again. Your payment could not be verified.", variant: "destructive" });
            }
          } catch (e) {
            toast({ title: "Payment Failed", description: "An error occurred during verification.", variant: "destructive" });
          } finally {
            setAdding(false);
          }
        },
        prefill: {
          name: user?.name || "Customer",
          email: user?.email || "",
          contact: user?.mobileNumber || ""
        },
        theme: {
          color: "#2563EB" // Techbes Primary Blue
        }
      };

      const rzp = new (window as any).Razorpay(options);
      
      rzp.on('payment.failed', function () {
        toast({ title: "Payment Failed", description: "Please try again.", variant: "destructive" });
        setAdding(false);
      });
      
      rzp.open();
    } catch (e) {
      console.error(e);
      toast({ title: "Payment Error", description: "Something went wrong. Please try again.", variant: "destructive" });
      setAdding(false);
    }
  }

  if (loading && !data.wallet) {
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

      {successTx && (
        <Card className="p-6 bg-emerald-50 border-emerald-200 shadow-sm rounded-2xl flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-emerald-900 mb-2">Funds Added Successfully</h3>
          <p className="text-emerald-700 mb-1">Your wallet balance has been updated instantly.</p>
          <p className="text-sm font-medium text-emerald-600 bg-emerald-100/50 px-3 py-1 rounded-full">Tx ID: {successTx}</p>
        </Card>
      )}

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
                disabled={adding}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-8 pr-4 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-lg font-bold text-gray-900 disabled:opacity-50"
              />
            </div>
            <div className="flex gap-2">
              {[500, 1000, 2000].map(amt => (
                <button 
                  key={amt}
                  disabled={adding}
                  onClick={() => setAddAmount(amt.toString())}
                  className="flex-1 py-1.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
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
              {adding ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : "Proceed to Pay"}
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
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${isCredit ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                        {isCredit ? <ArrowDownRight size={24} /> : <ArrowUpRight size={24} />}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 capitalize">{tx.category} {tx.referenceModel ? `• ${tx.referenceModel}` : ''}</p>
                        <p className="text-sm text-gray-500 mt-1">{tx.description}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-xs text-gray-400 font-medium">{formatDateTime(tx.createdAt)}</p>
                          {tx.referenceId && (
                            <span className="text-xs text-gray-400 font-medium bg-gray-100 px-2 py-0.5 rounded-sm">ID: {tx.referenceId.slice(-8).toUpperCase()}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className={`text-lg font-black ${isCredit ? 'text-emerald-600' : 'text-gray-900'}`}>
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
