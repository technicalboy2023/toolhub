"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { categories } from "@/features/tools/categories";
import type { CategorySlug } from "@/types";

interface CategoryNavProps {
  selected?: CategorySlug | "all";
  onSelect: (slug: CategorySlug | "all") => void;
}

export function CategoryNav({ selected = "all", onSelect }: CategoryNavProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onSelect("all")}
        className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
          selected === "all"
            ? "text-white"
            : "text-muted-foreground hover:text-foreground hover:bg-accent"
        }`}
      >
        {selected === "all" && (
          <motion.div
            layoutId="category-pill"
            className="absolute inset-0 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600"
          />
        )}
        <span className="relative z-10">All</span>
      </button>
      {categories.map((cat) => (
        <button
          key={cat.slug}
          onClick={() => onSelect(cat.slug)}
          className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
            selected === cat.slug
              ? "text-white"
              : "text-muted-foreground hover:text-foreground hover:bg-accent"
          }`}
        >
          {selected === cat.slug && (
            <motion.div
              layoutId="category-pill"
              className="absolute inset-0 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600"
            />
          )}
          <cat.icon className="h-4 w-4 relative z-10" />
          <span className="relative z-10">{cat.name}</span>
        </button>
      ))}
    </div>
  );
}