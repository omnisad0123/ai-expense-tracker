import { useEffect, useState, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, AlertTriangle, TrendingUp, 
  Wallet, Loader2, ArrowRight, BrainCircuit 
} from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";
import { getMonthlySummary, getAiCoachInsights } from "../services/analyticsService";
import { getBudgets } from "../services/budgetService";
import { AuthContext } from "../context/AuthContext";

function InsightsPage() {
  const { token } = useContext(AuthContext);
  const [summary, setSummary] = useState(null);
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiAdvice, setAiAdvice] = useState("");

  // Load core financial data
  const loadData = async () => {
    try {
      const [s, b] = await Promise.all([
        getMonthlySummary(),
        getBudgets()
      ]);
      setSummary(s);
      setBudgets(b || []);
    } catch (error) {
      console.error("Insights load failure:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch actual AI Analysis from Gemini Backend
  const generateAiAnalysis = async () => {
    if (isAiLoading) return;
    setIsAiLoading(true);
    try {
      const data = await getAiCoachInsights();
      setAiAdvice(data.insight);
    } catch (error) {
      console.error("AI Coach Error:", error);
      setAiAdvice("Gemini is currently processing a high volume of data. Please try again in a moment.");
    } finally {
      setIsAiLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // Auto-generate AI insight on first load
    generateAiAnalysis();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="h-[60vh] flex flex-col items-center justify-center text-slate-400">
          <Loader2 className="animate-spin text-indigo-500 mb-4" size={40} />
          <p className="font-black animate-pulse tracking-widest uppercase text-xs">Syncing Financial Data...</p>
        </div>
      </DashboardLayout>
    );
  }

  // Logic for UI calculations
  const topCategory = summary?.categoryBreakdown 
    ? [...summary.categoryBreakdown].sort((a, b) => b.totalAmount - a.totalAmount)[0] 
    : null;

  const overBudget = budgets.filter((b) => {
    const spent = summary?.categoryBreakdown?.find((c) => c._id === b.category)?.totalAmount || 0;
    return spent > b.limit;
  });

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto pb-10 px-4">
        
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h1 className="text-4xl font-black text-white tracking-tighter flex items-center gap-3">
              Smart Insights <Sparkles className="text-indigo-400" />
            </h1>
            <p className="text-slate-400 mt-2 font-medium">Neural analysis of your spending habits and budget efficiency.</p>
          </motion.div>
          
          <button 
            onClick={generateAiAnalysis}
            disabled={isAiLoading}
            className="group bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 text-white px-8 py-4 rounded-2xl font-bold transition-all flex items-center gap-3 shadow-2xl shadow-indigo-500/20 active:scale-95"
          >
            {isAiLoading ? <Loader2 className="animate-spin" size={20} /> : <BrainCircuit size={20} />}
            {isAiLoading ? "Processing Neural Data..." : "Regenerate Analysis"}
          </button>
        </div>

        {/* --- AI INSIGHT HERO CARD --- */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative bg-slate-900/40 backdrop-blur-2xl p-8 md:p-12 rounded-[2.5rem] border border-indigo-500/20 mb-12 shadow-3xl overflow-hidden"
        >
          {/* Neural Glow Background */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-600/10 blur-[100px] rounded-full" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-purple-600/5 blur-[100px] rounded-full" />
          
          <h2 className="text-sm font-black text-indigo-400 mb-8 flex items-center gap-2 tracking-[0.3em] uppercase">
            <Sparkles size={16} /> Gemini AI Coach
          </h2>
          
          <AnimatePresence mode="wait">
            {isAiLoading ? (
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="space-y-4"
              >
                <div className="h-4 bg-slate-800/50 rounded-full w-full animate-pulse" />
                <div className="h-4 bg-slate-800/50 rounded-full w-5/6 animate-pulse" />
                <div className="h-4 bg-slate-800/50 rounded-full w-3/4 animate-pulse" />
              </motion.div>
            ) : (
              <motion.div
                key="content"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="prose prose-invert max-w-none"
              >
                <p className="text-xl md:text-2xl font-medium text-slate-200 leading-relaxed italic whitespace-pre-line">
                  {aiAdvice || "Ready to analyze your spending. Click the button above to generate your personalized financial breakdown."}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* --- STATS GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <InsightStatCard 
            label="Gross Monthly Outflow" 
            value={`₹${summary?.totalSpent?.toLocaleString() || 0}`} 
            icon={<Wallet className="text-emerald-400" />} 
          />
          <InsightStatCard 
            label="Dominant Category" 
            value={topCategory?._id || "None"} 
            subValue={`₹${topCategory?.totalAmount?.toLocaleString() || 0}`}
            icon={<TrendingUp className="text-indigo-400" />} 
          />
          <InsightStatCard 
            label="System Alerts" 
            value={`${overBudget.length} Active`} 
            status={overBudget.length > 0 ? "danger" : "safe"}
            icon={<AlertTriangle className={overBudget.length > 0 ? "text-red-400" : "text-slate-500"} />} 
          />
        </div>

        {/* --- CRITICAL ALERTS --- */}
        <AnimatePresence>
          {overBudget.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <h2 className="text-sm font-black text-white uppercase tracking-widest mb-6 ml-1">Critical Anomalies</h2>
              {overBudget.map((b, index) => (
                <motion.div 
                  key={b._id} 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-red-950/10 border border-red-500/20 p-6 rounded-2xl flex items-center justify-between group hover:bg-red-950/20 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-red-500/10 p-2 rounded-lg"><AlertTriangle className="text-red-500" size={20} /></div>
                    <span className="text-red-200 font-medium tracking-wide">
                      Your <span className="font-black uppercase text-red-400">{b.category}</span> spending has exceeded the ₹{b.limit.toLocaleString()} threshold.
                    </span>
                  </div>
                  <button className="flex items-center gap-2 text-xs font-black text-red-400 uppercase tracking-widest hover:text-red-300 transition-colors">
                    Re-calibrate <ArrowRight size={14} />
                  </button>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}

// Stats Card Component
function InsightStatCard({ label, value, subValue, icon, status }) {
  return (
    <div className={`bg-slate-900/40 backdrop-blur-md p-8 rounded-3xl border transition-all duration-300 ${
      status === "danger" ? "border-red-500/30 bg-red-500/5 shadow-lg shadow-red-500/5" : "border-slate-800/50 hover:border-indigo-500/30"
    }`}>
      <div className="flex items-center justify-between mb-6">
        <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">{label}</p>
        <div className="p-3 bg-slate-950/50 rounded-xl border border-slate-800">{icon}</div>
      </div>
      <p className="text-3xl font-black text-white tracking-tighter">{value}</p>
      {subValue && <p className="text-xs text-slate-500 font-bold mt-2 uppercase tracking-widest">{subValue}</p>}
    </div>
  );
}

export default InsightsPage;