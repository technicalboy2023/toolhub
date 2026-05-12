"use client";

import { useState } from "react";
import { ToolDropzone } from "@/components/shared/tool-dropzone";
import { Button } from "@/components/ui/button";
import { Download, RotateCw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function RotatePdfTool() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [rotation, setRotation] = useState(90);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  const handleFile = async (f: File) => {
    setFile(f);
    setResultUrl(null);
    try {
      const { PDFDocument } = await import("pdf-lib");
      const bytes = await f.arrayBuffer();
      const pdf = await PDFDocument.load(bytes);
      setPageCount(pdf.getPageCount());
    } catch {
      toast.error("Invalid PDF file");
    }
  };

  const rotate = async () => {
    if (!file) return;
    setProcessing(true);
    try {
      const { PDFDocument } = await import("pdf-lib");
      const bytes = await file.arrayBuffer();
      const pdf = await PDFDocument.load(bytes);

      const pages = pdf.getPages();
      for (const page of pages) {
        page.setRotation({ type: 'degrees', angle: page.getRotation().angle + rotation } as any);
      }

      const rotatedBytes = await pdf.save();
      const blob = new Blob([new Uint8Array(rotatedBytes)], { type: "application/pdf" });
      setResultUrl(URL.createObjectURL(blob));
      setProcessing(false);
    } catch {
      toast.error("Failed to rotate PDF");
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {!file ? (
        <ToolDropzone onFile={handleFile} accept=".pdf" />
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">{pageCount} page(s) detected</p>
          <div className="flex gap-2">
            {[90, 180, 270].map((deg) => (
              <Button key={deg} variant={rotation === deg ? "default" : "outline"} onClick={() => setRotation(deg)} className="gap-1">
                <RotateCw className="h-4 w-4" />
                {deg}°
              </Button>
            ))}
          </div>
          <div className="flex gap-2">
            <Button onClick={rotate} disabled={processing} className="flex-1">
              {processing ? "Rotating..." : "Rotate All Pages"}
            </Button>
            <Button onClick={() => {
              if (!resultUrl) return;
              const a = document.createElement("a");
              a.href = resultUrl;
              a.download = `rotated-${file!.name}`;
              a.click();
            }} disabled={!resultUrl} variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Download
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}