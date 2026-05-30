"use client";

import { useRef, useState, useEffect } from "react";
import { IMAGES } from "@/lib/media";
import Footer from "@/components/shared/footer";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Gem,
  ArrowLeft,
  Shield,
  Database,
  Lock,
  Search,
  Fingerprint,
  Network,
  Cpu,
  Activity,
  Clock,
  CheckCircle2,
  Terminal,
  X,
  RefreshCw,
  Radio,
  ArrowRight,
  HardDrive
} from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

interface Block {
  title: string;
  height: number;
  data: string;
  prev: string;
  hash: string;
  validator: string;
  signature: string;
  timestamp: string;
  gas: string;
}

const blocksData: Block[] = [
  {
    title: "Rough Extraction",
    height: 104921,
    data: "Origin: Botswana (Letlhakane Mine), Rough Weight: 4.52ct, Mine-ID: LTH-921",
    prev: "0000000000000000000000000000000000000000000000000000000000000000",
    hash: "0x8f43a9e7b2c1d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9",
    validator: "Botswana Diamond Trust (BDT-VAL-01)",
    signature: "sig_8ef29ab48f3211ca883ee01a3cf9a22d881bc332f",
    timestamp: "2026-05-10 08:34:12 UTC",
    gas: "21,000"
  },
  {
    title: "Laser Scanning",
    height: 104922,
    data: "3D Inclusions Map: Complete, Internal Flaws: 2 (Grade VS2 estimate), Planners Assigned: 3",
    prev: "0x8f43a9e7b2c1d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9",
    hash: "0x1a7b4c2d3e4f5g6h7i8j9k0l1m2n3o4p5q6r7s8t9u0v1w2x3y4z5a6b7c8d9e0f",
    validator: "Antwerp Atelier Labs (AAL-VAL-04)",
    signature: "sig_d892eef11082aa993cbef4809ba822de3b4cf78ae",
    timestamp: "2026-05-14 14:22:45 UTC",
    gas: "23,150"
  },
  {
    title: "Final Polish",
    height: 104923,
    data: "Cut Grade: Ideal, Polish Rating: Excellent, Symmetry: Excellent, Final Carat: 2.10ct",
    prev: "0x1a7b4c2d3e4f5g6h7i8j9k0l1m2n3o4p5q6r7s8t9u0v1w2x3y4z5a6b7c8d9e0f",
    hash: "0x9d2e1f5a4b3c2d1e0f9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e",
    validator: "TraceOn Master Polishing (TMP-VAL-12)",
    signature: "sig_fa88cc021b33948da4cc8823ee9fa223b2dc789bb",
    timestamp: "2026-05-19 11:05:01 UTC",
    gas: "22,400"
  },
  {
    title: "GIA Certification",
    height: 104924,
    data: "Official Certificate ID: GIA-74921200, Color Grade: D, Clarity: Flawless (FL), Cut: Excellent",
    prev: "0x9d2e1f5a4b3c2d1e0f9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e",
    hash: "0x3b8d2a1c9e4f5g6h7i8j9k0l1m2n3o4p5q6r7s8t9u0v1w2x3y4z5a6b7c8d9e0f",
    validator: "GIA Central Registry Node (GIA-VAL-02)",
    signature: "sig_7721bcdd8f30bb2a4dc8aefee8a2dc331b289cf32",
    timestamp: "2026-05-24 16:40:59 UTC",
    gas: "28,900"
  },
];

