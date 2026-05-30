"use client";

import DashboardLayout from "@/components/layout/dashboard-layout";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  MoreVertical,
  UserCog,
  Shield,
  Pause,
  Play,
  Trash2,
  Eye,
  X,
  Loader2,
  Check
} from "lucide-react";
import { useState, useEffect } from "react";
import { stages } from "@/lib/design-tokens";

type Employee = {
  id: string;
  fullName: string;
  email: string;
  roleLabel: string;
  status: string;
  createdAt: string;
  contactNumber: string | null;
};

export default function EmployeeListPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ fullName: "", email: "", phone: "", roleLabel: "" });
  const [error, setError] = useState("");

  // Permissions state
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [selectedStages, setSelectedStages] = useState<number[]>([]);
  const [isSavingPermissions, setIsSavingPermissions] = useState(false);

  const fetchEmployees = async () => {
    try {
      const res = await fetch("/api/admin/employees");
      if (res.ok) {
        const data = await res.json();
        setEmployees(data.employees);
      }
    } catch (err) {
      console.error("Failed to fetch employees:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsCreating(true);

    try {
      const res = await fetch("/api/admin/employees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setEmployees([data.employee, ...employees]);
        setShowModal(false);
        setFormData({ fullName: "", email: "", phone: "", roleLabel: "" });
      } else {
        setError(data.error || "Failed to create employee");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setIsCreating(false);
    }
  };

  const handleEditPermissions = async (emp: Employee) => {
    setSelectedEmployee(emp);
    setSelectedStages([]);
    setShowPermissionsModal(true);
    
    try {
      const res = await fetch(`/api/admin/employees/${emp.id}/permissions`);
      if (res.ok) {
        const data = await res.json();
        setSelectedStages(data.stages || []);
      }
    } catch (err) {
      console.error("Failed to fetch permissions", err);
    }
  };

  const handleSavePermissions = async () => {
    if (!selectedEmployee) return;
    setIsSavingPermissions(true);

    try {
      const res = await fetch(`/api/admin/employees/${selectedEmployee.id}/permissions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stages: selectedStages }),
      });

      if (res.ok) {
        setShowPermissionsModal(false);
      } else {
        alert("Failed to save permissions");
      }
    } catch (err) {
      alert("An unexpected error occurred");
    } finally {
      setIsSavingPermissions(false);
    }
  };

  const filtered = employees.filter((e) => {
    const matchesSearch =
      e.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === "all" || e.status.toLowerCase() === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <DashboardLayout
      role="admin"
      user={{ fullName: "System Admin", email: "admin@traceon.app", role: "ADMIN" }}
    >
      <div className="page-enter">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-display font-bold">Employee Management</h1>
            <p className="text-sm text-muted mt-1">
              {employees.length} employees in your scope
            </p>
          </div>
          <button 
            onClick={() => setShowModal(true)}
            className="btn-primary text-sm py-2.5 px-5 flex items-center gap-2 self-start"
          >
            <Plus size={16} />
            Create Employee
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name or email..."
              className="w-full glass-input h-10 pl-9 pr-4 text-sm"
            />
          </div>
          <div className="flex gap-2">
            {["all", "active", "suspended"].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`text-xs px-3 py-2 rounded-lg transition-all capitalize ${
                  filterStatus === status
                    ? "bg-royal-blue/20 text-royal-blue border border-royal-blue/30"
                    : "text-muted hover:text-white hover:bg-royal-blue/5 border border-transparent"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Employee Table */}
        {isLoading ? (
          <div className="flex justify-center items-center h-32">
            <Loader2 className="animate-spin text-royal-blue" />
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Date Added</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((emp, i) => (
                    <motion.tr
                      key={emp.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-royal-blue/15 flex items-center justify-center text-xs font-semibold text-royal-blue uppercase">
                            {emp.fullName.split(" ").map((n) => n[0]).join("").substring(0,2)}
                          </div>
                          <div>
                            <p className="text-sm font-medium">{emp.fullName}</p>
                            <p className="text-xs text-muted">{emp.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="text-sm text-muted">{emp.roleLabel}</td>
                      <td>
                        <span
                          className={`badge ${
                            emp.status === "ACTIVE"
                              ? "badge-completed"
                              : "badge-error"
                          }`}
                        >
                          {emp.status}
                        </span>
                      </td>
                      <td className="text-xs text-muted">{new Date(emp.createdAt).toLocaleDateString()}</td>
                      <td>
                        <div className="flex items-center justify-end gap-1">
                          <button className="p-1.5 rounded-lg hover:bg-royal-blue/10 text-muted hover:text-white transition-colors" title="View">
                            <Eye size={14} />
                          </button>
                          <button 
                            onClick={() => handleEditPermissions(emp)}
                            className="p-1.5 rounded-lg hover:bg-royal-blue/10 text-muted hover:text-white transition-colors" 
                            title="Edit Permissions"
                          >
                            <Shield size={14} />
                          </button>
                          <button
                            className={`p-1.5 rounded-lg transition-colors ${
                              emp.status === "ACTIVE"
                                ? "hover:bg-warning/10 text-muted hover:text-warning"
                                : "hover:bg-success/10 text-muted hover:text-success"
                            }`}
                            title={emp.status === "ACTIVE" ? "Suspend" : "Reactivate"}
                          >
                            {emp.status === "ACTIVE" ? <Pause size={14} /> : <Play size={14} />}
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-center py-8 text-muted">
                        No employees found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
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
              
              <h2 className="text-xl font-bold mb-1">Create Employee</h2>
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
                    placeholder="e.g. John Smith"
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
                    placeholder="john@traceon.app"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted mb-1.5">Role Title</label>
                  <div className="relative">
                    <select
                      required
                      value={formData.roleLabel}
                      onChange={(e) => setFormData({...formData, roleLabel: e.target.value})}
                      className="w-full glass-input h-10 px-3 text-sm appearance-none bg-navy-deep cursor-pointer"
                    >
                      <option value="" disabled>Select a role</option>
                      <option value="Entry Operator">Entry Operator</option>
                      <option value="Diamond Cutter">Diamond Cutter</option>
                      <option value="Grading Specialist">Grading Specialist</option>
                      <option value="QC Inspector">QC Inspector</option>
                      <option value="Imaging Technician">Imaging Technician</option>
                      <option value="Planning Engineer">Planning Engineer</option>
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                    </div>
                  </div>
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
                    {isCreating ? <Loader2 size={16} className="animate-spin" /> : "Create Employee"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Permissions Modal */}
      <AnimatePresence>
        {showPermissionsModal && selectedEmployee && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowPermissionsModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-card relative w-full max-w-lg p-6 shadow-glow-lg flex flex-col max-h-[85vh]"
            >
              <button 
                onClick={() => setShowPermissionsModal(false)}
                className="absolute right-4 top-4 text-muted hover:text-white z-10"
              >
                <X size={20} />
              </button>
              
              <h2 className="text-xl font-bold mb-1">Assign Tasks & Permissions</h2>
              <p className="text-sm text-muted mb-4">
                Select which manufacturing stages <span className="text-white font-medium">{selectedEmployee.fullName}</span> is authorized to work on.
              </p>

              <div className="flex-1 overflow-y-auto pr-2 space-y-2 mb-6 custom-scrollbar">
                {stages.map((stage) => {
                  const isSelected = selectedStages.includes(stage.number);
                  return (
                    <div 
                      key={stage.number}
                      onClick={() => {
                        if (isSelected) {
                          setSelectedStages(selectedStages.filter(s => s !== stage.number));
                        } else {
                          setSelectedStages([...selectedStages, stage.number]);
                        }
                      }}
                      className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-colors ${
                        isSelected 
                          ? "bg-royal-blue/20 border-royal-blue/50" 
                          : "bg-white/5 border-white/10 hover:bg-white/10"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isSelected ? "bg-royal-blue/30 text-royal-blue" : "bg-white/10 text-muted"}`}>
                          <span className="font-mono text-xs">{stage.number}</span>
                        </div>
                        <div>
                          <p className={`text-sm font-medium ${isSelected ? "text-white" : "text-white/80"}`}>{stage.name}</p>
                        </div>
                      </div>
                      <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                        isSelected ? "bg-royal-blue border-royal-blue" : "border-white/20"
                      }`}>
                        {isSelected && <Check size={12} className="text-white" />}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-4 border-t border-white/10 flex justify-end gap-3 mt-auto">
                <button 
                  onClick={() => setShowPermissionsModal(false)}
                  className="btn-ghost px-6 py-2.5 text-sm"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSavePermissions}
                  disabled={isSavingPermissions}
                  className="btn-primary px-8 py-2.5 flex items-center justify-center gap-2 text-sm"
                >
                  {isSavingPermissions ? <Loader2 size={16} className="animate-spin" /> : "Save Permissions"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}
