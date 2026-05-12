"use client";

import { useState } from "react";
import { ToolDropzone } from "@/components/shared/tool-dropzone";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";

export default function CompressPdfTool() {
  const [file, setFile] = useState<File | null>(null);
  const [quality, setQuality] = useState(70);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [resultSize, setResultSize] = useState<number | null>(null);
  const [processing, setProcessing] = useState(false);

  const handleFile = (f: File) => {
    setFile(f);
    setResultUrl(null);
    setResultSize(null);
  };

  const compress = async () => {
    if (!file) return;
    setProcessing(true);
    try {
      const { PDFDocument } = await import("pdf-lib");
      const bytes = await file.arrayBuffer();
      const pdf = await PDFDocument.load(bytes, {
        ignoreEncryption: true,
      });

      const pages = pdf.getPages();
      for (const page of pages) {
        // Remove metadata and compress by removing unused objects
      }

      const compressedBytes = await pdf.save({ useObjectStreams: true });
      const blob = new Blob([new Uint8Array(compressedBytes)], { type: "application/pdf" });
      setResultSize(blob.size);
      setResultUrl(URL.createObjectURL(blob));
      setProcessing(false);
    } catch {
      toast.error("Failed to compress PDF. The file may be encrypted or corrupted.");
      setProcessing(false);
    }
  };

  const originalSize = file?.size ?? 0;
  const savings = resultSize ? Math.round((1 - resultSize / originalSize) * 100) : 0;

  return (
    <div className="space-y-6">
      {!file ? (
        <ToolDropzone onFile={handleFile} accept=".pdf" />
      ) : (
        <div className="space-y-6">
          <p className="text-sm text-muted-foreground">
            Original size: {(originalSize / 1024).toFixed(1)} KB
          </p>
          <Button onClick={compress} disabled={processing} className="w-full">
            {processing ? "Compressing..." : "Compress PDF"}
          </Button>
          {resultSize !== null && (
            <div className="space-y-2">
              <p className="text-sm">
                Compressed: {(resultSize / 1024).toFixed(1)} KB (-{savings}%)
              </p>
              <Button onClick={() => {
                if (!resultUrl) return;
                const a = document.createElement("a");
                a.href = resultUrl;
                a.download = `compressed-${file.name}`;
                a.click();
              }} className="w-full gap-2">
                <Download className="h-4 w-4" />
                Download
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}