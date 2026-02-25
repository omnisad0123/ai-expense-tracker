import { useState, useContext } from "react";
import { loginUser } from "../services/authService";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, LogIn, Wallet, Sparkles, PieChart, ShieldCheck } from "lucide-react";

function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  // Destructure setUser from our updated Context
  const { setToken, setUser } = useContext(AuthContext); 
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await loginUser(form);
      
      // Save both to LocalStorage for persistence
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Update global Context state
      setToken(data.token);
      setUser(data.user);

      // Navigate to the Dashboard
      navigate("/dashboard");
    } catch (error) {
      console.error("Login failed", error);
      alert(error.response?.data?.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex overflow-hidden font-sans">
      <motion.div 
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full lg:w-[40%] flex flex-col justify-center px-8 md:px-16 lg:px-20 bg-slate-950 z-20"
      >
        <div className="max-w-md w-full mx-auto">
          <div className="flex items-center gap-3 mb-10">
            <div className="bg-indigo-600 p-2 rounded-xl shadow-lg shadow-indigo-500/20">
              <Wallet size={24} className="text-white" />
            </div>
            <span className="text-2xl font-black italic tracking-tighter text-white uppercase">FinAI</span>
          </div>

          <h2 className="text-4xl font-black text-white mb-2">Welcome Back</h2>
          <p className="text-slate-400 mb-10">Sign in to manage your AI-powered finances.</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={20} />
              <input
                name="email" type="email" placeholder="Email Address" required
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-800 p-4 pl-12 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all text-white placeholder:text-slate-600"
              />
            </div>

            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={20} />
              <input
                name="password" type="password" placeholder="Password" required
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-800 p-4 pl-12 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all text-white placeholder:text-slate-600"
              />
            </div>

            <button 
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 text-white p-4 rounded-2xl font-bold shadow-xl shadow-indigo-500/20 transition-all flex items-center justify-center gap-2 group mt-4"
            >
              {loading ? "Authenticating..." : (
                <>Sign In <LogIn size={20} className="group-hover:translate-x-1 transition-transform" /></>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-slate-500">
              New to FinAI? <Link to="/register" className="text-indigo-400 font-bold hover:underline">Create an account</Link>
            </p>
          </div>
        </div>
      </motion.div>

      {/* Feature Showcase remains the same */}
      <motion.div 
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="hidden lg:flex flex-1 relative bg-indigo-600/5 border-l border-slate-900 items-center justify-center p-20"
      >
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-indigo-600/20 blur-[150px] rounded-full" />
        <div className="z-10 max-w-lg space-y-12">
          <FeatureItem icon={<Sparkles className="text-indigo-400" size={28} />} title="AI Insights" desc="Gemini-powered analysis of your spending habits." />
          <FeatureItem icon={<PieChart className="text-purple-400" size={28} />} title="Real-time Tracking" desc="Automatic categorization of every transaction." />
          <FeatureItem icon={<ShieldCheck className="text-emerald-400" size={28} />} title="Bank-Grade Security" desc="Your data is encrypted and synced securely." />
        </div>
      </motion.div>
    </div>
  );
}

function FeatureItem({ icon, title, desc }) {
  return (
    <div className="flex gap-6 items-start">
      <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 shadow-lg">{icon}</div>
      <div>
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <p className="text-slate-400 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

export default LoginPage;