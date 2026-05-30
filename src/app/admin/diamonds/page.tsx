"use client";

import DashboardLayout from "@/components/layout/dashboard-layout";
import { Search, Filter, Download, Gem, ChevronRight, MapPin, Scale, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function DiamondsListPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [diamonds, setDiamonds] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/diamonds")
      .then(r => r.json())
      .then(data => {
        if (data.diamonds) setDiamonds(data.diamonds);
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  const filtered = diamonds.filter(
    (d) =>
      d.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.roughId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (d.diamonddnaId && d.diamonddnaId.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <DashboardLayout
      role="admin"
      user={{ fullName: "System Admin", email: "admin@traceon.app", role: "ADMIN" }}
    >
      <div className="page-enter">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-display font-bold">Diamonds</h1>
            <p className="text-sm text-muted mt-1">Manage and track all diamonds in your scope</p>
          </div>
          <div className="flex items-center gap-3 self-start">
            <button className="btn-ghost text-sm py-2.5 px-5 flex items-center gap-2">
              <Download size={16} />
              Export
            </button>
            <Link href="/admin/diamonds/new" className="btn-primary text-sm py-2.5 px-5 flex items-center gap-2">
              <Gem size={16} />
              Register Rough
            </Link>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by ID or Rough ID..."
              className="w-full glass-input h-10 pl-9 pr-4 text-sm"
            />
          </div>
          <button className="btn-ghost px-4 flex items-center gap-2">
            <Filter size={14} /> Filter
          </button>
        </div>

        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="flex justify-center p-12"><Loader2 className="animate-spin text-royal-blue" /></div>
            ) : diamonds.length === 0 ? (
              <div className="p-12 text-center text-muted">No diamonds registered yet.</div>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Traceon ID</th>
                    <th>Rough ID</th>
                    <th>Origin</th>
                    <th>Weight</th>
                    <th>Stage</th>
                    <th>Status</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((d) => (
                    <tr key={d.id}>
                      <td>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-sky-blue/10 flex items-center justify-center">
                            <Gem size={14} className="text-sky-blue" />
                          </div>
                          <span className="font-mono text-sm text-sky-blue">{d.diamonddnaId || d.id.substring(0, 8)}</span>
                        </div>
                      </td>
                      <td className="font-mono text-xs text-muted">{d.roughId}</td>
                      <td>
                        <div className="flex items-center gap-1.5 text-sm">
                          <MapPin size={12} className="text-muted" /> {d.stage1?.originCountry || "—"}
                        </div>
                      </td>
                      <td>
                        <div className="flex items-center gap-1.5 text-sm">
                          <Scale size={12} className="text-muted" /> {d.stage1?.roughWeight ? `${d.stage1.roughWeight} ct` : "—"}
                        </div>
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-navy-deep rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-royal-blue to-sky-blue"
                              style={{ width: `${(d.currentStage / 14) * 100}%` }}
                            />
                          </div>
                          <span className="text-xs text-muted">{d.currentStage}/14</span>
                        </div>
                      </td>
                      <td>
                        <span className={`badge text-[10px] ${
                          d.status === "COMPLETED" ? "badge-completed" :
                          d.status === "FLAGGED" ? "badge-error" : "badge-active"
                        }`}>
                          {d.status}
                        </span>
                      </td>
                      <td className="text-right">
                        <Link href={`/diamond/${d.id}`} className="p-2 inline-flex rounded-lg hover:bg-royal-blue/10 text-muted transition-colors">
                          <ChevronRight size={16} />
                        </Link>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && diamonds.length > 0 && (
                    <tr>
                      <td colSpan={7} className="text-center py-8 text-muted">No matching diamonds found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
