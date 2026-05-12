import type { LucideIcon } from "lucide-react";

export interface Tool {
  slug: string;
  name: string;
  description: string;
  icon: LucideIcon;
  category: CategorySlug;
  color: string;
  isNew?: boolean;
  isPopular?: boolean;
  isPremium?: boolean;
}

export type CategorySlug =
  | "image"
  | "pdf"
  | "qr"
  | "text"
  | "data"
  | "utility"
  | "audio-video";

export interface Category {
  slug: CategorySlug;
  name: string;
  description: string;
  icon: LucideIcon;
  color: string;
  tools: Tool[];
}

export interface RecentlyUsedTool {
  slug: string;
  name: string;
  timestamp: number;
}