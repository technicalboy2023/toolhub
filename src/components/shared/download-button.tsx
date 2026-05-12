"use client";

import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DownloadButtonProps {
  onClick: () => void;
  filename: string;
  disabled?: boolean;
  loading?: boolean;
}

export function DownloadButton({
  onClick,
  filename,
  disabled,
  loading,
}: DownloadButtonProps) {
  return (
    <Button
      onClick={onClick}
      disabled={disabled || loading}
      className="w-full gap-2"
    >
      {loading ? (
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : (
        <Download className="h-4 w-4" />
      )}
      {loading ? "Processing..." : `Download ${filename}`}
    </Button>
  );
}