import type { Tool, CategorySlug } from "@/types";
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

export interface ToolConfig {
  slug: string;
  name: string;
  description: string;
  icon: LucideIcon;
  category: CategorySlug;
  color: string;
  isNew?: boolean;
  isPopular?: boolean;
}

function pickColor(category: CategorySlug): string {
  const colors: Record<CategorySlug, string> = {
    image: "from-pink-500 to-rose-500",
    pdf: "from-red-500 to-orange-500",
    qr: "from-blue-500 to-cyan-500",
    text: "from-emerald-500 to-teal-500",
    data: "from-violet-500 to-purple-500",
    utility: "from-amber-500 to-yellow-500",
    "audio-video": "from-indigo-500 to-blue-500",
  };
  return colors[category];
}

export const tools: ToolConfig[] = [
  // Utility Tools
  { slug: "html-formatter", name: "HTML Formatter", description: "Format and minify HTML code", icon: Wrench, category: "utility", color: pickColor("utility") },
  { slug: "markdown-converter", name: "Markdown Converter", description: "Convert between Markdown and HTML", icon: Wrench, category: "utility", color: pickColor("utility") },
  { slug: "hash-generator", name: "Hash Generator", description: "Generate MD5, SHA-1, SHA-256, and SHA-512 hashes", icon: Wrench, category: "utility", color: pickColor("utility") },

  // Image Tools
  { slug: "image-compressor", name: "Image Compressor", description: "Reduce image file size without losing quality", icon: Image, category: "image", color: pickColor("image"), isPopular: true },
  { slug: "resize-image", name: "Resize Image", description: "Change image dimensions to any size", icon: Image, category: "image", color: pickColor("image"), isPopular: true },
  { slug: "crop-image", name: "Crop Image", description: "Crop images to remove unwanted areas", icon: Image, category: "image", color: pickColor("image") },
  { slug: "background-remover", name: "Background Remover", description: "Remove image backgrounds automatically", icon: Image, category: "image", color: pickColor("image"), isPopular: true },
  { slug: "convert-image", name: "Convert Image Format", description: "Convert images between PNG, JPG, WebP, and more", icon: Image, category: "image", color: pickColor("image") },
  { slug: "watermark-image", name: "Watermark Image", description: "Add text or image watermarks to your photos", icon: Image, category: "image", color: pickColor("image") },
  { slug: "meme-generator", name: "Meme Generator", description: "Create funny memes with custom text", icon: Image, category: "image", color: pickColor("image") },
  { slug: "blur-image", name: "Blur Image", description: "Apply blur effects to images", icon: Image, category: "image", color: pickColor("image") },
  { slug: "rotate-image", name: "Rotate & Flip Image", description: "Rotate or flip images in any direction", icon: Image, category: "image", color: pickColor("image") },

  // PDF Tools
  { slug: "merge-pdf", name: "Merge PDF", description: "Combine multiple PDFs into a single document", icon: FileText, category: "pdf", color: pickColor("pdf"), isPopular: true },
  { slug: "split-pdf", name: "Split PDF", description: "Split PDF pages into separate documents", icon: FileText, category: "pdf", color: pickColor("pdf") },
  { slug: "compress-pdf", name: "Compress PDF", description: "Reduce PDF file size while maintaining quality", icon: FileText, category: "pdf", color: pickColor("pdf") },
  { slug: "pdf-to-image", name: "PDF to Image", description: "Convert PDF pages to high-quality images", icon: FileText, category: "pdf", color: pickColor("pdf") },
  { slug: "image-to-pdf", name: "Image to PDF", description: "Convert images to PDF documents", icon: FileText, category: "pdf", color: pickColor("pdf"), isPopular: true },
  { slug: "rotate-pdf", name: "Rotate PDF", description: "Rotate pages in your PDF document", icon: FileText, category: "pdf", color: pickColor("pdf") },
  { slug: "unlock-pdf", name: "Unlock PDF", description: "Remove password protection from PDFs", icon: FileText, category: "pdf", color: pickColor("pdf") },

  // QR & Barcode
  { slug: "qr-generator", name: "QR Generator", description: "Generate QR codes for URLs, text, and more", icon: QrCode, category: "qr", color: pickColor("qr"), isPopular: true },
  { slug: "qr-scanner", name: "QR Scanner", description: "Scan QR codes using your camera", icon: QrCode, category: "qr", color: pickColor("qr") },
  { slug: "barcode-generator", name: "Barcode Generator", description: "Generate various barcode types", icon: QrCode, category: "qr", color: pickColor("qr") },

  // Text Tools
  { slug: "word-counter", name: "Word Counter", description: "Count words, characters, sentences, and paragraphs", icon: Type, category: "text", color: pickColor("text"), isPopular: true },
  { slug: "case-converter", name: "Case Converter", description: "Convert text between upper, lower, title, and more", icon: Type, category: "text", color: pickColor("text") },
  { slug: "remove-duplicates", name: "Remove Duplicates", description: "Remove duplicate lines from text", icon: Type, category: "text", color: pickColor("text") },
  { slug: "json-formatter", name: "JSON Formatter", description: "Format, validate, and beautify JSON data", icon: Type, category: "text", color: pickColor("text"), isPopular: true },
  { slug: "base64-encoder", name: "Base64 Encoder/Decoder", description: "Encode or decode Base64 text and files", icon: Type, category: "text", color: pickColor("text") },
  { slug: "url-encoder", name: "URL Encoder/Decoder", description: "Encode or decode URL strings", icon: Type, category: "text", color: pickColor("text") },

  // Data Tools
  { slug: "csv-to-json", name: "CSV to JSON", description: "Convert CSV data to JSON format", icon: Database, category: "data", color: pickColor("data") },
  { slug: "json-to-csv", name: "JSON to CSV", description: "Convert JSON data to CSV format", icon: Database, category: "data", color: pickColor("data") },
  { slug: "xml-formatter", name: "XML Formatter", description: "Format and beautify XML documents", icon: Database, category: "data", color: pickColor("data") },
  { slug: "yaml-converter", name: "YAML Converter", description: "Convert between YAML and other formats", icon: Database, category: "data", color: pickColor("data") },

  // Utility Tools
  { slug: "password-generator", name: "Password Generator", description: "Generate strong, secure passwords instantly", icon: Wrench, category: "utility", color: pickColor("utility"), isPopular: true },
  { slug: "uuid-generator", name: "UUID Generator", description: "Generate UUID v4 and v7 identifiers", icon: Wrench, category: "utility", color: pickColor("utility") },
  { slug: "timestamp-converter", name: "Timestamp Converter", description: "Convert Unix timestamps to readable dates", icon: Wrench, category: "utility", color: pickColor("utility") },
  { slug: "color-picker", name: "Color Picker", description: "Pick, convert, and explore color values", icon: Wrench, category: "utility", color: pickColor("utility") },
  { slug: "unit-converter", name: "Unit Converter", description: "Convert between different units of measurement", icon: Wrench, category: "utility", color: pickColor("utility") },

  // Audio & Video
  { slug: "audio-converter", name: "Audio Converter", description: "Convert audio files between formats", icon: Headphones, category: "audio-video", color: pickColor("audio-video") },
  { slug: "video-compressor", name: "Video Compressor", description: "Reduce video file size while maintaining quality", icon: Headphones, category: "audio-video", color: pickColor("audio-video") },
  { slug: "mp3-cutter", name: "MP3 Cutter", description: "Cut and trim MP3 audio files", icon: Headphones, category: "audio-video", color: pickColor("audio-video") },
  { slug: "video-to-gif", name: "Video to GIF", description: "Convert video clips to animated GIFs", icon: Headphones, category: "audio-video", color: pickColor("audio-video"), isPopular: true },
];

export function getToolBySlug(slug: string): ToolConfig | undefined {
  return tools.find((t) => t.slug === slug);
}

export function getToolsByCategory(category: CategorySlug): ToolConfig[] {
  return tools.filter((t) => t.category === category);
}

export const popularTools = tools.filter((t) => t.isPopular);
export const featuredTools = tools.slice(0, 8);