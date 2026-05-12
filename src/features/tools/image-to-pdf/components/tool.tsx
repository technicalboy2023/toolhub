"use client";

import { useState } from "react";
import { ToolDropzone } from "@/components/shared/tool-dropzone";
import { Button } from "@/components/ui/button";
import { Download, X } from "lucide-react";
import { toast } from "sonner";

export default function ImageToPdfTool() {
  const [images, setImages] = useState<{ file: File; url: string }[]>([]);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  const handleFile = (f: File) => {
    setImages((prev) => [...prev, { file: f, url: URL.createObjectURL(f) }]);
    setResultUrl(null);
  };

  const removeImage = (i: number) => {
    setImages((prev) => prev.filter((_, idx) => idx !== i));
    setResultUrl(null);
  };

  const convert = async () => {
    if (images.length === 0) return;
    setProcessing(true);
    try {
      const { PDFDocument } = await import("pdf-lib");
      const pdf = await PDFDocument.create();

      for (const { file } of images) {
        const imgBytes = await file.arrayBuffer();
        let image;
        if (file.type === "image/png") {
          image = await pdf.embedPng(imgBytes);
        } else {
          image = await pdf.embedJpg(imgBytes);
        }
        const page = pdf.addPage([image.width, image.height]);
        page.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height });
      }

      const pdfBytes = await pdf.save();
      const blob = new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" });
      setResultUrl(URL.createObjectURL(blob));
      setProcessing(false);
    } catch {
      toast.error("Failed to create PDF");
      setProcessing(false);
    }
  };

  const download = () => {
    if (!resultUrl) return;
    const a = document.createElement("a");
    a.href = resultUrl;
    a.download = "images.pdf";
    a.click();
  };

  return (
    <div className="space-y-6">
      <ToolDropzone onFile={handleFile} accept="image/*" label="Drop images to convert to PDF" />

      {images.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          {images.map((img, i) => (
            <div key={i} className="relative group">
              <img src={img.url} alt={`Image ${i + 1}`} className="rounded-xl w-full h-24 object-cover bg-muted" />
              <button
                onClick={() => removeImage(i)}
                className="absolute top-1 right-1 p-1 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-2">
        <Button onClick={convert} disabled={images.length === 0 || processing} className="flex-1">
          {processing ? "Creating PDF..." : `Create PDF (${images.length} images)`}
        </Button>
        <Button onClick={download} disabled={!resultUrl} variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Download
        </Button>
      </div>
    </div>
  );
}