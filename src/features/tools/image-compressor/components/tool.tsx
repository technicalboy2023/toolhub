"use client";

import { useState } from "react";
import { ToolDropzone } from "@/components/shared/tool-dropzone";
import { Button } from "@/components/ui/button";
import { Download, ImageIcon } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";

export default function ImageCompressorTool() {
  const [file, setFile] = useState<File | null>(null);
  const [quality, setQuality] = useState(80);
  const [preview, setPreview] = useState<string | null>(null);
  const [compressedSize, setCompressedSize] = useState<number | null>(null);
  const [compressedUrl, setCompressedUrl] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  const handleFile = (f: File) => {
    setFile(f);
    const url = URL.createObjectURL(f);
    setPreview(url);
    setCompressedUrl(null);
    setCompressedSize(null);
    compressImage(f, quality);
  };

  const compressImage = async (f: File, q: number) => {
    setProcessing(true);
    try {
      const img = new Image();
      const bitmap = await createImageBitmap(f);
      const canvas = document.createElement("canvas");
      canvas.width = bitmap.width;
      canvas.height = bitmap.height;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(bitmap, 0, 0);

      canvas.toBlob(
        (blob) => {
          if (!blob) return;
          setCompressedSize(blob.size);
          setCompressedUrl(URL.createObjectURL(blob));
          setProcessing(false);
        },
        "image/jpeg",
        q / 100,
      );
    } catch {
      toast.error("Failed to compress image");
      setProcessing(false);
    }
  };

  const handleQualityChange = (val: number | readonly number[]) => {
    const q = Array.isArray(val) ? val[0] : val;
    setQuality(q);
    if (file) compressImage(file, q);
  };

  const download = () => {
    if (!compressedUrl || !file) return;
    const a = document.createElement("a");
    a.href = compressedUrl;
    a.download = `compressed-${file.name.replace(/\.[^.]+$/, ".jpg")}`;
    a.click();
  };

  const originalSize = file?.size ?? 0;
  const savings = compressedSize ? Math.round((1 - compressedSize / originalSize) * 100) : 0;

  return (
    <div className="space-y-6">
      {!file ? (
        <ToolDropzone onFile={handleFile} accept="image/*" label="Drop an image to compress" />
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {preview && (
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground">Original ({(originalSize / 1024).toFixed(1)} KB)</p>
                <img src={preview} alt="Original" className="rounded-xl w-full max-h-48 object-contain bg-muted" />
              </div>
            )}
            {compressedUrl && (
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground">
                  Compressed ({(compressedSize! / 1024).toFixed(1)} KB, -{savings}%)
                </p>
                <img src={compressedUrl} alt="Compressed" className="rounded-xl w-full max-h-48 object-contain bg-muted" />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Quality: {quality}%</span>
            </div>
            <Slider value={[quality]} onValueChange={(val) => handleQualityChange(Array.isArray(val) ? val : [val])} min={1} max={100} step={1} />
          </div>

          {processing && <p className="text-sm text-muted-foreground text-center">Processing...</p>}

          <Button onClick={download} disabled={!compressedUrl || processing} className="w-full gap-2">
            <Download className="h-4 w-4" />
            Download Compressed Image
          </Button>
        </div>
      )}
    </div>
  );
}