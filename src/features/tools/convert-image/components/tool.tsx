"use client";

import { useState } from "react";
import { ToolDropzone } from "@/components/shared/tool-dropzone";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const formats = [
  { value: "image/png", label: "PNG", ext: "png" },
  { value: "image/jpeg", label: "JPEG", ext: "jpg" },
  { value: "image/webp", label: "WebP", ext: "webp" },
  { value: "image/bmp", label: "BMP", ext: "bmp" },
  { value: "image/gif", label: "GIF", ext: "gif" },
];

export default function ConvertImageTool() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [format, setFormat] = useState(formats[1].value);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  const handleFile = (f: File) => {
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setResultUrl(null);
  };

  const convert = async () => {
    if (!file) return;
    setProcessing(true);
    try {
      const bitmap = await createImageBitmap(file);
      const canvas = document.createElement("canvas");
      canvas.width = bitmap.width;
      canvas.height = bitmap.height;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(bitmap, 0, 0);

      canvas.toBlob((blob) => {
        if (!blob) return;
        setResultUrl(URL.createObjectURL(blob));
        setProcessing(false);
      }, format, 0.92);
    } catch {
      toast.error("Failed to convert image");
      setProcessing(false);
    }
  };

  const download = () => {
    if (!resultUrl || !file) return;
    const fmt = formats.find((f) => f.value === format)!;
    const a = document.createElement("a");
    a.href = resultUrl;
    a.download = `converted-${file.name.replace(/\.[^.]+$/, "")}.${fmt.ext}`;
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
              <img src={preview} alt="Preview" className="rounded-xl max-h-48 object-contain bg-muted" />
            </div>
          )}

          <Select value={format} onValueChange={(v) => v && setFormat(v)}>
            <SelectTrigger>
              <SelectValue placeholder="Select format" />
            </SelectTrigger>
            <SelectContent>
              {formats.map((f) => (
                <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {resultUrl && (
            <div className="flex justify-center">
              <img src={resultUrl} alt="Converted" className="rounded-xl max-h-48 object-contain bg-muted" />
            </div>
          )}

          <div className="flex gap-2">
            <Button onClick={convert} disabled={processing} className="flex-1">
              {processing ? "Converting..." : "Convert"}
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