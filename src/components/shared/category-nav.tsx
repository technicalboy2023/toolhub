"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { categories } from "@/features/tools/categories";
import type { CategorySlug } from "@/types";
import { useUIStore } from "@/store/ui-store";

interface CategoryNavProps {
  selected?: CategorySlug | "all" | "favorites";
  onSelect: (slug: CategorySlug | "all" | "favorites") => void;
}

export function CategoryNav({ selected = "all", onSelect }: CategoryNavProps) {
  const { favorites } = useUIStore();

  return (
    <div className="flex flex-wrap gap-2">
      {/* All button */}
      <button
        onClick={() => onSelect("all")}
        className={`relative px-4 py-2 border-2 font-bold text-sm transition-all duration-100 ${
          selected === "all"
            ? "bg-primary text-foreground border-foreground shadow-[3px_3px_0px_0px] shadow-foreground"
            : "bg-background text-foreground border-foreground hover:bg-primary hover:shadow-[3px_3px_0px_0px] hover:shadow-foreground"
        }`}
      >
        All
      </button>

      {/* Favorites button */}
      <button
        onClick={() => onSelect("favorites")}
        className={`relative px-4 py-2 border-2 font-bold text-sm transition-all duration-100 flex items-center gap-2 ${
          selected === "favorites"
            ? "bg-primary text-foreground border-foreground shadow-[3px_3px_0px_0px] shadow-foreground"
            : "bg-background text-foreground border-foreground hover:bg-primary hover:shadow-[3px_3px_0px_0px] hover:shadow-foreground"
        }`}
      >
        <Heart className="h-4 w-4" />
        <span>Favorites</span>
        {favorites.length > 0 && (
          <span className="text-xs">({favorites.length})</span>
        )}
      </button>

      {/* Category buttons */}
      {categories.map((cat) => (
        <button
          key={cat.slug}
          onClick={() => onSelect(cat.slug)}
          className={`relative px-4 py-2 border-2 font-bold text-sm transition-all duration-100 flex items-center gap-2 ${
            selected === cat.slug
              ? "bg-primary text-foreground border-foreground shadow-[3px_3px_0px_0px] shadow-foreground"
              : "bg-background text-foreground border-foreground hover:bg-primary hover:shadow-[3px_3px_0px_0px] hover:shadow-foreground"
          }`}
        >
          <cat.icon className="h-4 w-4" />
          <span>{cat.name}</span>
        </button>
      ))}
    </div>
  );
}
