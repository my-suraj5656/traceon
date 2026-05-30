"use client";

import DashboardLayout from "@/components/layout/dashboard-layout";
import { motion } from "framer-motion";
import { Settings, Save, Gem, Globe, Bell, Shield, Server } from "lucide-react";
import { useState } from "react";

export default function SystemSettingsPage() {
  const [platformName, setPlatformName] = useState("Traceon");
  const [tagline, setTagline] = useState("From Earth to Eternity — Every Diamond Has a Story");
  const [notificationEmail, setNotificationEmail] = useState("alerts@traceon.app");
  const [blockchainEnabled, setBlockchainEnabled] = useState(false);
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  return (
    <DashboardLayout
      role="superadmin"
      user={{ fullName: "System Admin", email: "superadmin@traceon.app", role: "SUPER_ADMIN" }}
    >
      <div className="page-enter">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-display font-bold">System Settings</h1>
            <p className="text-sm text-muted mt-1">Platform configuration and branding</p>
          </div>
          <button className="btn-primary text-sm py-2.5 px-5 flex items-center gap-2">
            <Save size={16} />
            Save Changes
          </button>
        </div>

        <div className="max-w-2xl space-y-6">
          {/* Branding */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
            <div className="flex items-center gap-2 mb-5">
              <Gem size={18} className="text-sky-blue" />
              <h2 className="font-semibold">Branding</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-muted mb-1.5">Platform Name</label>
                <input type="text" value={platformName} onChange={(e) => setPlatformName(e.target.value)} className="w-full glass-input h-10 px-4 text-sm" />
              </div>
              <div>
                <label className="block text-sm text-muted mb-1.5">Tagline</label>
                <input type="text" value={tagline} onChange={(e) => setTagline(e.target.value)} className="w-full glass-input h-10 px-4 text-sm" />
              </div>
              <div>
                <label className="block text-sm text-muted mb-1.5">Logo Upload</label>
                <div className="glass-input h-20 flex items-center justify-center text-sm text-muted border-dashed cursor-pointer hover:border-royal-blue transition-colors">
                  Click to upload or drag and drop
                </div>
              </div>
            </div>
          </motion.div>

          {/* Notifications */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6">
            <div className="flex items-center gap-2 mb-5">
              <Bell size={18} className="text-sky-blue" />
              <h2 className="font-semibold">Notifications</h2>
            </div>
            <div>
              <label className="block text-sm text-muted mb-1.5">System Notification Email</label>
              <input type="email" value={notificationEmail} onChange={(e) => setNotificationEmail(e.target.value)} className="w-full glass-input h-10 px-4 text-sm" />
            </div>
          </motion.div>

          {/* Blockchain */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield size={18} className="text-sky-blue" />
                <div>
                  <h2 className="font-semibold">Polygon Blockchain</h2>
                  <p className="text-xs text-muted mt-0.5">Enable on-chain anchoring for flagged fields</p>
                </div>
              </div>
              <button
                onClick={() => setBlockchainEnabled(!blockchainEnabled)}
                className={`relative w-11 h-6 rounded-full transition-colors ${blockchainEnabled ? "bg-royal-blue" : "bg-navy-mid"}`}
              >
                <div className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${blockchainEnabled ? "translate-x-5" : ""}`} />
              </button>
            </div>
          </motion.div>

          {/* Maintenance */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Server size={18} className="text-warning" />
                <div>
                  <h2 className="font-semibold">Maintenance Mode</h2>
                  <p className="text-xs text-muted mt-0.5">Restrict access to Super Admins only</p>
                </div>
              </div>
              <button
                onClick={() => setMaintenanceMode(!maintenanceMode)}
                className={`relative w-11 h-6 rounded-full transition-colors ${maintenanceMode ? "bg-warning" : "bg-navy-mid"}`}
              >
                <div className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${maintenanceMode ? "translate-x-5" : ""}`} />
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
}
