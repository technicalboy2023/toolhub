"use client";

import { useState } from "react";
import { ToolDropzone } from "@/components/shared/tool-dropzone";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download } from "lucide-react";
import { toast } from "sonner";

export default function UnlockPdfTool() {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState("");
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  const handleFile = (f: File) => {
    setFile(f);
    setResultUrl(null);
    setPassword("");
  };

  const unlock = async () => {
    if (!file) return;
    setProcessing(true);
    try {
      const { PDFDocument } = await import("pdf-lib");
      const bytes = await file.arrayBuffer();
      const pdf = await PDFDocument.load(bytes, { password: password || undefined } as any);

      const unlockedBytes = await pdf.save({ useObjectStreams: true });
      const blob = new Blob([new Uint8Array(unlockedBytes)], { type: "application/pdf" });
      setResultUrl(URL.createObjectURL(blob));
      toast.success("PDF unlocked successfully!");
      setProcessing(false);
    } catch {
      toast.error("Failed to unlock PDF. Check the password or try a different file.");
      setProcessing(false);
    }
  };

  const download = () => {
    if (!resultUrl || !file) return;
    const a = document.createElement("a");
    a.href = resultUrl;
    a.download = `unlocked-${file.name}`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {!file ? (
        <ToolDropzone onFile={handleFile} accept=".pdf" />
      ) : (
        <div className="space-y-4">
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter PDF password (if known)"
          />
          <p className="text-xs text-muted-foreground">
            Note: This tool can only remove passwords from PDFs where the password is known or where the
            PDF has owner-level protection without encryption.
          </p>
          <div className="flex gap-2">
            <Button onClick={unlock} disabled={processing} className="flex-1">
              {processing ? "Unlocking..." : "Unlock PDF"}
            </Button>
            <Button onClick={download} disabled={!resultUrl} variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Download Unlocked
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}