"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Shield, ChevronLeft, AlertCircle, KeyRound } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ParticleField from "@/components/shared/particle-field";

export default function SuperAdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mfaCode, setMfaCode] = useState("");
  const [step, setStep] = useState<"credentials" | "mfa">("credentials");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed");
        setIsLoading(false);
        return;
      }

      if (data.user.role !== "SUPER_ADMIN") {
        setError("Unauthorized: Not a Super Admin account");
        setIsLoading(false);
        return;
      }

      // Success! Move to MFA step. 
      // (The API already set the secure cookies, but we enforce the MFA UI step before redirecting)
      setIsLoading(false);
      setStep("mfa");
    } catch {
      setError("Network error. Please try again.");
      setIsLoading(false);
    }
  };

  const handleMfaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Simulate MFA verification delay
    setTimeout(() => {
      setIsLoading(false);
      router.push("/superadmin");
    }, 1000);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 bg-transparent">
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
          Back to standard login
        </Link>

        <div className="glass-card p-8 md:p-10 border-destructive/20 relative overflow-hidden">
          {/* Top accent bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-destructive to-orange-500" />

          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-destructive/10 mb-4 border border-destructive/20">
              <Shield className="w-8 h-8 text-destructive glow-icon" />
            </div>
            <h1 className="text-2xl font-display font-bold">
              Super Admin Access
            </h1>
            <p className="text-sm text-muted mt-1">
              Restricted platform management
            </p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm mb-6"
            >
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <p>{error}</p>
            </motion.div>
          )}

          {step === "credentials" ? (
            <form onSubmit={handleCredentialsSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-muted mb-1.5">
                  Admin Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@traceon.app"
                  required
                  className="w-full glass-input h-11 px-4 text-sm focus:border-destructive/50 focus:ring-destructive/20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-muted mb-1.5">
                  Master Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full glass-input h-11 px-4 text-sm focus:border-destructive/50 focus:ring-destructive/20"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full btn-primary h-11 text-sm font-semibold flex items-center justify-center bg-destructive hover:bg-destructive/90 shadow-[0_0_15px_rgba(220,38,38,0.3)]"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  "Verify Credentials"
                )}
              </button>
            </form>
          ) : (
            <motion.form
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              onSubmit={handleMfaSubmit}
              className="space-y-5"
            >
              <div className="text-center p-4 bg-navy-mid/30 rounded-lg border border-border mb-6">
                <KeyRound size={24} className="text-muted mx-auto mb-2" />
                <p className="text-sm">
                  Enter the 6-digit code sent to your registered authenticator device.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-muted mb-1.5 text-center">
                  Authentication Code
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={mfaCode}
                  onChange={(e) => setMfaCode(e.target.value.replace(/[^0-9]/g, ""))}
                  placeholder="000000"
                  required
                  className="w-full glass-input h-14 px-4 text-2xl tracking-[0.5em] text-center font-mono focus:border-destructive/50 focus:ring-destructive/20"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading || mfaCode.length !== 6}
                className="w-full btn-primary h-11 text-sm font-semibold flex items-center justify-center bg-destructive hover:bg-destructive/90 shadow-[0_0_15px_rgba(220,38,38,0.3)] disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  "Authenticate"
                )}
              </button>
            </motion.form>
          )}
        </div>

        <p className="text-center text-xs text-muted mt-6 flex items-center justify-center gap-2">
          <Shield size={12} />
          Protected by Traceon Security Module
        </p>
      </motion.div>
    </div>
  );
}
