import {
  Image,
  FileText,
  QrCode,
  Type,
  Database,
  Wrench,
  Headphones,
  type LucideIcon,
} from "lucide-react";
import type { Category, CategorySlug, Tool } from "@/types";

export const categories: Category[] = [
  {
    slug: "image",
    name: "Image Tools",
    description: "Compress, resize, convert, and edit images right in your browser",
    icon: Image,
    color: "from-pink-500 to-rose-500",
    tools: [],
  },
  {
    slug: "pdf",
    name: "PDF Tools",
    description: "Merge, split, compress, and convert PDF documents",
    icon: FileText,
    color: "from-red-500 to-orange-500",
    tools: [],
  },
  {
    slug: "qr",
    name: "QR & Barcode",
    description: "Generate and scan QR codes and barcodes instantly",
    icon: QrCode,
    color: "from-blue-500 to-cyan-500",
    tools: [],
  },
  {
    slug: "text",
    name: "Text Tools",
    description: "Count words, format JSON, encode, decode, and more",
    icon: Type,
    color: "from-emerald-500 to-teal-500",
    tools: [],
  },
  {
    slug: "data",
    name: "Data Tools",
    description: "Convert between CSV, JSON, XML, and YAML formats",
    icon: Database,
    color: "from-violet-500 to-purple-500",
    tools: [],
  },
  {
    slug: "utility",
    name: "Utility Tools",
    description: "Password generator, UUID, timestamps, color picker, unit converter",
    icon: Wrench,
    color: "from-amber-500 to-yellow-500",
    tools: [],
  },
  {
    slug: "audio-video",
    name: "Audio & Video",
    description: "Convert audio, compress video, cut MP3, and create GIFs",
    icon: Headphones,
    color: "from-indigo-500 to-blue-500",
    tools: [],
  },
];

export const categoryColorMap: Record<CategorySlug, string> = {
  image: "from-pink-500 to-rose-500",
  pdf: "from-red-500 to-orange-500",
  qr: "from-blue-500 to-cyan-500",
  text: "from-emerald-500 to-teal-500",
  data: "from-violet-500 to-purple-500",
  utility: "from-amber-500 to-yellow-500",
  "audio-video": "from-indigo-500 to-blue-500",
};

export function getCategoryBySlug(slug: CategorySlug): Category | undefined {
  return categories.find((c) => c.slug === slug);
}