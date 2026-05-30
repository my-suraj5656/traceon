"use client";

import DashboardLayout from "@/components/layout/dashboard-layout";
import { Search, Download } from "lucide-react";
import { useState } from "react";

const auditLogs: any[] = [];

export default function AdminAuditLogPage() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <DashboardLayout
      role="admin"
      user={{ fullName: "Jane Smith", email: "jane@traceon.app", role: "ADMIN" }}
    >
      <div className="page-enter">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-display font-bold">Scoped Audit Logs</h1>
            <p className="text-sm text-muted mt-1">Activity from employees in your scope</p>
          </div>
          <button className="btn-primary text-sm py-2.5 px-5 flex items-center gap-2 self-start">
            <Download size={16} /> Export CSV
          </button>
        </div>

        <div className="relative max-w-md mb-6">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search logs..."
            className="w-full glass-input h-10 pl-9 pr-4 text-sm"
          />
        </div>

        <div className="glass-card overflow-hidden">
          <table className="data-table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>User</th>
                <th>Action</th>
                <th>Target</th>
              </tr>
            </thead>
            <tbody>
              {auditLogs.map((log) => (
                <tr key={log.id}>
                  <td className="font-mono text-xs text-muted">{log.timestamp}</td>
                  <td className="text-sm">{log.user}</td>
                  <td>
                    <span className="badge badge-active text-[10px]">{log.action}</span>
                  </td>
                  <td className="text-sm font-mono text-sky-blue">{log.target}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
