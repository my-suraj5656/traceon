"use client";

import DashboardLayout from "@/components/layout/dashboard-layout";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, MoreVertical, Shield, Pause, Play, Trash2, Eye, Mail, Phone, X, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";

type Admin = {
  id: string;
  fullName: string;
  email: string;
  contactNumber: string | null;
  status: string;
  createdAt: string;
  _count: { createdUsers: number };
};

export default function AdminListPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ fullName: "", email: "", phone: "" });
  const [error, setError] = useState("");

  const fetchAdmins = async () => {
    try {
      const res = await fetch("/api/superadmin/admins");
      if (res.ok) {
        const data = await res.json();
        setAdmins(data.admins);
      }
    } catch (err) {
      console.error("Failed to fetch admins:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsCreating(true);

    try {
      const res = await fetch("/api/superadmin/admins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setAdmins([data.admin, ...admins]);
        setShowModal(false);
        setFormData({ fullName: "", email: "", phone: "" });
      } else {
        setError(data.error || "Failed to create admin");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setIsCreating(false);
    }
  };

  const filtered = admins.filter(
    (a) =>
      a.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout
      role="superadmin"
      user={{ fullName: "System Admin", email: "superadmin@traceon.app", role: "SUPER_ADMIN" }}
    >
      <div className="page-enter">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-display font-bold">Admin Management</h1>
            <p className="text-sm text-muted mt-1">{admins.length} administrators</p>
          </div>
          <button 
            onClick={() => setShowModal(true)}
            className="btn-primary text-sm py-2.5 px-5 flex items-center gap-2 self-start"
          >
            <Plus size={16} />
            Create Admin
          </button>
        </div>

        {/* Search */}
        <div className="relative max-w-md mb-6">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search admins..."
            className="w-full glass-input h-10 pl-9 pr-4 text-sm"
          />
        </div>

        {/* Admin Cards Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center h-32">
            <Loader2 className="animate-spin text-royal-blue" />
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((admin, i) => (
              <motion.div
                key={admin.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="glass-card p-5"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-royal-blue/20 flex items-center justify-center text-sm font-bold text-royal-blue uppercase">
                      {admin.fullName.split(" ").map((n) => n[0]).join("").substring(0, 2)}
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{admin.fullName}</p>
                      <span className={`badge text-[10px] ${admin.status === "ACTIVE" ? "badge-completed" : "badge-error"}`}>
                        {admin.status}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-xs text-muted">
                    <Mail size={12} />
                    {admin.email}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted">
                    <Phone size={12} />
                    {admin.contactNumber || "No phone provided"}
                  </div>
                </div>

                <div className="flex gap-4 text-xs text-muted border-t border-border pt-3">
                  <span>{admin._count.createdUsers} employees created</span>
                  <span>Joined {new Date(admin.createdAt).toLocaleDateString()}</span>
                </div>

                <div className="flex gap-1 mt-3">
                  <button className="flex-1 btn-ghost text-xs py-1.5 flex items-center justify-center gap-1">
                    <Eye size={12} /> View
                  </button>
                  <button className={`flex-1 btn-ghost text-xs py-1.5 flex items-center justify-center gap-1 ${admin.status === "ACTIVE" ? "hover:!text-warning" : "hover:!text-success"}`}>
                    {admin.status === "ACTIVE" ? <><Pause size={12} /> Suspend</> : <><Play size={12} /> Activate</>}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Create Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-card relative w-full max-w-md p-6 shadow-glow-lg"
            >
              <button 
                onClick={() => setShowModal(false)}
                className="absolute right-4 top-4 text-muted hover:text-white"
              >
                <X size={20} />
              </button>
              
              <h2 className="text-xl font-bold mb-1">Create Administrator</h2>
              <p className="text-sm text-muted mb-6">A temporary password will be assigned.</p>

              <form onSubmit={handleCreate} className="space-y-4">
                {error && <div className="text-xs text-destructive bg-destructive/10 p-3 rounded-lg">{error}</div>}
                
                <div>
                  <label className="block text-xs font-medium text-muted mb-1.5">Full Name</label>
                  <input
                    required
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    className="w-full glass-input h-10 px-3 text-sm"
                    placeholder="e.g. Jane Doe"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted mb-1.5">Email Address</label>
                  <input
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full glass-input h-10 px-3 text-sm"
                    placeholder="jane@traceon.app"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted mb-1.5">Contact Number (Optional)</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full glass-input h-10 px-3 text-sm"
                    placeholder="+1 234 567 8900"
                  />
                </div>

                <div className="pt-2">
                  <button 
                    type="submit" 
                    disabled={isCreating}
                    className="w-full btn-primary h-10 flex items-center justify-center gap-2"
                  >
                    {isCreating ? <Loader2 size={16} className="animate-spin" /> : "Create Account"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}
