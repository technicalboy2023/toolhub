"use client";

import { useState, useRef, useCallback } from "react";
import { ToolDropzone } from "@/components/shared/tool-dropzone";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download } from "lucide-react";
import { toast } from "sonner";

export default function CropImageTool() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  // Crop dimensions (percentage-based)
  const [crop, setCrop] = useState({ x: 10, y: 10, w: 80, h: 80 });
  const imgRef = useRef<HTMLImageElement>(null);
  const [imgNatural, setImgNatural] = useState({ w: 0, h: 0 });

  const handleFile = (f: File) => {
    setFile(f);
    const url = URL.createObjectURL(f);
    setPreview(url);
    setResultUrl(null);
    const img = new Image();
    img.onload = () => setImgNatural({ w: img.naturalWidth, h: img.naturalHeight });
    img.src = url;
  };

  const cropImage = async () => {
    if (!file) return;
    setProcessing(true);
    try {
      const bitmap = await createImageBitmap(file);
      const x = Math.round((crop.x / 100) * bitmap.width);
      const y = Math.round((crop.y / 100) * bitmap.height);
      const w = Math.round((crop.w / 100) * bitmap.width);
      const h = Math.round((crop.h / 100) * bitmap.height);

      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(bitmap, x, y, w, h, 0, 0, w, h);

      canvas.toBlob((blob) => {
        if (!blob) return;
        setResultUrl(URL.createObjectURL(blob));
        setProcessing(false);
      }, file.type || "image/png");
    } catch {
      toast.error("Failed to crop image");
      setProcessing(false);
    }
  };

  const download = () => {
    if (!resultUrl || !file) return;
    const ext = file.name.split(".").pop() || "png";
    const a = document.createElement("a");
    a.href = resultUrl;
    a.download = `cropped-${file.name}`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {!file ? (
        <ToolDropzone onFile={handleFile} accept="image/*" />
      ) : (
        <div className="space-y-6">
          {preview && (
            <div className="relative flex justify-center">
              <img ref={imgRef} src={preview} alt="Original" className="rounded-xl max-h-64 object-contain bg-muted" />
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            {(["x", "y", "w", "h"] as const).map((key) => (
              <div key={key} className="space-y-2">
                <label className="text-xs text-muted-foreground uppercase">
                  {key === "x" ? "Left %" : key === "y" ? "Top %" : key === "w" ? "Width %" : "Height %"}
                </label>
                <Input
                  type="number"
                  min={key === "w" || key === "h" ? 1 : 0}
                  max={100}
                  value={crop[key]}
                  onChange={(e) => setCrop({ ...crop, [key]: Number(e.target.value) })}
                />
              </div>
            ))}
          </div>

          {resultUrl && (
            <div className="flex justify-center">
              <img src={resultUrl} alt="Cropped" className="rounded-xl max-h-48 object-contain bg-muted" />
            </div>
          )}

          <div className="flex gap-2">
            <Button onClick={cropImage} disabled={processing} className="flex-1">
              {processing ? "Cropping..." : "Crop Image"}
            </Button>
            <Button onClick={download} disabled={!resultUrl} variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Download
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}