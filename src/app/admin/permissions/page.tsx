"use client";

import DashboardLayout from "@/components/layout/dashboard-layout";
import { motion } from "framer-motion";
import { Shield, Search, Save, Grid3X3, Users, Gem, Loader2, Check } from "lucide-react";
import { useState, useEffect } from "react";
import { stages } from "@/lib/design-tokens";

type Employee = {
  id: string;
  fullName: string;
  roleLabel: string;
};

export default function PermissionMatrixPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [permissions, setPermissions] = useState<Record<string, number[]>>({});
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [empRes, permRes] = await Promise.all([
          fetch("/api/admin/employees"),
          fetch("/api/admin/permissions")
        ]);
        
        if (empRes.ok && permRes.ok) {
          const empData = await empRes.json();
          const permData = await permRes.json();
          setEmployees(empData.employees || []);
          setPermissions(permData.permissions || {});
        }
      } catch (err) {
        console.error("Failed to load permissions data", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const togglePermission = (empId: string, stageNum: number) => {
    setPermissions((prev) => {
      const current = prev[empId] || [];
      const updated = current.includes(stageNum)
        ? current.filter((n) => n !== stageNum)
        : [...current, stageNum];
      return { ...prev, [empId]: updated };
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      const res = await fetch("/api/admin/permissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ permissions }),
      });
      if (res.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err) {
      console.error("Failed to save permissions", err);
    } finally {
      setIsSaving(false);
    }
  };

  const filteredEmployees = employees.filter((e) =>
    e.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout
      role="admin"
      user={{ fullName: "System Admin", email: "admin@traceon.app", role: "ADMIN" }}
    >
      <div className="page-enter">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-display font-bold">Stage Permissions Matrix</h1>
            <p className="text-sm text-muted mt-1">
              Manage which employees can edit specific manufacturing stages
            </p>
          </div>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className={`btn-primary text-sm py-2.5 px-5 flex items-center gap-2 self-start transition-all ${saveSuccess ? "!bg-success" : ""}`}
          >
            {isSaving ? <Loader2 size={16} className="animate-spin" /> : 
             saveSuccess ? <Check size={16} /> : <Save size={16} />}
            {saveSuccess ? "Saved!" : "Save Configuration"}
          </button>
        </div>

        <div className="glass-card mb-6 p-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full max-w-md">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search employees..."
              className="w-full glass-input h-10 pl-9 pr-4 text-sm"
            />
          </div>
          <div className="flex items-center gap-4 text-sm text-muted">
            <span className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-sky-blue shadow-[0_0_8px_rgba(165,215,232,0.5)]"></div> Full Access</span>
            <span className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-navy-mid/30 border border-border"></div> No Access</span>
          </div>
        </div>

        {/* Matrix Container */}
        {isLoading ? (
          <div className="flex justify-center items-center h-48">
            <Loader2 className="animate-spin text-royal-blue" />
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border bg-royal-blue/5">
                    <th className="p-4 sticky left-0 bg-navy-deep/95 backdrop-blur-sm z-20 border-r border-border min-w-[200px]">
                      <div className="flex items-center gap-2 text-sm text-muted">
                        <Users size={16} /> Employee
                      </div>
                    </th>
                    {stages.map((stage) => (
                      <th key={stage.number} className="p-3 min-w-[100px] border-r border-border/50 text-center">
                        <div className="flex flex-col items-center justify-center gap-1">
                          <span className="text-[10px] font-mono text-muted uppercase">S{stage.number}</span>
                          <span className="text-xs font-semibold whitespace-nowrap truncate max-w-[80px]" title={stage.name}>
                            {stage.name}
                          </span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredEmployees.map((emp, i) => (
                    <motion.tr
                      key={emp.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.05 }}
                      className="border-b border-border hover:bg-royal-blue/5 transition-colors"
                    >
                      <td className="p-4 sticky left-0 bg-navy-deep/95 backdrop-blur-sm z-10 border-r border-border">
                        <p className="text-sm font-medium">{emp.fullName}</p>
                        <p className="text-xs text-muted">{emp.roleLabel}</p>
                      </td>
                      {stages.map((stage) => {
                        const hasAccess = permissions[emp.id]?.includes(stage.number);
                        return (
                          <td key={stage.number} className="p-3 border-r border-border/50 text-center">
                            <button
                              onClick={() => togglePermission(emp.id, stage.number)}
                              className={`w-6 h-6 rounded mx-auto flex items-center justify-center transition-all ${
                                hasAccess
                                  ? "bg-sky-blue text-navy-deep shadow-[0_0_8px_rgba(165,215,232,0.5)] scale-110"
                                  : "bg-navy-mid/30 border border-border text-transparent hover:bg-royal-blue/20"
                              }`}
                            >
                              {hasAccess && <Shield size={12} />}
                            </button>
                          </td>
                        );
                      })}
                    </motion.tr>
                  ))}
                  {filteredEmployees.length === 0 && (
                    <tr>
                      <td colSpan={stages.length + 1} className="text-center py-12 text-muted">
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
    </DashboardLayout>
  );
}
