"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Gem,
  Shield,
  Fingerprint,
  Globe,
  Layers,
  Sparkles,
  Eye,
  ChevronLeft,
} from "lucide-react";
import ParticleField from "@/components/shared/particle-field";

const values = [
  { icon: Shield, title: "Trust", desc: "Every data point is audited, hashed, and blockchain-ready." },
  { icon: Fingerprint, title: "Identity", desc: "DiamondDNA creates a permanent, unique digital fingerprint." },
  { icon: Eye, title: "Transparency", desc: "Public journey pages let anyone verify a diamond's story." },
  { icon: Layers, title: "Precision", desc: "14 stages of meticulous tracking from rough to polish." },
];

export default function AboutPage() {
  return (
    <div className="relative min-h-screen">
      <nav className="relative z-10 flex items-center justify-between px-6 md:px-12 py-4">
        <Link href="/" className="flex items-center gap-2">
          <Gem className="w-6 h-6 text-sky-blue" />
          <span className="font-display text-lg font-bold">
            TRACE<span className="text-sky-blue">ON</span>
          </span>
        </Link>
        <Link href="/" className="btn-ghost text-xs py-2 px-3 flex items-center gap-1.5">
          <ChevronLeft size={14} />
          Home
        </Link>
      </nav>

      <section className="relative z-10 px-6 md:px-12 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-sky-blue/15 mb-6">
            <Sparkles className="w-8 h-8 text-sky-blue glow-icon" />
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-extrabold mb-4">
            About <span className="gradient-text">Traceon</span>
          </h1>
          <p className="text-lg text-muted leading-relaxed max-w-2xl mx-auto">
            Traceon is a next-generation diamond traceability platform built by
            DiamondDNA. We combine advanced optical fingerprinting, blockchain
            verification, and luxury design to create the most transparent
            diamond ecosystem in the world.
          </p>
        </motion.div>
      </section>

      <section className="relative z-10 px-6 md:px-12 py-12">
        <div className="max-w-4xl mx-auto grid sm:grid-cols-2 gap-6">
          {values.map((v, i) => (
            <motion.div
              key={v.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-6"
            >
              <v.icon className="w-8 h-8 text-sky-blue mb-3" />
              <h3 className="text-lg font-semibold mb-2">{v.title}</h3>
              <p className="text-sm text-muted">{v.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="relative z-10 px-6 md:px-12 py-16 text-center">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto"
        >
          <blockquote className="text-2xl md:text-3xl font-display font-bold italic gradient-text leading-snug">
            &ldquo;From Earth to Eternity — Every Diamond Has a Story.&rdquo;
          </blockquote>
          <p className="text-sm text-muted mt-4">— DiamondDNA</p>
        </motion.div>
      </section>

      <footer className="relative z-10 border-t border-border px-6 md:px-12 py-8 text-center">
        <p className="text-xs text-muted">
          Traceon · © {new Date().getFullYear()} · All Rights Reserved
        </p>
      </footer>
    </div>
  );
}
