import { clearAuth, getAuth } from "@/lib/auth";
import { useNavigate } from "react-router";

const OrganizersLandingPage: React.FC = () => {
  const navigate = useNavigate();
  const auth = getAuth();

  return (
    <div className="bg-[#0a0a0f] min-h-screen text-white" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Syne:wght@700;800&display=swap');`}</style>

      <nav className="border-b border-gray-800/60 sticky top-0 z-50 bg-[#0a0a0f]/90 backdrop-blur-sm">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-violet-600 flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M2 5a1 1 0 011-1h10a1 1 0 011 1v1a2 2 0 010 4v1a1 1 0 01-1 1H3a1 1 0 01-1-1v-1a2 2 0 010-4V5z" fill="white"/>
              </svg>
            </div>
            <span className="text-white font-bold text-sm" style={{ fontFamily: "'Syne', sans-serif" }}>TicketFlow</span>
          </div>
          <div className="flex items-center gap-3">
            {auth ? (
              <>
                <button onClick={() => navigate("/dashboard/events")} className="text-gray-400 hover:text-white text-sm">Dashboard</button>
                <button onClick={() => { clearAuth(); navigate("/"); }} className="bg-gray-800 hover:bg-gray-700 text-white text-sm px-4 py-1.5 rounded-lg">Logout</button>
              </>
            ) : (
              <button onClick={() => navigate("/login")} className="bg-violet-600 hover:bg-violet-500 text-white text-sm px-4 py-1.5 rounded-lg">Sign in</button>
            )}
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 bg-violet-900/30 border border-violet-800/50 rounded-full px-3 py-1">
              <div className="w-1.5 h-1.5 rounded-full bg-violet-400" />
              <span className="text-violet-300 text-xs font-medium">For Event Organizers</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight" style={{ fontFamily: "'Syne', sans-serif" }}>
              Create, Manage &<br />Sell Event Tickets
            </h1>
            <p className="text-gray-400 text-lg leading-relaxed">
              A complete platform for event organizers to create events, sell tickets, and validate attendees with QR Codes.
            </p>
            <div className="flex flex-wrap gap-3">
              <button onClick={() => navigate("/dashboard/events")} className="bg-violet-600 hover:bg-violet-500 text-white px-6 py-3 rounded-xl font-medium transition-all hover:shadow-lg hover:shadow-violet-500/20">
                Create an Event
              </button>
              <button onClick={() => navigate("/")} className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-xl font-medium transition-colors">
                Browse Events
              </button>
            </div>
          </div>
          <div className="rounded-2xl overflow-hidden border border-gray-800/50 aspect-square">
            <img src="organizers-landing-hero.png" alt="A busy concert" className="w-full h-full object-cover" />
          </div>
        </div>
      </main>
    </div>
  );
};

export default OrganizersLandingPage;
