"use client";

import { useState, useRef } from "react";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { motion, AnimatePresence } from "framer-motion";
import { ScanLine, Camera, Image as ImageIcon, X, ArrowRight, Loader2, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function BarcodeScannerPage() {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();

  // Simulate starting the camera
  const startScanner = () => {
    setIsScanning(true);
    setScanResult(null);

    // Simulate finding a barcode after 3 seconds
    setTimeout(() => {
      setScanResult("a1b2c3d4-e5f6-7890-abcd-ef1234567890"); // Demo barcode UUID
      setIsScanning(false);
    }, 3000);
  };

  const processScan = () => {
    setIsProcessing(true);
    // Simulate API lookup
    setTimeout(() => {
      setIsProcessing(false);
      // Route to dynamic stage form for the associated diamond
      router.push("/employee/stage/TRX-2025-00123/4");
    }, 1500);
  };

  return (
    <DashboardLayout
      role="employee"
      user={{ fullName: "Raj Kumar", email: "raj@traceon.app", role: "EMPLOYEE" }}
    >
      <div className="page-enter max-w-2xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-display font-bold">Packet Scanner</h1>
          <p className="text-sm text-muted mt-1">
            Scan the physical diamond packet barcode to log its location
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6 md:p-10 text-center"
        >
          {/* Scanner Viewfinder area */}
          <div className="relative w-full aspect-square max-w-md mx-auto mb-8 bg-black rounded-2xl overflow-hidden border border-border flex items-center justify-center">
            
            {!isScanning && !scanResult && (
              <div className="text-center p-6">
                <Camera size={48} className="text-muted mx-auto mb-4" />
                <p className="text-muted text-sm">Camera inactive</p>
              </div>
            )}

            {isScanning && (
              <div className="absolute inset-0">
                {/* Simulated camera feed background */}
                <div className="absolute inset-0 bg-navy-mid/20" />
                
                {/* Scanning animation line */}
                <motion.div
                  animate={{ top: ["0%", "100%", "0%"] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="absolute left-0 right-0 h-1 bg-sky-blue shadow-[0_0_15px_rgba(165,215,232,0.8)] z-10"
                />

                {/* Corner markers */}
                <div className="absolute inset-8 border-2 border-dashed border-white/30 rounded-lg" />
                <div className="absolute top-4 left-4 w-8 h-8 border-t-4 border-l-4 border-sky-blue rounded-tl-lg" />
                <div className="absolute top-4 right-4 w-8 h-8 border-t-4 border-r-4 border-sky-blue rounded-tr-lg" />
                <div className="absolute bottom-4 left-4 w-8 h-8 border-b-4 border-l-4 border-sky-blue rounded-bl-lg" />
                <div className="absolute bottom-4 right-4 w-8 h-8 border-b-4 border-r-4 border-sky-blue rounded-br-lg" />
                
                <div className="absolute bottom-6 left-0 right-0 text-center text-sm text-white font-medium drop-shadow-md">
                  Align barcode within frame
                </div>
              </div>
            )}

            {scanResult && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="absolute inset-0 bg-success/20 flex flex-col items-center justify-center p-6"
              >
                <div className="w-16 h-16 rounded-full bg-success text-navy-deep flex items-center justify-center mb-4">
                  <CheckCircle2 size={32} />
                </div>
                <p className="text-white font-semibold text-lg mb-2">Barcode Captured</p>
                <p className="text-xs font-mono text-white/80 break-all bg-black/40 p-2 rounded w-full">
                  {scanResult}
                </p>
              </motion.div>
            )}
          </div>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {!isScanning && !scanResult && (
              <>
                <button
                  onClick={startScanner}
                  className="btn-primary py-3 px-8 flex items-center justify-center gap-2"
                >
                  <ScanLine size={18} />
                  Start Camera Scanner
                </button>
                <button className="btn-ghost py-3 px-8 flex items-center justify-center gap-2">
                  <ImageIcon size={18} />
                  Upload Image
                </button>
              </>
            )}

            {isScanning && (
              <button
                onClick={() => setIsScanning(false)}
                className="btn-ghost py-3 px-8 flex items-center justify-center gap-2"
              >
                <X size={18} />
                Cancel Scan
              </button>
            )}

            {scanResult && (
              <>
                <button
                  onClick={() => setScanResult(null)}
                  className="btn-ghost py-3 px-6"
                  disabled={isProcessing}
                >
                  Rescan
                </button>
                <button
                  onClick={processScan}
                  disabled={isProcessing}
                  className="btn-primary py-3 px-8 flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <>
                      Process Packet <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
