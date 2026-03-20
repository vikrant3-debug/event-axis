import { clearAuth, getAuth } from "@/lib/auth";
import { useNavigate, useLocation } from "react-router";
import { Ticket, LayoutDashboard, LogOut, Zap, CalendarDays, ShieldCheck } from "lucide-react";
import { useRoles } from "@/hooks/use-roles";

const NavBar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const auth = getAuth();
  const { isOrganizer, isStaff, isAttendee } = useRoles();

  const handleLogout = () => {
    clearAuth();
    navigate("/login");
  };

  const isActive = (path: string) => location.pathname.startsWith(path);

  return (
    <nav className="border-b border-white/5 bg-[#08080e]/90 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">

        {/* Logo */}
        <button onClick={() => navigate("/")} className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-shadow">
            <Zap className="w-4 h-4 text-white fill-white" />
          </div>
          <span className="text-white font-black text-base tracking-tight" style={{ fontFamily: "'Clash Display', 'Syne', sans-serif" }}>
            Event<span className="text-cyan-400">Axis</span>
          </span>
        </button>

        {/* Center nav links (when logged in) */}
        {auth && (
          <div className="hidden md:flex items-center gap-1">
            <button
              onClick={() => navigate("/")}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-all ${
                location.pathname === "/" ? "bg-white/10 text-white" : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <CalendarDays className="w-4 h-4" />
              Events
            </button>

            {isOrganizer && (
              <button
                onClick={() => navigate("/dashboard")}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-all ${
                  isActive("/dashboard") ? "bg-white/10 text-white" : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </button>
            )}

            {isAttendee && (
              <button
                onClick={() => navigate("/dashboard/tickets")}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-all ${
                  isActive("/dashboard/tickets") ? "bg-white/10 text-white" : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Ticket className="w-4 h-4" />
                My Tickets
              </button>
            )}

            {isStaff && (
              <button
                onClick={() => navigate("/dashboard/validate-qr")}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-all ${
                  isActive("/dashboard/validate-qr") ? "bg-white/10 text-white" : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                Validate
              </button>
            )}
          </div>
        )}

        {/* Right side */}
        <div className="flex items-center gap-3">
          {auth ? (
            <>
              <div className="hidden sm:flex items-center gap-2">
                <span className="text-xs px-2.5 py-1 rounded-full bg-cyan-950/60 text-cyan-300 border border-cyan-800/40 font-medium">
                  {auth.role}
                </span>
                <span className="text-gray-500 text-xs truncate max-w-[140px]">{auth.email}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 text-gray-400 hover:text-red-400 text-sm transition-colors px-2 py-1.5 rounded-lg hover:bg-red-950/30"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <button onClick={() => navigate("/login")} className="text-gray-400 hover:text-white text-sm transition-colors px-3 py-1.5">
                Sign in
              </button>
              <button onClick={() => navigate("/signup")} className="bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-sm px-4 py-1.5 rounded-lg transition-colors">
                Sign up
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
