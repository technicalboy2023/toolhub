"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { useState, useEffect, forwardRef, useImperativeHandle, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sun,
  Moon,
  Menu,
  X,
  Search,
  Blocks,
  Star,
  Keyboard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUIStore } from "@/store/ui-store";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/", label: "HOME" },
  { href: "/tools", label: "ALL TOOLS" },
];

export interface SearchBarRef {
  focus: () => void;
}

export const Navbar = forwardRef<SearchBarRef>((props, ref) => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { isMobileMenuOpen, setMobileMenuOpen } = useUIStore();
  const pathname = usePathname();

  const searchRef = useRef<SearchBarRef>(null);

  useImperativeHandle(ref, () => ({
    focus: () => searchRef.current?.focus(),
  }));

  useEffect(() => setMounted(true), []);

  return (
    <header className="sticky top-0 z-50 w-full border-b-2 border-foreground bg-background">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex items-center justify-center w-9 h-9 border-2 border-foreground bg-primary shadow-[2px_2px_0px_0px] shadow-foreground">
            <Blocks className="h-5 w-5 text-foreground" />
          </div>
          <span className="text-xl font-black tracking-tighter">
            TOOLS<span className="bg-primary text-foreground px-1">HUB</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 text-sm font-bold tracking-wide transition-colors ${
                  isActive
                    ? "text-foreground border-b-2 border-primary"
                    : "text-foreground hover:bg-primary hover:text-foreground"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Search button with keyboard shortcut */}
          <button
            onClick={() => searchRef.current?.focus()}
            className="hidden md:flex items-center gap-2 px-3 py-1.5 border-2 border-foreground bg-background font-bold text-sm hover:bg-primary hover:text-foreground transition-colors"
            aria-label="Search tools"
          >
            <Search className="h-4 w-4" />
            <span className="hidden lg:inline-flex items-center gap-1 text-xs">
              <Keyboard className="h-3 w-3" />
              <span>Ctrl K</span>
            </span>
          </button>

          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label="Toggle theme"
              className="border-2 border-foreground hover:bg-primary hover:text-foreground"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
          )}

          <a
            href="https://github.com/technicalboy2023/toolhub"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 border-2 border-foreground bg-primary text-foreground font-bold text-xs hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px] transition-all"
            aria-label="GitHub"
          >
            <Star className="h-4 w-4" />
            <span>Star</span>
          </a>

          {/* Mobile menu toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden border-2 border-foreground hover:bg-primary hover:text-foreground"
            onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-b-2 border-foreground md:hidden"
          >
            <nav className="container mx-auto px-4 py-4 flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-3 text-sm font-bold text-foreground border-b border-border/50 hover:bg-primary hover:text-foreground transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  searchRef.current?.focus();
                }}
                className="px-4 py-3 text-sm font-bold text-foreground border-b border-border/50 hover:bg-primary hover:text-foreground transition-colors flex items-center gap-2"
              >
                <Search className="h-4 w-4" />
                Search tools
              </button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
});

Navbar.displayName = "Navbar";
