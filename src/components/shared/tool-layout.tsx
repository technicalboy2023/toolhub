import type { ReactNode } from "react";
import { Shield } from "lucide-react";
import { ToolHeader } from "./tool-header";
import type { LucideIcon } from "lucide-react";

interface ToolLayoutProps {
  icon: LucideIcon;
  title: string;
  description: string;
  gradient: string;
  children: ReactNode;
}

export function ToolLayout({
  icon,
  title,
  description,
  gradient,
  children,
}: ToolLayoutProps) {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12 max-w-4xl">
      <ToolHeader
        icon={icon}
        title={title}
        description={description}
        gradient={gradient}
      />

      {/* Tool content */}
      <div className="glass-card rounded-2xl p-6 md:p-8 mb-6">
        {children}
      </div>

      {/* Privacy notice */}
      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground/60">
        <Shield className="h-4 w-4 text-emerald-500" />
        <span>Your files stay on your device. Nothing is uploaded to any server.</span>
      </div>
    </div>
  );
}