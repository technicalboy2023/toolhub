"use client";

import { useState } from "react";
import { ToolDropzone } from "@/components/shared/tool-dropzone";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export default function AudioConverterTool() {
  const [file, setFile] = useState<File | null>(null);
  const [format, setFormat] = useState("audio/mp3");
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  const handleFile = (f: File) => {
    setFile(f);
    setResultUrl(null);
  };

  const convert = async () => {
    if (!file) return;
    setProcessing(true);
    try {
      // Audio conversion requires ffmpeg.wasm. For now, provide the original file.
      toast.info(`Full audio conversion requires ffmpeg.wasm. The original file will be downloaded.`);
      setResultUrl(URL.createObjectURL(file));
      setProcessing(false);
    } catch {
      toast.error("Failed to convert audio");
      setProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!resultUrl || !file) return;
    const a = document.createElement("a");
    a.href = resultUrl;
    const ext = format === "audio/mp3" ? "mp3" : format === "audio/wav" ? "wav" : "ogg";
    a.download = `converted-${file.name.replace(/\.[^.]+$/, "")}.${ext}`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {!file ? (
        <ToolDropzone onFile={handleFile} accept="audio/*" />
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">Selected: {file.name}</p>
          <Select value={format} onValueChange={(v) => v && setFormat(v)}>
            <SelectTrigger>
              <SelectValue placeholder="Output format" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="audio/mp3">MP3</SelectItem>
              <SelectItem value="audio/wav">WAV</SelectItem>
              <SelectItem value="audio/ogg">OGG</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            Note: Full audio conversion requires ffmpeg.wasm. Basic mode provides file rename.
          </p>
          <div className="flex gap-2">
            <Button onClick={convert} disabled={processing} className="flex-1">
              {processing ? "Converting..." : "Convert"}
            </Button>
            <Button onClick={handleDownload} disabled={!resultUrl} variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Download
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}