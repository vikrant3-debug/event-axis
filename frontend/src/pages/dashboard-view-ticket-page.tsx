import { TicketDetails, TicketStatus } from "@/domain/domain";
import { getTicket, getTicketQr } from "@/lib/api";
import { useAuth } from "@/hooks/use-auth";
import { format } from "date-fns";
import { ArrowLeft, Calendar, Copy, DollarSign, MapPin, Tag } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

const DashboardViewTicketPage: React.FC = () => {
  const [ticket, setTicket] = useState<TicketDetails | undefined>();
  const [qrCodeUrl, setQrCodeUrl] = useState<string | undefined>();
  const [isQrLoading, setIsQrCodeLoading] = useState(true);
  const [error, setError] = useState<string | undefined>();
  const [copied, setCopied] = useState(false);
  const { id } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token || !id) return;

    const load = async () => {
      try {
        setIsQrCodeLoading(true);
        setError(undefined);
        setTicket(await getTicket(token, id));
        setQrCodeUrl(URL.createObjectURL(await getTicketQr(token, id)));
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred");
      } finally {
        setIsQrCodeLoading(false);
      }
    };

    load();
    return () => { if (qrCodeUrl) URL.revokeObjectURL(qrCodeUrl); };
  }, [token, id]);

  const handleCopy = () => {
    if (!ticket) return;
    navigator.clipboard.writeText(ticket.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!ticket) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-[#0a0a0f] min-h-screen text-white flex flex-col items-center px-4 py-10" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Syne:wght@700;800&display=swap');`}</style>

      <div className="w-full max-w-md">
        <button onClick={() => navigate("/dashboard/tickets")} className="flex items-center gap-2 text-gray-500 hover:text-white text-sm mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to tickets
        </button>

        {/* Ticket Card */}
        <div className="relative bg-[#16161f] rounded-3xl overflow-hidden border border-gray-800/60">
          {/* Top gradient bar */}
          <div className="h-1.5 bg-gradient-to-r from-violet-600 to-indigo-600" />

          <div className="p-8">
            {/* Status badge */}
            <div className="flex justify-between items-center mb-6">
              <span className={`text-xs px-3 py-1 rounded-full border font-medium ${
                ticket.status === TicketStatus.PURCHASED
                  ? "bg-emerald-900/40 text-emerald-300 border-emerald-800/50"
                  : "bg-red-900/40 text-red-300 border-red-800/50"
              }`}>{ticket.status}</span>
            </div>

            {/* Ticket ID */}
            <div className="bg-[#0a0a0f] rounded-xl px-4 py-3 mb-6 flex items-center justify-between gap-3">
              <div>
                <p className="text-gray-500 text-xs mb-1">Ticket ID</p>
                <p className="text-white font-mono text-xs break-all">{ticket.id}</p>
              </div>
              <button
                onClick={handleCopy}
                className="text-gray-500 hover:text-violet-400 transition-colors shrink-0"
                title="Copy ID"
              >
                {copied ? (
                  <span className="text-emerald-400 text-xs">Copied!</span>
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* Event info */}
            <h1 className="text-2xl font-bold mb-2" style={{ fontFamily: "'Syne', sans-serif" }}>{ticket.eventName}</h1>

            <div className="space-y-2 mb-6">
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <MapPin className="w-4 h-4 text-gray-600 shrink-0" />
                <span>{ticket.eventVenue}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <Calendar className="w-4 h-4 text-gray-600 shrink-0" />
                <span>{format(ticket.eventStart, "Pp")} — {format(ticket.eventEnd, "Pp")}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <Tag className="w-4 h-4 text-gray-600 shrink-0" />
                <span>{ticket.description}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <DollarSign className="w-4 h-4 text-gray-600 shrink-0" />
                <span className="text-white font-semibold">₹{ticket.price}</span>
              </div>
            </div>

            {/* Dashed divider */}
            <div className="border-t border-dashed border-gray-700/60 my-6" />

            {/* QR Code */}
            <div className="flex flex-col items-center">
              <div className="bg-white p-4 rounded-2xl mb-4 w-44 h-44 flex items-center justify-center">
                {isQrLoading && (
                  <div className="text-center">
                    <div className="w-8 h-8 border-2 border-gray-300 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                    <p className="text-gray-400 text-xs">Loading...</p>
                  </div>
                )}
                {error && !isQrLoading && (
                  <div className="text-center text-gray-400 text-xs p-2">⚠️ {error}</div>
                )}
                {qrCodeUrl && !isQrLoading && !error && (
                  <img src={qrCodeUrl} alt="QR Code" className="w-full h-full object-contain" />
                )}
              </div>
              <p className="text-gray-500 text-xs text-center">Present this QR code at the venue for entry</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardViewTicketPage;
