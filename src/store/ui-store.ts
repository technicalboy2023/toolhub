import { create } from "zustand";
import type { RecentlyUsedTool } from "@/types";

interface UIState {
  isMobileMenuOpen: boolean;
  recentlyUsed: RecentlyUsedTool[];
  favorites: string[];
  setMobileMenuOpen: (open: boolean) => void;
  addRecentlyUsed: (slug: string, name: string) => void;
  clearRecentlyUsed: () => void;
  toggleFavorite: (slug: string) => void;
  isFavorite: (slug: string) => boolean;
  clearFavorites: () => void;
}

const RECENT_KEY = "toolhub-recently-used";
const FAVORITES_KEY = "toolhub-favorites";
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

function loadFavorites(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as string[];
  } catch {
    return [];
  }
}

export const useUIStore = create<UIState>((set) => ({
  isMobileMenuOpen: false,
  recentlyUsed: loadRecentlyUsed(),
  favorites: loadFavorites(),

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

  toggleFavorite: (slug) =>
    set((state) => {
      const isFav = state.favorites.includes(slug);
      const updated = isFav
        ? state.favorites.filter((s) => s !== slug)
        : [...state.favorites, slug];
      if (typeof window !== "undefined") {
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
      }
      return { favorites: updated };
    }),

  isFavorite: (slug) => {
    const currentFavorites = loadFavorites();
    return currentFavorites.includes(slug);
  },

  clearFavorites: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(FAVORITES_KEY);
    }
    return { favorites: [] };
  },
}));
