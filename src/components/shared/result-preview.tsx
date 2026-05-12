"use client";

import { Copy, Check } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ResultPreviewProps {
  title?: string;
  children: React.ReactNode;
  copyable?: string;
}

export function ResultPreview({
  title = "Result",
  children,
  copyable,
}: ResultPreviewProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!copyable) return;
    try {
      await navigator.clipboard.writeText(copyable);
      setCopied(true);
      toast.success("Copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        {copyable && (
          <Button
            variant="ghost"
            size="xs"
            onClick={handleCopy}
            className="gap-1.5"
          >
            {copied ? (
              <Check className="h-3.5 w-3.5 text-emerald-500" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
            {copied ? "Copied" : "Copy"}
          </Button>
        )}
      </div>
      <div className="rounded-xl bg-muted/50 p-4 overflow-auto max-h-96">
        {children}
      </div>
    </div>
  );
}