"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { motion } from "framer-motion";
import { ChevronRight, Loader2, Play, Search, AlertCircle, Box, Gem } from "lucide-react";
import { stages } from "@/lib/design-tokens";
import Link from "next/link";

type DiamondData = {
  id: string;
  traceonId: string;
  roughId: string;
  currentStage: number;
  status: string;
  updatedAt: string;
  stage1?: {
    originCountry: string;
    roughWeight: number;
  };
};

export default function WorkspacePage() {
  const params = useParams();
  const router = useRouter();
  const stageNumber = parseInt(params.stageNumber as string, 10);
  
  const [diamonds, setDiamonds] = useState<DiamondData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const stage = stages.find(s => s.number === stageNumber);

  useEffect(() => {
    if (!stage) return;
    
    fetch(`/api/employee/workspace/${stageNumber}`)
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setError(data.error);
        } else {
          setDiamonds(data.diamonds || []);
        }
      })
      .catch(err => {
        setError("Failed to load workspace data");
        console.error(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [stageNumber, stage]);

  if (!stage) {
    return (
      <div className="min-h-screen bg-navy-deep flex items-center justify-center">
        <div className="text-center text-white">Invalid stage number.</div>
      </div>
    );
  }

  const filteredDiamonds = diamonds.filter(d => 
    d.traceonId?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    d.roughId?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout role="employee" user={{ fullName: "Employee", email: "", role: "EMPLOYEE" }}>
      <div className="page-enter">
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <Link href="/employee" className="text-royal-blue hover:text-white transition-colors text-sm flex items-center gap-1 mb-2">
              <ChevronRight size={14} className="rotate-180" /> Back to Dashboard
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-royal-blue/20 flex items-center justify-center text-royal-blue font-mono font-bold">
                S{stage.number}
              </div>
              <div>
                <h1 className="text-2xl font-display font-bold">{stage.name}</h1>
                <p className="text-sm text-muted">Workspace Queue</p>
              </div>
            </div>
          </div>
          
          {/* If it's Stage 1, we don't have a queue typically, we register new ones. But we'll add a button just in case. */}
          {stage.number === 1 && (
            <Link href="/admin/diamonds/new" className="btn-primary py-2.5 px-6 text-sm">
              Register New Rough Diamond
            </Link>
          )}
        </div>

        {error ? (
          <div className="glass-card p-8 text-center text-red-400 border border-red-500/20 bg-red-500/5">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2">Access Denied</h3>
            <p>{error}</p>
          </div>
        ) : (
          <>
            <div className="glass-card p-4 mb-6 flex items-center gap-3">
              <Search size={18} className="text-muted" />
              <input 
                type="text" 
                placeholder="Scan or type Traceon ID / Rough ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none outline-none text-sm w-full text-white placeholder:text-muted"
                autoFocus
              />
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="animate-spin text-royal-blue w-8 h-8" />
              </div>
            ) : filteredDiamonds.length === 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Dummy Diamond for Demonstration */}
                <div className="glass-card p-5 group border-warning/30 bg-warning/5 transition-colors relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-warning text-navy-deep text-[10px] font-bold px-2 py-1 rounded-bl-lg z-10">
                    DEMO MOCK DATA
                  </div>
                  <div className="flex justify-between items-start mb-4 mt-2">
                    <div className="flex items-center gap-2">
                      <Gem size={16} className="text-warning" />
                      <span className="font-mono text-sm font-semibold">TRX-DEMO-0001</span>
                    </div>
                    <span className="badge badge-pending text-[10px]">WAITING</span>
                  </div>
                  
                  <div className="space-y-2 mb-6">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted">Origin:</span>
                      <span className="text-white font-medium">Botswana</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted">Weight:</span>
                      <span className="text-white font-medium">14.52 ct</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted">Queued:</span>
                      <span className="text-white font-medium">Just now</span>
                    </div>
                  </div>

                  <Link 
                    href={`/employee/stage/demo-diamond-id/${stage.number}`}
                    className="w-full btn-primary py-2 flex items-center justify-center gap-2 text-sm opacity-90 group-hover:opacity-100 transition-opacity"
                  >
                    <Play size={14} /> Start Task
                  </Link>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredDiamonds.map((diamond, index) => (
                  <motion.div
                    key={diamond.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="glass-card p-5 group hover:border-royal-blue/30 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-2">
                        <Gem size={16} className="text-sky-blue" />
                        <span className="font-mono text-sm font-semibold">{diamond.traceonId || diamond.roughId}</span>
                      </div>
                      <span className="badge badge-pending text-[10px]">WAITING</span>
                    </div>
                    
                    <div className="space-y-2 mb-6">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted">Origin:</span>
                        <span className="text-white font-medium">{diamond.stage1?.originCountry || "Unknown"}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-muted">Weight:</span>
                        <span className="text-white font-medium">{diamond.stage1?.roughWeight ? `${diamond.stage1.roughWeight} ct` : "Unknown"}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-muted">Queued:</span>
                        <span className="text-white font-medium">{new Date(diamond.updatedAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <Link 
                      href={`/employee/stage/${diamond.id}/${stage.number}`}
                      className="w-full btn-primary py-2 flex items-center justify-center gap-2 text-sm opacity-90 group-hover:opacity-100 transition-opacity"
                    >
                      <Play size={14} /> Start Task
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
