"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { Gem, ArrowLeft, Loader2, Save } from "lucide-react";
import Link from "next/link";

export default function NewDiamondPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  // Form State
  const [formData, setFormData] = useState({
    roughId: `RGH-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`,
    sourceLotId: "",
    originCountry: "",
    roughWeight: "",
    pcsCount: "1",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/diamonds", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          roughWeight: parseFloat(formData.roughWeight),
          pcsCount: parseInt(formData.pcsCount, 10),
        }),
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Failed to register rough diamond");
      }

      setSuccess("Rough diamond registered successfully!");
      setTimeout(() => {
        router.push("/admin/diamonds");
        router.refresh(); // Refresh the list
      }, 1000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout
      role="admin"
      user={{ fullName: "System Admin", email: "admin@traceon.app", role: "ADMIN" }}
    >
      <div className="page-enter max-w-3xl mx-auto">
        <div className="mb-6 flex items-center gap-4">
          <Link href="/admin/diamonds" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
            <ArrowLeft size={18} className="text-muted" />
          </Link>
          <div>
            <h1 className="text-2xl font-display font-bold">Register Rough Diamond</h1>
            <p className="text-sm text-muted mt-1">Enter a new rough diamond into the system (Stage 1)</p>
          </div>
        </div>

        <div className="glass-card p-6 md:p-8">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm flex items-center gap-2">
              <Loader2 size={16} className="animate-spin" />
              {success} Redirecting...
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center gap-3 mb-6 pb-6 border-b border-white/10">
              <div className="w-10 h-10 rounded-xl bg-sky-blue/10 flex items-center justify-center">
                <Gem size={20} className="text-sky-blue" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Stage 1: Rough Entry</h3>
                <p className="text-xs text-muted">Initial data capture and intake</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/80">Rough ID <span className="text-red-400">*</span></label>
                <input
                  type="text"
                  name="roughId"
                  required
                  value={formData.roughId}
                  onChange={handleChange}
                  className="w-full glass-input h-11 px-4"
                  placeholder="e.g. RGH-2026-00001"
                />
                <p className="text-xs text-muted">Auto-generated default provided, but can be customized to match physical parcel labels.</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-white/80">Source Lot ID <span className="text-red-400">*</span></label>
                <input
                  type="text"
                  name="sourceLotId"
                  required
                  value={formData.sourceLotId}
                  onChange={handleChange}
                  className="w-full glass-input h-11 px-4"
                  placeholder="e.g. LOT-ABC-123"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-white/80">Origin Country <span className="text-red-400">*</span></label>
                <select
                  name="originCountry"
                  required
                  value={formData.originCountry}
                  onChange={handleChange}
                  className="w-full glass-input h-11 px-4 appearance-none"
                  style={{ backgroundImage: "url(\"data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='rgba(255,255,255,0.5)' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 1rem center", backgroundSize: "1em" }}
                >
                  <option value="" disabled className="bg-[#0f1929]">Select Origin</option>
                  <option value="Botswana" className="bg-[#0f1929]">Botswana</option>
                  <option value="Canada" className="bg-[#0f1929]">Canada</option>
                  <option value="South Africa" className="bg-[#0f1929]">South Africa</option>
                  <option value="Namibia" className="bg-[#0f1929]">Namibia</option>
                  <option value="Angola" className="bg-[#0f1929]">Angola</option>
                  <option value="Russia" className="bg-[#0f1929]">Russia</option>
                  <option value="Australia" className="bg-[#0f1929]">Australia</option>
                  <option value="Other" className="bg-[#0f1929]">Other</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-white/80">Rough Weight (ct) <span className="text-red-400">*</span></label>
                <input
                  type="number"
                  step="0.0001"
                  min="0"
                  name="roughWeight"
                  required
                  value={formData.roughWeight}
                  onChange={handleChange}
                  className="w-full glass-input h-11 px-4"
                  placeholder="0.00"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-white/80">Pieces Count</label>
                <input
                  type="number"
                  min="1"
                  step="1"
                  name="pcsCount"
                  value={formData.pcsCount}
                  onChange={handleChange}
                  className="w-full glass-input h-11 px-4"
                />
              </div>
            </div>

            <div className="pt-6 border-t border-white/10 flex justify-end gap-3">
              <Link href="/admin/diamonds" className="btn-ghost px-6 py-2.5">
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary px-8 py-2.5 flex items-center gap-2"
              >
                {isLoading ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Save size={18} />
                )}
                Register Diamond
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
