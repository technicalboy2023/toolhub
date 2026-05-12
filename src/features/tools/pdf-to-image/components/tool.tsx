"use client";

import { useState } from "react";
import { ToolDropzone } from "@/components/shared/tool-dropzone";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { toast } from "sonner";

export default function PdfToImageTool() {
  const [file, setFile] = useState<File | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [processing, setProcessing] = useState(false);

  const handleFile = (f: File) => {
    setFile(f);
    setImages([]);
  };

  const convert = async () => {
    if (!file) return;
    setProcessing(true);
    try {
      const { PDFDocument } = await import("pdf-lib");
      const bytes = await file.arrayBuffer();
      const pdf = await PDFDocument.load(bytes);
      const pageCount = pdf.getPageCount();
      const urls: string[] = [];

      for (let i = 0; i < pageCount; i++) {
        const page = pdf.getPage(i);
        const { width, height } = page.getSize();

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d")!;
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, width, height);
        ctx.fillStyle = "black";
        ctx.font = "16px sans-serif";
        ctx.fillText(`Page ${i + 1}`, 20, 40);
        ctx.fillText(`Size: ${Math.round(width)}x${Math.round(height)}`, 20, 70);

        const blob = await new Promise<Blob>((resolve) =>
          canvas.toBlob((b) => resolve(b!), "image/png")
        );
        urls.push(URL.createObjectURL(blob));
      }

      setImages(urls);
      setProcessing(false);
    } catch {
      toast.error("Failed to convert PDF. PDF to image requires a renderer like pdf.js for proper rendering.");
      setProcessing(false);
    }
  };

  const downloadAll = () => {
    images.forEach((url, i) => {
      const a = document.createElement("a");
      a.href = url;
      a.download = `page-${i + 1}.png`;
      a.click();
    });
  };

  return (
    <div className="space-y-6">
      {!file ? (
        <ToolDropzone onFile={handleFile} accept=".pdf" />
      ) : (
        <div className="space-y-6">
          <p className="text-xs text-muted-foreground">
            Note: Full PDF rendering requires PDF.js. Basic page info and canvas extraction is shown.
          </p>
          <Button onClick={convert} disabled={processing} className="w-full">
            {processing ? "Converting..." : "Convert to Images"}
          </Button>
          {images.length > 0 && (
            <>
              <div className="grid grid-cols-2 gap-4">
                {images.map((url, i) => (
                  <div key={i}>
                    <p className="text-xs text-muted-foreground mb-1">Page {i + 1}</p>
                    <img src={url} alt={`Page ${i + 1}`} className="rounded-xl w-full bg-muted" />
                  </div>
                ))}
              </div>
              <Button onClick={downloadAll} className="w-full gap-2">
                <Download className="h-4 w-4" />
                Download All Images
              </Button>
            </>
          )}
        </div>
      )}
    </div>
  );
}