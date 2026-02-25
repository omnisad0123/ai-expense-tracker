import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, PieChart, Pie, Cell, Legend 
} from "recharts";
import { TrendingUp, PieChart as PieIcon, Calendar, Filter } from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";
import { getMonthlySummary, getMonthlyTrend } from "../services/analyticsService";

function AnalyticsPage() {
  const [categoryData, setCategoryData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [loading, setLoading] = useState(true);

  const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"];

  useEffect(() => {
    const loadData = async () => {
      try {
        const [summary, trend] = await Promise.all([
          getMonthlySummary(),
          getMonthlyTrend()
        ]);

        setCategoryData(summary.categoryBreakdown.map(item => ({
          name: item._id,
          value: item.totalAmount
        })));
        setMonthlyData(trend);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Custom Tooltip Component for a sleek dark look
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 border border-slate-700 p-3 rounded-lg shadow-2xl backdrop-blur-md">
          <p className="text-slate-400 text-xs font-bold uppercase mb-1">{label || payload[0].name}</p>
          <p className="text-indigo-400 font-black text-lg">₹{payload[0].value.toLocaleString()}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto pb-10">
        
        {/* Header with quick filters */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-4xl font-black text-white tracking-tight">Financial Analytics</h1>
            <p className="text-slate-400 mt-1">Deep dive into your monthly spending patterns.</p>
          </div>
          <div className="flex gap-2">
            <button className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-lg border border-slate-700 flex items-center gap-2 transition-all">
              <Calendar size={18} /> Last 6 Months
            </button>
            <button className="bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 px-4 py-2 rounded-lg border border-indigo-500/30 flex items-center gap-2 transition-all">
              <Filter size={18} /> Category
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Donut Chart Card */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-900/50 backdrop-blur-xl p-8 rounded-3xl border border-slate-800 shadow-xl"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400">
                <PieIcon size={20} />
              </div>
              <h2 className="text-xl font-bold text-white">Expense Distribution</h2>
            </div>

            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    innerRadius={80}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Bar Chart Card */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-slate-900/50 backdrop-blur-xl p-8 rounded-3xl border border-slate-800 shadow-xl"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
                <TrendingUp size={20} />
              </div>
              <h2 className="text-xl font-bold text-white">Monthly Trajectory</h2>
            </div>

            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6366f1" stopOpacity={1} />
                      <stop offset="100%" stopColor="#6366f1" stopOpacity={0.3} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#64748b', fontSize: 12 }} 
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#64748b', fontSize: 12 }}
                  />
                  <Tooltip cursor={{ fill: '#1e293b', opacity: 0.4 }} content={<CustomTooltip />} />
                  <Bar 
                    dataKey="total" 
                    fill="url(#barGradient)" 
                    radius={[6, 6, 0, 0]} 
                    barSize={40}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

        </div>
      </div>
    </DashboardLayout>
  );
}

export default AnalyticsPage;