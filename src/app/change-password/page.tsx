"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ShieldAlert, AlertCircle, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import ParticleField from "@/components/shared/particle-field";
import { validatePasswordStrength } from "@/lib/auth/password";

export default function ChangePasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const validation = validatePasswordStrength(password);
  const passwordsMatch = password === confirmPassword && password.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validation.valid) {
      setError("Please meet all password requirements.");
      return;
    }

    if (!passwordsMatch) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (res.ok) {
        // Redirect back to login so they can log in with new password and get fresh tokens
        router.push("/login?changed=true");
      } else {
        setError(data.error || "Failed to change password");
        setIsLoading(false);
      }
    } catch (err) {
      setError("Network error. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="glass-card p-8 md:p-10 border-warning/30 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-warning" />

          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-warning/15 mb-4">
              <ShieldAlert className="w-8 h-8 text-warning glow-icon" />
            </div>
            <h1 className="text-2xl font-display font-bold">Security Action Required</h1>
            <p className="text-sm text-muted mt-2">
              For your security, you must change your password before accessing the platform.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="flex items-start gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm mb-6">
                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                <p>{error}</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-muted mb-1.5">
                New Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full glass-input h-11 px-4 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-muted mb-1.5">
                Confirm New Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`w-full glass-input h-11 px-4 text-sm ${
                  confirmPassword.length > 0 && !passwordsMatch
                    ? "border-destructive focus:border-destructive"
                    : ""
                }`}
              />
              {confirmPassword.length > 0 && !passwordsMatch && (
                <p className="text-xs text-destructive mt-1">Passwords must match</p>
              )}
            </div>

            {/* Password Requirements UI */}
            <div className="bg-navy-mid/30 rounded-lg p-4 border border-border mt-4">
              <p className="text-xs font-semibold mb-2">Password Requirements:</p>
              <ul className="space-y-1.5">
                {[
                  { text: "At least 8 characters", valid: password.length >= 8 },
                  { text: "One uppercase letter", valid: /[A-Z]/.test(password) },
                  { text: "One lowercase letter", valid: /[a-z]/.test(password) },
                  { text: "One number", valid: /[0-9]/.test(password) },
                  { text: "One special character", valid: /[^A-Za-z0-9]/.test(password) },
                ].map((req, i) => (
                  <li key={i} className="flex items-center gap-2 text-xs">
                    {req.valid ? (
                      <CheckCircle2 size={12} className="text-success shrink-0" />
                    ) : (
                      <div className="w-3 h-3 rounded-full border border-muted shrink-0" />
                    )}
                    <span className={req.valid ? "text-muted line-through" : "text-white"}>
                      {req.text}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              type="submit"
              disabled={isLoading || !validation.valid || !passwordsMatch}
              className="w-full btn-primary h-11 text-sm font-semibold flex items-center justify-center mt-6 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                "Update Password"
              )}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
