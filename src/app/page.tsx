"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Sparkles,
  History,
  TrendingUp,
  Star,
  Shield,
  Heart,
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
import type { RecentlyUsedTool } from "@/types";

const sectionVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

const stats = [
  { value: "37+", label: "TOTAL TOOLS" },
  { value: "7", label: "CATEGORIES" },
  { value: "0", label: "SERVER UPLOADS" },
  { value: "100%", label: "FREE FOREVER" },
];

const categoryColors: Record<string, string> = {
  image: "#3B82F6",
  pdf: "#EF4444",
  qr: "#06B6D4",
  text: "#10B981",
  data: "#8B5CF6",
  utility: "#F59E0B",
  "audio-video": "#6366F1",
};

export default function HomePage() {
  const { recentlyUsed, favorites } = useUIStore();

  const recentTools = recentlyUsed
    .map((r: RecentlyUsedTool) => getToolBySlug(r.slug))
    .filter(Boolean);

  const favoriteTools = favorites
    .map((slug: string) => getToolBySlug(slug))
    .filter(Boolean);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="border-b-2 border-foreground bg-background">
        <div className="container mx-auto px-4 py-16 md:py-20">
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
                className="px-3 py-1.5 gap-1.5 text-xs bg-primary text-foreground border-2 border-foreground font-bold"
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
              className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tighter leading-tight"
            >
              Everything you need.
              <br />
              <span className="bg-primary text-foreground px-2">Nothing leaves your device.</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg max-w-xl font-medium text-muted-foreground"
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
              <span className="text-xs font-bold">Popular:</span>
              {popularTools.slice(0, 4).map((tool) => (
                <Link
                  key={tool.slug}
                  href={`/tools/${tool.slug}`}
                  className="text-xs px-2.5 py-1 border-2 border-foreground font-bold hover:bg-primary hover:text-foreground transition-colors"
                >
                  {tool.name}
                </Link>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Strip */}
      <section className="border-y-2 border-foreground bg-primary">
        <div className="container mx-auto px-4 py-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="text-center"
            >
              <div className="text-2xl font-black">{stat.value}</div>
              <div className="text-xs font-bold uppercase tracking-wider">
                {stat.label}
              </div>
            </motion.div>
          ))}
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
              <div className="flex h-8 w-8 items-center justify-center border-2 border-foreground bg-background">
                <History className="h-4 w-4 text-foreground" />
              </div>
              <h2 className="text-xl font-bold tracking-tight section-heading">
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

        {/* Favorites */}
        {favoriteTools.length > 0 && (
          <motion.section
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-8 w-8 items-center justify-center border-2 border-foreground bg-primary">
                <Heart className="h-4 w-4 text-foreground" />
              </div>
              <h2 className="text-xl font-bold tracking-tight section-heading">
                Favorites
              </h2>
            </div>
            <ToolGrid columns={3}>
              {favoriteTools.map((tool: any, i: number) => (
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
              <div className="flex h-8 w-8 items-center justify-center border-2 border-foreground bg-background">
                <Star className="h-4 w-4 text-foreground" />
              </div>
              <h2 className="text-xl font-bold tracking-tight section-heading">
                Featured Tools
              </h2>
            </div>
            <Link
              href="/tools"
              className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors font-bold"
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

        {/* Browse by Category */}
        <motion.section
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-8 w-8 items-center justify-center border-2 border-foreground bg-background">
              <TrendingUp className="h-4 w-4 text-foreground" />
            </div>
            <h2 className="text-xl font-bold tracking-tight section-heading">
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
                    className="group relative flex items-start gap-4 p-5 card-bold hover:shadow-[6px_6px_0px_0px] transition-all duration-100"
                  >
                    <div
                      className="flex h-12 w-12 items-center justify-center border-2 border-foreground shrink-0"
                      style={{ backgroundColor: categoryColors[category.slug] }}
                    >
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-black uppercase tracking-wider text-foreground">
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
          className="border-2 border-foreground bg-foreground text-background p-8 md:p-12 text-center"
        >
          <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-3 section-heading">
            Private by Design
          </h2>
          <p className="text-background/80 max-w-lg mx-auto mb-6">
            Unlike other online tool platforms, ToolsHub processes everything
            directly in your browser. Your files never touch a server — they
            stay on your device, where they belong.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm font-bold">
            <div className="flex items-center gap-2 border-2 border-background px-4 py-2 text-primary">
              <div className="h-2 w-2 rounded-full bg-primary" />
              No file uploads
            </div>
            <div className="flex items-center gap-2 border-2 border-background px-4 py-2 text-primary">
              <div className="h-2 w-2 rounded-full bg-primary" />
              No tracking
            </div>
            <div className="flex items-center gap-2 border-2 border-background px-4 py-2 text-primary">
              <div className="h-2 w-2 rounded-full bg-primary" />
              100% free
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
