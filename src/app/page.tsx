"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  Sparkles,
  History,
  TrendingUp,
  Star,
} from "lucide-react";
import Link from "next/link";
import { SearchBar } from "@/components/shared/search-bar";
import { ToolCard } from "@/components/shared/tool-card";
import { ToolGrid } from "@/components/shared/tool-grid";
import { EmptyState } from "@/components/shared/empty-state";
import { categories } from "@/features/tools/categories";
import {
  featuredTools,
  popularTools,
} from "@/features/tools/registry";
import { useUIStore } from "@/store/ui-store";
import { Badge } from "@/components/ui/badge";
import { getToolsByCategory, getToolBySlug } from "@/features/tools/registry";

const sectionVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

export default function HomePage() {
  const { recentlyUsed } = useUIStore();

  const recentTools = recentlyUsed
    .map((r) => getToolBySlug(r.slug))
    .filter(Boolean);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border/40">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/[0.03] via-purple-500/[0.02] to-transparent dark:from-indigo-500/[0.05] dark:via-purple-500/[0.03]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 py-20 md:py-28 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center text-center gap-6 max-w-3xl mx-auto"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
            >
              <Badge
                variant="secondary"
                className="px-3 py-1.5 gap-1.5 text-xs bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 border-indigo-500/20"
              >
                <Sparkles className="h-3 w-3" />
                40+ Free Browser Tools
              </Badge>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-tight"
            >
              Everything you need.
              <br />
              <span className="gradient-text">Nothing leaves your device.</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-muted-foreground max-w-xl"
            >
              Process images, PDFs, text, and more — all inside your browser.
              Fast, private, and completely free.
            </motion.p>

            {/* Search */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="w-full max-w-xl mt-2"
            >
              <SearchBar />
            </motion.div>

            {/* Popular quick links */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35 }}
              className="flex flex-wrap items-center justify-center gap-2 mt-2"
            >
              <span className="text-xs text-muted-foreground">Popular:</span>
              {popularTools.slice(0, 4).map((tool) => (
                <Link
                  key={tool.slug}
                  href={`/tools/${tool.slug}`}
                  className="text-xs px-2.5 py-1 rounded-full bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                >
                  {tool.name}
                </Link>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Main content */}
      <div className="container mx-auto px-4 py-12 md:py-16 space-y-16">
        {/* Recently Used */}
        {recentTools.length > 0 && (
          <motion.section
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10">
                <History className="h-4 w-4 text-indigo-500" />
              </div>
              <h2 className="text-xl font-semibold tracking-tight">
                Recently Used
              </h2>
            </div>
            <ToolGrid columns={3}>
              {recentTools.slice(0, 6).map((tool: any, i: number) => (
                <ToolCard key={tool.slug} tool={tool} index={i} />
              ))}
            </ToolGrid>
          </motion.section>
        )}

        {/* Featured Tools */}
        <motion.section
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10">
                <Star className="h-4 w-4 text-amber-500" />
              </div>
              <h2 className="text-xl font-semibold tracking-tight">
                Featured Tools
              </h2>
            </div>
            <Link
              href="/tools"
              className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
            >
              View all
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <ToolGrid columns={3}>
            {featuredTools.map((tool, i) => (
              <ToolCard key={tool.slug} tool={tool} index={i} />
            ))}
          </ToolGrid>
        </motion.section>

        {/* Categories */}
        <motion.section
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10">
              <TrendingUp className="h-4 w-4 text-purple-500" />
            </div>
            <h2 className="text-xl font-semibold tracking-tight">
              Browse by Category
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {categories.map((category, i) => {
              const Icon = category.icon;
              const toolCount = getToolsByCategory(category.slug).length;

              return (
                <motion.div
                  key={category.slug}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    href={`/tools?category=${category.slug}`}
                    className="group relative flex items-start gap-4 rounded-2xl border border-border/40 bg-card/30 backdrop-blur-sm p-5 transition-all duration-300 hover-lift"
                  >
                    <div
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${category.color} shadow-lg`}
                    >
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold tracking-tight group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors">
                        {category.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {category.description}
                      </p>
                      <span className="text-xs text-muted-foreground/60 mt-2 block">
                        {toolCount} tools
                      </span>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </motion.section>

        {/* Privacy Banner */}
        <motion.section
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-3xl border border-indigo-500/20 bg-gradient-to-br from-indigo-500/[0.05] via-purple-500/[0.05] to-pink-500/[0.05] p-8 md:p-12 text-center"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-pink-500/5" />
          <div className="relative">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-3">
              Private by Design
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto mb-6">
              Unlike other online tool platforms, ToolsHub processes everything
              directly in your browser. Your files never touch a server — they
              stay on your device, where they belong.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500/10 text-emerald-500">
                <div className="h-2 w-2 rounded-full bg-emerald-500" />
                No file uploads
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500/10 text-emerald-500">
                <div className="h-2 w-2 rounded-full bg-emerald-500" />
                No tracking
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500/10 text-emerald-500">
                <div className="h-2 w-2 rounded-full bg-emerald-500" />
                100% free
              </div>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
}