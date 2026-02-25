import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, Wallet, CreditCard, Activity, 
  IndianRupee, History, Sparkles, Send, Loader2 
} from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";
import { addExpense, getExpenses } from "../services/expenseService";
import { getMonthlySummary, getFinancialScore } from "../services/analyticsService";

function DashboardPage() {
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState(null);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [issubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({ amount: "", description: "", paymentMode: "upi" });

  const loadData = async () => {
    try {
      const [expenseData, analyticsData, scoreData] = await Promise.all([
        getExpenses(),
        getMonthlySummary(),
        getFinancialScore(),
      ]);
      setExpenses(expenseData || []);
      setSummary(analyticsData);
      setScore(scoreData?.financialScore || 0);
    } catch (error) {
      console.error("Dashboard Sync Error:", error);
      // Global 401 Handler: Redirect to login if session is invalid
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.amount || !form.description) return;
    
    setIsSubmitting(true);
    try {
      await addExpense(form);
      setForm({ amount: "", description: "", paymentMode: "upi" });
      await loadData(); // Refresh all stats after new entry
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="h-[60vh] flex flex-col items-center justify-center text-slate-400">
          <Loader2 className="animate-spin text-indigo-500 mb-4" size={40} />
          <p className="font-medium animate-pulse tracking-widest uppercase text-xs">Initializing Neural Core...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8 pb-10">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h1 className="text-4xl font-black bg-gradient-to-r from-white to-slate-500 bg-clip-text text-transparent tracking-tighter">
              Financial Overview
            </h1>
            <p className="text-slate-400 mt-1 flex items-center gap-2 text-sm font-medium">
              <Sparkles size={14} className="text-indigo-400" /> Gemini AI Categorization Active
            </p>
          </motion.div>
          <div className="text-slate-500 text-[10px] font-bold uppercase tracking-widest bg-slate-900/50 px-4 py-2 rounded-full border border-slate-800 backdrop-blur-md">
            Sync Status: <span className="text-emerald-500">Online</span>
          </div>
        </header>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard 
            title="Financial Health" 
            value={`${score}/100`} 
            icon={<Activity className="text-emerald-400" />}
            color="emerald"
            delay={0.1}
          />
          <StatCard 
            title="Total Spent" 
            value={`₹${summary?.totalSpent?.toLocaleString() || 0}`} 
            icon={<Wallet className="text-indigo-400" />}
            color="blue"
            delay={0.2}
          />
          <StatCard 
            title="Budget Usage" 
            value={summary?.totalSpent > 0 ? "Analyzing..." : "No Data"} 
            icon={<CreditCard className="text-purple-400" />}
            color="purple"
            delay={0.3}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-1 bg-slate-900/40 p-8 rounded-3xl border border-slate-800/50 backdrop-blur-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />
            <h2 className="text-xl font-bold mb-8 flex items-center gap-2 text-slate-200">
              <Plus size={20} className="text-indigo-400" /> New Transaction
            </h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Amount (₹)</label>
                <input
                  name="amount" type="number" placeholder="0.00"
                  value={form.amount} onChange={handleChange}
                  className="w-full bg-slate-950/50 border border-slate-800 p-4 rounded-2xl focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all text-white font-bold"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Description</label>
                <input
                  name="description" placeholder="What was this for?"
                  value={form.description} onChange={handleChange}
                  className="w-full bg-slate-950/50 border border-slate-800 p-4 rounded-2xl focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all text-white"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Payment Mode</label>
                <select
                  name="paymentMode" value={form.paymentMode} onChange={handleChange}
                  className="w-full bg-slate-950/50 border border-slate-800 p-4 rounded-2xl focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all text-white appearance-none"
                >
                  <option value="upi">UPI / Instant</option>
                  <option value="card">Credit/Debit Card</option>
                  <option value="cash">Physical Cash</option>
                </select>
              </div>
              <button
                type="submit"
                disabled={issubmitting}
                className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 text-white font-black py-4 rounded-2xl shadow-xl shadow-indigo-500/20 flex items-center justify-center gap-2 transition-all active:scale-95 mt-4"
              >
                {issubmitting ? <Loader2 className="animate-spin" size={20} /> : <><Send size={18} /> Process Expense</>}
              </button>
            </form>
          </motion.div>

          {/* History Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 bg-slate-900/40 p-8 rounded-3xl border border-slate-800/50 backdrop-blur-2xl"
          >
            <h2 className="text-xl font-bold mb-8 flex items-center gap-2 text-slate-200">
              <History size={20} className="text-indigo-400" /> Intelligence Feed
            </h2>
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
              <AnimatePresence mode="popLayout">
                {expenses.length === 0 ? (
                  <div className="text-center py-20 text-slate-600 font-medium">No recent transactions discovered.</div>
                ) : (
                  expenses.map((exp, index) => (
                    <motion.div
                      key={exp._id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="group flex justify-between items-center bg-slate-950/30 hover:bg-slate-800/50 p-5 rounded-2xl border border-slate-800/50 hover:border-indigo-500/30 transition-all duration-300"
                    >
                      <div className="flex items-center gap-5">
                        <div className="bg-slate-900 p-3 rounded-xl group-hover:text-indigo-400 transition-colors border border-slate-800">
                          <IndianRupee size={18} />
                        </div>
                        <div>
                          <p className="font-bold text-slate-200 group-hover:text-white transition-colors">{exp.description}</p>
                          <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1">
                            {exp.category} <span className="mx-2 text-slate-700">•</span> {exp.paymentMode}
                          </p>
                        </div>
                      </div>
                      <span className="text-xl font-black text-white">₹{exp.amount.toLocaleString()}</span>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
}

function StatCard({ title, value, icon, color, delay }) {
  const colorMap = {
    emerald: "hover:border-emerald-500/50 hover:shadow-emerald-500/5",
    blue: "hover:border-indigo-500/50 hover:shadow-indigo-500/5",
    purple: "hover:border-purple-500/50 hover:shadow-purple-500/5"
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ y: -5 }}
      className={`bg-slate-900/60 backdrop-blur-md p-6 rounded-[2rem] border border-slate-800/50 shadow-2xl transition-all duration-500 ${colorMap[color]}`}
    >
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-slate-500 text-[10px] font-black tracking-[0.2em] uppercase">{title}</h2>
        <div className="p-2.5 bg-slate-950/50 rounded-xl border border-slate-800">{icon}</div>
      </div>
      <p className="text-3xl font-black text-white tracking-tighter">{value}</p>
    </motion.div>
  );
}

export default DashboardPage;