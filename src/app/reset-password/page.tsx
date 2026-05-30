"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Gem, ChevronLeft, AlertCircle, Mail, Key } from "lucide-react";
import Link from "next/link";
import ParticleField from "@/components/shared/particle-field";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    // Simulate API call
    setTimeout(() => {
      setStatus("success");
      setMessage("If an account exists for that email, a password reset link has been sent.");
    }, 1500);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md"
      >
        <Link
          href="/login"
          className="inline-flex items-center gap-1 text-sm text-muted hover:text-white transition-colors mb-8"
        >
          <ChevronLeft size={16} />
          Back to Login
        </Link>

        <div className="glass-card p-8 md:p-10">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-royal-blue/15 mb-4">
              <Key className="w-8 h-8 text-sky-blue glow-icon" />
            </div>
            <h1 className="text-2xl font-display font-bold">Reset Password</h1>
            <p className="text-sm text-muted mt-1">
              Enter your email to receive a reset link
            </p>
          </div>

          {status === "success" ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <div className="w-12 h-12 rounded-full bg-success/20 text-success flex items-center justify-center mx-auto mb-4">
                <Mail size={24} />
              </div>
              <p className="text-sm text-white mb-6 leading-relaxed">
                {message}
              </p>
              <button
                onClick={() => setStatus("idle")}
                className="text-sm text-sky-blue hover:text-sky-blue-light"
              >
                Try another email
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {status === "error" && (
                <div className="flex items-start gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm mb-6">
                  <AlertCircle size={16} className="shrink-0 mt-0.5" />
                  <p>{message}</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-muted mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  required
                  className="w-full glass-input h-11 px-4 text-sm"
                />
              </div>

              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full btn-primary h-11 text-sm font-semibold flex items-center justify-center"
              >
                {status === "loading" ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  "Send Reset Link"
                )}
              </button>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}
