"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Gem, Eye, EyeOff, AlertCircle, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ParticleField from "@/components/shared/particle-field";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [attemptsRemaining, setAttemptsRemaining] = useState<number | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
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
        if (data.attemptsRemaining !== undefined) {
          setAttemptsRemaining(data.attemptsRemaining);
        }
        return;
      }

      // Redirect based on role
      const roleRoutes: Record<string, string> = {
        SUPER_ADMIN: "/superadmin",
        ADMIN: "/admin",
        EMPLOYEE: "/employee",
      };

      if (data.user.mustChangePassword) {
        router.push("/change-password");
      } else {
        router.push(roleRoutes[data.user.role] || "/");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
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
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm text-muted hover:text-white transition-colors mb-8"
        >
          <ChevronLeft size={16} />
          Back to Traceon
        </Link>

        {/* Login Card */}
        <div className="glass-card p-8 md:p-10">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-royal-blue/15 mb-4">
              <Gem className="w-8 h-8 text-sky-blue glow-icon" />
            </div>
            <h1 className="text-2xl font-display font-bold">
              Welcome back
            </h1>
            <p className="text-sm text-muted mt-1">
              Sign in to your Traceon account
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm mb-6"
            >
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <div>
                <p>{error}</p>
                {attemptsRemaining !== null && attemptsRemaining > 0 && (
                  <p className="text-xs mt-1 opacity-80">
                    {attemptsRemaining} attempt{attemptsRemaining !== 1 ? "s" : ""} remaining
                  </p>
                )}
              </div>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="login-email" className="block text-sm font-medium text-muted mb-1.5">
                Email Address
              </label>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                required
                className="w-full glass-input h-11 px-4 text-sm"
                autoComplete="email"
              />
            </div>

            <div>
              <label htmlFor="login-password" className="block text-sm font-medium text-muted mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full glass-input h-11 px-4 pr-10 text-sm"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-muted cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-border bg-[#070e17] accent-royal-blue"
                />
                Remember me
              </label>
              <Link
                href="/reset-password"
                className="text-sm text-royal-blue hover:text-royal-blue-light transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary h-11 text-sm font-semibold flex items-center justify-center disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Super Admin link */}
          <div className="mt-6 pt-6 border-t border-border text-center">
            <Link
              href="/superadmin/login"
              className="text-xs text-muted hover:text-sky-blue transition-colors"
            >
              Super Admin Access →
            </Link>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-muted mt-6">
          Traceon · Secure Login · TLS 1.3
        </p>
      </motion.div>
    </div>
  );
}
