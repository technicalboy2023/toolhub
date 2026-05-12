"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Blocks } from "lucide-react";
import { ToolCard } from "@/components/shared/tool-card";
import { ToolGrid } from "@/components/shared/tool-grid";
import { CategoryNav } from "@/components/shared/category-nav";
import { EmptyState } from "@/components/shared/empty-state";
import { SearchBar } from "@/components/shared/search-bar";
import { tools } from "@/features/tools/registry";
import type { CategorySlug } from "@/types";

export default function ToolsPage() {
  const [category, setCategory] = useState<CategorySlug | "all">("all");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return tools.filter((tool) => {
      const matchesCategory = category === "all" || tool.category === category;
      const matchesSearch =
        !search ||
        tool.name.toLowerCase().includes(search.toLowerCase()) ||
        tool.description.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [category, search]);

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center text-center gap-4 mb-10"
      >
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-xl shadow-indigo-500/10">
          <Blocks className="h-7 w-7 text-white" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">All Tools</h1>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Browse our collection of {tools.length} free, privacy-first browser tools.
          </p>
        </div>
      </motion.div>

      {/* Search */}
      <div className="mb-6">
        <SearchBar />
      </div>

      {/* Category filter */}
      <div className="mb-8 overflow-x-auto pb-2">
        <CategoryNav selected={category} onSelect={setCategory} />
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