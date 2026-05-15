import type { LucideIcon } from "lucide-react";

interface ToolHeaderProps {
  icon: LucideIcon;
  title: string;
  description: string;
  flatColor: string;
}

export function ToolHeader({ icon: Icon, title, description, flatColor }: ToolHeaderProps) {
  return (
    <div className="flex flex-col items-center text-center gap-4 mb-8">
      <div
        className="flex h-14 w-14 items-center justify-center border-2 border-foreground"
        style={{ backgroundColor: flatColor }}
      >
        <Icon className="h-7 w-7 text-white" />
      </div>
      <div className="space-y-2">
        <h1 className="text-3xl font-black uppercase tracking-tight section-heading">
          {title}
        </h1>
        <p className="text-muted-foreground max-w-lg mx-auto">{description}</p>
      </div>
    </div>
  );
}
