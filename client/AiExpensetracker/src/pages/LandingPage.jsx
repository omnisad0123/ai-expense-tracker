import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, Wallet, Shield, Zap, ArrowRight, BarChart3 } from "lucide-react";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-hidden font-sans">
      {/* --- NAVBAR --- */}
      <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto border-b border-slate-900">
        <div className="flex items-center gap-2 text-2xl font-black tracking-tighter italic">
          <div className="bg-indigo-600 p-2 rounded-xl shadow-lg shadow-indigo-500/30">
            <Wallet size={24} className="text-white" />
          </div>
          <span>FIN<span className="text-indigo-500">Track</span></span>
        </div>
        
        <div className="hidden md:flex gap-8 text-slate-400 font-medium text-sm uppercase tracking-widest">
          <Link to="#" className="hover:text-indigo-400 transition">Features</Link>
          <Link to="#" className="hover:text-indigo-400 transition">Security</Link>
          <Link to="#" className="hover:text-indigo-400 transition">Pricing</Link>
        </div>

        <div className="flex items-center gap-4">
          <Link to="/login" className="text-slate-300 hover:text-white font-semibold transition">
            Log in
          </Link>
          <Link to="/register" className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/20 transition-all">
            Get Started
          </Link>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <main className="max-w-7xl mx-auto px-8 py-24 grid grid-cols-1 lg:grid-cols-2 items-center relative">
        {/* Glow Effects */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-purple-600/5 blur-[100px] rounded-full pointer-events-none" />
        
        {/* Left Side: Content */}
        <motion.div 
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="z-10"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-widest mb-8">
            <Sparkles size={14} /> AI-Powered Finance
          </div>
          
          <h1 className="text-6xl md:text-7xl font-black leading-tight mb-8 tracking-tight">
            Take Control of <br />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">Your Wealth</span>
          </h1>
          
          <p className="text-xl text-slate-400 leading-relaxed max-w-lg mb-10">
            Harness the power of AI to automatically categorize expenses, set smart budgets, and get personalized financial insights in real-time.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/register">
              <button className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-500 text-white text-lg font-bold px-10 py-4 rounded-2xl shadow-2xl shadow-indigo-500/30 transition-all flex items-center justify-center gap-2 group">
                Start Free Trial <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
            <button className="w-full sm:w-auto bg-slate-900 border border-slate-800 text-white text-lg font-bold px-10 py-4 rounded-2xl hover:bg-slate-800 transition-all">
              See Demo
            </button>
          </div>

          <div className="mt-12 flex items-center gap-6 text-slate-500">
            <div className="flex items-center gap-2"><Shield size={18} /> Bank-grade Security</div>
            <div className="flex items-center gap-2"><Zap size={18} /> Instant Sync</div>
          </div>
        </motion.div>

        {/* Right Side: Visual Element */}
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative mt-20 lg:mt-0 flex justify-center lg:justify-end"
        >
          {/* Glassmorphism Card Mockup */}
          <div className="relative z-10 w-full max-w-[500px] aspect-[4/3] bg-slate-900/40 backdrop-blur-3xl border border-slate-800/50 rounded-3xl p-8 shadow-2xl overflow-hidden group">
             {/* Decorative internal elements to mimic a dashboard */}
             <div className="flex justify-between items-center mb-10">
                <div className="h-8 w-32 bg-slate-800 rounded-lg animate-pulse" />
                <BarChart3 className="text-indigo-500" size={32} />
             </div>
             <div className="space-y-6">
                <div className="h-4 w-full bg-slate-800/50 rounded-full" />
                <div className="h-4 w-3/4 bg-slate-800/50 rounded-full" />
                <div className="grid grid-cols-3 gap-4 mt-10">
                   <div className="h-20 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl" />
                   <div className="h-20 bg-slate-800/50 rounded-2xl" />
                   <div className="h-20 bg-slate-800/50 rounded-2xl" />
                </div>
             </div>
             
             {/* Glowing light streak */}
             <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          </div>

          {/* Background Decorative Rings */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] border border-slate-800/30 rounded-full pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] border border-slate-900/20 rounded-full pointer-events-none" />
        </motion.div>
      </main>
    </div>
  );
};

export default LandingPage;