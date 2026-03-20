import NavBar from "@/components/nav-bar";
import { SimplePagination } from "@/components/simple-pagination";
import { SpringBootPagination, TicketStatus, TicketSummary } from "@/domain/domain";
import { listTickets } from "@/lib/api";
import { useAuth } from "@/hooks/use-auth";
import { Ticket, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

const DashboardListTickets: React.FC = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [tickets, setTickets] = useState<SpringBootPagination<TicketSummary> | undefined>();
  const [error, setError] = useState<string | undefined>();
  const [page, setPage] = useState(0);

  useEffect(() => {
    if (!token) return;
    listTickets(token, page).then(setTickets).catch(err => setError(err instanceof Error ? err.message : "Error"));
  }, [token, page]);

  return (
    <div className="bg-[#08080e] min-h-screen text-white" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Syne:wght@700;800;900&display=swap');`}</style>
      <NavBar />

      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-black" style={{ fontFamily: "'Syne', sans-serif" }}>My Tickets</h1>
          <p className="text-gray-500 text-sm mt-1">Your purchased tickets</p>
        </div>

        {error && (
          <div className="mb-6 bg-red-950/40 border border-red-800/40 rounded-xl px-4 py-3">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        <div className="space-y-3">
          {tickets?.content.map((ticket) => (
            <button key={ticket.id} onClick={() => navigate(`/dashboard/tickets/${ticket.id}`)}
              className="w-full text-left bg-[#111118] border border-white/8 hover:border-cyan-500/30 rounded-xl p-4 transition-all group">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-cyan-950/40 border border-cyan-800/30 flex items-center justify-center shrink-0 group-hover:bg-cyan-900/40 transition-colors">
                    <Ticket className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-white text-sm">{ticket.ticketType.name}</p>
                    <p className="text-gray-500 text-xs mt-0.5">₹{ticket.ticketType.price}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${
                    ticket.status === TicketStatus.PURCHASED
                      ? "bg-emerald-900/40 text-emerald-300 border-emerald-800/50"
                      : "bg-red-900/40 text-red-300 border-red-800/50"
                  }`}>
                    {ticket.status}
                  </span>
                  <ArrowRight className="w-4 h-4 text-gray-600 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all" />
                </div>
              </div>
            </button>
          ))}

          {tickets?.content.length === 0 && (
            <div className="text-center py-16 text-gray-500">
              <Ticket className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="text-lg mb-2">No tickets yet</p>
              <p className="text-sm">Browse events and purchase a ticket</p>
              <button onClick={() => navigate("/")} className="mt-4 text-cyan-400 hover:text-cyan-300 text-sm">
                Browse Events →
              </button>
            </div>
          )}
        </div>

        {tickets && (
          <div className="flex justify-center py-8">
            <SimplePagination pagination={tickets} onPageChange={setPage} />
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardListTickets;
