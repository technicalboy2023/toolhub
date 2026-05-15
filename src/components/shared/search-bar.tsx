"use client";

import { useState, useRef, useEffect, forwardRef, useImperativeHandle, useCallback } from "react";
import { Search, X, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { tools } from "@/features/tools/registry";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export interface SearchBarProps {
  autoFocus?: boolean;
  onSelect?: () => void;
}

export interface SearchBarRef {
  focus: () => void;
}

export const SearchBar = forwardRef<SearchBarRef, SearchBarProps>(
  ({ autoFocus, onSelect }, ref
) => {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const results = query.trim()
    ? tools.filter(
        (t) =>
          t.name.toLowerCase().includes(query.toLowerCase()) ||
          t.description.toLowerCase().includes(query.toLowerCase()),
      )
    : [];

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === "Escape" && document.activeElement === inputRef.current) {
        inputRef.current?.blur();
        setIsOpen(false);
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSelect = useCallback(() => {
    setQuery("");
    setIsOpen(false);
    onSelect?.();
  }, [onSelect]);

  useImperativeHandle(ref, () => ({
    focus: () => inputRef.current?.focus(),
  }));

  return (
    <div ref={wrapperRef} className="relative w-full max-w-xl mx-auto">
      <div className="relative border-2 border-foreground bg-background shadow-[3px_3px_0px_0px] shadow-foreground transition-all duration-100 focus-within:border-primary focus-within:shadow-[3px_3px_0px_0px] focus-within:shadow-primary">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground" />
        <Input
          ref={inputRef}
          type="text"
          placeholder="Search tools..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          className="h-12 pl-10 pr-12 bg-transparent font-medium outline-none text-base"
        />
        {query && (
          <button
            onClick={() => {
              setQuery("");
              inputRef.current?.focus();
            }}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-foreground hover:text-foreground transition-colors"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
        <kbd className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs border border-foreground px-1.5 py-0.5 font-bold text-foreground">
          Ctrl K
        </kbd>
      </div>

      <AnimatePresence>
        {isOpen && query && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="absolute top-full left-0 right-0 mt-2 rounded-lg border-2 border-foreground shadow-[4px_4px_0px_0px] shadow-foreground bg-background overflow-hidden z-50"
          >
            {results.length > 0 ? (
              <ul className="py-2 max-h-80 overflow-auto scrollbar-thin">
                {results.slice(0, 8).map((tool) => (
                  <li key={tool.slug}>
                    <Link
                      href={`/tools/${tool.slug}`}
                      onClick={handleSelect}
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-primary hover:text-foreground transition-colors group"
                    >
                      <div
                        className={`flex h-8 w-8 shrink-0 items-center justify-center border-2 border-foreground bg-background`}
                        style={{ backgroundColor: getCategoryColor(tool.category) }}
                      >
                        <tool.icon className="h-4 w-4 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold truncate">{tool.name}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {tool.description}
                        </p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="px-4 py-8 text-center">
                <p className="text-sm text-muted-foreground">
                  No tools found for &quot;{query}&quot;
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

SearchBar.displayName = "SearchBar";

function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    image: "#3B82F6",
    pdf: "#EF4444",
    qr: "#06B6D4",
    text: "#10B981",
    data: "#8B5CF6",
    utility: "#F59E0B",
    "audio-video": "#6366F1",
  };
  return colors[category] || "#6366F1";
}
