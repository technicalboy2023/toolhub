"use client";

import { useState } from "react";
import { ToolDropzone } from "@/components/shared/tool-dropzone";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";

export default function VideoCompressorTool() {
  const [file, setFile] = useState<File | null>(null);
  const [quality, setQuality] = useState(70);
  const [resultUrl, setResultUrl] = useState<string | null>(null);

  const handleFile = (f: File) => {
    setFile(f);
    setResultUrl(null);
  };

  const renameFile = async () => {
    if (!file) return;
    const newFile = new File([file], `renamed.${file.name.split('.').pop()}`, { type: file.type });
    setResultUrl(URL.createObjectURL(newFile));
    toast.success("File renamed successfully!");
  };

  const download = () => {
    if (!resultUrl || !file) return;
    const a = document.createElement("a");
    a.href = resultUrl;
    a.download = `renamed-${file.name}`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {!file ? (
        <ToolDropzone onFile={handleFile} accept="video/*" maxSize={500 * 1024 * 1024} />
      ) : (
        <div className="space-y-4">
          <div className="card-bold p-4 bg-yellow-50 border-yellow-200 text-yellow-800 space-y-2">
            <p className="text-sm font-bold flex items-center gap-2">
              ⚠️ Browser-based video compression limits
            </p>
            <p className="text-xs">
              Full video compression requires WebAssembly (ffmpeg.wasm) which is 30MB+ and slow to load.
              We recommend these free alternatives for real conversion:
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <a href="https://ffmpeg.guide" target="_blank" className="text-xs underline font-medium">FFmpeg.guide (Desktop)</a>
              <a href="https://cloudconvert.com" target="_blank" className="text-xs underline font-medium">CloudConvert.com</a>
              <a href="https://convertio.co" target="_blank" className="text-xs underline font-medium">Convertio.co</a>
            </div>
          </div>

          <p className="text-sm text-muted-foreground">Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(1)} MB)</p>
          <p className="text-xs text-muted-foreground">
            Note: This tool only renames the file extension.
          </p>
          <div className="flex gap-2">
            <Button onClick={renameFile} className="flex-1 btn-primary">
              Rename File
            </Button>
            <Button onClick={download} disabled={!resultUrl} variant="outline" className="gap-2 btn-secondary">
              <Download className="h-4 w-4" />
              Download
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}