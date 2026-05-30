"use client";

import Link from "next/link";
import { Gem, Globe, Shield, Fingerprint } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative z-10 bg-[#1e2638]/40 border-t border-white/5 px-6 md:px-12 py-4">
      <div className="max-w-6xl mx-auto flex flex-col items-center gap-3">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2">
          <Gem className="w-4 h-4 text-sky-blue" />
          <span className="font-display text-sm font-medium text-white">TraceOn</span>
        </Link>

        {/* Navigation Links */}
        <div className="flex flex-wrap justify-center gap-6 md:gap-10">
          <Link href="/about" className="text-xs text-white/50 hover:text-white transition-colors">About</Link>
          <Link href="/search" className="text-xs text-white/50 hover:text-white transition-colors">Search Diamond</Link>
          <Link href="/blockchain" className="text-xs text-white/50 hover:text-white transition-colors">Blockchain</Link>
        </div>

        {/* Social Icons */}
        <div className="flex items-center gap-4 text-white/40">
          <Globe className="w-4 h-4 hover:text-white cursor-pointer transition-colors" />
          <Shield className="w-4 h-4 hover:text-white cursor-pointer transition-colors" />
          <Fingerprint className="w-4 h-4 hover:text-white cursor-pointer transition-colors" />
        </div>

        {/* Copyright */}
        <div className="text-[10px] text-white/30">
          © {new Date().getFullYear()} TraceOn Ateliers. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
