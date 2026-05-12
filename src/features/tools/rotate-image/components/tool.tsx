"use client";

import { useState } from "react";
import { ToolDropzone } from "@/components/shared/tool-dropzone";
import { Button } from "@/components/ui/button";
import { Download, RotateCw, FlipHorizontal, FlipVertical } from "lucide-react";
import { toast } from "sonner";

export default function RotateImageTool() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [rotation, setRotation] = useState(0);
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);

  const handleFile = (f: File) => {
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setRotation(0);
    setFlipH(false);
    setFlipV(false);
    setResultUrl(null);
  };

  const processImage = async () => {
    if (!file) return;
    try {
      const img = await createImageBitmap(file);
      const canvas = document.createElement("canvas");

      const rad = (rotation * Math.PI) / 180;
      const cos = Math.abs(Math.cos(rad));
      const sin = Math.abs(Math.sin(rad));
      canvas.width = Math.ceil(img.width * cos + img.height * sin);
      canvas.height = Math.ceil(img.width * sin + img.height * cos);

      const ctx = canvas.getContext("2d")!;
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate(rad);
      if (flipH) ctx.scale(-1, 1);
      if (flipV) ctx.scale(1, -1);
      ctx.drawImage(img, -img.width / 2, -img.height / 2);

      canvas.toBlob((blob) => {
        if (!blob) return;
        setResultUrl(URL.createObjectURL(blob));
      }, file.type || "image/png");
    } catch {
      toast.error("Failed to process image");
    }
  };

  const handleRotate = (deg: number) => {
    setRotation((r) => {
      const newR = r + deg;
      setRotation(newR);
      setTimeout(() => processImage(), 0);
      return newR;
    });
  };

  const toggleFlipH = () => {
    setFlipH(!flipH);
    setTimeout(() => processImage(), 0);
  };

  const toggleFlipV = () => {
    setFlipV(!flipV);
    setTimeout(() => processImage(), 0);
  };

  const download = () => {
    if (!resultUrl || !file) return;
    const a = document.createElement("a");
    a.href = resultUrl;
    a.download = `rotated-${file.name}`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {!file ? (
        <ToolDropzone onFile={handleFile} accept="image/*" />
      ) : (
        <div className="space-y-6">
          <div className="flex flex-wrap justify-center gap-2">
            <Button variant="outline" onClick={() => handleRotate(-90)} className="gap-2">
              <RotateCw className="h-4 w-4 -scale-x-100" />
              -90°
            </Button>
            <Button variant="outline" onClick={() => handleRotate(90)} className="gap-2">
              <RotateCw className="h-4 w-4" />
              +90°
            </Button>
            <Button variant="outline" onClick={toggleFlipH} className={`gap-2 ${flipH ? "bg-accent" : ""}`}>
              <FlipHorizontal className="h-4 w-4" />
              Flip H
            </Button>
            <Button variant="outline" onClick={toggleFlipV} className={`gap-2 ${flipV ? "bg-accent" : ""}`}>
              <FlipVertical className="h-4 w-4" />
              Flip V
            </Button>
            <Button variant="secondary" onClick={() => { setRotation(0); setFlipH(false); setFlipV(false); processImage(); }}>
              Reset
            </Button>
          </div>

          {resultUrl && (
            <div className="flex justify-center">
              <img src={resultUrl} alt="Processed" className="rounded-xl max-h-64 object-contain bg-muted" />
            </div>
          )}

          <Button onClick={download} className="w-full gap-2">
            <Download className="h-4 w-4" />
            Download
          </Button>
        </div>
      )}
    </div>
  );
}