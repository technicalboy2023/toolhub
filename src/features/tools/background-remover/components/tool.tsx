"use client";

import { useState } from "react";
import { ToolDropzone } from "@/components/shared/tool-dropzone";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { toast } from "sonner";

export default function BackgroundRemoverTool() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  const handleFile = (f: File) => {
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setResultUrl(null);
  };

  const removeBackground = async () => {
    if (!file) return;
    setProcessing(true);
    try {
      const img = await createImageBitmap(file);
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // Simple chroma-key: detect dominant background color from edges and make transparent
      const edgePixels: number[][] = [];
      const w = canvas.width;
      const h = canvas.height;

      // Sample edges
      for (let x = 0; x < w; x++) {
        for (const y of [0, h - 1]) {
          const i = (y * w + x) * 4;
          edgePixels.push([data[i], data[i + 1], data[i + 2]]);
        }
      }
      for (let y = 0; y < h; y++) {
        for (const x of [0, w - 1]) {
          const i = (y * w + x) * 4;
          edgePixels.push([data[i], data[i + 1], data[i + 2]]);
        }
      }

      // Average edge color
      const avg = edgePixels.reduce((acc, p) => [acc[0] + p[0], acc[1] + p[1], acc[2] + p[2]], [0, 0, 0]);
      const n = edgePixels.length;
      const bgColor = [avg[0] / n, avg[1] / n, avg[2] / n];
      const threshold = 60;

      for (let i = 0; i < data.length; i += 4) {
        const dr = data[i] - bgColor[0];
        const dg = data[i + 1] - bgColor[1];
        const db = data[i + 2] - bgColor[2];
        const dist = Math.sqrt(dr * dr + dg * dg + db * db);
        if (dist < threshold) {
          data[i + 3] = 0;
        }
      }

      ctx.putImageData(imageData, 0, 0);
      canvas.toBlob((blob) => {
        if (!blob) return;
        setResultUrl(URL.createObjectURL(blob));
        setProcessing(false);
      }, "image/png");
    } catch {
      toast.error("Failed to process image");
      setProcessing(false);
    }
  };

  const download = () => {
    if (!resultUrl || !file) return;
    const a = document.createElement("a");
    a.href = resultUrl;
    a.download = `bg-removed-${file.name.replace(/\.[^.]+$/, ".png")}`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {!file ? (
        <ToolDropzone onFile={handleFile} accept="image/*" />
      ) : (
        <div className="space-y-6">
          <p className="text-xs text-muted-foreground text-center">
            This uses a simple color-based background removal. For best results, use images with a solid background color.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {preview && (
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2">Original</p>
                <img src={preview} alt="Original" className="rounded-xl w-full max-h-48 object-contain bg-muted" />
              </div>
            )}
            {resultUrl && (
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2">Background Removed</p>
                <div className="rounded-xl w-full max-h-48 bg-[repeating-conic-gradient(#e5e5e5_0%_25%,#fff_0%_50%)] bg-[length:20px_20px] flex items-center justify-center">
                  <img src={resultUrl} alt="Result" className="max-h-48 object-contain" />
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <Button onClick={removeBackground} disabled={processing} className="flex-1">
              {processing ? "Processing..." : "Remove Background"}
            </Button>
            <Button onClick={download} disabled={!resultUrl} variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Download PNG
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}