export default function BlockchainPage() {
  const container = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Simulated live ledger telemetry states
  const [ledgerHeight, setLedgerHeight] = useState(452192);
  const [hashRate, setHashRate] = useState(14.24);
  const [activeValidators, setActiveValidators] = useState(24);
  const [countdown, setCountdown] = useState(8);

  // Horizontal scroll tracking states
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Ledger Verification console states
  const [selectedBlock, setSelectedBlock] = useState<Block | null>(null);
  const [verificationStage, setVerificationStage] = useState<"idle" | "connecting" | "decoding" | "success">("idle");
  const [scrambledHash, setScrambledHash] = useState("");
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);

  // Fluctuating network telemetry ticks
  useEffect(() => {
    const timer = setInterval(() => {
      setLedgerHeight(prev => prev + (Math.random() > 0.88 ? 1 : 0));

      setHashRate(prev => {
        const delta = (Math.random() - 0.5) * 0.12;
        return parseFloat(Math.max(13.9, Math.min(14.6, prev + delta)).toFixed(2));
      });

      setActiveValidators(prev => {
        if (Math.random() > 0.96) {
          return prev === 24 ? 23 : 24;
        }
        return prev;
      });

      setCountdown(prev => {
        if (prev <= 1) {
          return Math.floor(Math.random() * 4) + 7; // Reset between 7-10s
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Track horizontal scroll events to determine active card and calculate spin progress
  const handleTimelineScroll = () => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    // Calculate overall scroll progress from 0 to 1
    const maxScroll = scrollContainer.scrollWidth - scrollContainer.clientWidth;
    const progress = maxScroll > 0 ? scrollContainer.scrollLeft / maxScroll : 0;
    setScrollProgress(progress);

    // Determine which card is closest to the horizontal center of the viewport
    const cards = scrollContainer.querySelectorAll(".hash-block");
    let closestIndex = 0;
    let minDistance = Infinity;

    cards.forEach((card, idx) => {
      const rect = card.getBoundingClientRect();
      const cardCenter = rect.left + rect.width / 2;
      const viewportCenter = window.innerWidth / 2;
      const distance = Math.abs(cardCenter - viewportCenter);

      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = idx;
      }
    });

    if (closestIndex !== activeCardIndex) {
      setActiveCardIndex(closestIndex);
    }
  };

  // Sync scroll listener on mount
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleTimelineScroll);
      // Run once initially to set the correct active index
      handleTimelineScroll();
    }
    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener("scroll", handleTimelineScroll);
      }
    };
  }, [activeCardIndex]);

  // Diagnostic hash scrambling logic
  useEffect(() => {
    if (verificationStage !== "decoding" || !selectedBlock) return;

    let scrambleCount = 0;
    const maxScrambles = 16;
    const targetHash = selectedBlock.hash;
    const hashChars = targetHash.split("");

    const interval = setInterval(() => {
      scrambleCount++;
      const progressFraction = scrambleCount / maxScrambles;
      const charsToResolve = Math.floor(hashChars.length * progressFraction);

      const nextScrambled = hashChars.map((char, idx) => {
        if (idx < charsToResolve) return char;
        const hexAlphabet = "0123456789abcdef";
        return hexAlphabet[Math.floor(Math.random() * hexAlphabet.length)];
      }).join("");

      setScrambledHash(nextScrambled);

      // Sequentially inject diagnostic logs
      if (scrambleCount === 4) {
        setTerminalLogs(prev => [
          ...prev,
          `[SEC] Scanning cryptographic signatures...`,
          `[SEC] Merkle Path Verification: SUCCESS`
        ]);
      } else if (scrambleCount === 8) {
        setTerminalLogs(prev => [
          ...prev,
          `[CRYPT] Parsing RSA Miner Signature: ${selectedBlock.signature.substring(0, 18)}...`,
          `[CRYPT] Double-hashing block payload data...`
        ]);
      } else if (scrambleCount === 12) {
        setTerminalLogs(prev => [
          ...prev,
          `[CONSENSUS] Querying online validators...`,
          `[CONSENSUS] Agreement achieved: 24/24 nodes sync confirmed.`
        ]);
      }

      if (scrambleCount >= maxScrambles) {
        clearInterval(interval);
        setVerificationStage("success");
        setTerminalLogs(prev => [
          ...prev,
          `[SYS] Block #${selectedBlock.height} hash validated successfully.`,
          `[SUCCESS] STATUS: IMMUTABLE, SECURED & AUDITED.`
        ]);
      }
    }, 120);

    return () => clearInterval(interval);
  }, [verificationStage, selectedBlock]);

  const startVerification = (block: Block) => {
    setSelectedBlock(block);
    setVerificationStage("connecting");
    setTerminalLogs([`[SYS] Triggering manual cryptographic audit on Block #${block.height}...`]);
    setScrambledHash("------------------------------------------------------------------");

    // Simulate connection lag
    setTimeout(() => {
      setVerificationStage("decoding");
      setTerminalLogs(prev => [
        ...prev,
        `[NET] Handshake complete. Peer: ${block.validator}`,
        `[SYS] Downloading block payload and transaction metadata...`,
      ]);
    }, 600);
  };

  useGSAP(() => {
    // Hero Elements Fade In
    gsap.fromTo(".hero-elem",
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.12,
        ease: "power3.out",
      }
    );

    // Telemetry widgets entrance
    gsap.fromTo(".telemetry-widget",
      { y: 20, opacity: 0, scale: 0.95 },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.7,
        stagger: 0.08,
        ease: "power2.out",
        delay: 0.3
      }
    );

    // Bento grids scroll trigger entry
    gsap.fromTo(".bento-card",
      { y: 40, opacity: 0 },
      {
        scrollTrigger: {
          trigger: ".bento-grid",
          start: "top 85%",
        },
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.15,
        ease: "power2.out"
      }
    );

    // Timeline elements entrance
    gsap.fromTo(".hash-block",
      { opacity: 0, scale: 0.9, y: 15 },
      {
        scrollTrigger: {
          trigger: "#timeline-section",
          start: "top 80%",
        },
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.12,
        ease: "power2.out"
      }
    );

    // Diamond Bounce Animation
    gsap.to(".diamond-bounce", {
      y: -10,
      duration: 1.8,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut"
    });

  }, { scope: container });

  return (
    <div ref={container} className="relative min-h-screen bg-transparent text-[#e2e8f0] font-sans">

      {/* Top Futuristic Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-6 md:px-12 py-6 border-b border-white/5 backdrop-blur-md">
        <Link href="/" className="flex items-center gap-2">
          <Gem className="w-6 h-6 text-sky-blue" />
          <span className="font-display text-xl font-medium tracking-tight text-white">
            TraceOn
          </span>
        </Link>
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-[9px] font-bold text-emerald-400 tracking-wider uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            Ledger Core Online
          </div>
          <Link href="/" className="px-4 py-2 rounded-full border border-white/20 text-white/80 hover:bg-white/5 hover:text-white transition-all text-xs font-medium flex items-center gap-1.5">
            <ArrowLeft size={14} />
            Back to Home
          </Link>
        </div>
      </nav>

      {/* Hero Header */}
      <section className="relative z-10 flex flex-col items-center justify-center text-center px-6 pt-20 pb-16">
        <div className="hero-elem opacity-0 inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-8">
          <Database className="w-3.5 h-3.5 text-sky-blue animate-pulse" />
          <span className="text-[10px] font-bold tracking-widest uppercase text-white/80">
            Cryptographic Integrity Center
          </span>
        </div>

        <h1 className="hero-elem opacity-0 text-4xl md:text-5xl lg:text-6xl font-display font-medium tracking-tight text-white max-w-4xl leading-tight">
          Trust Engineered. <br />Immutable Ledger Transparency.
        </h1>

        <p className="hero-elem opacity-0 mt-6 text-sm md:text-base text-white/60 max-w-2xl leading-relaxed">
          Opaque certificates belong in the past. TraceOn relies on private decentralized ledger systems to permanently seal every stage of your diamond&apos;s journey, producing a mathematically verifiable, tamper-proof audit record.
        </p>

        <div className="hero-elem opacity-0 mt-10">
          <Link
            href="/search"
            className="px-8 py-3 inline-flex items-center gap-2 rounded-xl bg-sky-blue hover:bg-white text-[#070e17] text-sm font-semibold transition-all shadow-[0_0_20px_rgba(165,215,232,0.3)] hover:scale-105 cursor-pointer"
          >
            <Search size={16} />
            Scan Gemstone DNA
          </Link>
        </div>
      </section>

      {/* Simulated Live Ledger Telemetry HUD Dashboard */}
      <section className="relative z-10 px-6 md:px-12 pb-20">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 bg-gradient-to-b from-[#0B1526]/50 to-[#070e17]/80 rounded-[2rem] border border-white/5 p-6 backdrop-blur-xl">

            {/* Widget 1: Block Height */}
            <div className="telemetry-widget opacity-0 rounded-2xl bg-white/[0.02] border border-white/5 p-5 hover:bg-white/[0.04] transition-all">
              <div className="flex items-center gap-2 text-white/40 text-[10px] uppercase tracking-wider mb-2.5 font-semibold">
                <Cpu className="w-3.5 h-3.5 text-sky-blue" />
                Ledger Block Height
              </div>
              <p className="text-xl md:text-2xl font-mono font-medium text-white tracking-tight">
                #{ledgerHeight.toLocaleString()}
              </p>
              <div className="mt-2 text-[9px] text-sky-blue/60 flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-sky-blue animate-pulse" />
                Mining real-time node logs
              </div>
            </div>

            {/* Widget 2: Network Hashrate */}
            <div className="telemetry-widget opacity-0 rounded-2xl bg-white/[0.02] border border-white/5 p-5 hover:bg-white/[0.04] transition-all">
              <div className="flex items-center gap-2 text-white/40 text-[10px] uppercase tracking-wider mb-2.5 font-semibold">
                <Activity className="w-3.5 h-3.5 text-sky-blue" />
                Hashing Velocity
              </div>
              <p className="text-xl md:text-2xl font-mono font-medium text-white tracking-tight">
                {hashRate} GH/s
              </p>
              <div className="mt-2 text-[9px] text-white/40">
                Ledger validation latency: 0.14ms
              </div>
            </div>

            {/* Widget 3: Consensus Nodes */}
            <div className="telemetry-widget opacity-0 rounded-2xl bg-white/[0.02] border border-white/5 p-5 hover:bg-white/[0.04] transition-all">
              <div className="flex items-center gap-2 text-white/40 text-[10px] uppercase tracking-wider mb-2.5 font-semibold">
                <Network className="w-3.5 h-3.5 text-sky-blue" />
                Consensus Validators
              </div>
              <p className="text-xl md:text-2xl font-mono font-medium text-sky-blue tracking-tight">
                {activeValidators} / 24 Online
              </p>
              <div className="mt-2 text-[9px] text-emerald-400/80 flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-emerald-400" />
                Consensus agreement: 100%
              </div>
            </div>

            {/* Widget 4: Block Timer */}
            <div className="telemetry-widget opacity-0 rounded-2xl bg-white/[0.02] border border-white/5 p-5 hover:bg-white/[0.04] transition-all">
              <div className="flex items-center gap-2 text-white/40 text-[10px] uppercase tracking-wider mb-2.5 font-semibold">
                <Clock className="w-3.5 h-3.5 text-sky-blue" />
                Next Block Audit
              </div>
              <p className="text-xl md:text-2xl font-mono font-medium text-white tracking-tight">
                in {countdown}s
              </p>
              <div className="mt-2 text-[9px] text-white/40 truncate">
                Protocol: Proof-of-Brilliance
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Grid Concept Overview Section */}
      <section className="relative z-10 px-6 md:px-12 pb-32">
        <div className="bento-grid max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Bento Card 1 */}
          <div className="bento-card opacity-0 rounded-3xl border border-white/5 bg-[#0B1526]/60 p-8 md:p-12 relative overflow-hidden group hover:bg-[#0B1526]/80 transition-all">
            <div className="absolute top-0 right-0 w-32 h-32 bg-sky-blue/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-6">
              <Shield className="w-6 h-6 text-sky-blue" />
            </div>
            <h3 className="text-xl font-display font-medium text-white mb-3">
              Immutable Provenance
            </h3>
            <p className="text-sm text-white/50 leading-relaxed">
              Every event in a diamond&apos;s lifecycle—from rough mining extraction to final GIA laboratory certification—is recorded as a discrete block on our ledger. Once written, these records are forever locked. tampered records are instantly rejected by the nodes.
            </p>
          </div>

          {/* Bento Card 2 */}
          <div className="bento-card opacity-0 rounded-3xl border border-white/5 bg-[#0B1526]/60 p-8 md:p-12 relative overflow-hidden group hover:bg-[#0B1526]/80 transition-all">
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-sky-blue/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
            <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-6">
              <Fingerprint className="w-6 h-6 text-sky-blue" />
            </div>
            <h3 className="text-xl font-display font-medium text-white mb-3">
              Digital Twin Fingerprinting
            </h3>
            <p className="text-sm text-white/50 leading-relaxed">
              Paper grading certificates are easily forged, altered, or lost. By combining advanced optical microscopic scans with cryptographic hashes, we construct a virtual &quot;Digital Twin&quot; of the physical stone, permanently pairing its records with its physical DNA.
            </p>
          </div>

          {/* Bento Card 3 */}
          <div className="bento-card opacity-0 rounded-3xl border border-white/5 bg-[#0B1526]/60 p-8 md:p-12 relative overflow-hidden group hover:bg-[#0B1526]/80 transition-all md:col-span-2">
            <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-sky-blue/5 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2 pointer-events-none" />
            <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-6">
              <Network className="w-6 h-6 text-sky-blue" />
            </div>
            <h3 className="text-xl font-display font-medium text-white mb-3">
              Eradicating Opaque Sourcing
            </h3>
            <div className="grid md:grid-cols-2 gap-8">
              <p className="text-sm text-white/50 leading-relaxed">
                Conflict gems infiltrate traditional global markets due to lax batch tracking and undocumented exchanges. Blockchain institutes an absolute zero-trust verification environment.
              </p>
              <p className="text-sm text-white/50 leading-relaxed">
                If a gemstone lacks a valid genesis block signed by an approved mining entity, it cannot register on the TraceOn protocol. This creates a secure barrier protecting miners, artisans, retailers, and collectors.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* Horizontal Interactive Timeline Section (Holographic Laser Dossier Scanner) */}
      <section id="timeline-section" className="relative z-10 py-24 bg-[#050B14] border-t border-white/5 overflow-hidden w-full">
        <div className="max-w-4xl mx-auto text-center mb-10 px-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-sky-blue/20 bg-sky-blue/5 mb-4">
            <Radio className="w-3 h-3 text-sky-blue animate-pulse" />
            <span className="text-[9px] font-bold tracking-widest uppercase text-sky-blue">
              Live Ledger Stream
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-medium text-white mb-4">
            The Immutable Ledger
          </h2>
          <p className="text-sm text-white/50 max-w-2xl mx-auto">
            Swipe or scroll horizontally to browse the chronological cryptographic chain. Observe the rotating diamond scanner analyze each block node in real-time.
          </p>
          <div className="mt-6 inline-flex items-center gap-2 text-sky-blue/60 text-[10px] font-semibold uppercase tracking-widest bg-sky-blue/5 px-4 py-1.5 rounded-full border border-sky-blue/10">
            Swipe or Drag Left/Right <ArrowRight className="w-3.5 h-3.5 animate-pulse" />
          </div>
        </div>

        {/* The Pipeline Container (Clean, no lines) */}
        <div className="relative w-full flex flex-col items-center select-none h-[540px]">

          {/* Viewport-locked Floating Diamond Scanner (Centered above the row) */}
          <div className="relative w-20 h-20 z-30 pointer-events-none mb-2">
            <div className="diamond-bounce w-full h-full flex items-center justify-center">
              <div className="relative w-full h-full flex items-center justify-center">

                {/* HUD rings spinning */}
                <div className="absolute inset-[-8px] border border-sky-blue/30 rounded-full border-dashed animate-spin-slow" />
                <div className="absolute inset-[-16px] border border-royal-blue/10 rounded-full animate-[spin_10s_linear_infinite_reverse]" />

                {/* Glow aura */}
                <div className="absolute inset-0 bg-sky-blue/20 blur-xl rounded-full animate-pulse" />

                <img
                  src={IMAGES.transparentDiamond}
                  alt="Ledger core scanner"
                  className="w-[75%] h-[75%] object-contain drop-shadow-[0_0_15px_rgba(165,215,232,0.85)] z-10"
                  style={{ transform: `rotate(${scrollProgress * 720}deg)` }}
                />
              </div>
            </div>
          </div>

          {/* Vertical Scan Laser Light Cone */}
          <div className="absolute top-18 w-0.5 h-16 bg-gradient-to-b from-sky-blue/60 via-sky-blue/20 to-transparent z-20 pointer-events-none shadow-[0_0_8px_rgba(165,215,232,0.4)]" />

          {/* Horizontal Scrolling wrapper (Straight Row of Floating Dossiers) */}
          <div
            ref={scrollContainerRef}
            className="w-full overflow-x-auto flex items-center gap-10 px-[38vw] h-[440px] scroll-smooth snap-x snap-mandatory py-4 z-10"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {blocksData.map((block, i) => {
              const isActive = i === activeCardIndex;

              return (
                <div
                  key={block.height}
                  className="hash-block shrink-0 w-[320px] md:w-[350px] snap-center flex flex-col items-center relative"
                >
                  {/* Card Body */}
                  <div className={`glass-card relative border bg-[#0B1526]/85 p-6 rounded-[1.8rem] transition-all duration-500 w-full text-left ${isActive
                      ? "border-sky-blue/60 shadow-[0_0_30px_rgba(165,215,232,0.2)] scale-[1.03]"
                      : "border-white/5 opacity-40 scale-95"
                    }`}>

                    {/* Glowing Laser Scan Target Top Border */}
                    <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r transition-all duration-500 ${isActive ? "from-sky-blue via-royal-blue to-transparent shadow-[0_0_8px_rgba(165,215,232,0.8)]" : "from-white/10 to-transparent"
                      }`} />

                    {/* Header */}
                    <div className="flex items-center justify-between gap-4 mb-4">
                      <span className={`text-[10px] font-mono font-bold tracking-widest px-2.5 py-1 rounded transition-colors duration-500 ${isActive ? "text-sky-blue bg-sky-blue/10 border border-sky-blue/20" : "text-white/40 bg-white/5 border border-white/10"
                        }`}>
                        BLOCK #{block.height}
                      </span>
                      <span className="text-[9px] font-mono text-white/30">
                        {block.timestamp}
                      </span>
                    </div>

                    <h3 className="text-lg font-display font-medium text-white mb-3.5 flex items-center gap-2">
                      <Lock className={`w-4 h-4 transition-colors ${isActive ? "text-sky-blue animate-pulse" : "text-white/30"}`} />
                      {block.title}
                    </h3>

                    {/* Cryptographic payload logs */}
                    <div className="space-y-3 font-mono text-[10px] leading-relaxed text-white/60">

                      <div className="bg-black/35 border border-white/5 rounded-xl p-3">
                        <div className="text-white/30 text-[8px] uppercase tracking-wider mb-1">Payload:</div>
                        <div className="text-white/85 text-[10px]">{block.data}</div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <div className="text-white/30 text-[8px] uppercase tracking-wider mb-0.5">Gas Limit:</div>
                          <div className="text-white/85 font-sans">{block.gas}</div>
                        </div>
                        <div>
                          <div className="text-white/30 text-[8px] uppercase tracking-wider mb-0.5">Consensus Node:</div>
                          <div className="text-white/85 truncate" title={block.validator}>{block.validator.split(" ")[0]}</div>
                        </div>
                      </div>

                      <div>
                        <div className="text-white/30 text-[8px] uppercase tracking-wider mb-0.5">Prev Hash:</div>
                        <div className="text-white/40 truncate text-[9px]">{block.prev}</div>
                      </div>

                      <div>
                        <div className="text-sky-blue/80 text-[8px] uppercase tracking-wider mb-0.5 font-semibold">Block Hash Signature:</div>
                        <div className="text-sky-blue bg-sky-blue/5 border border-sky-blue/10 px-2.5 py-1.5 rounded truncate text-[9px]">
                          {block.hash}
                        </div>
                      </div>

                    </div>

                    {/* Interactive footer */}
                    <div className="mt-5 flex justify-between items-center">
                      <div className="flex items-center gap-1 text-emerald-400 text-[9px] font-semibold uppercase tracking-wider bg-emerald-500/5 px-2 py-0.5 border border-emerald-500/10 rounded">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        VERIFIED
                      </div>

                      <button
                        onClick={() => startVerification(block)}
                        className="px-3.5 py-1.5 text-[9px] font-bold uppercase tracking-widest text-[#070e17] bg-sky-blue hover:bg-white hover:shadow-[0_0_12px_rgba(255,255,255,0.4)] rounded transition-all flex items-center gap-1 cursor-pointer"
                      >
                        <Terminal className="w-2.5 h-2.5" />
                        Verify
                      </button>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* Verification Core Terminal Overlay (Modal) */}
      {selectedBlock && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md transition-all duration-300">
          <div className="w-full max-w-2xl rounded-[2rem] bg-gradient-to-b from-[#0B1526] to-[#070e17] border border-white/10 p-6 md:p-8 relative overflow-hidden shadow-[0_0_50px_rgba(165,215,232,0.15)] animate-scale-in">
            {/* Top header glow */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-sky-blue via-royal-blue to-transparent" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-20 bg-sky-blue/5 blur-2xl rounded-full" />

            {/* Close button */}
            <button
              onClick={() => setSelectedBlock(null)}
              className="absolute top-5 right-5 p-2 rounded-full border border-white/10 hover:border-white/30 text-white/50 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Modal Title */}
            <div className="flex items-center gap-3.5 mb-6">
              <div className="w-10 h-10 rounded-xl bg-sky-blue/10 border border-sky-blue/20 flex items-center justify-center shadow-[0_0_15px_rgba(165,215,232,0.15)]">
                <Terminal className="w-5 h-5 text-sky-blue" />
              </div>
              <div>
                <h3 className="text-xl font-display font-medium text-white">Ledger Verification Core</h3>
                <p className="text-xs text-white/40 font-mono">Audit protocol active for Block #{selectedBlock.height}</p>
              </div>
            </div>

            {/* Diagnostic Terminal Panel */}
            <div className="bg-black/60 rounded-2xl border border-white/5 p-5 font-mono text-xs text-white/80 space-y-4">

              {/* Telemetry info */}
              <div className="grid grid-cols-2 gap-4 pb-4 border-b border-white/5 text-[10px] text-white/40 uppercase tracking-wider">
                <div>
                  Block Node: <span className="text-white/80 font-bold font-sans">{selectedBlock.title}</span>
                </div>
                <div className="text-right">
                  System: <span className="text-white/80 font-bold font-sans">TraceOn Chain 2.0</span>
                </div>
              </div>

              {/* Hash Decoding Box */}
              <div className="bg-black/90 rounded-xl border border-white/5 p-4 relative overflow-hidden">
                <div className="text-[10px] text-sky-blue/60 uppercase tracking-widest mb-2 font-bold flex items-center gap-1.5">
                  <Activity className="w-3 h-3 text-sky-blue animate-pulse" />
                  Hashing Diagnostic Signatures:
                </div>
                <div className="text-xs text-sky-blue break-all bg-sky-blue/5 border border-sky-blue/15 p-3 rounded-lg leading-relaxed shadow-inner">
                  {scrambledHash}
                </div>
                {verificationStage === "decoding" && (
                  <div className="absolute right-4 top-4 flex items-center gap-1 bg-sky-blue/15 px-2 py-0.5 rounded text-[8px] font-bold text-sky-blue uppercase tracking-widest animate-pulse border border-sky-blue/20">
                    <RefreshCw className="w-2.5 h-2.5 animate-spin" />
                    Auditing...
                  </div>
                )}
              </div>

              {/* Diagnostic Terminal Logs */}
              <div className="h-44 overflow-y-auto space-y-2 border border-white/5 bg-black/40 rounded-xl p-4 text-[11px] leading-relaxed custom-scrollbar">
                {terminalLogs.map((log, idx) => {
                  let colorClass = "text-white/50";
                  if (log.startsWith("[SUCCESS]")) colorClass = "text-emerald-400 font-bold";
                  else if (log.startsWith("[SYS]")) colorClass = "text-white/80";
                  else if (log.startsWith("[NET]")) colorClass = "text-royal-blue-light";
                  else if (log.startsWith("[SEC]")) colorClass = "text-sky-blue-light";
                  else if (log.startsWith("[CRYPT]")) colorClass = "text-amber-300";

                  return (
                    <div key={idx} className={colorClass}>
                      {log}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Actions / Close */}
            <div className="mt-8 flex justify-between items-center">
              <div className="text-[10px] text-white/30 truncate max-w-[200px]" title={selectedBlock.validator}>
                Node: {selectedBlock.validator}
              </div>

              {verificationStage === "success" ? (
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1 px-4 py-2 border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 font-semibold tracking-wider text-[10px] uppercase rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.15)] animate-pulse">
                    <CheckCircle2 size={12} />
                    LEDGER SECURED
                  </span>
                  <button
                    onClick={() => setSelectedBlock(null)}
                    className="px-5 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-white/80 hover:text-white text-xs font-semibold tracking-wide transition-all cursor-pointer"
                  >
                    Close console
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 text-sky-blue/60 text-[9px] uppercase tracking-widest animate-pulse font-bold bg-sky-blue/5 border border-sky-blue/10 px-2.5 py-1.5 rounded">
                    <RefreshCw className="w-2.5 h-2.5 animate-spin" />
                    Hash Scramble Running
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
