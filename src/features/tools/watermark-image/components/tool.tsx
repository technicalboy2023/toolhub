"use client";

import { useState } from "react";
import { ToolDropzone } from "@/components/shared/tool-dropzone";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download } from "lucide-react";
import { toast } from "sonner";

export default function WatermarkImageTool() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [watermarkText, setWatermarkText] = useState("© ToolsHub");
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  const handleFile = (f: File) => {
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setResultUrl(null);
  };

  const addWatermark = async () => {
    if (!file) return;
    setProcessing(true);
    try {
      const img = await createImageBitmap(file);
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0);

      ctx.font = `bold ${Math.max(16, img.width * 0.04)}px sans-serif`;
      ctx.fillStyle = "rgba(255,255,255,0.5)";
      ctx.textAlign = "center";

      const textWidth = ctx.measureText(watermarkText).width;
      const x = img.width / 2;
      const y = img.height / 2;

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(-Math.PI / 4);
      ctx.fillText(watermarkText, 0, 0);
      ctx.restore();

      canvas.toBlob((blob) => {
        if (!blob) return;
        setResultUrl(URL.createObjectURL(blob));
        setProcessing(false);
      }, file.type || "image/png");
    } catch {
      toast.error("Failed to add watermark");
      setProcessing(false);
    }
  };

  const download = () => {
    if (!resultUrl || !file) return;
    const a = document.createElement("a");
    a.href = resultUrl;
    a.download = `watermarked-${file.name}`;
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

          <Input
            value={watermarkText}
            onChange={(e) => setWatermarkText(e.target.value)}
            placeholder="Watermark text"
          />

          {resultUrl && (
            <div className="flex justify-center">
              <img src={resultUrl} alt="Watermarked" className="rounded-xl max-h-48 object-contain bg-muted" />
            </div>
          )}

          <div className="flex gap-2">
            <Button onClick={addWatermark} disabled={processing} className="flex-1">
              {processing ? "Processing..." : "Add Watermark"}
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