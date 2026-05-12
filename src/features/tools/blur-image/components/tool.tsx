"use client";

import { useState, useEffect } from "react";
import { ToolDropzone } from "@/components/shared/tool-dropzone";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";

export default function BlurImageTool() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [blurRadius, setBlurRadius] = useState(5);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  const handleFile = (f: File) => {
    setFile(f);
    setPreview(URL.createObjectURL(f));
    applyBlur(f, blurRadius);
  };

  const applyBlur = async (f: File, radius: number) => {
    setProcessing(true);
    try {
      const img = await createImageBitmap(f);
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0);
      ctx.filter = `blur(${radius}px)`;
      ctx.drawImage(img, 0, 0);

      canvas.toBlob((blob) => {
        if (!blob) return;
        setResultUrl(URL.createObjectURL(blob));
        setProcessing(false);
      }, f.type || "image/png");
    } catch {
      toast.error("Failed to apply blur");
      setProcessing(false);
    }
  };

  const download = () => {
    if (!resultUrl || !file) return;
    const a = document.createElement("a");
    a.href = resultUrl;
    a.download = `blurred-${file.name}`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {!file ? (
        <ToolDropzone onFile={handleFile} accept="image/*" />
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {preview && (
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2">Original</p>
                <img src={preview} alt="Original" className="rounded-xl w-full max-h-48 object-contain bg-muted" />
              </div>
            )}
            {resultUrl && (
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2">Blurred (radius: {blurRadius}px)</p>
                <img src={resultUrl} alt="Blurred" className="rounded-xl w-full max-h-48 object-contain bg-muted" />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Blur Radius: {blurRadius}px</span>
            </div>
            <Slider value={[blurRadius]} onValueChange={(val) => { const v = Array.isArray(val) ? val[0] : val;
              setBlurRadius(v);
              if (file) applyBlur(file, v);
            }} min={1} max={20} step={1} />
          </div>

          {processing && <p className="text-sm text-muted-foreground text-center">Applying blur...</p>}

          <Button onClick={download} disabled={!resultUrl || processing} className="w-full gap-2">
            <Download className="h-4 w-4" />
            Download Blurred Image
          </Button>
        </div>
      )}
    </div>
  );
}