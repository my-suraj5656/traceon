"use client";

import DashboardLayout from "@/components/layout/dashboard-layout";
import { motion } from "framer-motion";
import {
  Users,
  Diamond,
  Clock,
  CheckCircle2,
  TrendingUp,
  ChevronRight,
  Gem,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function AdminDashboard() {
  const [diamonds, setDiamonds] = useState<any[]>([]);
  const [employeesCount, setEmployeesCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/diamonds").then(r => r.json()),
      fetch("/api/admin/employees").then(r => r.json())
    ]).then(([dRes, eRes]) => {
      if (dRes.diamonds) setDiamonds(dRes.diamonds);
      if (eRes.employees) setEmployeesCount(eRes.employees.length);
      setIsLoading(false);
    }).catch(console.error);
  }, []);

  const activeDiamonds = diamonds.filter(d => d.status === "IN_PROGRESS");
  const completedDiamonds = diamonds.filter(d => d.status === "COMPLETED");

  const stats = [
    { label: "Employees", value: employeesCount.toString(), icon: Users, change: "+0", color: "text-royal-blue", bg: "bg-royal-blue/15" },
    { label: "Diamonds In Progress", value: activeDiamonds.length.toString(), icon: Diamond, change: "+0", color: "text-sky-blue", bg: "bg-sky-blue/15" },
    { label: "Pending Stages", value: "0", icon: Clock, change: "0", color: "text-warning", bg: "bg-warning/15" },
    { label: "Completed", value: completedDiamonds.length.toString(), icon: CheckCircle2, change: "+0", color: "text-success", bg: "bg-success/15" },
  ];

  return (
    <DashboardLayout
      role="admin"
      user={{ fullName: "System Admin", email: "admin@traceon.app", role: "ADMIN" }}
    >
      <div className="page-enter">
        <div className="mb-8">
          <h1 className="text-2xl font-display font-bold">Admin Dashboard</h1>
          <p className="text-sm text-muted mt-1">
            Manage your team and diamond operations
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-5"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-muted uppercase tracking-wider">{stat.label}</p>
                  <p className="text-3xl font-bold mt-1">{isLoading ? <Loader2 className="animate-spin w-6 h-6 mt-2" /> : stat.value}</p>
                  <p className="text-xs text-success mt-2 flex items-center gap-1">
                    <TrendingUp size={12} />
                    {stat.change} this week
                  </p>
                </div>
                <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
                  <stat.icon size={20} className={stat.color} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recent Diamonds */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2 glass-card"
          >
            <div className="flex items-center justify-between p-5 border-b border-border">
              <div className="flex items-center gap-2">
                <Gem size={16} className="text-sky-blue" />
                <h2 className="font-semibold">Recent Diamond Packets</h2>
              </div>
              <Link href="/admin/diamonds" className="text-xs text-royal-blue hover:text-royal-blue-light flex items-center gap-1">
                View All <ChevronRight size={12} />
              </Link>
            </div>
            <div className="overflow-x-auto">
              {isLoading ? (
                <div className="flex justify-center p-8"><Loader2 className="animate-spin text-royal-blue" /></div>
              ) : diamonds.length === 0 ? (
                <div className="p-8 text-center text-muted">No diamonds registered yet.</div>
              ) : (
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Diamond ID</th>
                      <th>Rough ID</th>
                      <th>Stage</th>
                      <th>Weight</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {diamonds.slice(0, 5).map((d) => (
                      <tr key={d.id}>
                        <td>
                          <Link href={`/diamond/${d.id}`} className="font-mono text-sky-blue text-xs hover:underline">
                            {d.diamonddnaId || d.id.substring(0, 8)}
                          </Link>
                        </td>
                        <td className="font-mono text-xs text-muted">{d.roughId}</td>
                        <td>
                          <div className="flex items-center gap-2">
                            <div className="w-full max-w-[80px] h-1.5 bg-navy-deep rounded-full overflow-hidden">
                              <div
                                className="h-full rounded-full bg-gradient-to-r from-royal-blue to-sky-blue"
                                style={{ width: `${(d.currentStage / 14) * 100}%` }}
                              />
                            </div>
                            <span className="text-xs text-muted">{d.currentStage}/14</span>
                          </div>
                        </td>
                        <td className="text-sm">{d.stage1?.roughWeight ? `${d.stage1.roughWeight} ct` : "—"}</td>
                        <td>
                          <span className={`badge text-[10px] ${
                            d.status === "COMPLETED" ? "badge-completed" :
                            d.status === "FLAGGED" ? "badge-error" : "badge-active"
                          }`}>
                            {d.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </motion.div>

          {/* Activity Feed */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="glass-card"
          >
            <div className="flex items-center justify-between p-5 border-b border-border">
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-royal-blue" />
                <h2 className="font-semibold text-sm">Activity</h2>
              </div>
            </div>
            <div className="divide-y divide-border">
              <div className="p-4 text-center text-muted text-sm">
                Real-time activity feed is currently empty.
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
}
