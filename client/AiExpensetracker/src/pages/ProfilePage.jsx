import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import DashboardLayout from "../components/DashboardLayout";
import api from "../services/api";
import { User, Mail, Trash2, Save, AlertTriangle, Loader2 } from "lucide-react";

function ProfilePage() {
  const { user, setUser, logout } = useContext(AuthContext);
  const [newName, setNewName] = useState(user?.name || "");
  const [isUpdating, setIsUpdating] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleUpdateName = async () => {
    if (!newName.trim() || newName === user?.name) return;
    setIsUpdating(true);
    try {
      const { data } = await api.put("/auth/update-profile", { name: newName });
      setUser(data); 
      localStorage.setItem("user", JSON.stringify(data)); 
      alert("Profile updated successfully!");
    } catch (err) {
      alert("Update failed. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await api.delete("/auth/delete-account");
      logout();
    } catch (err) {
      alert("Error deleting account.");
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        <header>
          <h1 className="text-4xl font-black text-white tracking-tighter">Settings</h1>
          <p className="text-slate-400 font-medium">Manage your FinTrack profile and data.</p>
        </header>

        {/* --- NAME SECTION --- */}
        <div className="bg-slate-900/40 border border-slate-800 p-8 rounded-[2rem] backdrop-blur-xl">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-4">Display Identity</label>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
              <input 
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 p-4 pl-12 rounded-2xl text-white outline-none focus:border-indigo-500 transition-all"
                placeholder="Your Name"
              />
            </div>
            <button 
              onClick={handleUpdateName}
              disabled={isUpdating || newName === user?.name}
              className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 text-white px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              {isUpdating ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
              Save Name
            </button>
          </div>
        </div>

        {/* --- ACCOUNT DETAILS --- */}
        <div className="bg-slate-900/40 border border-slate-800 p-8 rounded-[2rem] flex items-center gap-4">
          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800"><Mail className="text-slate-500" /></div>
          <div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Email Address</p>
            <p className="text-white font-bold">{user?.email}</p>
          </div>
        </div>

        {/* --- DELETE SECTION --- */}
        <div className="pt-10 border-t border-slate-900">
          <div className="bg-red-950/10 border border-red-500/10 p-8 rounded-[2rem]">
            <div className="flex items-center gap-4 mb-6">
              <AlertTriangle className="text-red-500" />
              <h3 className="text-xl font-bold text-white">Danger Zone</h3>
            </div>
            {!showDeleteConfirm ? (
              <button 
                onClick={() => setShowDeleteConfirm(true)}
                className="text-red-500 text-sm font-black uppercase tracking-widest hover:underline"
              >
                Delete Account Permanently
              </button>
            ) : (
              <div className="flex gap-4">
                <button onClick={handleDeleteAccount} className="bg-red-600 text-white px-6 py-3 rounded-xl font-bold">Confirm Delete</button>
                <button onClick={() => setShowDeleteConfirm(false)} className="bg-slate-800 text-white px-8 py-3 rounded-xl font-bold">Cancel</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default ProfilePage;