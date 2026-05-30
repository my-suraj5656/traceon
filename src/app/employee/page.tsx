"use client";

import DashboardLayout from "@/components/layout/dashboard-layout";
import { motion } from "framer-motion";
import {
  Diamond,
  Clock,
  ScanLine,
  ChevronRight,
  AlertCircle,
  ShieldCheck,
  Loader2
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { stages } from "@/lib/design-tokens";

type UserData = {
  id: string;
  fullName: string;
  email: string;
  role: "EMPLOYEE";
  roleLabel: string;
  permittedStages: number[];
};

export default function EmployeeDashboard() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me")
      .then(res => res.json())
      .then(data => {
        if (data.user) setUserData(data.user);
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center">
        <Loader2 className="animate-spin text-royal-blue w-8 h-8" />
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center text-white">
        Error loading profile.
      </div>
    );
  }

  return (
    <DashboardLayout role="employee" user={userData}>
      <div className="page-enter">
        <div className="mb-8">
          <h1 className="text-2xl font-display font-bold">My Dashboard</h1>
          <p className="text-sm text-muted mt-1">
            Welcome back, {userData.fullName.split(" ")[0]}.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-5"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-royal-blue/15 flex items-center justify-center">
                <ShieldCheck size={20} className="text-royal-blue" />
              </div>
              <div>
                <p className="text-2xl font-bold">{userData.permittedStages.length}</p>
                <p className="text-xs text-muted">Authorized Stages</p>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-5"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-warning/15 flex items-center justify-center">
                <Clock size={20} className="text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold">0</p>
                <p className="text-xs text-muted">Pending Tasks</p>
              </div>
            </div>
          </motion.div>

          {userData.permittedStages.includes(4) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card p-5 cursor-pointer"
            >
              <Link href="/employee/scan" className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-sky-blue/15 flex items-center justify-center">
                  <ScanLine size={20} className="text-sky-blue" />
                </div>
                <div>
                  <p className="text-sm font-semibold">Scan Barcode</p>
                  <p className="text-xs text-muted">Open camera scanner</p>
                </div>
                <ChevronRight size={16} className="text-muted ml-auto" />
              </Link>
            </motion.div>
          )}
        </div>

        {/* Authorized Stages */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card mb-6"
        >
          <div className="flex items-center gap-2 p-5 border-b border-border">
            <ShieldCheck size={16} className="text-success" />
            <h2 className="font-semibold">My Authorized Workspaces</h2>
          </div>
          <div className="p-5">
            {userData.permittedStages.length === 0 ? (
              <div className="text-center py-8 text-muted">
                <AlertCircle className="w-8 h-8 mx-auto mb-3 opacity-50" />
                <p>You have not been assigned permissions to any manufacturing stages yet.</p>
                <p className="text-xs mt-1">Please contact your administrator.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {userData.permittedStages.map(stageNum => {
                  const stage = stages.find(s => s.number === stageNum);
                  if (!stage) return null;
                  return (
                    <div key={stageNum} className="border border-border rounded-lg p-4 bg-navy-mid/20 flex items-center justify-between">
                      <div>
                        <p className="text-xs font-mono text-royal-blue mb-1">STAGE {stage.number}</p>
                        <p className="text-sm font-medium">{stage.name}</p>
                      </div>
                      <Link href={`/employee/workspace/${stage.number}`} className="p-2 rounded-lg bg-royal-blue/10 text-royal-blue hover:bg-royal-blue hover:text-white transition-colors">
                        <ChevronRight size={16} />
                      </Link>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
