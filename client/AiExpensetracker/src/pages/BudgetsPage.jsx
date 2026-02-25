import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Target, TrendingDown, PieChart, 
  AlertCircle, CheckCircle2, Save, PlusCircle, Loader2 
} from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";
import { getBudgets, setBudget } from "../services/budgetService";
import { getMonthlySummary } from "../services/analyticsService";

function BudgetsPage() {
  const [budgets, setBudgets] = useState([]);
  const [summary, setSummary] = useState(null);
  const [form, setForm] = useState({ category: "", limit: "" });
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  const loadData = async () => {
    try {
      // Using Promise.allSettled or wrapping in try-catch to prevent 401 crashes
      const [budgetData, summaryData] = await Promise.all([
        getBudgets(),
        getMonthlySummary()
      ]);
      
      setBudgets(budgetData || []);
      setSummary(summaryData);
    } catch (error) {
      console.error("Failed to sync budget data:", error);
      
      // Automatic logout if the token is invalid (Fixes the 401 loop)
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.category || !form.limit) return;
    
    setIsUpdating(true);
    try {
      await setBudget(form);
      setForm({ category: "", limit: "" });
      await loadData(); // Refresh data after update
    } catch (error) {
      console.error("Update failed:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const getSpent = (category) => {
    const found = summary?.categoryBreakdown?.find((c) => c._id === category);
    return found ? found.totalAmount : 0;
  };

  const totalBudget = budgets.reduce((sum, b) => sum + Number(b.limit), 0);
  const totalSpent = summary?.totalSpent || 0;
  const usagePercent = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0;

  if (loading) {
    return (
      <DashboardLayout>
        <div className="h-[60vh] flex flex-col items-center justify-center text-slate-400">
          <Loader2 className="animate-spin text-indigo-500 mb-4" size={40} />
          <p className="font-medium animate-pulse">Syncing your financial limits...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto pb-12">
        {/* Header */}
        <header className="mb-10">
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-4xl font-black text-white flex items-center gap-3"
          >
            <Target className="text-indigo-500" size={36} /> Budget Planner
          </motion.h1>
          <p className="text-slate-400 mt-2">AI-assisted control over your monthly spending trajectory.</p>
        </header>

        {/* Global Progress Header */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <BudgetStatCard 
            label="Total Allocated" 
            value={`₹${totalBudget.toLocaleString()}`} 
            icon={<PieChart className="text-indigo-400" />} 
          />
          <BudgetStatCard 
            label="Total Spent" 
            value={`₹${totalSpent.toLocaleString()}`} 
            icon={<TrendingDown className="text-emerald-400" />} 
          />
          <BudgetStatCard 
            label="Overall Usage" 
            value={`${usagePercent}%`} 
            icon={<ActivityIcon percent={usagePercent} />} 
          />
        </div>

        {/* Set Budget Form */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-900/40 backdrop-blur-2xl p-8 rounded-[2rem] border border-slate-800/50 mb-12 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-slate-200">
            <PlusCircle size={20} className="text-indigo-400" /> Adjust Category Limits
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <input
              name="category" placeholder="Category (e.g. Groceries)"
              value={form.category} onChange={handleChange}
              className="w-full bg-slate-950/50 border border-slate-800 p-4 rounded-xl focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all text-white"
            />
            <input
              name="limit" type="number" placeholder="Monthly Limit (₹)"
              value={form.limit} onChange={handleChange}
              className="w-full bg-slate-950/50 border border-slate-800 p-4 rounded-xl focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all text-white"
            />
            <button 
              disabled={isUpdating}
              className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20 active:scale-95"
            >
              {isUpdating ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
              Update Budget
            </button>
          </form>
        </motion.div>

        {/* Budget Item List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AnimatePresence mode="popLayout">
            {budgets.map((budget) => {
              const spent = getSpent(budget.category);
              const percent = Math.min((spent / budget.limit) * 100, 100);
              const isOver = spent > budget.limit;

              return (
                <motion.div
                  layout
                  key={budget._id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className={`group relative overflow-hidden bg-slate-900/60 backdrop-blur-md p-6 rounded-2xl border transition-all duration-500 ${
                    isOver ? "border-red-500/40 shadow-[0_0_20px_rgba(239,68,68,0.1)]" : "border-slate-800 hover:border-indigo-500/30"
                  }`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors">{budget.category}</h3>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Limit: ₹{budget.limit.toLocaleString()}</p>
                    </div>
                    {isOver ? (
                      <div className="bg-red-500/10 p-2 rounded-lg"><AlertCircle className="text-red-500 animate-pulse" size={20} /></div>
                    ) : (
                      <div className="bg-emerald-500/10 p-2 rounded-lg"><CheckCircle2 className="text-emerald-500" size={20} /></div>
                    )}
                  </div>

                  <div className="flex justify-between items-end mb-3">
                    <span className={`text-3xl font-black tracking-tighter ${isOver ? "text-red-400" : "text-white"}`}>
                      ₹{spent.toLocaleString()}
                    </span>
                    <span className={`text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-tighter ${isOver ? "bg-red-500/20 text-red-400" : "bg-slate-800 text-slate-400"}`}>
                      {Math.round(percent)}% Exhausted
                    </span>
                  </div>

                  {/* High-Tech Glowing Progress Bar */}
                  <div className="w-full bg-slate-950/50 h-2.5 rounded-full overflow-hidden border border-slate-800">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percent}%` }}
                      transition={{ duration: 1.2, ease: "circOut" }}
                      className={`h-full rounded-full relative ${
                        percent >= 90 ? "bg-red-500" : percent >= 70 ? "bg-amber-500" : "bg-indigo-500"
                      }`}
                    >
                      {/* Inner Shine Effect */}
                      <div className="absolute inset-0 bg-white/20 blur-[2px]" />
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </DashboardLayout>
  );
}

// Helper Components
function BudgetStatCard({ label, value, icon }) {
  return (
    <div className="bg-slate-900/50 backdrop-blur-md p-6 rounded-2xl border border-slate-800/50 flex items-center gap-5 hover:bg-slate-800/40 transition-all group">
      <div className="p-3 bg-slate-800 rounded-xl group-hover:scale-110 transition-transform">{icon}</div>
      <div>
        <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">{label}</p>
        <p className="text-2xl font-black text-white tracking-tighter">{value}</p>
      </div>
    </div>
  );
}

function ActivityIcon({ percent }) {
  if (percent >= 100) return <AlertCircle className="text-red-500" />;
  if (percent >= 80) return <TrendingDown className="text-amber-500" />;
  return <CheckCircle2 className="text-emerald-500" />;
}

export default BudgetsPage;