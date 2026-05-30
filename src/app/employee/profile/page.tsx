"use client";

import DashboardLayout from "@/components/layout/dashboard-layout";
import { User, Mail, Shield, Save } from "lucide-react";
import { useState } from "react";

export default function EmployeeProfilePage() {
  const [fullName, setFullName] = useState("Raj Kumar");
  const [email, setEmail] = useState("raj@traceon.app");

  return (
    <DashboardLayout
      role="employee"
      user={{ fullName: "Raj Kumar", email: "raj@traceon.app", role: "EMPLOYEE" }}
    >
      <div className="page-enter max-w-2xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-display font-bold">My Profile</h1>
            <p className="text-sm text-muted mt-1">Manage your account settings</p>
          </div>
          <button className="btn-primary py-2 px-6 flex items-center gap-2 text-sm">
            <Save size={16} /> Save
          </button>
        </div>

        <div className="glass-card p-6 space-y-6">
          <div className="flex items-center gap-6 mb-8">
            <div className="w-20 h-20 rounded-full bg-royal-blue/20 flex items-center justify-center text-2xl font-bold text-royal-blue border-2 border-royal-blue/30">
              RK
            </div>
            <div>
              <h2 className="text-xl font-semibold">Raj Kumar</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="badge badge-active text-[10px]">Employee</span>
                <span className="text-xs text-muted">Joined May 2025</span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-muted mb-1.5 flex items-center gap-2">
              <User size={14} /> Full Name
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full glass-input h-11 px-4 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-muted mb-1.5 flex items-center gap-2">
              <Mail size={14} /> Email Address
            </label>
            <input
              type="email"
              value={email}
              readOnly
              className="w-full glass-input h-11 px-4 text-sm opacity-70 cursor-not-allowed bg-black/20"
            />
          </div>

          <div className="pt-6 border-t border-border">
            <h3 className="font-semibold flex items-center gap-2 mb-4">
              <Shield size={16} className="text-sky-blue" /> Authorized Stages
            </h3>
            <div className="flex flex-wrap gap-2">
              {[5, 6, 7, 8].map((s) => (
                <span key={s} className="bg-royal-blue/10 border border-royal-blue/20 text-sky-blue px-3 py-1.5 rounded-lg text-sm font-mono">
                  Stage {s}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
