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

  const handleFile = (f: File) => {
    setFile(f);
    setResultUrl(null);
  };

  const renameFile = async () => {
    if (!file) return;
    const ext = format === "audio/mp3" ? "mp3" : format === "audio/wav" ? "wav" : "ogg";
    const newFile = new File([file], `renamed.${ext}`, { type: format });
    setResultUrl(URL.createObjectURL(newFile));
    toast.success("File renamed successfully!");
  };

  const download = () => {
    if (!resultUrl || !file) return;
    const a = document.createElement("a");
    a.href = resultUrl;
    const ext = format === "audio/mp3" ? "mp3" : format === "audio/wav" ? "wav" : "ogg";
    a.download = `renamed.${ext}`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {!file ? (
        <ToolDropzone onFile={handleFile} accept="audio/*" />
      ) : (
        <div className="space-y-4">
          <div className="card-bold p-4 bg-yellow-50 border-yellow-200 text-yellow-800 space-y-2">
            <p className="text-sm font-bold flex items-center gap-2">
              ⚠️ Browser-based audio conversion limits
            </p>
            <p className="text-xs">
              Full audio conversion requires WebAssembly (ffmpeg.wasm) which is 30MB+ and slow to load.
              We recommend these free alternatives for real conversion:
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <a href="https://ffmpeg.guide" target="_blank" className="text-xs underline font-medium">FFmpeg.guide (Desktop)</a>
              <a href="https://cloudconvert.com" target="_blank" className="text-xs underline font-medium">CloudConvert.com</a>
              <a href="https://convertio.co" target="_blank" className="text-xs underline font-medium">Convertio.co</a>
            </div>
          </div>

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