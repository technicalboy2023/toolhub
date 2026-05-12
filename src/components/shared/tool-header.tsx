import type { LucideIcon } from "lucide-react";

interface ToolHeaderProps {
  icon: LucideIcon;
  title: string;
  description: string;
  gradient: string;
}

export function ToolHeader({ icon: Icon, title, description, gradient }: ToolHeaderProps) {
  return (
    <div className="flex flex-col items-center text-center gap-4 mb-8">
      <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${gradient} shadow-xl shadow-indigo-500/10`}>
        <Icon className="h-7 w-7 text-white" />
      </div>
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        <p className="text-muted-foreground max-w-lg mx-auto">{description}</p>
      </div>
    </div>
  );
}