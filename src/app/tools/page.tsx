"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Blocks, ArrowRight } from "lucide-react";
import { ToolCard } from "@/components/shared/tool-card";
import { ToolGrid } from "@/components/shared/tool-grid";
import { EmptyState } from "@/components/shared/empty-state";
import { SearchBar } from "@/components/shared/search-bar";
import { CategoryNav } from "@/components/shared/category-nav";
import { tools } from "@/features/tools/registry";
import type { CategorySlug } from "@/types";
import { useUIStore } from "@/store/ui-store";

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

type SortBy = "name" | "popular" | "newest";

export default function ToolsPage() {
  const [category, setCategory] = useState<CategorySlug | "all" | "favorites">("all");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortBy>("name");
  const { favorites } = useUIStore();

  const filtered = useMemo(() => {
    let list = [...tools];

    // Filter by category/favorites
    if (category === "favorites") {
      list = list.filter((t) => favorites.includes(t.slug));
    } else if (category !== "all") {
      list = list.filter((t) => t.category === category);
    }

    // Filter by search query
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q),
      );
    }

    // Sort
    if (sortBy === "name") {
      list.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "popular") {
      list.sort((a, b) => (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0));
    } else if (sortBy === "newest") {
      list.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
    }

    return list;
  }, [category, search, sortBy, favorites]);

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center text-center gap-4 mb-10"
      >
        <div className="flex h-14 w-14 items-center justify-center border-2 border-foreground bg-background">
          <Blocks className="h-7 w-7 text-foreground" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-black tracking-tight section-heading">
            All Tools
          </h1>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Browse our collection of {tools.length} free, privacy-first browser tools.
          </p>
        </div>
      </motion.div>

      {/* Search + Sort */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4 items-center">
        <div className="flex-1">
          <SearchBar />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            SORT BY:
          </span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortBy)}
            className="px-3 py-1.5 border-2 border-foreground bg-background font-bold text-sm focus:outline-none focus:ring-2 focus:ring-foreground"
          >
            <option value="name">Name (A-Z)</option>
            <option value="name-reverse">Name (Z-A)</option>
            <option value="popular">Popular</option>
            <option value="newest">Newest</option>
          </select>
        </div>
      </div>

      {/* Category filter */}
      <div className="mb-8 overflow-x-auto pb-2">
        <CategoryNav selected={category} onSelect={setCategory} />
      </div>

      {/* Tool count */}
      <div className="flex justify-end mb-6">
        <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
          SHOWING {filtered.length} TOOLS
        </span>
      </div>

      {/* Tools grid */}
      {filtered.length > 0 ? (
        <ToolGrid columns={3}>
          {filtered.map((tool, i) => (
            <ToolCard key={tool.slug} tool={tool} index={i} />
          ))}
        </ToolGrid>
      ) : (
        <EmptyState
          title="No tools found"
          description="Try a different category or search term."
        />
      )}
    </div>
  );
}
