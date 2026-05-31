"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRouter } from "next/navigation";
import { VIDEOS, IMAGES, normalizeMediaUrl } from "@/lib/media";
import Footer from "@/components/shared/footer";
import {
  Gem,
  Search,
  Shield,
  Fingerprint,
  Globe,
  CheckCircle2,
  ChevronRight,
  Database,
  Lock,
} from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

export default function HomePage() {
  const container = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [featuredDiamonds, setFeaturedDiamonds] = useState<any[]>([]);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    fetch("/api/diamonds/featured")
      .then((r) => r.json())
      .then((data) => setFeaturedDiamonds(data.diamonds || []))
      .catch(() => { });
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim().replace(/[\s\-_]/g, "").toUpperCase();
    if (q) router.push(`/diamond/${q}`);
  };

  const startVoiceSearch = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognitionRef.current = recognition;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);
    recognition.onresult = async (event: any) => {
      const raw = event.results[0][0].transcript.trim();
      const cleaned = raw.replace(/[\s\-_]/g, "").toUpperCase();
      setSearchQuery(cleaned);

      // Search API handles packetBarcode + roughId + diamonddnaId (incl. normalized variants)
      try {
        const res = await fetch(`/api/diamonds/search?q=${encodeURIComponent(raw)}`);
        const data = await res.json();
        if (data.diamonds?.length > 0) {
          // Prefer exact packetBarcode match if multiple results
          const exact = data.diamonds.find(
            (d: any) => d.stage3?.packetBarcode?.replace(/[^A-Z0-9]/gi, "").toUpperCase() === cleaned
          );
          router.push(`/diamond/${(exact ?? data.diamonds[0]).id}`);
          return;
        }
      } catch { /* ignore, fall through */ }

      router.push(`/diamond/${cleaned}`);
    };

    recognition.start();
  };

  useGSAP(() => {
    // Hero Elements Animation
    const tl = gsap.timeline();
    tl.fromTo(".hero-elem",
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out",
      }
    );

    // Section Titles
    gsap.utils.toArray(".section-title").forEach((title: any) => {
      gsap.fromTo(title,
        { y: 30, opacity: 0 },
        {
          scrollTrigger: {
            trigger: title,
            start: "top 85%",
          },
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power2.out"
        }
      );
    });

    // Bento Cards Animation
    gsap.fromTo(".bento-card",
      { y: 40, opacity: 0 },
      {
        scrollTrigger: {
          trigger: ".bento-grid",
          start: "top 80%",
        },
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.15,
        ease: "power2.out"
      }
    );

    // CTA Animation
    gsap.fromTo(".cta-container",
      { scale: 0.95, opacity: 0 },
      {
        scrollTrigger: {
          trigger: ".cta-section",
          start: "top 85%",
        },
        scale: 1,
        opacity: 1,
        duration: 0.8,
        ease: "power2.out"
      }
    );
  }, { scope: container });

  return (
    <div ref={container} className="relative min-h-screen bg-transparent text-[#e2e8f0] overflow-hidden font-sans">

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-6 md:px-12 py-6">
        <Link href="/" className="flex items-center gap-2">
          <Gem className="w-6 h-6 text-sky-blue" />
          <span className="font-display text-xl font-medium tracking-tight text-white">
            TraceOn
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link href="/blockchain" className="text-xs font-medium text-white/60 hover:text-white transition-colors">Diamond Tracking</Link>
        </div>

        <div className="flex items-center">
          <Link
            href="/login"
            className="text-xs font-medium py-2 px-5 rounded-full border border-white/20 hover:bg-white/5 transition-colors"
          >
            Login
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden flex flex-col items-center justify-center text-center px-6 pt-20 md:pt-32 pb-24">
        {/* Background Video */}
        <video
          autoPlay muted loop playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-70 pointer-events-none"
          style={{ filter: "brightness(1.4) contrast(1.05)" }}
          src={VIDEOS.hero}
        />
        {/* Dark cinematic overlay */}
        <div className="absolute inset-0 bg-[#050912]/40 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050912]/70 via-transparent to-[#050912]/90 pointer-events-none" />

        {/* Floating diamond — right side */}
        <div className="absolute right-4 md:right-12 top-1/2 -translate-y-1/2 pointer-events-none hidden md:block z-10 opacity-25">
          <div className="relative w-80 h-80">
            <div className="absolute inset-0 animate-spin" style={{ animationDuration: "22s", filter: "drop-shadow(0 0 12px rgba(165,215,232,0.95))" }}>
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <polygon points="50,1 99,50 50,99 1,50" fill="rgba(165,215,232,0.04)" stroke="#A5D7E8" strokeWidth="2" />
              </svg>
            </div>
            <div className="absolute inset-8 animate-spin" style={{ animationDuration: "15s", animationDirection: "reverse" }}>
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <polygon points="50,1 99,50 50,99 1,50" fill="none" stroke="#A5D7E8" strokeWidth="1.8" strokeOpacity="0.8" />
              </svg>
            </div>
            <div className="absolute inset-16">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <polygon points="50,1 99,50 50,99 1,50" fill="none" stroke="#A5D7E8" strokeWidth="2" strokeOpacity="0.6" />
              </svg>
            </div>
            <div className="absolute inset-0">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <line x1="50" y1="1" x2="50" y2="99" stroke="#A5D7E8" strokeWidth="0.8" strokeOpacity="0.5" />
                <line x1="1" y1="50" x2="99" y2="50" stroke="#A5D7E8" strokeWidth="0.8" strokeOpacity="0.5" />
                <line x1="50" y1="1" x2="99" y2="50" stroke="#A5D7E8" strokeWidth="0.5" strokeOpacity="0.35" />
                <line x1="99" y1="50" x2="50" y2="99" stroke="#A5D7E8" strokeWidth="0.5" strokeOpacity="0.35" />
                <line x1="50" y1="99" x2="1" y2="50" stroke="#A5D7E8" strokeWidth="0.5" strokeOpacity="0.35" />
                <line x1="1" y1="50" x2="50" y2="1" stroke="#A5D7E8" strokeWidth="0.5" strokeOpacity="0.35" />
              </svg>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-4 h-4 rounded-full animate-pulse" style={{ background: "#A5D7E8", boxShadow: "0 0 20px 6px rgba(165,215,232,0.8)" }} />
            </div>
          </div>
        </div>

        {/* Left accent diamond */}
        <div className="absolute left-6 md:left-12 top-1/3 pointer-events-none hidden md:block z-10 opacity-25">
          <div className="relative w-28 h-28 animate-spin" style={{ animationDuration: "30s", filter: "drop-shadow(0 0 10px rgba(165,215,232,0.9))" }}>
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <polygon points="50,1 99,50 50,99 1,50" fill="rgba(165,215,232,0.05)" stroke="#A5D7E8" strokeWidth="2.5" />
              <line x1="50" y1="1" x2="50" y2="99" stroke="#A5D7E8" strokeWidth="1" strokeOpacity="0.6" />
              <line x1="1" y1="50" x2="99" y2="50" stroke="#A5D7E8" strokeWidth="1" strokeOpacity="0.6" />
              <circle cx="50" cy="50" r="4" fill="#A5D7E8" />
            </svg>
          </div>
        </div>

        <div className="relative z-10 flex flex-col items-center w-full">

          <div className="hero-elem opacity-0 inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-8">
            <Shield className="w-3.5 h-3.5 text-sky-blue" />
            <span className="text-[10px] font-bold tracking-widest uppercase text-white/80">
              The Diamond Story
            </span>
          </div>

          <h1 className="hero-elem opacity-0 text-4xl md:text-5xl lg:text-6xl font-display font-medium tracking-tight text-white max-w-4xl leading-tight">
            The Genesis of Brilliance,<br />Digitally Documented.
          </h1>

          <p className="hero-elem opacity-0 mt-6 text-sm md:text-base text-white/60 max-w-2xl leading-relaxed">
            Securely verify the unique history and ethical journey of your gemstone through our proprietary precision tracking and provenance system.            
          </p>

          {/* Inline Search Bar */}
          <div className="hero-elem opacity-0 mt-8 md:mt-12 w-full max-w-2xl px-2 md:px-0">
            <form onSubmit={handleSearch} className="relative flex items-center p-1 md:p-1.5 rounded-2xl border border-white/10 bg-[#0B1526]/80 backdrop-blur-xl shadow-2xl">
              <div className="pl-2 md:pl-4 pr-1 md:pr-2 text-white/40 shrink-0">
                <Search size={16} className="md:w-[18px] md:h-[18px]" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value.toUpperCase())}
                placeholder="Diamond ID (e.g. TR-54231...)"
                className="flex-1 min-w-0 bg-transparent border-none outline-none text-xs md:text-sm text-white placeholder:text-white/30 h-10 md:h-12 uppercase"
              />
              <button
                type="button"
                onClick={startVoiceSearch}
                title={isListening ? "Stop listening" : "Search by voice"}
                className={`h-8 w-8 md:h-10 md:w-10 rounded-lg md:rounded-xl flex items-center justify-center mr-1 transition-all shrink-0 ${isListening
                  ? "bg-red-500/20 border border-red-500/40 text-red-400 animate-pulse"
                  : "bg-white/5 hover:bg-white/10 text-white/50 hover:text-white/80"
                  }`}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="md:w-4 md:h-4">
                  <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                  <line x1="12" y1="19" x2="12" y2="23" />
                  <line x1="8" y1="23" x2="16" y2="23" />
                </svg>
              </button>
              <button
                type="submit"
                className="h-10 md:h-12 px-3 md:px-6 rounded-lg md:rounded-xl bg-sky-blue/10 hover:bg-sky-blue/20 text-sky-blue text-xs md:text-sm font-semibold transition-colors whitespace-nowrap shrink-0"
              >
                Trace
              </button>
            </form>
          </div>

          {/* 3 Stats */}
          <div className="hero-elem opacity-0 mt-10 md:mt-16 grid grid-cols-3 gap-4 md:gap-16 text-center">
            <div className="flex flex-col items-center">
              <div className="text-xl md:text-3xl font-display font-medium text-sky-blue">1.2M+</div>
              <div className="text-[8px] md:text-[9px] font-bold tracking-widest uppercase text-white/40 mt-1">Stones Tracked</div>
            </div>
            <div className="flex flex-col items-center border-x border-white/10 px-2 md:px-8">
              <div className="text-xl md:text-3xl font-display font-medium text-sky-blue">100%</div>
              <div className="text-[8px] md:text-[9px] font-bold tracking-widest uppercase text-white/40 mt-1">Ethical Verified</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-xl md:text-3xl font-display font-medium text-sky-blue">0ms</div>
              <div className="text-[8px] md:text-[9px] font-bold tracking-widest uppercase text-white/40 mt-1">Latency Ledger</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 px-6 md:px-12 py-24 bg-[#050B14]">
        <div className="section-title opacity-0 text-center mb-16">
          <h2 className="text-2xl md:text-3xl font-display font-medium text-white">
            Uncompromising Transparency
          </h2>
          <p className="mt-4 text-sm text-white/50 max-w-xl mx-auto">
            From the deepest mines to the master jeweler&apos;s bench, every touchpoint is
            recorded on an immutable ledger.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="bento-grid max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Card 1: Precision Blockchain */}
          <div className="bento-card opacity-0 md:col-span-2 relative overflow-hidden rounded-3xl border border-sky-blue/10 bg-gradient-to-br from-white/[0.03] to-transparent p-8 md:p-12 group">
            {/* Glow behind diamond */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-72 h-72 bg-sky-blue/10 blur-3xl rounded-full pointer-events-none" />
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-72 h-72 opacity-60 pointer-events-none transition-opacity duration-700 group-hover:opacity-90">
              <svg viewBox="0 0 100 100" className="w-full h-full text-sky-blue drop-shadow-[0_0_20px_rgba(165,215,232,0.5)]">
                {/* Outer diamond */}
                <polygon points="50,4 96,50 50,96 4,50" fill="none" stroke="currentColor" strokeWidth="1.2" opacity="0.9" />
                {/* Mid diamond */}
                <polygon points="50,16 84,50 50,84 16,50" fill="none" stroke="currentColor" strokeWidth="0.7" opacity="0.6" />
                {/* Inner diamond */}
                <polygon points="50,28 72,50 50,72 28,50" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.4" />
                {/* Cross lines */}
                <line x1="50" y1="4" x2="50" y2="96" stroke="currentColor" strokeWidth="0.4" opacity="0.4" />
                <line x1="4" y1="50" x2="96" y2="50" stroke="currentColor" strokeWidth="0.4" opacity="0.4" />
                {/* Diagonal facet lines */}
                <line x1="50" y1="4" x2="96" y2="50" stroke="currentColor" strokeWidth="0.3" opacity="0.25" />
                <line x1="96" y1="50" x2="50" y2="96" stroke="currentColor" strokeWidth="0.3" opacity="0.25" />
                <line x1="50" y1="96" x2="4" y2="50" stroke="currentColor" strokeWidth="0.3" opacity="0.25" />
                <line x1="4" y1="50" x2="50" y2="4" stroke="currentColor" strokeWidth="0.3" opacity="0.25" />
                {/* Center dot */}
                <circle cx="50" cy="50" r="2" fill="currentColor" opacity="0.8" />
              </svg>
            </div>

            <div className="relative z-10 w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-6 border border-white/10">
              <Database className="w-5 h-5 text-white" />
            </div>

            <h3 className="text-xl font-display font-medium text-white mb-4">
              Precision Security
            </h3>
            <p className="text-sm text-white/50 max-w-sm leading-relaxed mb-8">
              Our private blockchain infrastructure ensures that every stone's
              identity is unique and impossible to duplicate. Every grading report,
              laser inscription, and transaction is timestamped and
              cryptographically secured.
            </p>

            <div className="flex flex-wrap gap-3">
              <div className="px-4 py-2 rounded-lg bg-white/5 border border-white/5 text-[10px] font-semibold tracking-wide text-white/70">
                Immutable Ledger
              </div>
              <div className="px-4 py-2 rounded-lg bg-white/5 border border-white/5 text-[10px] font-semibold tracking-wide text-white/70">
                E2E Encryption
              </div>
            </div>
          </div>

          {/* Card 2: Fingerprinting */}
          <div className="bento-card opacity-0 md:col-span-1 rounded-3xl border border-white/5 bg-[#0B1526]/50 p-8 flex flex-col items-center text-center justify-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-b from-sky-blue/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="relative z-10 w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-6 border border-white/10">
              <Fingerprint className="w-5 h-5 text-white" />
            </div>
            <h3 className="relative z-10 text-lg font-display font-medium text-white mb-3">
              Digital Atelier Fingerprinting
            </h3>
            <p className="relative z-10 text-xs text-white/50 leading-relaxed mb-8">
              We capture high-resolution microscopic
              "heartbeat" data for every stone, creating a
              unique digital twin that allows for verification
              without invasive testing.
            </p>

            {/* Visual Element */}
            <div className="relative z-10 w-24 h-24 rounded-full border border-white/10 flex items-center justify-center bg-[#070e17]">
              <div className="absolute w-12 h-12 rounded-full border border-sky-blue/30 animate-ping" />
              <Fingerprint className="w-8 h-8 text-sky-blue/60" />
            </div>
          </div>

          {/* Card 3: Traceability Beyond Borders */}
          <div className="bento-card opacity-0 md:col-span-3 rounded-3xl border border-white/5 bg-[#070e17] overflow-hidden flex flex-col md:flex-row group">
            <div className="flex-1 p-8 md:p-12 flex flex-col justify-center">
              <h3 className="text-xl font-display font-medium text-white mb-4">
                Traceability Beyond Borders
              </h3>
              <p className="text-sm text-white/50 leading-relaxed mb-8 max-w-md">
                TraceOn partners with ethically-minded mines globally to ensure
                that every diamond is sourced under the strictest humanitarian
                guidelines.
              </p>

              <ul className="space-y-4">
                {[
                  "Zero-Conflict Sourcing Guaranteed",
                  "Carbon-Neutral Logistic Channels",
                  "Direct Miner Equity Programs"
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-sm text-white/80">
                    <CheckCircle2 className="w-4 h-4 text-sky-blue" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="w-full md:w-[45%] min-h-[300px] relative">
              <img
                src={IMAGES.diamonds["RGH-26-011"].rough}
                alt="Rough Diamond RGH-26-011"
                className="absolute inset-0 w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#070e17] to-transparent hidden md:block" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#070e17] to-transparent block md:hidden" />
            </div>
          </div>

        </div>
      </section>

      {/* Diamond Gallery Section */}
      <section className="relative z-10 px-6 md:px-12 py-24 bg-transparent">
        <div className="section-title opacity-0 text-center mb-16">
          <h2 className="text-2xl md:text-3xl font-display font-medium text-white">
            From Rough to Radiant
          </h2>
          <p className="mt-4 text-sm text-white/50 max-w-xl mx-auto">
            Real stones. Real journey. Every image is authenticated.
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredDiamonds.length === 0 && Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-3xl overflow-hidden border border-white/5 bg-[#0B1526]/40 animate-pulse">
              <div className="h-64 bg-white/5 rounded-t-3xl" />
              <div className="p-5 space-y-3">
                <div className="flex justify-between">
                  <div className="h-2.5 w-24 bg-white/10 rounded-full" />
                  <div className="h-2.5 w-14 bg-white/10 rounded-full" />
                </div>
                <div className="grid grid-cols-3 gap-3 pt-1">
                  <div className="h-8 bg-white/5 rounded-xl" />
                  <div className="h-8 bg-white/5 rounded-xl" />
                  <div className="h-8 bg-white/5 rounded-xl" />
                </div>
                <div className="flex justify-between pt-1">
                  <div className="h-2 w-16 bg-white/10 rounded-full" />
                  <div className="h-2 w-20 bg-white/10 rounded-full" />
                </div>
              </div>
            </div>
          ))}
          {featuredDiamonds.map((diamond) => {
            const staticImgs = (IMAGES.diamonds as Record<string, { rough: string; polished: string }>)[diamond.roughId];
            const roughImg = staticImgs?.rough ?? (Array.isArray(diamond.stage5?.rawImageUrls) ? normalizeMediaUrl(diamond.stage5.rawImageUrls[0]) : null);
            const polishedImg = staticImgs?.polished ?? (Array.isArray(diamond.stage14?.finalImageSet) ? normalizeMediaUrl(diamond.stage14.finalImageSet[0]) : null);
            const carat = diamond.stage13?.finalCarat ?? "—";
            const color = diamond.stage13?.finalColor ?? "—";
            const clarity = diamond.stage13?.finalClarity ?? "—";
            const origin = diamond.stage1?.originCountry ?? "—";

            return (
              <Link
                key={diamond.id}
                href={`/diamond/${diamond.roughId}`}
                className="group relative rounded-3xl overflow-hidden border border-white/5 bg-[#0B1526]/40 hover:border-sky-blue/20 transition-all duration-500"
              >
                <div className="relative h-64 overflow-hidden bg-[#070e17]">
                  {polishedImg && (
                    <img
                      src={polishedImg}
                      alt={`Polished ${diamond.roughId}`}
                      className="absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:opacity-0"
                    />
                  )}
                  {roughImg && (
                    <img
                      src={roughImg}
                      alt={`Rough ${diamond.roughId}`}
                      className="absolute inset-0 w-full h-full object-cover opacity-0 transition-all duration-700 group-hover:opacity-100"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B1526] via-transparent to-transparent" />
                  <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-[9px] font-bold tracking-widest uppercase text-white/60">
                    Hover: Rough
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-mono text-sky-blue/70 uppercase tracking-widest">{diamond.roughId}</span>
                    <span className="px-2 py-0.5 rounded border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 text-[9px] font-bold uppercase tracking-wider">Verified</span>
                  </div>

                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div>
                      <div className="text-base font-display font-medium text-white">{carat}ct</div>
                      <div className="text-[9px] text-white/40 uppercase tracking-wider mt-0.5">Carat</div>
                    </div>
                    <div>
                      <div className="text-base font-display font-medium text-white">{color}</div>
                      <div className="text-[9px] text-white/40 uppercase tracking-wider mt-0.5">Color</div>
                    </div>
                    <div>
                      <div className="text-base font-display font-medium text-white">{clarity}</div>
                      <div className="text-[9px] text-white/40 uppercase tracking-wider mt-0.5">Clarity</div>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xs text-white/40">{origin}</span>
                    <span className="text-xs text-sky-blue/70 group-hover:text-sky-blue transition-colors flex items-center gap-1">
                      View Journey <ChevronRight size={12} />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}

          {/* Planning video showcase card */}
          <div className="relative rounded-3xl overflow-hidden border border-white/5 bg-[#0B1526]/40 group">
            <div className="relative h-64 overflow-hidden">
              <video
                src={VIDEOS.planning["ABT077-1"]}
                autoPlay muted loop playsInline
                className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B1526] via-transparent to-transparent" />
            </div>
            <div className="p-5">
              <div className="text-[10px] font-mono text-sky-blue/70 uppercase tracking-widest mb-2">Planning Video</div>
              <p className="text-sm text-white/70 font-medium">Diamond Planning Process</p>
              <p className="text-xs text-white/40 mt-1">Live footage from our certified atelier</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section relative z-10 px-6 md:px-12 py-32 bg-[#070e17] flex justify-center">
        <div className="cta-container opacity-0 w-full max-w-4xl rounded-[2.5rem] bg-gradient-to-b from-[#0B1526] to-[#070e17] border border-white/5 p-8 md:p-20 text-center relative overflow-hidden">
          {/* Subtle top glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-24 bg-sky-blue/5 blur-3xl rounded-full" />

          <h2 className="relative z-10 text-3xl md:text-4xl font-display font-medium text-white mb-4">
            Protect Your Legacy.
          </h2>
          <p className="relative z-10 text-sm text-white/50 max-w-lg mx-auto mb-10 leading-relaxed">
            Whether you are an atelier, a retailer, or a private owner, TraceOn provides the
            ultimate assurance for the world&apos;s most precious assets.
          </p>

          <div className="relative z-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/search"
              className="px-8 py-3 rounded-xl bg-[#A5D7E8] hover:bg-[#8EC6DA] text-[#070e17] text-sm font-semibold transition-colors"
            >
              Get Started Today
            </Link>
            <Link
              href="/about"
              className="px-8 py-3 rounded-xl border border-white/20 text-white text-sm font-medium hover:bg-white/5 transition-colors"
            >
              Contact Our Atelier
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
