import { clearAuth, getAuth } from "@/lib/auth";
import { useNavigate } from "react-router";
import { Input } from "@/components/ui/input";
import { Search, Zap, CalendarDays, MapPin, ArrowRight, Twitter, Github, Linkedin, Mail, LogOut, LayoutDashboard, Ticket, ShieldCheck, Instagram } from "lucide-react";
import { useEffect, useState } from "react";
import { PublishedEventSummary, SpringBootPagination } from "@/domain/domain";
import { listPublishedEvents, searchPublishedEvents } from "@/lib/api";
import PublishedEventCard from "@/components/published-event-card";
import { SimplePagination } from "@/components/simple-pagination";
import { useRoles } from "@/hooks/use-roles";

const AttendeeLandingPage: React.FC = () => {
  const navigate = useNavigate();
  const auth = getAuth();
  const { isOrganizer, isStaff, isAttendee } = useRoles();
  const [page, setPage] = useState(0);
  const [publishedEvents, setPublishedEvents] = useState<SpringBootPagination<PublishedEventSummary> | undefined>();
  const [error, setError] = useState<string | undefined>();
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (query && query.length > 0) queryPublishedEvents();
    else refreshPublishedEvents();
  }, [page]);

  const refreshPublishedEvents = async () => {
    try {
      setPublishedEvents(await listPublishedEvents(page));
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    }
  };

  const queryPublishedEvents = async () => {
    if (!query) return refreshPublishedEvents();
    try {
      setPublishedEvents(await searchPublishedEvents(query, page));
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    }
  };

  return (
    <div className="bg-[#08080e] min-h-screen text-white" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Syne:wght@700;800;900&display=swap');
        .event-card-grid > * { height: 100%; }
        .hero-glow { background: radial-gradient(ellipse 80% 50% at 50% -10%, rgba(6,182,212,0.15), transparent); }
        .grid-bg { background-image: linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px); background-size: 40px 40px; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .fade-up { animation: fadeUp 0.6s ease forwards; }
        .fade-up-2 { animation: fadeUp 0.6s 0.15s ease forwards; opacity: 0; }
        .fade-up-3 { animation: fadeUp 0.6s 0.3s ease forwards; opacity: 0; }
      `}</style>

      {/* Nav */}
      <nav className="border-b border-white/5 bg-[#08080e]/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
          <button onClick={() => navigate("/")} className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Zap className="w-4 h-4 text-white fill-white" />
            </div>
            <span className="text-white font-black text-base" style={{ fontFamily: "'Syne', sans-serif" }}>
              Event<span className="text-cyan-400">Axis</span>
            </span>
          </button>

          {auth && (
            <div className="hidden md:flex items-center gap-1">
              <button onClick={() => navigate("/")} className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm bg-white/10 text-white">
                <CalendarDays className="w-4 h-4" /> Events
              </button>
              {(isOrganizer) && (
                <button onClick={() => navigate("/dashboard")} className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-all">
                  <LayoutDashboard className="w-4 h-4" /> Dashboard
                </button>
              )}
              {isAttendee && (
                <button onClick={() => navigate("/dashboard/tickets")} className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-all">
                  <Ticket className="w-4 h-4" /> My Tickets
                </button>
              )}
              {isStaff && (
                <button onClick={() => navigate("/dashboard/validate-qr")} className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-all">
                  <ShieldCheck className="w-4 h-4" /> Validate
                </button>
              )}
            </div>
          )}

          <div className="flex items-center gap-3">
            {auth ? (
              <>
                <span className="text-xs px-2.5 py-1 rounded-full bg-cyan-950/60 text-cyan-300 border border-cyan-800/40 font-medium hidden sm:inline">{auth.role}</span>
                <button onClick={() => { clearAuth(); navigate("/"); window.location.reload(); }}
                  className="flex items-center gap-1.5 text-gray-400 hover:text-red-400 text-sm transition-colors px-2 py-1.5 rounded-lg hover:bg-red-950/30">
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <button onClick={() => navigate("/login")} className="text-gray-400 hover:text-white text-sm px-3 py-1.5 transition-colors">Sign in</button>
                <button onClick={() => navigate("/signup")} className="bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-sm px-4 py-1.5 rounded-lg transition-colors">Sign up</button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div className="relative overflow-hidden hero-glow grid-bg">
        <div className="max-w-6xl mx-auto px-5 py-20 md:py-28">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-cyan-950/40 border border-cyan-800/40 rounded-full px-3 py-1 text-cyan-300 text-xs font-medium mb-6 fade-up">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              Live events near you
            </div>
            <h1 className="text-4xl md:text-6xl font-black leading-[1.05] mb-5 fade-up-2" style={{ fontFamily: "'Syne', sans-serif" }}>
              Your next<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">unforgettable</span><br />
              experience
            </h1>
            <p className="text-gray-400 text-lg mb-8 fade-up-3 leading-relaxed">
              Discover, book, and experience events that matter. From concerts to conferences — all in one place.
            </p>
            <div className="flex gap-2 max-w-lg fade-up-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <Input
                  className="bg-white/5 border-white/10 text-white placeholder-gray-500 focus:border-cyan-500/50 pl-10 h-11 rounded-xl"
                  placeholder="Search events, venues, artists..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && queryPublishedEvents()}
                />
              </div>
              <button onClick={queryPublishedEvents} className="bg-cyan-500 hover:bg-cyan-400 text-black font-semibold px-5 h-11 rounded-xl transition-colors flex items-center gap-2">
                Search <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Decorative orbs */}
        <div className="absolute top-20 right-10 w-64 h-64 rounded-full bg-cyan-600/5 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/3 w-48 h-48 rounded-full bg-blue-600/8 blur-3xl pointer-events-none" />
      </div>

      {/* Events section */}
      <div className="max-w-6xl mx-auto px-5 py-14">

        {error && (
          <div className="mb-6 bg-red-950/40 border border-red-800/40 rounded-xl px-4 py-3">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xl font-bold text-white" style={{ fontFamily: "'Syne', sans-serif" }}>Upcoming Events</h2>
            <p className="text-gray-500 text-sm mt-0.5">
              {publishedEvents ? `${publishedEvents.totalElements} events found` : "Loading..."}
            </p>
          </div>
        </div>

        {/* Event Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 event-card-grid">
          {publishedEvents?.content?.map((publishedEvent) => (
            <PublishedEventCard publishedEvent={publishedEvent} key={publishedEvent.id} />
          ))}
        </div>

        {!publishedEvents?.content?.length && publishedEvents && (
          <div className="text-center py-20">
            <CalendarDays className="w-10 h-10 text-gray-700 mx-auto mb-3" />
            <p className="text-gray-500">No events found</p>
          </div>
        )}

        {publishedEvents && (
          <div className="w-full flex justify-center py-10">
            <SimplePagination pagination={publishedEvents} onPageChange={setPage} />
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-[#06060b]">
        <div className="max-w-6xl mx-auto px-5 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                  <Zap className="w-4 h-4 text-white fill-white" />
                </div>
                <span className="text-white font-black text-base" style={{ fontFamily: "'Syne', sans-serif" }}>
                  Event<span className="text-cyan-400">Axis</span>
                </span>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
                The modern platform for discovering and managing live events. Your next experience is one click away.
              </p>
              <div className="flex items-center gap-3 mt-5">
                {[Github, Linkedin, Mail,Instagram].map((Icon, i) => (
                  <button key={i} className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-500 hover:text-white transition-all">
                    <Icon className="w-3.5 h-3.5" />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-white text-sm font-semibold mb-4">Platform</h4>
              <ul className="space-y-2.5">
                {["Browse Events", "Sell Tickets", "For Organizers", "Staff Portal"].map((item) => (
                  <li key={item}><a href="#" className="text-gray-500 hover:text-white text-sm transition-colors">{item}</a></li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-white text-sm font-semibold mb-4">Company</h4>
              <ul className="space-y-2.5">
                {["About", "Blog", "Privacy Policy", "Terms of Service"].map((item) => (
                  <li key={item}><a href="#" className="text-gray-500 hover:text-white text-sm transition-colors">{item}</a></li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-gray-600 text-xs">© 2026 EventAxis. All rights reserved.</p>
            <p className="text-gray-700 text-xs">Built for event lovers</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AttendeeLandingPage;
