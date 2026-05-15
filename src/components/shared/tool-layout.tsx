import type { ReactNode } from "react";
import { Shield } from "lucide-react";
import { ToolHeader } from "./tool-header";
import type { LucideIcon } from "lucide-react";
import { tools, getToolsByCategory } from "@/features/tools/registry";
import Link from "next/link";

interface ToolLayoutProps {
  icon: LucideIcon;
  title: string;
  description: string;
  flatColor: string;
  children: ReactNode;
  category: string;
}

export function ToolLayout({
  icon,
  title,
  description,
  flatColor,
  children,
  category,
}: ToolLayoutProps) {
  const relatedTools = getToolsByCategory(category as any)
    .filter((t) => t.slug !== title.toLowerCase().replace(/\s+/g, "-"))
    .slice(0, 3);

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 max-w-4xl">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm font-bold mb-6">
        <Link
          href="/"
          className="hover:bg-primary hover:text-foreground px-1 transition-colors"
        >
          HOME
        </Link>
        <span className="text-muted-foreground">/</span>
        <Link
          href="/tools"
          className="hover:bg-primary hover:text-foreground px-1 transition-colors"
        >
          TOOLS
        </Link>
        <span className="text-muted-foreground">/</span>
        <span className="text-muted-foreground">{title}</span>
      </nav>

      <ToolHeader
        icon={icon}
        title={title}
        description={description}
        flatColor={flatColor}
      />

      {/* Tool content */}
      <div className="card-bold p-6 md:p-8 mb-6">{children}</div>

      {/* Related tools */}
      {relatedTools.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4">
            YOU MIGHT ALSO LIKE
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {relatedTools.map((relatedTool) => (
              <Link
                key={relatedTool.slug}
                href={`/tools/${relatedTool.slug}`}
                className="card-bold p-4 flex items-center gap-3 hover:shadow-[6px_6px_0px_0px] transition-all duration-100"
              >
                <div
                  className="flex h-8 w-8 items-center justify-center border-2 border-foreground shrink-0"
                  style={{ backgroundColor: getCategoryColor(relatedTool.category) }}
                >
                  <relatedTool.icon className="h-4 w-4 text-white" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold truncate">{relatedTool.name}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {relatedTool.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Privacy notice */}
      <div className="flex items-center justify-center gap-2 text-sm font-bold border-t-2 border-foreground pt-4 mt-6 text-muted-foreground bg-primary">
        <Shield className="h-4 w-4 text-foreground" />
        <span>Your files stay on your device. Nothing is uploaded to any server.</span>
      </div>
    </div>
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
