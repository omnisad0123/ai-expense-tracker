import { NavLink, useNavigate } from "react-router-dom";
import { useContext, useState } from "react"; // Added useState
import { AuthContext } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion"; // Added AnimatePresence
import { 
  LayoutDashboard, PieChart, Target, 
  Sparkles, LogOut, Wallet, User, Settings,
  Menu, X // Added Mobile Icons
} from "lucide-react";

function DashboardLayout({ children }) {
  const { user, logout } = useContext(AuthContext); 
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false); // Mobile toggle state

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
      
      {/* --- MOBILE HAMBURGER BUTTON --- */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-6 right-6 z-50 p-3 bg-indigo-600 rounded-xl shadow-lg"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* --- SIDEBAR --- */}
      <motion.aside 
        initial={false}
        animate={{ x: isOpen ? 0 : (window.innerWidth < 768 ? -300 : 0) }}
        transition={{ type: "spring", damping: 20, stiffness: 100 }}
        className={`
          w-72 fixed inset-y-0 left-0 z-40 bg-slate-900/95 backdrop-blur-2xl border-r border-slate-800/50 p-6 flex flex-col justify-between
          md:sticky md:top-0 md:h-screen md:translate-x-0 md:bg-slate-900/50
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
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
                onClick={() => setIsOpen(false)} // Close sidebar on click (mobile)
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

        {/* --- ACCOUNT HUB (RETAINED) --- */}
        <div className="pt-6 border-t border-slate-800/50 space-y-3">
          <NavLink
            to="/profile"
            onClick={() => setIsOpen(false)}
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

          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-red-400 hover:bg-red-400/5 rounded-xl transition-all group"
          >
            <LogOut size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Sign Out</span>
          </button>
        </div>
      </motion.aside>

      {/* --- MOBILE BACKDROP --- */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden"
          />
        )}
      </AnimatePresence>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 overflow-y-auto bg-slate-950 relative">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="p-6 md:p-10 relative z-10"> {/* Adjusted padding for mobile */}
          {children}
        </div>
      </main>
    </div>
  );
}

export default DashboardLayout;