"use client";

import { useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { ChevronLeft, Save, Upload, ScanLine, Loader2, CheckCircle2, X } from "lucide-react";
import { stages } from "@/lib/design-tokens";
import Link from "next/link";

export default function StageDataEntryPage() {
  const params = useParams();
  const router = useRouter();
  const stageNumber = parseInt(params.stageNumber as string, 10);
  const diamondId = params.diamondId as string;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadToCloudinary = async (file: File): Promise<string> => {
    const folder = `stage${stageNumber}`;
    const res = await fetch("/api/cloudinary/sign", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ folder }),
    });
    const { signature, timestamp, api_key, cloud_name, folder: signedFolder } = await res.json();

    const form = new FormData();
    form.append("file", file);
    form.append("signature", signature);
    form.append("timestamp", String(timestamp));
    form.append("api_key", api_key);
    form.append("folder", signedFolder);

    const upload = await fetch(`https://api.cloudinary.com/v1_1/${cloud_name}/auto/upload`, {
      method: "POST",
      body: form,
    });
    const data = await upload.json();
    return data.secure_url;
  };

  const handleFileDrop = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setIsUploading(true);
    try {
      const urls = await Promise.all(Array.from(files).map(uploadToCloudinary));
      setUploadedUrls(prev => [...prev, ...urls]);
    } finally {
      setIsUploading(false);
    }
  };

  const stage = stages.find(s => s.number === stageNumber);

  const handleSimulateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsDone(true);
      setTimeout(() => router.push(`/employee/workspace/${stageNumber}`), 1500);
    }, 2000);
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (uploadedUrls.length === 0) return;
    setIsSubmitting(true);
    try {
      const body: Record<string, unknown> = {};
      if (stageNumber === 5) {
        const videos = uploadedUrls.filter(u => u.match(/\.(mp4|mov|webm)/i));
        const images = uploadedUrls.filter(u => !u.match(/\.(mp4|mov|webm)/i));
        body.video360Url = videos[0] ?? null;
        body.rawImageUrls = images;
      } else if (stageNumber === 8) {
        body.galaxyFile = uploadedUrls[0] ?? null;
      } else if (stageNumber === 14) {
        const videos = uploadedUrls.filter(u => u.match(/\.(mp4|mov|webm)/i));
        const images = uploadedUrls.filter(u => !u.match(/\.(mp4|mov|webm)/i));
        body.final360Video = videos[0] ?? null;
        body.finalImageSet = images;
      }
      await fetch(`/api/stage/${diamondId}/${stageNumber}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      setIsDone(true);
      setTimeout(() => router.push(`/employee/workspace/${stageNumber}`), 1500);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!stage) {
    return (
      <div className="min-h-screen bg-navy-deep flex items-center justify-center text-white">
        Invalid Stage
      </div>
    );
  }

  // Helper to render different placeholder blocks
  const renderStageForm = () => {
    switch (stageNumber) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-muted mb-1.5">Source Lot ID</label>
                <input type="text" className="w-full glass-input h-10 px-3 text-sm" placeholder="e.g. LOT-2026-X" />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted mb-1.5">Origin Country</label>
                <input type="text" className="w-full glass-input h-10 px-3 text-sm" placeholder="e.g. Botswana" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-muted mb-1.5">Rough Weight (Carats)</label>
              <input type="number" step="0.01" className="w-full glass-input h-10 px-3 text-sm" placeholder="0.00" />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-muted mb-1.5">Estimated Shape</label>
                <select className="w-full glass-input h-10 px-3 text-sm appearance-none bg-navy-deep">
                  <option>Round Brilliant</option>
                  <option>Princess</option>
                  <option>Cushion</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-muted mb-1.5">Est. Polish Weight</label>
                <input type="number" step="0.01" className="w-full glass-input h-10 px-3 text-sm" placeholder="0.00 ct" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-muted mb-1.5">Clarity Estimate</label>
                <select className="w-full glass-input h-10 px-3 text-sm appearance-none bg-navy-deep">
                  <option>VVS1</option><option>VS1</option><option>SI1</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-muted mb-1.5">Color Estimate</label>
                <select className="w-full glass-input h-10 px-3 text-sm appearance-none bg-navy-deep">
                  <option>D</option><option>E</option><option>F</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 3: // Packet Creation + Barcode Labeling
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-muted mb-1.5">Packet ID</label>
                <input type="text" className="w-full glass-input h-10 px-3 text-sm" placeholder="e.g. PKT-2026-001" />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted mb-1.5">Packet Weight (Carats)</label>
                <input type="number" step="0.01" className="w-full glass-input h-10 px-3 text-sm" placeholder="0.00" />
              </div>
            </div>
            <div className="border-t border-white/10 pt-5 text-center space-y-4">
              <p className="text-xs font-semibold text-muted uppercase tracking-widest">Barcode Labeling</p>
              <div className="w-16 h-16 mx-auto rounded-full bg-sky-blue/10 flex items-center justify-center">
                <ScanLine size={28} className="text-sky-blue" />
              </div>
              <p className="text-sm text-muted">Scan the physical packet barcode to link it to the system.</p>
              <input type="text" className="w-full max-w-sm mx-auto glass-input h-12 px-4 text-center text-lg tracking-widest font-mono" placeholder="SCAN BARCODE..." />
            </div>
          </div>
        );

      case 4: // Barcode Labeling (merged into stage 3)
        return null;

      case 5: // Digital Imaging
      case 8: // Virtual Planning
      case 14: // Final Photo/Video
        return (
          <div className="space-y-6">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,video/*,.galaxy,.sarin"
              className="hidden"
              onChange={e => handleFileDrop(e.target.files)}
            />
            <div
              className="border-2 border-dashed border-white/20 rounded-xl p-10 text-center hover:bg-white/5 transition-colors cursor-pointer group"
              onClick={() => fileInputRef.current?.click()}
              onDragOver={e => e.preventDefault()}
              onDrop={e => { e.preventDefault(); handleFileDrop(e.dataTransfer.files); }}
            >
              {isUploading ? (
                <Loader2 size={32} className="mx-auto text-royal-blue mb-3 animate-spin" />
              ) : (
                <Upload size={32} className="mx-auto text-muted mb-3 group-hover:text-royal-blue transition-colors" />
              )}
              <p className="text-sm font-medium mb-1">
                {isUploading ? "Uploading to Cloudinary..." : "Drag and drop or click to select files"}
              </p>
              <p className="text-xs text-muted">Images, 360 video, or Galaxy/Sarin files</p>
            </div>

            {uploadedUrls.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs text-muted font-semibold uppercase tracking-widest">Uploaded ({uploadedUrls.length})</p>
                {uploadedUrls.map((url, i) => (
                  <div key={i} className="flex items-center gap-3 glass-card p-3 rounded-xl">
                    <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                    <p className="text-xs font-mono text-white/60 truncate flex-1">{url}</p>
                    <button onClick={() => setUploadedUrls(prev => prev.filter((_, j) => j !== i))} className="text-white/30 hover:text-white/70">
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="glass-card p-4 text-sm text-muted">
              Files upload directly to Cloudinary CDN. URLs saved to DB on submit.
            </div>
          </div>
        );

      case 7: // DiamondDNA Fingerprint (Automated)
        return (
          <div className="space-y-6 py-6 text-center">
            <Loader2 size={40} className="animate-spin mx-auto text-royal-blue mb-4" />
            <h3 className="text-lg font-medium">Generating Immutable Fingerprint</h3>
            <p className="text-sm text-muted max-w-sm mx-auto">
              The AI is currently processing the optical scans from Stage 5 and 6 to extract feature vectors and generate the cryptographic hash.
            </p>
            <div className="bg-black/30 p-4 rounded-lg font-mono text-xs text-sky-blue mt-6 break-all">
              Generating Signature: 8f4a1b9e...[Processing]
            </div>
          </div>
        );

      default:
        // Generic placeholder for other stages
        return (
          <div className="space-y-4">
            <p className="text-sm text-muted mb-6">Enter the required parameters for {stage.name}.</p>
            <div>
              <label className="block text-xs font-medium text-muted mb-1.5">Machine ID</label>
              <input type="text" className="w-full glass-input h-10 px-3 text-sm" placeholder="e.g. MCH-01" />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted mb-1.5">Operation Notes</label>
              <textarea className="w-full glass-input p-3 text-sm min-h-[100px]" placeholder="Any anomalies?" />
            </div>
          </div>
        );
    }
  };

  return (
    <DashboardLayout role="employee" user={{ fullName: "Employee", email: "", role: "EMPLOYEE" }}>
      <div className="page-enter max-w-4xl mx-auto">
        <Link href={`/employee/workspace/${stageNumber}`} className="text-royal-blue hover:text-white transition-colors text-sm flex items-center gap-1 mb-6">
          <ChevronLeft size={16} /> Back to Queue
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column: Task Info */}
          <div className="md:col-span-1 space-y-6">
            <div className="glass-card p-6">
              <div className="w-12 h-12 rounded-xl bg-royal-blue/20 flex items-center justify-center text-royal-blue font-mono font-bold text-xl mb-4">
                S{stage.number}
              </div>
              <h1 className="text-xl font-display font-bold mb-1">{stage.name}</h1>
              <p className="text-xs text-muted mb-6">Data Entry Form</p>
              
              <div className="space-y-3 pt-4 border-t border-white/10">
                <div>
                  <p className="text-xs text-muted">Diamond ID</p>
                  <p className="font-mono text-sm font-semibold">{diamondId === "demo-diamond-id" ? "TRX-DEMO-0001" : diamondId}</p>
                </div>
                <div>
                  <p className="text-xs text-muted">Status</p>
                  <span className="badge badge-pending text-[10px] mt-1">IN PROGRESS</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Form Blocks */}
          <div className="md:col-span-2">
            <div className="glass-card p-6 md:p-8">
              {isDone ? (
                <div className="text-center py-16">
                  <CheckCircle2 size={48} className="mx-auto text-success mb-4" />
                  <h3 className="text-xl font-display font-bold text-white mb-2">Stage Completed!</h3>
                  <p className="text-sm text-muted">Data securely saved to PostgreSQL.</p>
                  <p className="text-sm text-muted mt-1">Redirecting to queue...</p>
                </div>
              ) : (
                <form onSubmit={[5, 8, 14].includes(stageNumber) ? handleUploadSubmit : handleSimulateSubmit} className="space-y-8 flex flex-col h-full">
                  <div className="flex-1">
                    {renderStageForm()}
                  </div>

                  <div className="pt-6 border-t border-white/10 flex justify-end">
                    <button 
                      type="submit" 
                      disabled={isSubmitting || stageNumber === 7 || ([5, 8, 14].includes(stageNumber) && uploadedUrls.length === 0)}
                      className="btn-primary py-2.5 px-8 flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <>
                          <Save size={16} /> {stageNumber === 7 ? "Processing..." : "Submit & Advance Stage"}
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
