import { create } from "zustand";
import type { RecentlyUsedTool } from "@/types";

interface UIState {
  isMobileMenuOpen: boolean;
  recentlyUsed: RecentlyUsedTool[];
  setMobileMenuOpen: (open: boolean) => void;
  addRecentlyUsed: (slug: string, name: string) => void;
  clearRecentlyUsed: () => void;
}

const RECENT_KEY = "toolhub-recently-used";
const MAX_RECENT = 10;

function loadRecentlyUsed(): RecentlyUsedTool[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(RECENT_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as RecentlyUsedTool[];
  } catch {
    return [];
  }
}

export const useUIStore = create<UIState>((set) => ({
  isMobileMenuOpen: false,
  recentlyUsed: loadRecentlyUsed(),

  setMobileMenuOpen: (open) => set({ isMobileMenuOpen: open }),

  addRecentlyUsed: (slug, name) =>
    set((state) => {
      const filtered = state.recentlyUsed.filter((t) => t.slug !== slug);
      const updated = [{ slug, name, timestamp: Date.now() }, ...filtered].slice(
        0,
        MAX_RECENT,
      );
      if (typeof window !== "undefined") {
        localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
      }
      return { recentlyUsed: updated };
    }),

  clearRecentlyUsed: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(RECENT_KEY);
    }
    return { recentlyUsed: [] };
  },
}));