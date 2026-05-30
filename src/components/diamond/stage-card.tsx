"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, X } from "lucide-react";
import {
  Gem, Search, Package, Barcode, Camera, ScanLine, Fingerprint,
  Monitor, ShieldCheck, Zap, Box, Sparkles, Award, Image, type LucideIcon,
} from "lucide-react";
import { normalizeMediaUrl } from "@/lib/media";

const iconMap: Record<string, LucideIcon> = {
  gem: Gem, search: Search, package: Package, barcode: Barcode,
  camera: Camera, scan: ScanLine, fingerprint: Fingerprint, monitor: Monitor,
  "shield-check": ShieldCheck, zap: Zap, box: Box, sparkles: Sparkles,
  award: Award, image: Image,
};

type MediaItem = { url: string; type: "video" | "image" | "360"; label: string };

interface StageCardProps {
  number: number;
  displayNumber?: number;
  name: string;
  icon: string;
  status: "completed" | "active" | "pending";
  data?: Record<string, unknown>;
  completedAt?: string | null;
  onClick?: () => void;
  compact?: boolean;
}

function MediaModal({ item, onClose }: { item: MediaItem; onClose: () => void }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); return () => setMounted(false); }, []);
  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#050912]/85 backdrop-blur-lg"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.92, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.92, opacity: 0, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 28 }}
          className="relative w-full max-w-3xl rounded-3xl overflow-hidden bg-[#070e17] border border-white/10 shadow-[0_0_80px_rgba(165,215,232,0.12)]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Glow top border */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#A5D7E8]/50 to-transparent" />

          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className="relative w-8 h-8 rounded-lg flex items-center justify-center text-[#A5D7E8]">
                <span className="absolute inset-0 rounded-lg animate-spin" style={{ animationDuration: "3s", background: "conic-gradient(from 0deg,#A5D7E8,#576CBC,#A5D7E8,#576CBC,#A5D7E8)", padding: "1.5px", WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)", WebkitMaskComposite: "xor", maskComposite: "exclude", opacity: 0.7 }} />
                <span className="absolute inset-[1.5px] rounded-[6px] bg-[#070e17]" />
                <span className="relative z-10">
                  {item.type === "video" || item.type === "360" ? (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="m21 15-5-5L5 21" /></svg>
                  )}
                </span>
              </div>
              <div>
                <p className="text-[10px] font-bold tracking-widest uppercase text-[#A5D7E8]/60">
                  {item.type === "360" ? "360° View" : item.type === "video" ? "Video" : "Image"}
                </p>
                <p className="text-sm font-medium text-white mt-0.5">{item.label}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-white transition-all"
            >
              <X size={14} />
            </button>
          </div>

          {/* Content */}
          <div className="bg-black">
            {item.type === "video" ? (
              <video
                src={item.url}
                className="w-full aspect-video"
                controls
                autoPlay
                playsInline
              />
            ) : item.type === "360" ? (
              <iframe src={item.url} className="w-full aspect-video border-0" allow="fullscreen" />
            ) : (
              <img src={item.url} alt={item.label} className="w-full max-h-[70vh] object-contain" />
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
}

export default function StageCard({
  number, displayNumber, name, icon, status, data, completedAt, onClick, compact = false,
}: StageCardProps) {
  const Icon = iconMap[icon] || Gem;
  const [expanded, setExpanded] = useState(false);
  const [activeMedia, setActiveMedia] = useState<MediaItem | null>(null);

  const statusStyles = {
    completed: "shadow-[0_0_15px_rgba(165,215,232,0.05)] border-white/10",
    active: "shadow-[0_0_20px_rgba(87,108,188,0.15)] border-[#576CBC]/40",
    pending: "border-dashed border-white/10 opacity-60",
  };

  const nodeStyles = {
    completed: "bg-sky-blue/10 border border-sky-blue/20 text-sky-blue",
    active: "bg-[#576CBC]/10 border border-[#576CBC]/30 text-[#A5D7E8]",
    pending: "bg-white/5 border border-white/10 text-white/30",
  };

  const formatValue = (val: unknown): string => {
    if (val === null || val === undefined) return "-";
    if (typeof val === "boolean") return val ? "Yes" : "No";
    if (typeof val === "object") {
      if (Array.isArray(val)) return val.join(", ");
      return Object.entries(val as Record<string, unknown>)
        .map(([k, v]) => {
          const fk = k.replace(/([A-Z])/g, " $1").replace(/_/g, " ").replace(/^./, (s) => s.toUpperCase()).trim();
          return `${fk}: ${v}`;
        })
        .join(", ");
    }
    if (typeof val === "string" && val.match(/^\d{4}-\d{2}-\d{2}/)) {
      return new Date(val).toLocaleDateString("en-US", {
        year: "numeric", month: "short", day: "numeric",
        hour: "2-digit", minute: "2-digit",
      });
    }
    return String(val);
  };

  const isMediaUrl = (s: string) =>
    s.startsWith("http://") || s.startsWith("https://") || s.startsWith("/");

  const isMediaField = (key: string, val: unknown): boolean => {
    const lk = key.toLowerCase();
    if (lk === "yehuda360url") return typeof val === "string" && isMediaUrl(val);
    if (!lk.includes("image") && !lk.includes("video") && !lk.includes("url")) return false;
    if (typeof val === "string" && isMediaUrl(val)) return true;
    if (Array.isArray(val) && val.length > 0 && typeof val[0] === "string" && isMediaUrl(val[0])) return true;
    if (typeof val === "string" && val.trim().startsWith("[")) {
      try {
        const parsed = JSON.parse(val);
        if (Array.isArray(parsed) && parsed.length > 0 && typeof parsed[0] === "string" && isMediaUrl(parsed[0])) return true;
      } catch { }
    }
    return false;
  };

  const getFieldLabel = (key: string) =>
    key === "packetId" ? "Packet ID"
      : key === "video360Url" ? "Planning Video"
      : key === "yehuda360Url" ? "360 Yehuda View"
      : key === "gradingVideoUrl" ? "Grading Video"
      : key === "laserVideoUrl" ? "Laser & Sawing Video"
      : key === "brutingVideoUrl" ? "Bruting Process Video"
      : key === "polishingVideoUrl" ? "Polishing Process Video"
      : key.replace(/([A-Z])/g, " $1").replace(/_/g, " ");

  const getMediaType = (key: string, url?: string): "video" | "image" | "360" => {
    const lk = key.toLowerCase();
    if (lk.includes("yehuda360")) {
      // If the stored URL is actually a video file, render as video not iframe
      if (url && /\.(mp4|mov|webm|avi|ogg)/i.test(url)) return "video";
      return "360";
    }
    if (lk.includes("video")) return "video";
    return "image";
  };

  const renderMediaButtons = (key: string, val: unknown) => {
    let urls: string[] = [];
    if (Array.isArray(val)) {
      urls = val as string[];
    } else if (typeof val === "string") {
      const trimmed = val.trim();
      if (trimmed.startsWith("[")) {
        try { const p = JSON.parse(trimmed); if (Array.isArray(p)) urls = p; } catch { urls = [val]; }
      } else {
        urls = [val];
      }
    }
    urls = urls.map(normalizeMediaUrl);

    const label = getFieldLabel(key);

    return (
      <div className="flex flex-wrap gap-2 mt-1">
        {urls.map((url, idx) => {
          const urlType = getMediaType(key, url);
          const urlIsVideo = urlType === "video";
          const urlIs360 = urlType === "360";
          return (
          <button
            key={idx}
            onClick={(e) => {
              e.stopPropagation();
              setActiveMedia({ url, type: urlType, label: urls.length > 1 ? `${label} #${idx + 1}` : label });
            }}
            className="group relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_0_16px_rgba(165,215,232,0.2)]"
          >
            {/* Spinning site-theme gradient border */}
            <span
              className="absolute inset-0 rounded-lg animate-spin"
              style={{
                animationDuration: "3s",
                background: "conic-gradient(from 0deg,#A5D7E8,#576CBC,#A5D7E8,#576CBC,#A5D7E8)",
                padding: "1.5px",
                WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                WebkitMaskComposite: "xor",
                maskComposite: "exclude",
                opacity: 0.7,
              }}
            />
            {/* Button fill */}
            <span className="absolute inset-[1.5px] rounded-[6px] bg-[#0B1526] group-hover:bg-[#0d1a30] transition-colors" />
            {/* Content */}
            <span className="relative z-10 flex items-center gap-1.5 text-[#A5D7E8] group-hover:text-white transition-colors">
              {urlIs360 ? (
                <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
              ) : urlIsVideo ? (
                <svg className="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
              ) : (
                <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="m21 15-5-5L5 21" />
                </svg>
              )}
              <span>
                {urlIs360 ? "Open 360°" : urlIsVideo ? "Play Video" : "View Image"}
                {urls.length > 1 ? ` #${idx + 1}` : ""}
              </span>
            </span>
          </button>
          );
        })}
      </div>
    );
  };

  const entries = data ? Object.entries(data) : [];
  const visibleEntries = expanded ? entries : entries.slice(0, 6);
  const extraCount = entries.length - 6;

  return (
    <>
      {activeMedia && <MediaModal item={activeMedia} onClose={() => setActiveMedia(null)} />}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5, delay: number * 0.05 }}
        className={`rounded-[1.5rem] bg-[#0B1526]/60 border border-white/5 backdrop-blur-md ${statusStyles[status]} cursor-pointer transition-all ${compact ? "p-4" : "px-6 py-8"}`}
        onClick={onClick}
        whileHover={{ scale: 1.01, backgroundColor: "rgba(11, 21, 38, 0.8)" }}
        whileTap={{ scale: 0.99 }}
      >
        <div className="flex items-start gap-5">
          <div className={`flex items-center justify-center w-12 h-12 rounded-xl rotate-45 ${nodeStyles[status]} shrink-0`}>
            <div className="-rotate-45"><Icon size={compact ? 18 : 22} /></div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-xs font-mono text-white/40 uppercase tracking-widest">
                Stage {String(displayNumber ?? number).padStart(2, "0")}
              </span>
              <span className={`px-2 py-0.5 rounded border text-[9px] font-bold tracking-wider uppercase ${
                status === "completed" ? "bg-sky-blue/10 border-sky-blue/20 text-sky-blue"
                : status === "active" ? "bg-[#576CBC]/10 border-[#576CBC]/30 text-[#A5D7E8] animate-pulse"
                : "bg-white/5 border-white/10 text-white/40"
              }`}>
                {status === "completed" ? "Complete" : status === "active" ? "In Progress" : "Pending"}
              </span>
            </div>

            <h3 className={`font-semibold text-white ${compact ? "text-sm" : "text-lg"}`}>{name}</h3>

            {!compact && entries.length > 0 && (
              <>
                <div className="mt-5 grid grid-cols-2 gap-x-6 gap-y-4">
                  {visibleEntries.map(([key, value]) => (
                    <div key={key} className="flex flex-col">
                      <span className="text-[10px] text-white/40 uppercase tracking-widest font-semibold mb-1">
                        {getFieldLabel(key)}
                      </span>
                      {isMediaField(key, value) ? renderMediaButtons(key, value) : (
                        <span className="text-sm text-white/90 font-medium truncate" title={formatValue(value)}>
                          {formatValue(value)}
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                {extraCount > 0 && (
                  <button
                    onClick={(e) => { e.stopPropagation(); setExpanded((v) => !v); }}
                    className="mt-4 flex items-center gap-1.5 text-[11px] text-sky-blue/70 hover:text-sky-blue transition-colors font-medium"
                  >
                    {expanded
                      ? <><ChevronUp size={12} /> Show less</>
                      : <><ChevronDown size={12} /> Show {extraCount} more field{extraCount > 1 ? "s" : ""}</>}
                  </button>
                )}
              </>
            )}

            {completedAt && (
              <p className="mt-5 text-[10px] text-white/25 font-mono">
                Completed {new Date(completedAt).toLocaleDateString("en-US", {
                  year: "numeric", month: "short", day: "numeric",
                  hour: "2-digit", minute: "2-digit",
                })}
              </p>
            )}
          </div>

          {status === "completed" && (
            <div className="text-success shrink-0">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="drop-shadow-[0_0_6px_rgba(16,185,129,0.5)]">
                <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="2" />
                <path d="M6 10L9 13L14 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          )}
        </div>
      </motion.div>
    </>
  );
}
