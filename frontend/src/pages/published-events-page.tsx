import { clearAuth, getAuth } from "@/lib/auth";
import { useNavigate, useParams, Link } from "react-router";
import { PublishedEventDetails, PublishedEventTicketTypeDetails } from "@/domain/domain";
import { getPublishedEvent } from "@/lib/api";
import { ArrowLeft, MapPin, Calendar, Ticket, Zap, LogOut, LayoutDashboard } from "lucide-react";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { useRoles } from "@/hooks/use-roles";

const EVENT_IMAGES = [
  "/event-1.jpg", "/event-2.jpg", "/event-3.jpg", "/event-4.jpg",
  "/event-5.jpg", "/event-6.jpg", "/event-7.jpg",
];
const getImage = (id: string) => EVENT_IMAGES[id.charCodeAt(0) % EVENT_IMAGES.length];

const PublishedEventsPage: React.FC = () => {
  const navigate = useNavigate();
  const auth = getAuth();
  const { isStaff } = useRoles();
  const { id } = useParams();
  const [error, setError] = useState<string | undefined>();
  const [publishedEvent, setPublishedEvent] = useState<PublishedEventDetails | undefined>();
  const [selectedTicketType, setSelectedTicketType] = useState<PublishedEventTicketTypeDetails | undefined>();

  useEffect(() => {
    if (!id) { setError("ID must be provided!"); return; }
    getPublishedEvent(id)
      .then(data => {
        setPublishedEvent(data);
        if (data.ticketTypes.length > 0) setSelectedTicketType(data.ticketTypes[0]);
      })
      .catch(err => setError(err instanceof Error ? err.message : "Error"));
  }, [id]);

  return (
    <div className="bg-[#08080e] min-h-screen text-white" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Syne:wght@700;800;900&display=swap');`}</style>

      {/* Nav */}
      <nav className="border-b border-white/5 bg-[#08080e]/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
          <button onClick={() => navigate("/")} className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Zap className="w-4 h-4 text-white fill-white" />
            </div>
            <span className="text-white font-black text-base" style={{ fontFamily: "'Syne', sans-serif" }}>
              Event<span className="text-cyan-400">Axis</span>
            </span>
          </button>
          <div className="flex items-center gap-3">
            {auth ? (
              <>
                <span className="text-xs px-2.5 py-1 rounded-full bg-cyan-950/60 text-cyan-300 border border-cyan-800/40 font-medium hidden sm:inline">{auth.role}</span>
                <button onClick={() => navigate("/dashboard")} className="flex items-center gap-1.5 text-gray-400 hover:text-white text-sm transition-colors">
                  <LayoutDashboard className="w-4 h-4" /><span className="hidden sm:inline">Dashboard</span>
                </button>
                <button onClick={() => { clearAuth(); navigate("/"); }} className="flex items-center gap-1.5 text-gray-400 hover:text-red-400 text-sm transition-colors px-2 py-1.5 rounded-lg hover:bg-red-950/30">
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              <button onClick={() => navigate("/login")} className="bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-sm px-4 py-1.5 rounded-lg transition-colors">
                Sign in
              </button>
            )}
          </div>
        </div>
      </nav>

      {error && (
        <div className="max-w-6xl mx-auto px-5 py-4">
          <div className="bg-red-950/40 border border-red-800/40 rounded-xl px-4 py-3">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        </div>
      )}

      <main className="max-w-6xl mx-auto px-5 py-10">
        <button onClick={() => navigate("/")} className="flex items-center gap-2 text-gray-500 hover:text-white text-sm mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to events
        </button>

        {publishedEvent && (
          <>
            {/* Hero section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 items-start">
              <div className="space-y-4">
                <h1 className="text-4xl font-black leading-tight" style={{ fontFamily: "'Syne', sans-serif" }}>
                  {publishedEvent.name}
                </h1>
                <div className="space-y-2">
                  <p className="flex gap-2 items-start text-gray-400 text-sm">
                    <MapPin className="w-4 h-4 shrink-0 mt-0.5 text-cyan-500" />
                    {publishedEvent.venue}
                  </p>
                  {publishedEvent.start && (
                    <p className="flex gap-2 items-center text-gray-400 text-sm">
                      <Calendar className="w-4 h-4 shrink-0 text-cyan-500" />
                      {format(publishedEvent.start, "PPP")}
                      {publishedEvent.end && ` — ${format(publishedEvent.end, "PPP")}`}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <Ticket className="w-4 h-4 text-cyan-400" />
                  <span className="text-cyan-400 text-sm font-medium">{publishedEvent.ticketTypes?.length} ticket type{publishedEvent.ticketTypes?.length !== 1 ? "s" : ""} available</span>
                </div>
              </div>

              {/* Event image */}
              <div className="rounded-2xl overflow-hidden aspect-video relative">
                <img
                  src={getImage(publishedEvent.id)}
                  alt={publishedEvent.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </div>
            </div>

            {/* Tickets section */}
            <h2 className="text-xl font-black mb-5" style={{ fontFamily: "'Syne', sans-serif" }}>Available Tickets</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Ticket type list */}
              <div className="space-y-2">
                {publishedEvent.ticketTypes?.map((ticketType) => (
                  <div
                    key={ticketType.id}
                    onClick={() => setSelectedTicketType(ticketType)}
                    className={`cursor-pointer rounded-xl px-5 py-4 border transition-all ${
                      selectedTicketType?.id === ticketType.id
                        ? "bg-cyan-950/30 border-cyan-500/40"
                        : "bg-[#111118] border-white/8 hover:border-white/20"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold text-sm">{ticketType.name}</h3>
                        {ticketType.description && (
                          <p className="text-gray-500 text-xs mt-0.5">{ticketType.description}</p>
                        )}
                      </div>
                      <span className={`text-lg font-bold ${selectedTicketType?.id === ticketType.id ? "text-cyan-400" : "text-white"}`}>
                        ₹{ticketType.price}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Selected ticket summary */}
              {selectedTicketType && (
                <div className="bg-[#111118] border border-white/8 rounded-2xl p-6 h-fit">
                  <h3 className="text-xl font-black mb-1" style={{ fontFamily: "'Syne', sans-serif" }}>{selectedTicketType.name}</h3>
                  <p className="text-3xl font-black text-cyan-400 mb-3">₹{selectedTicketType.price}</p>
                  {selectedTicketType.description && (
                    <p className="text-gray-400 text-sm mb-5">{selectedTicketType.description}</p>
                  )}
                  {!isStaff ? (
                    <Link to={`/events/${publishedEvent.id}/purchase/${selectedTicketType.id}`}>
                      <button className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-bold py-3 rounded-xl transition-all shadow-lg shadow-cyan-500/20">
                        Purchase Ticket
                      </button>
                    </Link>
                  ) : (
                    <div className="w-full bg-white/5 text-gray-500 font-medium py-3 rounded-xl text-center text-sm">
                      Staff cannot purchase tickets
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default PublishedEventsPage;
