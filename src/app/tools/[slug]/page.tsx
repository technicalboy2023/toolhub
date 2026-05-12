import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { tools, getToolBySlug } from "@/features/tools/registry";
import { categoryColorMap } from "@/features/tools/categories";
import dynamic from "next/dynamic";
import { ToolLayout } from "@/components/shared/tool-layout";
import { LoadingState } from "@/components/shared/loading-state";

interface ToolPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return tools.map((tool) => ({ slug: tool.slug }));
}

export async function generateMetadata({ params }: ToolPageProps): Promise<Metadata> {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) return {};

  return {
    title: tool.name,
    description: tool.description,
    openGraph: {
      title: `${tool.name} | ToolsHub`,
      description: tool.description,
    },
    twitter: {
      title: `${tool.name} | ToolsHub`,
      description: tool.description,
    },
  };
}

// Dynamically import tool components for code splitting
const toolComponents: Record<string, () => Promise<{ default: React.ComponentType<any> }>> = {
  "word-counter": () => import("@/features/tools/word-counter/components/tool"),
  "case-converter": () => import("@/features/tools/case-converter/components/tool"),
  "json-formatter": () => import("@/features/tools/json-formatter/components/tool"),
  "password-generator": () => import("@/features/tools/password-generator/components/tool"),
  "uuid-generator": () => import("@/features/tools/uuid-generator/components/tool"),
  "timestamp-converter": () => import("@/features/tools/timestamp-converter/components/tool"),
  "base64-encoder": () => import("@/features/tools/base64-encoder/components/tool"),
  "url-encoder": () => import("@/features/tools/url-encoder/components/tool"),
  "remove-duplicates": () => import("@/features/tools/remove-duplicates/components/tool"),
  "color-picker": () => import("@/features/tools/color-picker/components/tool"),
  "unit-converter": () => import("@/features/tools/unit-converter/components/tool"),
  "qr-generator": () => import("@/features/tools/qr-generator/components/tool"),
  "csv-to-json": () => import("@/features/tools/csv-to-json/components/tool"),
  "json-to-csv": () => import("@/features/tools/json-to-csv/components/tool"),
  "xml-formatter": () => import("@/features/tools/xml-formatter/components/tool"),
  "yaml-converter": () => import("@/features/tools/yaml-converter/components/tool"),
  "barcode-generator": () => import("@/features/tools/barcode-generator/components/tool"),
  "qr-scanner": () => import("@/features/tools/qr-scanner/components/tool"),
  "image-compressor": () => import("@/features/tools/image-compressor/components/tool"),
  "resize-image": () => import("@/features/tools/resize-image/components/tool"),
  "crop-image": () => import("@/features/tools/crop-image/components/tool"),
  "background-remover": () => import("@/features/tools/background-remover/components/tool"),
  "convert-image": () => import("@/features/tools/convert-image/components/tool"),
  "watermark-image": () => import("@/features/tools/watermark-image/components/tool"),
  "meme-generator": () => import("@/features/tools/meme-generator/components/tool"),
  "blur-image": () => import("@/features/tools/blur-image/components/tool"),
  "rotate-image": () => import("@/features/tools/rotate-image/components/tool"),
  "merge-pdf": () => import("@/features/tools/merge-pdf/components/tool"),
  "split-pdf": () => import("@/features/tools/split-pdf/components/tool"),
  "compress-pdf": () => import("@/features/tools/compress-pdf/components/tool"),
  "pdf-to-image": () => import("@/features/tools/pdf-to-image/components/tool"),
  "image-to-pdf": () => import("@/features/tools/image-to-pdf/components/tool"),
  "rotate-pdf": () => import("@/features/tools/rotate-pdf/components/tool"),
  "unlock-pdf": () => import("@/features/tools/unlock-pdf/components/tool"),
  "audio-converter": () => import("@/features/tools/audio-converter/components/tool"),
  "video-compressor": () => import("@/features/tools/video-compressor/components/tool"),
  "mp3-cutter": () => import("@/features/tools/mp3-cutter/components/tool"),
  "video-to-gif": () => import("@/features/tools/video-to-gif/components/tool"),
};

export default async function ToolPage({ params }: ToolPageProps) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) notFound();

  const gradient = categoryColorMap[tool.category];
  const DynamicTool = toolComponents[slug]
    ? dynamic(toolComponents[slug], {
        loading: () => <LoadingState variant="tool" />,
      })
    : null;

  return (
    <ToolLayout
      icon={tool.icon}
      title={tool.name}
      description={tool.description}
      gradient={gradient}
    >
      {DynamicTool ? <DynamicTool /> : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-muted-foreground">This tool is coming soon.</p>
        </div>
      )}
    </ToolLayout>
  );
}