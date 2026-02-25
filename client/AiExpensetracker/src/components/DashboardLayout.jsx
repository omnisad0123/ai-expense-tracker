import { NavLink, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { motion } from "framer-motion";
import { 
  LayoutDashboard, PieChart, Target, 
  Sparkles, LogOut, Wallet, User, Settings 
} from "lucide-react";

function DashboardLayout({ children }) {
  const { user, logout } = useContext(AuthContext); 
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const menuItems = [
    { path: "/dashboard", name: "Dashboard", icon: <LayoutDashboard size={20} /> },
    { path: "/analytics", name: "Analytics", icon: <PieChart size={20} /> },
    { path: "/budgets", name: "Budgets", icon: <Target size={20} /> },
    { path: "/insights", name: "AI Insights", icon: <Sparkles size={20} /> },
  ];

  return (
    <div className="min-h-screen flex bg-slate-950 text-white font-sans">
      
      {/* --- SIDEBAR --- */}
      <motion.aside 
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="w-72 sticky top-0 h-screen bg-slate-900/50 backdrop-blur-2xl border-r border-slate-800/50 p-6 flex flex-col justify-between"
      >
        <div>
          {/* Brand Logo */}
          <div className="flex items-center gap-3 mb-12 px-2">
            <div className="bg-indigo-600 p-2 rounded-xl shadow-lg shadow-indigo-500/30">
              <Wallet className="text-white" size={24} />
            </div>
            <h1 className="text-2xl font-black tracking-tighter italic">
              FIN<span className="text-indigo-500">Track</span>
            </h1>
          </div>

          {/* Navigation */}
          <nav className="space-y-2">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `
                  flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 group
                  ${isActive 
                    ? "bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 shadow-[0_0_20px_rgba(79,70,229,0.1)]" 
                    : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
                  }
                `}
              >
                <span className="group-hover:scale-110 transition-transform duration-300">
                  {item.icon}
                </span>
                <span className="font-semibold tracking-wide text-sm">{item.name}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* --- IMPROVED ACCOUNT HUB --- */}
        <div className="pt-6 border-t border-slate-800/50 space-y-3">
          
          {/* Integrated Profile & Settings Card */}
          <NavLink
            to="/profile"
            className={({ isActive }) => `
              flex items-center justify-between p-3 rounded-2xl border transition-all duration-300 group
              ${isActive 
                ? "bg-indigo-600/10 border-indigo-500/30" 
                : "bg-slate-900/40 border-slate-800/50 hover:border-slate-700"
              }
            `}
          >
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center border border-white/10 shrink-0">
                <User size={18} className="text-white" />
              </div>
              <div className="overflow-hidden">
                {/* Dynamically pulls the user name from AuthContext */}
                <p className="text-sm font-black text-white truncate">
                  {user?.name || "Member"}
                </p>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest group-hover:text-indigo-400 transition-colors">
                  Account Settings
                </p>
              </div>
            </div>
            <Settings size={16} className="text-slate-600 group-hover:text-indigo-400 group-hover:rotate-45 transition-all" />
          </NavLink>

          {/* Minimalist Logout Option */}
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-red-400 hover:bg-red-400/5 rounded-xl transition-all group"
          >
            <LogOut size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Sign Out</span>
          </button>
        </div>
      </motion.aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 overflow-y-auto bg-slate-950 relative">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="p-10 relative z-10">
          {children}
        </div>
      </main>

    </div>
  );
}

export default DashboardLayout;