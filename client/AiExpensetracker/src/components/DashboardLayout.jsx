import { useState } from "react";
import { Menu, X, LayoutDashboard, PieChart, Target, Sparkles, LogOut, Wallet } from "lucide-react";
import { NavLink } from "react-router-dom";

function DashboardLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Controls mobile visibility

  const menuItems = [
    { path: "/dashboard", name: "Dashboard", icon: <LayoutDashboard size={20} /> },
    { path: "/analytics", name: "Analytics", icon: <PieChart size={20} /> },
    { path: "/budgets", name: "Budgets", icon: <Target size={20} /> },
    { path: "/insights", name: "AI Insights", icon: <Sparkles size={20} /> },
  ];

  return (
    <div className="min-h-screen flex bg-slate-950 text-white">
      {/* Mobile Toggle Button */}
      <button 
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="md:hidden fixed top-4 right-4 z-50 p-2 bg-indigo-600 rounded-lg"
      >
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-72 bg-slate-900 border-r border-slate-800 transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0 
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <div className="p-6">
          <div className="flex items-center gap-3 mb-10">
            <Wallet className="text-indigo-500" size={28} />
            <h1 className="text-xl font-bold italic">FIN<span className="text-indigo-500">Track</span></h1>
          </div>
          
          <nav className="space-y-2">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsSidebarOpen(false)} // Auto-close on mobile click
                className={({ isActive }) => `
                  flex items-center gap-4 px-4 py-3 rounded-xl transition-all
                  ${isActive ? "bg-indigo-600/20 text-indigo-400 border border-indigo-500/30" : "text-slate-400 hover:bg-slate-800"}
                `}
              >
                {item.icon}
                <span className="font-medium">{item.name}</span>
              </NavLink>
            ))}
          </nav>
        </div>
      </aside>

      {/* Backdrop for Mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10">
        {children}
      </main>
    </div>
  );
}