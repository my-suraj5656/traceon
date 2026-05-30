"use client";

import DashboardLayout from "@/components/layout/dashboard-layout";
import { motion } from "framer-motion";
import { ScrollText, Download, Search, Filter, Calendar } from "lucide-react";
import { useState } from "react";

const auditLogs: any[] = [];

const actionColors: Record<string, string> = {
  CREATE: "badge-completed",
  UPDATE: "badge-active",
  DELETE: "badge-error",
  PERMISSION_CHANGE: "badge-pending",
  FRAUD_ALERT: "badge-error",
  LOGIN: "badge-completed",
};

export default function AuditLogPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterAction, setFilterAction] = useState("all");

  const filtered = auditLogs.filter((log) => {
    const matchesSearch =
      log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.target.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterAction === "all" || log.action === filterAction;
    return matchesSearch && matchesFilter;
  });

  return (
    <DashboardLayout
      role="superadmin"
      user={{ fullName: "System Admin", email: "superadmin@traceon.app", role: "SUPER_ADMIN" }}
    >
      <div className="page-enter">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-display font-bold">Audit Logs</h1>
            <p className="text-sm text-muted mt-1">
              Immutable record of all platform activity
            </p>
          </div>
          <button className="btn-primary text-sm py-2.5 px-5 flex items-center gap-2 self-start">
            <Download size={16} />
            Export CSV
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
              placeholder="Search logs..."
              className="w-full glass-input h-10 pl-9 pr-4 text-sm"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {["all", "CREATE", "UPDATE", "DELETE", "PERMISSION_CHANGE", "FRAUD_ALERT"].map((action) => (
              <button
                key={action}
                onClick={() => setFilterAction(action)}
                className={`text-[11px] px-2.5 py-1.5 rounded-lg transition-all ${
                  filterAction === action
                    ? "bg-royal-blue/20 text-royal-blue border border-royal-blue/30"
                    : "text-muted hover:text-white hover:bg-royal-blue/5 border border-transparent"
                }`}
              >
                {action === "all" ? "All" : action.replace("_", " ")}
              </button>
            ))}
          </div>
        </div>

        {/* Log Entries */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>User</th>
                  <th>Action</th>
                  <th>Entity</th>
                  <th>Target</th>
                  <th>Details</th>
                  <th>IP</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((log, i) => (
                  <motion.tr
                    key={log.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                  >
                    <td className="font-mono text-xs text-muted whitespace-nowrap">{log.timestamp}</td>
                    <td className="text-sm">{log.user}</td>
                    <td>
                      <span className={`badge text-[10px] ${actionColors[log.action] || "badge-active"}`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="text-sm text-muted">{log.entity}</td>
                    <td className="text-sm font-mono text-sky-blue">{log.target}</td>
                    <td className="text-xs text-muted max-w-[200px] truncate">{log.details}</td>
                    <td className="font-mono text-xs text-muted">{log.ip}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
