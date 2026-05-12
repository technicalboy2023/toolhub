"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { ToolConfig } from "@/features/tools/registry";
import { Badge } from "@/components/ui/badge";

interface ToolCardProps {
  tool: ToolConfig;
  index?: number;
}

export function ToolCard({ tool, index = 0 }: ToolCardProps) {
  const Icon = tool.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Link
        href={`/tools/${tool.slug}`}
        className="group relative flex flex-col gap-3 rounded-2xl border border-border/40 bg-card/30 backdrop-blur-sm p-5 transition-all duration-300 hover-lift hover:border-indigo-500/30 dark:hover:border-indigo-400/20"
      >
        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500/[0.03] to-purple-500/[0.03] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Icon */}
        <div
          className={`relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${tool.color} shadow-lg`}
        >
          <Icon className="h-5 w-5 text-white" />
        </div>

        {/* Content */}
        <div className="relative space-y-1.5">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold tracking-tight">{tool.name}</h3>
            {tool.isNew && (
              <Badge variant="default" className="h-5 px-1.5 text-[10px] bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/30 border-0">
                NEW
              </Badge>
            )}
            {tool.isPopular && (
              <Badge variant="secondary" className="h-5 px-1.5 text-[10px] bg-amber-500/15 text-amber-500 hover:bg-amber-500/25 border-0">
                POPULAR
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {tool.description}
          </p>
        </div>

        {/* Arrow */}
        <div className="relative mt-auto flex items-center gap-1 text-xs font-medium text-indigo-500 dark:text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-x-[-4px] group-hover:translate-x-0 transition-transform">
          Open tool
          <ArrowRight className="h-3 w-3" />
        </div>
      </Link>
    </motion.div>
  );
}