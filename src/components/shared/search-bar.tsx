"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { Search, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

interface SearchResult {
  id: string;
  roughId: string;
  diamonddnaId: string | null;
  currentStage: number;
  status: string;
  stage3?: { packetBarcode: string | null } | null;
}

interface SearchBarProps {
  size?: "default" | "large";
  autoFocus?: boolean;
  className?: string;
}

export default function SearchBar({
  size = "default",
  autoFocus = false,
  className = "",
}: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const searchDiamonds = useCallback(async (searchQuery: string) => {
    if (searchQuery.length < 2) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(
        `/api/diamonds/search?q=${encodeURIComponent(searchQuery)}`
      );
      if (res.ok) {
        const data = await res.json();
        setResults(data.diamonds || []);
      }
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleChange = (value: string) => {
    const upperValue = value.toUpperCase();
    setQuery(upperValue);
    setShowResults(true);

    // Debounce 300ms per PRD
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      searchDiamonds(upperValue);
    }, 300);
  };

  const handleSelect = (diamond: SearchResult) => {
    setShowResults(false);
    setQuery("");
    router.push(`/diamond/${diamond.id}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setShowResults(false);
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const sizeClasses =
    size === "large"
      ? "h-16 text-lg px-6 rounded-xl"
      : "h-11 text-sm px-4 rounded-lg";

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <Search
            className={`absolute left-4 top-1/2 -translate-y-1/2 text-muted ${
              size === "large" ? "w-5 h-5" : "w-4 h-4"
            }`}
          />
          <input
            type="text"
            value={query}
            onChange={(e) => handleChange(e.target.value)}
            onFocus={() => query.length >= 2 && setShowResults(true)}
            placeholder="Search by Traceon ID, Rough ID, or Packet ID..."
            autoFocus={autoFocus}
            className={`w-full glass-input uppercase ${sizeClasses} ${
              size === "large" ? "pl-12 pr-12" : "pl-10 pr-10"
            }`}
            id="diamond-search-input"
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setResults([]);
                setShowResults(false);
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-white transition-colors"
            >
              <X size={size === "large" ? 20 : 16} />
            </button>
          )}
        </div>
      </form>

      {/* Results dropdown */}
      <AnimatePresence>
        {showResults && (query.length >= 2 || results.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 right-0 mt-2 glass rounded-xl overflow-hidden z-50 max-h-80 overflow-y-auto"
          >
            {isLoading ? (
              <div className="p-4 text-center text-muted text-sm">
                <div className="inline-block w-4 h-4 border-2 border-royal-blue border-t-transparent rounded-full animate-spin mr-2" />
                Searching...
              </div>
            ) : results.length > 0 ? (
              results.map((diamond) => (
                <button
                  key={diamond.id}
                  onClick={() => handleSelect(diamond)}
                  className="w-full px-4 py-3 flex items-center gap-3 hover:bg-royal-blue/10 transition-colors text-left border-b border-border last:border-0"
                >
                  <div className="w-8 h-8 rounded-lg bg-royal-blue/20 flex items-center justify-center text-royal-blue shrink-0">
                    <Search size={14} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-white truncate">
                      {diamond.stage3?.packetBarcode || diamond.diamonddnaId || diamond.roughId}
                    </div>
                    <div className="text-xs text-muted">
                      Stage {diamond.currentStage} / 14 ·{" "}
                      {diamond.status.replace("_", " ")}
                    </div>
                  </div>
                  <div className="text-xs font-mono text-muted">
                    {diamond.stage3?.packetBarcode
                      ? diamond.roughId
                      : null}
                  </div>
                </button>
              ))
            ) : query.length >= 2 ? (
              <div className="p-4 text-center text-muted text-sm">
                No diamonds found for &quot;{query}&quot;
              </div>
            ) : null}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
