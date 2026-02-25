import { useState } from "react";
import { registerUser } from "../services/authService";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Mail, Lock, UserPlus, Wallet, CheckCircle2, Zap, Rocket } from "lucide-react";

function RegisterPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await registerUser(form);
      navigate("/login");
    } catch (error) {
      console.error("Registration failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex overflow-hidden font-sans">
      
      {/* --- LEFT SIDE: THE FORM --- */}
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

          <h2 className="text-4xl font-black text-white mb-2">Join FinAI</h2>
          <p className="text-slate-400 mb-10">Start your AI-powered financial journey today.</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={20} />
              <input
                name="name" placeholder="Full Name" required onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-800 p-4 pl-12 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all text-white"
              />
            </div>

            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={20} />
              <input
                name="email" type="email" placeholder="Email Address" required onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-800 p-4 pl-12 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all text-white"
              />
            </div>

            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={20} />
              <input
                name="password" type="password" placeholder="Create Password" required onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-800 p-4 pl-12 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all text-white"
              />
            </div>

            <button 
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 text-white p-4 rounded-2xl font-bold shadow-xl shadow-indigo-500/20 transition-all flex items-center justify-center gap-2 group mt-2"
            >
              {loading ? "Creating Account..." : (
                <>Get Started <UserPlus size={20} className="group-hover:scale-110 transition-transform" /></>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-slate-500">
              Already have an account? <Link to="/login" className="text-indigo-400 font-bold hover:underline">Sign In</Link>
            </p>
          </div>
        </div>
      </motion.div>

      {/* --- RIGHT SIDE: ONBOARDING PREVIEW --- */}
      <motion.div 
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="hidden lg:flex flex-1 relative bg-slate-900/20 border-l border-slate-900 items-center justify-center p-20"
      >
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent opacity-50" />
        
        <div className="z-10 w-full max-w-lg space-y-10">
          <div className="space-y-2">
            <h2 className="text-3xl font-black text-white">Setup in 3 Easy Steps</h2>
            <p className="text-slate-400">Join thousands of users who simplified their wealth management.</p>
          </div>

          <div className="space-y-6">
            <StepItem icon={<Rocket className="text-blue-400" />} text="Create your secure account" delay={0.4} />
            <StepItem icon={<Zap className="text-amber-400" />} text="Connect your accounts or log manually" delay={0.6} />
            <StepItem icon={<CheckCircle2 className="text-emerald-400" />} text="Receive AI-driven savings insights" delay={0.8} />
          </div>

          {/* Decorative Card */}
          <div className="p-8 bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50" />
            <p className="text-indigo-400 font-bold mb-4 flex items-center gap-2 italic">
              <Zap size={16} /> Recent Insight
            </p>
            <p className="text-slate-200 text-lg leading-relaxed">
              "Your entertainment spending is 20% lower this month. You're on track to save <span className="text-emerald-400">₹4,500</span> more than January!"
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function StepItem({ icon, text, delay }) {
  return (
    <motion.div 
      initial={{ x: 20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay }}
      className="flex items-center gap-4 p-4 bg-slate-900/40 rounded-2xl border border-slate-800 hover:border-slate-700 transition-colors"
    >
      <div className="p-2 bg-slate-800 rounded-lg">{icon}</div>
      <span className="text-slate-300 font-medium">{text}</span>
    </motion.div>
  );
}

export default RegisterPage;