"use client";

import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import {
  Gem, MapPin, Scale, Printer, ArrowLeft, ExternalLink,
  CheckCircle2, Clock, AlertTriangle, Loader2, Shield, Copy, Check, Layers,
} from "lucide-react";
import Link from "next/link";
import { stages } from "@/lib/design-tokens";
import { VIDEOS, IMAGES } from "@/lib/media";
import StageCard from "@/components/diamond/stage-card";
import { useParams } from "next/navigation";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}


function getStageData(diamond: any, stageNum: number) {
  if (!diamond) return null;
  const key = `stage${stageNum}`;
  return diamond[key] as Record<string, unknown> | null;
}

const statusConfig: Record<string, { label: string; cls: string }> = {
  IN_PROGRESS: { label: "In Progress", cls: "bg-sky-blue/10 border-sky-blue/20 text-sky-blue" },
  COMPLETED: { label: "Completed", cls: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" },
  FLAGGED: { label: "Flagged", cls: "bg-amber-500/10 border-amber-500/20 text-amber-400" },
  ARCHIVED: { label: "Archived", cls: "bg-white/5 border-white/10 text-white/40" },
};

export default function DiamondJourneyPage() {
  const params = useParams();
  const id = params.id as string;
  const [diamond, setDiamond] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [journeyModal, setJourneyModal] = useState(false);
  const [showJourneyToast, setShowJourneyToast] = useState(false);
  const [toastDismissed, setToastDismissed] = useState(false);
  const journeyVideoRef = useRef<HTMLVideoElement>(null);
  const timelineEndRef = useRef<HTMLDivElement>(null);
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const controller = new AbortController();
    setIsLoading(true);
    fetch(`/api/diamond/${id}`, { signal: controller.signal })
      .then((r) => r.json())
      .then((data) => { if (data.diamond) setDiamond(data.diamond); })
      .catch((err) => { if (err.name !== "AbortError") console.error(err); })
      .finally(() => setIsLoading(false));
    return () => controller.abort();
  }, [id]);

  // Toast when timeline end scrolls into view
  useEffect(() => {
    if (!timelineEndRef.current || toastDismissed) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setShowJourneyToast(true); },
      { threshold: 0.5 }
    );
    obs.observe(timelineEndRef.current);
    return () => obs.disconnect();
  }, [isLoading, diamond, toastDismissed]);

  // Auto-scroll through stages after page loads
  useEffect(() => {
    if (isLoading || !diamond) return;

    // Only auto-scroll on fresh page load, not on browser back
    if (window.performance.navigation.type === 2) return; // TYPE_BACK_FORWARD

    let stopped = false;
    let timeoutId: ReturnType<typeof setTimeout>;

    const stop = () => { stopped = true; clearTimeout(timeoutId); };
    window.addEventListener("touchstart", stop, { once: true, passive: true });
    window.addEventListener("wheel", stop, { once: true, passive: true });
    window.addEventListener("keydown", stop, { once: true });

    timeoutId = setTimeout(() => {
      const nodes = Array.from(document.querySelectorAll(".timeline-node"));
      if (!nodes.length) return;

      let i = 0;
      const scrollNext = () => {
        if (stopped || i >= nodes.length) return;
        nodes[i].scrollIntoView({ behavior: "smooth", block: "center" });
        i++;
        timeoutId = setTimeout(scrollNext, 4000);
      };
      scrollNext();
    }, 3000);

    return () => {
      stop();
      window.removeEventListener("touchstart", stop);
      window.removeEventListener("wheel", stop);
      window.removeEventListener("keydown", stop);
    };
  }, [isLoading, diamond]);

  useGSAP(() => {
    if (isLoading || !diamond) return;

    gsap.fromTo(".diamond-header",
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
    );

    gsap.fromTo(".stat-card",
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: "power2.out", delay: 0.2 }
    );

    if (document.querySelector(".progress-fill")) {
      const roughWeight = parseFloat(diamond.stage1?.roughWeight || "0");
      const polishWeight = parseFloat(diamond.stage12?.polishWeight || diamond.stage13?.finalCarat || "0");
      const widthPercent = roughWeight > 0 ? (polishWeight / roughWeight) * 100 : 0;
      gsap.fromTo(".progress-fill",
        { width: "0%" },
        { width: `${widthPercent}%`, duration: 1.5, delay: 0.8, ease: "power3.inOut" }
      );
    }

    gsap.fromTo(".timeline-node",
      {
        x: (index, target) => target.classList.contains("timeline-left") ? -80 : 80,
        opacity: 0, scale: 0.85,
        rotateY: (index, target) => target.classList.contains("timeline-left") ? -25 : 25,
        transformPerspective: 1000,
      },
      {
        scrollTrigger: { trigger: ".timeline-section", start: "top 80%" },
        x: 0, opacity: 1, scale: 1, rotateY: 0,
        duration: 0.9, stagger: 0.15, ease: "back.out(1.2)",
      }
    );

    if (document.querySelector(".dna-mask")) {
      gsap.to(".dna-mask", {
        scrollTrigger: {
          trigger: "#timeline-track",
          start: "top center", end: "bottom 85%", scrub: 1,
        },
        top: "100%", ease: "none",
      });
    }

    if (document.querySelector(".certificate-card")) {
      gsap.fromTo(".certificate-card",
        { scale: 0.95, opacity: 0 },
        {
          scrollTrigger: { trigger: ".certificate-section", start: "top 85%" },
          scale: 1, opacity: 1, duration: 0.8, ease: "back.out(1.2)",
        }
      );
    }

    if (document.querySelector(".traveling-diamond")) {
      gsap.to(".traveling-diamond", {
        scrollTrigger: {
          trigger: "#timeline-track",
          start: "top center", end: "bottom 85%", scrub: 1,
        },
        y: () => {
          const track = document.getElementById("timeline-track");
          return track ? track.offsetHeight - 96 : 0;
        },
        ease: "none",
      });

      gsap.to(".diamond-bounce", {
        y: -8, duration: 2, repeat: -1, yoyo: true, ease: "power1.inOut",
      });

      gsap.to(".diamond-spin", {
        scrollTrigger: {
          trigger: ".timeline-section",
          start: "top center", end: "bottom center", scrub: 1,
        },
        rotate: 360, ease: "none",
      });
    }
  }, { scope: container, dependencies: [isLoading, diamond] });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-transparent">
        <Loader2 className="animate-spin text-sky-blue w-8 h-8" />
      </div>
    );
  }

  if (!diamond) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-transparent text-[#e2e8f0]">
        <Gem className="w-16 h-16 text-white/20 mb-4" />
        <h1 className="text-2xl font-display font-medium text-white mb-2">Diamond Not Found</h1>
        <p className="text-white/50 mb-6">We couldn&apos;t find a record for &quot;{id}&quot;.</p>
        <Link href="/" className="px-6 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors">
          Back to Home
        </Link>
      </div>
    );
  }

  // Computations
  const roughWeight = parseFloat(diamond.stage1?.roughWeight || "0");
  const polishWeight = parseFloat(diamond.stage12?.polishWeight || diamond.stage13?.finalCarat || "0");
  const yieldPercent = roughWeight > 0 && polishWeight > 0
    ? ((polishWeight / roughWeight) * 100).toFixed(1)
    : "-";
  const pcsCount = diamond.stage1?.pcsCount ?? null;

  const allCompletedTimestamps = [1, 2, 3, 4, 5, 6, 7, 8, 10, 11, 12, 13, 14]
    .map((n) => (diamond[`stage${n}`] as any)?.completedAt)
    .filter(Boolean)
    .map((d: string) => new Date(d).getTime());
  const latestCompletedTs = allCompletedTimestamps.length > 0 ? Math.max(...allCompletedTimestamps) : null;
  const entryTs = diamond.stage1?.entryTimestamp ? new Date(diamond.stage1.entryTimestamp).getTime() : null;
  const journeyDays = latestCompletedTs && entryTs
    ? Math.floor((latestCompletedTs - entryTs) / (1000 * 60 * 60 * 24))
    : null;

  const statusCfg = statusConfig[diamond.status] ?? { label: diamond.status, cls: "bg-white/5 border-white/10 text-white/40" };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const blockchainFields = [
    { label: "DiamondDNA ID", value: diamond.stage7?.diamonddnaId ?? diamond.diamonddnaId },
    { label: "Fingerprint Hash", value: diamond.stage7?.fingerprintHash },
    { label: "Verification Signature", value: diamond.stage7?.verificationSignature },
  ].filter((f) => f.value);

  return (
    <div ref={container} className="relative min-h-screen bg-transparent text-[#e2e8f0] font-sans">
      {/* Top Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-6 md:px-12 py-6 no-print">
        <Link href="/" className="flex items-center gap-2">
          <Gem className="w-6 h-6 text-sky-blue" />
          <span className="font-display text-xl font-medium tracking-tight text-white">TraceOn</span>
        </Link>
        <div className="flex items-center gap-3">
          <button
            onClick={() => window.print()}
            className="px-4 py-2 rounded-full border border-white/20 text-white/80 hover:bg-white/5 hover:text-white transition-colors text-xs font-medium flex items-center gap-1.5"
          >
            <Printer size={14} /> Print
          </button>
          <Link href="/" className="px-4 py-2 rounded-full border border-white/20 text-white/80 hover:bg-white/5 hover:text-white transition-colors text-xs font-medium flex items-center gap-1.5">
            <ArrowLeft size={14} /> Back
          </Link>
        </div>
      </nav>

      {/* Treatment Detection Alert */}
      {diamond.stage6?.treatmentDetection && (
        <div className="relative z-10 px-6 md:px-12 pb-4 no-print">
          <div className="max-w-4xl mx-auto flex items-center gap-3 bg-amber-500/10 border border-amber-500/30 rounded-2xl px-5 py-3">
            <AlertTriangle size={16} className="text-amber-400 shrink-0" />
            <p className="text-sm text-amber-300 font-medium">
              Treatment Detected - This diamond shows evidence of treatment. Verify with a certified lab report before purchase.
            </p>
          </div>
        </div>
      )}

      {/* Diamond Header */}
      <section className="relative z-10 px-6 md:px-12 py-8 pt-4">
        <div className="diamond-header max-w-4xl mx-auto opacity-0">
          {/* ID Badge + Status */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-sky-blue/10 border border-sky-blue/20 flex items-center justify-center shadow-[0_0_15px_rgba(165,215,232,0.15)]">
              <Gem className="w-6 h-6 text-sky-blue" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl md:text-3xl font-display font-medium text-white">
                  Diamond Journey
                </h1>
                <span className={`px-2.5 py-0.5 rounded-full border text-[10px] font-bold tracking-wider uppercase ${statusCfg.cls}`}>
                  {statusCfg.label}
                </span>
              </div>
              <p className="text-sm font-mono text-sky-blue/80 mt-0.5">{diamond.diamonddnaId}</p>
            </div>
          </div>

          {/* Stats Grid â€" 6 cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-8">
            <div className="stat-card rounded-[1.5rem] bg-[#0B1526]/50 border border-white/5 p-5 opacity-0 hover:bg-[#0B1526]/80 transition-colors">
              <div className="flex items-center gap-2 text-white/40 text-xs mb-2"><MapPin size={14} /> Origin</div>
              <p className="font-semibold text-white">{diamond.stage1?.originCountry ?? "-"}</p>
            </div>
            <div className="stat-card rounded-[1.5rem] bg-[#0B1526]/50 border border-white/5 p-5 opacity-0 hover:bg-[#0B1526]/80 transition-colors">
              <div className="flex items-center gap-2 text-white/40 text-xs mb-2"><Scale size={14} /> Rough Weight</div>
              <p className="font-semibold text-white">{roughWeight > 0 ? `${roughWeight} ct` : "-"}</p>
            </div>
            <div className="stat-card rounded-[1.5rem] bg-[#0B1526]/50 border border-white/5 p-5 opacity-0 hover:bg-[#0B1526]/80 transition-colors">
              <div className="flex items-center gap-2 text-white/40 text-xs mb-2"><Scale size={14} /> Polish Weight</div>
              <p className="font-semibold text-white">{polishWeight > 0 ? `${polishWeight} ct` : "-"}</p>
            </div>
            <div className="stat-card rounded-[1.5rem] bg-[#0B1526]/50 border border-white/5 p-5 opacity-0 hover:bg-[#0B1526]/80 transition-colors">
              <div className="flex items-center gap-2 text-white/40 text-xs mb-2"><ExternalLink size={14} /> Yield</div>
              <p className="font-semibold text-white">{yieldPercent !== "-" ? `${yieldPercent}%` : "-"}</p>
            </div>
            {pcsCount != null && (
              <div className="stat-card rounded-[1.5rem] bg-[#0B1526]/50 border border-white/5 p-5 opacity-0 hover:bg-[#0B1526]/80 transition-colors">
                <div className="flex items-center gap-2 text-white/40 text-xs mb-2"><Layers size={14} /> Pieces</div>
                <p className="font-semibold text-white">{pcsCount}</p>
              </div>
            )}
            {journeyDays != null && (
              <div className="stat-card rounded-[1.5rem] bg-[#0B1526]/50 border border-white/5 p-5 opacity-0 hover:bg-[#0B1526]/80 transition-colors">
                <div className="flex items-center gap-2 text-white/40 text-xs mb-2"><Clock size={14} /> Journey</div>
                <p className="font-semibold text-white">{journeyDays}d</p>
              </div>
            )}
          </div>

          {/* Weight Progression Bar */}
          {polishWeight > 0 && (
            <div className="mt-6 rounded-[1.5rem] bg-[#0B1526]/50 border border-white/5 p-6">
              <div className="flex justify-between text-xs text-white/50 mb-3 font-medium">
                <span>Rough: {roughWeight} ct</span>
                <span>Polish: {polishWeight} ct</span>
              </div>
              <div className="h-4 bg-[#070e17] rounded-full overflow-hidden border border-white/5">
                <div
                  className="progress-fill h-full rounded-full w-full"
                  style={{
                    background: "linear-gradient(90deg, #A5D7E8, #576CBC)",
                    boxShadow: "inset 0 0 8px rgba(255,255,255,0.2)",
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Timeline */}
      <section className="timeline-section relative z-10 px-6 md:px-12 py-12 overflow-x-clip">
        <div className="max-w-4xl mx-auto">
          <div id="timeline-track" className="relative">
            {/* Traveling Diamond */}
            {(["hidden md:flex", "flex md:hidden"] as const).map((vis, idx) => (
              <button
                key={idx}
                onClick={() => setJourneyModal(true)}
                className={`traveling-diamond absolute ${idx === 0 ? "left-[-24px] md:left-1/2 md:-translate-x-1/2" : "left-[-24px]"} top-0 z-20 w-24 h-24 mt-6 ${vis} flex-col items-center gap-1.5 group cursor-pointer bg-transparent border-none p-0 outline-none`}
                title="Watch full journey video"
              >
                <div className="diamond-bounce w-full h-full flex items-center justify-center relative">
                  <img
                    src={IMAGES.transparentDiamond}
                    alt="Traveling Diamond"
                    className="diamond-spin w-full h-full object-contain drop-shadow-[0_0_25px_rgba(165,215,232,0.8)] group-hover:drop-shadow-[0_0_40px_rgba(165,215,232,1)] transition-all duration-300"
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-8 h-8 rounded-full bg-[#A5D7E8]/20 border border-[#A5D7E8]/50 flex items-center justify-center backdrop-blur-sm">
                      <svg className="w-3.5 h-3.5 text-[#A5D7E8] ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                    </div>
                  </div>
                </div>
                <span className="text-[9px] font-bold tracking-widest uppercase text-[#A5D7E8]/60 animate-pulse whitespace-nowrap">Watch Journey</span>
              </button>
            ))}

            {/* Stage nodes */}
            {stages.map((stage, i) => {
              const stageData = getStageData(diamond, stage.number);
              const isCompleted = stageData !== null && stageData !== undefined;
              const isActive = diamond.currentStage === stage.number && !isCompleted;
              const status = isCompleted ? "completed" : isActive ? "active" : "pending";

              const completedAt = (stageData as any)?.completedAt as string | null | undefined;

              let displayData = stageData
                ? Object.fromEntries(
                  Object.entries(stageData).filter(
                    ([k]) => !["id", "diamondId", "completedAt", "completedBy", "inclusionImageUrls"].includes(k)
                  )
                )
                : undefined;

              // Stage 1: show packetBarcode (Packet ID) instead of internal roughId
              if (stage.number === 1 && displayData) {
                const { roughId: _rough, ...rest1 } = displayData as Record<string, unknown>;
                const packetBarcode = (diamond.stage3 as any)?.packetBarcode;
                displayData = packetBarcode
                  ? { packetId: packetBarcode, ...rest1 }
                  : rest1;
              }

              // Stage 3: merge stage 4 (Barcode Labeling) data in
              if (stage.number === 3 && diamond.stage4) {
                const s4 = Object.fromEntries(
                  Object.entries(diamond.stage4 as Record<string, unknown>).filter(
                    ([k]) => !["id", "diamondId", "completedAt", "completedBy"].includes(k)
                  )
                );
                displayData = { ...(displayData ?? {}), ...s4 };
              }

              // Stage 3: packetWeight = stage 2 estimatedPolishWeight; packetId = packetBarcode
              if (stage.number === 3 && displayData) {
                const estPolishWeight = (diamond.stage2 as any)?.estimatedPolishWeight;
                if (estPolishWeight !== null && estPolishWeight !== undefined) {
                  displayData = { ...displayData, packetWeight: estPolishWeight };
                }
                const barcode = (diamond.stage3 as any)?.packetBarcode;
                if (barcode !== null && barcode !== undefined) {
                  displayData = { ...displayData, packetId: barcode };
                }
              }

              // Stage 5: remove planning video, show yehuda 360 iframe from stage 6
              if (stage.number === 5 && displayData) {
                const { video360Url: _v, ...rest5 } = displayData;
                displayData = rest5;
                const im = (diamond.stage6 as any)?.inclusionMap as Record<string, unknown> | null;
                if (im?.yehuda360Url) {
                  displayData = { ...displayData, yehuda360Url: im.yehuda360Url };
                }
              }

              // Stage 6: remove yehuda360Url, show planning video from stage 5 instead
              if (stage.number === 6 && displayData) {
                const im = displayData.inclusionMap as Record<string, unknown> | null;
                if (im?.yehuda360Url) {
                  const { yehuda360Url: _, ...rest } = im;
                  displayData.inclusionMap = rest;
                }
                const planningVideo = (diamond.stage5 as any)?.video360Url;
                if (planningVideo) {
                  displayData = { ...displayData, video360Url: planningVideo };
                }
              }

              // Stage 10: inject laser & sawing process video
              if (stage.number === 10) {
                displayData = { ...(displayData ?? {}), laserVideoUrl: VIDEOS.laser };
              }

              // Stage 11: inject bruting process video
              if (stage.number === 11) {
                displayData = { ...(displayData ?? {}), brutingVideoUrl: VIDEOS.bruting };
              }

              // Stage 12: inject polishing process video
              if (stage.number === 12) {
                displayData = { ...(displayData ?? {}), polishingVideoUrl: VIDEOS.polishing };
              }

              // Stage 13: inject grading process video
              if (stage.number === 13) {
                displayData = { ...(displayData ?? {}), gradingVideoUrl: VIDEOS.grading };
              }

              return (
                <div
                  key={stage.number}
                  className={`timeline-node opacity-0 relative pl-16 md:pl-0 py-6 ${i % 2 === 0
                      ? "timeline-left md:pr-[calc(50%+2.5rem)] md:text-right"
                      : "timeline-right md:pl-[calc(50%+2.5rem)]"
                    }`}
                >
                  <StageCard
                    number={stage.number}
                    displayNumber={i + 1}
                    name={stage.name}
                    icon={stage.icon}
                    status={status}
                    data={displayData}
                    completedAt={completedAt ?? null}
                  />
                </div>
              );
            })}
            <div ref={timelineEndRef} className="h-1 w-full" />
          </div>
        </div>
      </section>

      {/* Blockchain DNA Record */}
      {blockchainFields.length > 0 && (
        <section className="relative z-10 px-6 md:px-12 py-8 no-print">
          <div className="max-w-4xl mx-auto">
            <div className="rounded-[2rem] bg-[#0B1526]/60 border border-[#576CBC]/20 backdrop-blur-md p-8 relative overflow-hidden">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-24 bg-royal-blue/5 blur-3xl rounded-full pointer-events-none" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-lg bg-[#576CBC]/10 border border-[#576CBC]/20 flex items-center justify-center">
                    <Shield className="w-4 h-4 text-[#576CBC]" />
                  </div>
                  <h2 className="font-display text-lg font-medium text-white">Blockchain DNA Record</h2>
                  <span className="px-2 py-0.5 rounded border text-[9px] font-bold tracking-wider uppercase bg-emerald-500/10 border-emerald-500/20 text-emerald-400">
                    Immutable
                  </span>
                </div>

                <div className="space-y-3">
                  {blockchainFields.map((field) => (
                    <div key={field.label} className="flex items-center gap-3 bg-white/[0.03] rounded-xl p-4 border border-white/5">
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] text-white/40 uppercase tracking-widest font-semibold mb-1">{field.label}</p>
                        <p className="text-xs font-mono text-white/80 truncate">{field.value}</p>
                      </div>
                      <button
                        onClick={() => copyToClipboard(field.value!, field.label)}
                        className="shrink-0 p-2 rounded-lg hover:bg-white/10 transition-colors"
                        title="Copy to clipboard"
                      >
                        {copiedField === field.label
                          ? <Check size={14} className="text-emerald-400" />
                          : <Copy size={14} className="text-white/40 hover:text-white" />}
                      </button>
                    </div>
                  ))}
                </div>

                <div className="mt-5 flex items-center gap-2 text-[11px] text-white/30">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Tamper-evident Â· Blockchain-ready Â· SHA-256 fingerprint
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Final Grading Certificate */}
      {diamond.stage13 && (
        <section className="certificate-section relative z-10 px-6 md:px-12 py-20 flex justify-center">
          <div className="certificate-card opacity-0 w-full max-w-3xl rounded-[2.5rem] bg-gradient-to-b from-[#0B1526] to-[#070e17] border border-white/5 p-10 md:p-16 relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-24 bg-sky-blue/5 blur-3xl rounded-full" />

            <div className="text-center relative z-10">
              <Gem className="w-12 h-12 text-sky-blue mx-auto mb-4 drop-shadow-[0_0_15px_rgba(165,215,232,0.5)]" />
              <h2 className="font-display text-2xl md:text-3xl font-medium mb-1 text-white">Diamond Certificate</h2>
              <p className="text-sm font-mono text-sky-blue/80 mb-10">{diamond.diamonddnaId}</p>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-8 text-left bg-white/5 rounded-3xl p-8 border border-white/5">
                {[
                  { label: "Carat", value: `${diamond.stage13.finalCarat} ct` },
                  { label: "Color", value: diamond.stage13.finalColor },
                  { label: "Clarity", value: diamond.stage13.finalClarity },
                  { label: "Cut", value: diamond.stage13.cutGrade },
                  { label: "Polish", value: diamond.stage13.polishGrade },
                  { label: "Symmetry", value: diamond.stage13.symmetryGrade },
                ].map((item) => (
                  <div key={item.label}>
                    <p className="text-[10px] text-white/40 uppercase tracking-widest mb-1.5 font-bold">{item.label}</p>
                    <p className="text-xl font-medium text-white">{item.value}</p>
                  </div>
                ))}
              </div>

              <div className="mt-12 pt-8 border-t border-white/10 text-center">
                <p className="text-xs text-white/50 font-medium">TraceOn Â· Blockchain-Ready Certificate</p>
                <p className="text-[10px] font-mono text-white/30 mt-2">
                  Fingerprint: {diamond.stage7?.fingerprintHash}
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Journey Toast Notification */}
      {showJourneyToast && !toastDismissed && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 28 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-sm"
        >
          <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-[0_0_60px_rgba(165,215,232,0.2)]">
            <div className="absolute inset-0 rounded-2xl" style={{ background: "linear-gradient(135deg, rgba(165,215,232,0.15), rgba(192,132,252,0.15), rgba(245,158,11,0.1))", zIndex: 0 }} />
            <div className="relative z-10 flex items-center gap-4 px-5 py-4 bg-[#070e17]/90 backdrop-blur-xl">
              <div className="relative w-10 h-10 shrink-0 flex items-center justify-center">
                <span className="absolute inset-0 rounded-full animate-spin" style={{ animationDuration: "2.5s", background: "conic-gradient(from 0deg, #A5D7E8, #c084fc, #f59e0b, #A5D7E8)", filter: "blur(3px)", opacity: 0.7 }} />
                <img src={IMAGES.transparentDiamond} className="relative z-10 w-full h-full object-contain drop-shadow-[0_0_10px_rgba(165,215,232,0.9)]" alt="" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-bold tracking-widest uppercase" style={{ background: "linear-gradient(90deg,#A5D7E8,#c084fc)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  Journey Complete
                </p>
                <p className="text-xs text-white/80 font-medium mt-0.5 truncate">Watch the full diamond process video</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => { setJourneyModal(true); setShowJourneyToast(false); }}
                  className="h-8 px-3 rounded-lg text-[11px] font-bold text-[#070e17] whitespace-nowrap"
                  style={{ background: "linear-gradient(90deg, #A5D7E8, #c084fc)" }}
                >
                  Watch
                </button>
                <button
                  onClick={() => { setShowJourneyToast(false); setToastDismissed(true); }}
                  className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/40 hover:text-white transition-colors"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Full Journey Video Modal */}
      {journeyModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#050912]/80 backdrop-blur-md"
          onClick={() => { setJourneyModal(false); journeyVideoRef.current?.pause(); }}
        >
          <div
            className="relative w-full max-w-3xl rounded-3xl overflow-hidden border border-[#A5D7E8]/20 bg-[#070e17] shadow-[0_0_80px_rgba(165,215,232,0.15)]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
              <div>
                <p className="text-[10px] font-bold tracking-widest uppercase text-[#A5D7E8]/60">Full Journey</p>
                <p className="text-sm font-display font-medium text-white mt-0.5">Diamond Manufacturing Process</p>
              </div>
              <button
                onClick={() => { setJourneyModal(false); journeyVideoRef.current?.pause(); }}
                className="w-8 h-8 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <video
              ref={journeyVideoRef}
              src={VIDEOS.journey}
              className="w-full aspect-video"
              controls
              autoPlay
              playsInline
            />
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="relative z-10 bg-[#1e2638]/40 border-t border-white/5 px-6 md:px-12 py-6 no-print">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-white/40">
            <Gem className="w-3 h-3 text-sky-blue" />
            TraceOn Ateliers Â· Â© {new Date().getFullYear()}
          </div>
          <Link href="/search" className="text-xs text-white/40 hover:text-white transition-colors">
            Search Another Diamond
          </Link>
        </div>
      </footer>
    </div>
  );
}
