"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Gem, Search, Home } from "lucide-react";
import SearchBar from "@/components/shared/search-bar";

export default function NotFound() {
  return (
    <div className="relative min-h-screen flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 text-center max-w-lg w-full"
      >
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-royal-blue/10 mb-6">
          <Gem className="w-10 h-10 text-muted" />
        </div>

        <h1 className="text-6xl font-display font-extrabold gradient-text mb-2">
          404
        </h1>
        <h2 className="text-xl font-semibold mb-2">Diamond Not Found</h2>
        <p className="text-muted text-sm mb-8">
          The diamond or page you&apos;re looking for doesn&apos;t exist or may
          have been moved.
        </p>

        {/* Search fallback */}
        <div className="mb-6">
          <SearchBar size="default" autoFocus />
        </div>

        <Link
          href="/"
          className="btn-ghost text-sm inline-flex items-center gap-2"
        >
          <Home size={14} />
          Back to Home
        </Link>
      </motion.div>
    </div>
  );
}
