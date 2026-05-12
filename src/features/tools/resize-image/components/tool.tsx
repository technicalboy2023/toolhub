"use client";

import { useState, useRef } from "react";
import { ToolDropzone } from "@/components/shared/tool-dropzone";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download } from "lucide-react";
import { toast } from "sonner";

export default function ResizeImageTool() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [width, setWidth] = useState(800);
  const [height, setHeight] = useState(600);
  const [maintainRatio, setMaintainRatio] = useState(true);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const aspectRatioRef = useRef(1);

  const handleFile = (f: File) => {
    setFile(f);
    const url = URL.createObjectURL(f);
    setPreview(url);
    setResultUrl(null);

    const img = new Image();
    img.onload = () => {
      setWidth(img.naturalWidth);
      setHeight(img.naturalHeight);
      aspectRatioRef.current = img.naturalWidth / img.naturalHeight;
    };
    img.src = url;
  };

  const handleWidthChange = (val: number) => {
    setWidth(val);
    if (maintainRatio) setHeight(Math.round(val / aspectRatioRef.current));
  };

  const handleHeightChange = (val: number) => {
    setHeight(val);
    if (maintainRatio) setWidth(Math.round(val * aspectRatioRef.current));
  };

  const resize = async () => {
    if (!file) return;
    setProcessing(true);
    try {
      const bitmap = await createImageBitmap(file);
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d")!;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(bitmap, 0, 0, width, height);

      canvas.toBlob((blob) => {
        if (!blob) return;
        setResultUrl(URL.createObjectURL(blob));
        setProcessing(false);
      }, file.type || "image/png");
    } catch {
      toast.error("Failed to resize image");
      setProcessing(false);
    }
  };

  const download = () => {
    if (!resultUrl || !file) return;
    const ext = file.name.split(".").pop() || "png";
    const a = document.createElement("a");
    a.href = resultUrl;
    a.download = `resized-${width}x${height}.${ext}`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {!file ? (
        <ToolDropzone onFile={handleFile} accept="image/*" />
      ) : (
        <div className="space-y-6">
          {preview && (
            <div className="flex justify-center">
              <img src={preview} alt="Original" className="rounded-xl max-h-48 object-contain bg-muted" />
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs text-muted-foreground">Width (px)</label>
              <Input type="number" value={width} onChange={(e) => handleWidthChange(Number(e.target.value))} min={1} />
            </div>
            <div className="space-y-2">
              <label className="text-xs text-muted-foreground">Height (px)</label>
              <Input type="number" value={height} onChange={(e) => handleHeightChange(Number(e.target.value))} min={1} />
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={maintainRatio} onChange={() => setMaintainRatio(!maintainRatio)} className="rounded" />
            Maintain aspect ratio
          </label>

          <div className="flex gap-2">
            <Button onClick={resize} disabled={processing} className="flex-1">
              {processing ? "Resizing..." : "Resize"}
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