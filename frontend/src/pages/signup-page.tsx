import { useState } from "react";
import { useNavigate } from "react-router";
import { saveAuth } from "@/lib/auth";
import { Eye, EyeOff, Zap, Ticket, Building2, ShieldCheck } from "lucide-react";

const API_BASE = "/api/v1";

const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<"ATTENDEE" | "ORGANIZER" | "STAFF">("ATTENDEE");
  const [error, setError] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(undefined);
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Signup failed");
        return;
      }
      saveAuth({ token: data.token, email: data.email, role: data.role });
      navigate("/dashboard");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const roles = [
    { value: "ATTENDEE", label: "Attendee", desc: "Browse & buy tickets", icon: Ticket },
    { value: "ORGANIZER", label: "Organizer", desc: "Create & manage events", icon: Building2 },
    { value: "STAFF", label: "Staff", desc: "Validate tickets at venue", icon: ShieldCheck },
  ] as const;

  return (
    <div className="min-h-screen bg-[#08080e] flex items-center justify-center px-4 py-10" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Syne:wght@700;800;900&display=swap');
        input:-webkit-autofill { -webkit-box-shadow: 0 0 0 30px #0f0f18 inset !important; -webkit-text-fill-color: #fff !important; }
        .card-glow { box-shadow: 0 0 0 1px rgba(6,182,212,0.15), 0 20px 60px rgba(0,0,0,0.5); }
      `}</style>

      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <button onClick={() => navigate("/")} className="inline-flex items-center gap-2.5 mb-6">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
              <Zap className="w-4 h-4 text-white fill-white" />
            </div>
            <span className="text-white font-black text-xl" style={{ fontFamily: "'Syne', sans-serif" }}>
              Event<span className="text-cyan-400">Axis</span>
            </span>
          </button>
          <h1 className="text-white text-2xl font-bold mb-1">Create account</h1>
          <p className="text-gray-500 text-sm">Join thousands of event lovers</p>
        </div>

        <div className="card-glow bg-[#0f0f18] border border-white/8 rounded-2xl p-7">
          {error && (
            <div className="mb-5 bg-red-950/40 border border-red-800/40 rounded-xl px-4 py-3">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="block text-gray-400 text-xs font-medium mb-1.5 tracking-wider uppercase">Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Your full name"
                required
                className="w-full bg-[#08080e] border border-white/8 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 outline-none focus:border-cyan-500/50 transition-colors"
              />
            </div>

            <div>
              <label className="block text-gray-400 text-xs font-medium mb-1.5 tracking-wider uppercase">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full bg-[#08080e] border border-white/8 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 outline-none focus:border-cyan-500/50 transition-colors"
              />
            </div>

            <div>
              <label className="block text-gray-400 text-xs font-medium mb-1.5 tracking-wider uppercase">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-[#08080e] border border-white/8 rounded-xl px-4 py-3 pr-11 text-white text-sm placeholder-gray-600 outline-none focus:border-cyan-500/50 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Role selector */}
            <div>
              <label className="block text-gray-400 text-xs font-medium mb-1.5 tracking-wider uppercase">I want to...</label>
              <div className="grid grid-cols-3 gap-2">
                {roles.map(({ value, label, desc, icon: Icon }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setRole(value)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      role === value
                        ? "bg-cyan-950/40 border-cyan-500/50 text-white"
                        : "bg-[#08080e] border-white/8 text-gray-400 hover:border-white/20"
                    }`}
                  >
                    <Icon className={`w-4 h-4 mb-1.5 ${role === value ? "text-cyan-400" : "text-gray-600"}`} />
                    <p className="text-xs font-semibold">{label}</p>
                    <p className="text-xs text-gray-600 mt-0.5">{desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-bold py-3 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-cyan-500/20"
            >
              {isLoading ? "Creating account..." : "Create account"}
            </button>
          </form>
        </div>

        <p className="text-center text-gray-600 text-xs mt-5">
          Already have an account?{" "}
          <button onClick={() => navigate("/login")} className="text-cyan-400 hover:text-cyan-300 font-medium">
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
