"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { motion } from "framer-motion";
import { Users, Shield, Diamond, Activity, TrendingUp, Clock, ChevronRight, Loader2 } from "lucide-react";
import Link from "next/link";

interface DashboardData {
  stats: {
    adminCount: number;
    employeeCount: number;
    diamondCount: number;
    completedDiamondCount: number;
  };
  recentActions: Array<{
    user: string;
    role: string;
    action: string;
    target: string;
    time: string;
  }>;
}

export default function SuperAdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/superadmin/dashboard")
      .then(res => res.json())
      .then(data => {
        if (!data.error) {
          setData(data);
        }
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  const stats = data ? [
    { label: "Total Admins", value: data.stats.adminCount.toString(), icon: Shield, change: "Active", color: "text-royal-blue", bg: "bg-royal-blue/15" },
    { label: "Total Employees", value: data.stats.employeeCount.toString(), icon: Users, change: "Active", color: "text-sky-blue", bg: "bg-sky-blue/15" },
    { label: "Diamonds Tracked", value: data.stats.diamondCount.toString(), icon: Diamond, change: "In Pipeline", color: "text-success", bg: "bg-success/15" },
    { label: "Completed Diamonds", value: data.stats.completedDiamondCount.toString(), icon: Activity, change: "Ready for sale", color: "text-warning", bg: "bg-warning/15" },
  ] : [];

  return (
    <DashboardLayout
      role="superadmin"
      user={{ fullName: "System Admin", email: "superadmin@traceon.app", role: "SUPER_ADMIN" }}
    >
      <div className="page-enter">
        <div className="mb-8">
          <h1 className="text-2xl font-display font-bold">Super Admin Dashboard</h1>
          <p className="text-sm text-muted mt-1">
            Platform-wide overview and management
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center p-24">
            <Loader2 className="w-8 h-8 text-sky-blue animate-spin" />
          </div>
        ) : (
          <>
            {/* Stats Grid */}
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
                      <p className="text-xs text-muted uppercase tracking-wider">
                        {stat.label}
                      </p>
                      <p className="text-3xl font-bold mt-1">{stat.value}</p>
                      <p className="text-xs text-success mt-2 flex items-center gap-1">
                        <TrendingUp size={12} />
                        {stat.change}
                      </p>
                    </div>
                    <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
                      <stat.icon size={20} className={stat.color} />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="glass-card"
            >
              <div className="flex items-center justify-between p-5 border-b border-border">
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-royal-blue" />
                  <h2 className="font-semibold">Recent Activity</h2>
                </div>
                <Link
                  href="/superadmin/audit-logs"
                  className="text-xs text-royal-blue hover:text-royal-blue-light transition-colors flex items-center gap-1"
                >
                  View All <ChevronRight size={12} />
                </Link>
              </div>
              <div className="divide-y divide-border">
                {data?.recentActions.length === 0 ? (
                  <div className="p-8 text-center text-muted text-sm">
                    No recent activity found in the system.
                  </div>
                ) : (
                  data?.recentActions.map((action, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 + i * 0.05 }}
                      className="flex items-center justify-between p-4 hover:bg-royal-blue/5 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold ${
                          action.role === "SUPER_ADMIN" ? "bg-purple-500/10 text-purple-400" :
                          action.role === "ADMIN" ? "bg-sky-blue/10 text-sky-blue" :
                          "bg-emerald-500/10 text-emerald-400"
                        }`}>
                          {action.user.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm">
                            <span className="font-medium text-white/90">{action.user}</span>{" "}
                            <span className="text-muted capitalize">{action.action.toLowerCase()}</span>{" "}
                            <span className="text-sky-blue">{action.target}</span>
                          </p>
                        </div>
                      </div>
                      <span className="text-xs text-muted whitespace-nowrap ml-4">
                        {action.time}
                      </span>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
