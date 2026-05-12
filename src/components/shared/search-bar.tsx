"use client";

import { useState, useRef, useEffect } from "react";
import { Search, X, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { tools } from "@/features/tools/registry";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface SearchBarProps {
  autoFocus?: boolean;
  onSelect?: () => void;
}

export function SearchBar({ autoFocus, onSelect }: SearchBarProps) {
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

  const handleSelect = () => {
    setQuery("");
    setIsOpen(false);
    onSelect?.();
  };

  return (
    <div ref={wrapperRef} className="relative w-full max-w-xl mx-auto">
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
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
          className="h-12 pl-10 pr-10 rounded-xl bg-background/60 backdrop-blur-sm border-border/50 text-base"
        />
        {query && (
          <button
            onClick={() => {
              setQuery("");
              inputRef.current?.focus();
            }}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <AnimatePresence>
        {isOpen && query && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="absolute top-full left-0 right-0 mt-2 rounded-xl border border-border/50 bg-background/95 backdrop-blur-xl shadow-2xl shadow-black/10 overflow-hidden z-50"
          >
            {results.length > 0 ? (
              <ul className="py-2 max-h-80 overflow-auto scrollbar-thin">
                {results.slice(0, 8).map((tool) => (
                  <li key={tool.slug}>
                    <Link
                      href={`/tools/${tool.slug}`}
                      onClick={handleSelect}
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-accent transition-colors group"
                    >
                      <div
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${tool.color}`}
                      >
                        <tool.icon className="h-4 w-4 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {tool.name}
                        </p>
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
}