import { purchaseTicket } from "@/lib/api";
import { useAuth } from "@/hooks/use-auth";
import { CheckCircle, ArrowLeft, ShoppingBag, Shield, Zap, CreditCard } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

const PurchaseTicketPage: React.FC = () => {
  const { eventId, ticketTypeId } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | undefined>();
  const [isPurchaseSuccess, setIsPurchaseSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isPurchaseSuccess) return;
    const timer = setTimeout(() => navigate("/dashboard/tickets"), 3000);
    return () => clearTimeout(timer);
  }, [isPurchaseSuccess]);

  const handlePurchase = async () => {
    if (!token || !eventId || !ticketTypeId) return;
    setIsLoading(true);
    setError(undefined);
    try {
      await purchaseTicket(token, eventId, ticketTypeId);
      setIsPurchaseSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  if (isPurchaseSuccess) {
    return (
      <div className="bg-[#08080e] min-h-screen flex items-center justify-center px-4">
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&display=swap');
          @keyframes popIn { 0% { transform: scale(0.5); opacity: 0; } 70% { transform: scale(1.1); } 100% { transform: scale(1); opacity: 1; } }
          .pop-in { animation: popIn 0.5s ease forwards; }
        `}</style>
        <div className="text-center max-w-sm w-full">
          <div className="pop-in w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-emerald-500/30">
            <CheckCircle className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-3xl font-black text-white mb-2" style={{ fontFamily: "'Syne', sans-serif" }}>You're in!</h2>
          <p className="text-gray-400 mb-1">Ticket confirmed and ready.</p>
          <p className="text-gray-600 text-sm">Redirecting to your tickets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#08080e] min-h-screen text-white flex flex-col" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Syne:wght@700;800;900&display=swap');`}</style>

      {/* Simple top bar */}
      <div className="border-b border-white/5 px-5 h-14 flex items-center">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-white text-sm transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm">

          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/20 flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="w-6 h-6 text-cyan-400" />
            </div>
            <h1 className="text-2xl font-black text-white mb-1" style={{ fontFamily: "'Syne', sans-serif" }}>Confirm Purchase</h1>
            <p className="text-gray-500 text-sm">Review and confirm your ticket</p>
          </div>

          <div className="bg-[#111118] border border-white/8 rounded-2xl p-5 space-y-4">

            {error && (
              <div className="bg-red-950/40 border border-red-800/40 rounded-xl px-4 py-3">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {/* Card Number */}
            <div>
              <label className="block text-gray-400 text-xs font-medium mb-1.5 tracking-wider uppercase">Card Number</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                  className="w-full bg-[#08080e] border border-white/8 rounded-xl px-4 py-3 pl-10 text-white text-sm placeholder-gray-600 outline-none focus:border-cyan-500/50 transition-colors"
                />
                <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-600" />
              </div>
            </div>

            {/* Cardholder Name */}
            <div>
              <label className="block text-gray-400 text-xs font-medium mb-1.5 tracking-wider uppercase">Cardholder Name</label>
              <input
                type="text"
                placeholder=""
                className="w-full bg-[#08080e] border border-white/8 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 outline-none focus:border-cyan-500/50 transition-colors"
              />
            </div>

            {/* Expiry + CVV */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-gray-400 text-xs font-medium mb-1.5 tracking-wider uppercase">Expiry</label>
                <input
                  type="text"
                  placeholder="MM/YY"
                  className="w-full bg-[#08080e] border border-white/8 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 outline-none focus:border-cyan-500/50 transition-colors"
                />
              </div>
              <div>
                <label className="block text-gray-400 text-xs font-medium mb-1.5 tracking-wider uppercase">CVV</label>
                <input
                  type="text"
                  placeholder="•••"
                  maxLength={4}
                  className="w-full bg-[#08080e] border border-white/8 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 outline-none focus:border-cyan-500/50 transition-colors"
                />
              </div>
            </div>

            {/* Trust badges */}
            <div className="flex items-center gap-4 pt-1">
              <div className="flex items-center gap-1.5 text-gray-600 text-xs">
                <Shield className="w-3.5 h-3.5 text-emerald-600" />
                Secure checkout
              </div>
              <div className="flex items-center gap-1.5 text-gray-600 text-xs">
                <Zap className="w-3.5 h-3.5 text-cyan-600" />
                Instant delivery
              </div>
            </div>

            <button
              onClick={handlePurchase}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-bold py-3.5 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-cyan-500/20 text-sm"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  Processing...
                </span>
              ) : "Pay & Get Ticket"}
            </button>

          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseTicketPage;
