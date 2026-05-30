"use client";

import DashboardLayout from "@/components/layout/dashboard-layout";
import { Download, FileDown, Calendar, Filter } from "lucide-react";
import { useState } from "react";

export default function AdminExportPage() {
  return (
    <DashboardLayout
      role="admin"
      user={{ fullName: "Jane Smith", email: "jane@traceon.app", role: "ADMIN" }}
    >
      <div className="page-enter">
        <div className="mb-8">
          <h1 className="text-2xl font-display font-bold">Export Center</h1>
          <p className="text-sm text-muted mt-1">Generate reports and export platform data</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="glass-card p-6 flex flex-col h-full">
            <div className="w-12 h-12 rounded-xl bg-royal-blue/15 flex items-center justify-center mb-4">
              <FileDown size={24} className="text-royal-blue" />
            </div>
            <h2 className="text-lg font-semibold mb-2">Diamond Packets</h2>
            <p className="text-sm text-muted mb-6 flex-1">
              Export a complete CSV list of all diamond packets currently active or completed within your scope.
            </p>
            <button className="w-full btn-ghost py-2.5 flex items-center justify-center gap-2">
              <Download size={16} /> Export CSV
            </button>
          </div>

          <div className="glass-card p-6 flex flex-col h-full">
            <div className="w-12 h-12 rounded-xl bg-sky-blue/15 flex items-center justify-center mb-4">
              <Calendar size={24} className="text-sky-blue" />
            </div>
            <h2 className="text-lg font-semibold mb-2">Monthly Activity Report</h2>
            <p className="text-sm text-muted mb-6 flex-1">
              Download a detailed PDF report summarizing stage completions, flagged anomalies, and throughput metrics.
            </p>
            <button className="w-full btn-ghost py-2.5 flex items-center justify-center gap-2">
              <Download size={16} /> Download PDF
            </button>
          </div>

          <div className="glass-card p-6 flex flex-col h-full">
            <div className="w-12 h-12 rounded-xl bg-success/15 flex items-center justify-center mb-4">
              <Filter size={24} className="text-success" />
            </div>
            <h2 className="text-lg font-semibold mb-2">Custom Query Export</h2>
            <p className="text-sm text-muted mb-6 flex-1">
              Run custom queries based on specific date ranges, stages, or employees to generate targeted CSV datasets.
            </p>
            <button className="w-full btn-primary py-2.5 flex items-center justify-center gap-2">
              Configure Query
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
