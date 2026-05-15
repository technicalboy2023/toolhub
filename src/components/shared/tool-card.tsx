"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Heart } from "lucide-react";
import type { ToolConfig } from "@/features/tools/registry";
import { useUIStore } from "@/store/ui-store";

interface ToolCardProps {
  tool: ToolConfig;
  index?: number;
}

export function ToolCard({ tool, index = 0 }: ToolCardProps) {
  const Icon = tool.icon;
  const { favorites, toggleFavorite, isFavorite } = useUIStore();
  const isFav = isFavorite(tool.slug);

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(tool.slug);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Link
        href={`/tools/${tool.slug}`}
        className="group relative flex flex-col gap-3 p-5 card-bold cursor-pointer hover:shadow-[6px_6px_0px_0px] transition-all duration-100"
      >
        {/* Heart/favorite button */}
        <button
          onClick={handleFavorite}
          className="absolute top-3 right-3 z-10 p-1 hover:scale-110 transition-transform"
          aria-label={isFav ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart
            className={`h-5 w-5 transition-colors ${
              isFav ? "fill-red-500 text-red-500" : "text-foreground"
            }`}
          />
        </button>

        {/* Icon */}
        <div
          className="flex h-10 w-10 items-center justify-center border-2 border-foreground"
          style={{ backgroundColor: getCategoryColor(tool.category) }}
        >
          <Icon className="h-5 w-5 text-white" />
        </div>

        {/* Content */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-bold tracking-tight">{tool.name}</h3>
            {tool.isNew && (
              <span className="text-[10px] font-bold bg-primary text-foreground px-1 py-0.5">
                NEW
              </span>
            )}
            {tool.isPopular && (
              <span className="text-[10px] font-bold bg-foreground text-background px-1 py-0.5">
                POPULAR
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {tool.description}
          </p>
        </div>

        {/* Arrow */}
        <div className="flex items-center gap-1 text-xs font-bold mt-auto">
          Open tool
          <ArrowRight className="h-3 w-3" />
        </div>
      </Link>
    </motion.div>
  );
}

function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    image: "#3B82F6",
    pdf: "#EF4444",
    qr: "#06B6D4",
    text: "#10B981",
    data: "#8B5CF6",
    utility: "#F59E0B",
    "audio-video": "#6366F1",
  };
  return colors[category] || "#6366F1";
}
