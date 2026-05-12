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
  const [processing, setProcessing] = useState(false);

  const handleFile = (f: File) => {
    setFile(f);
    setResultUrl(null);
  };

  const compress = async () => {
    if (!file) return;
    setProcessing(true);
    try {
      // Video compression requires ffmpeg.wasm
      toast.info(`Video compression requires ffmpeg.wasm. The original file will be downloaded for now.`);
      setResultUrl(URL.createObjectURL(file));
      setProcessing(false);
    } catch {
      toast.error("Failed to compress video");
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {!file ? (
        <ToolDropzone onFile={handleFile} accept="video/*" maxSize={500 * 1024 * 1024} />
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(1)} MB)</p>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Quality: {quality}%</span>
            </div>
            <Slider value={[quality]} onValueChange={(val) => setQuality(Array.isArray(val) ? val[0] : val)} min={1} max={100} step={1} />
          </div>
          <p className="text-xs text-muted-foreground">Note: Video compression requires ffmpeg.wasm.</p>
          <div className="flex gap-2">
            <Button onClick={compress} disabled={processing} className="flex-1">
              {processing ? "Compressing..." : "Compress"}
            </Button>
            <Button onClick={() => {
              if (!resultUrl || !file) return;
              const a = document.createElement("a");
              a.href = resultUrl;
              a.download = `compressed-${file.name}`;
              a.click();
            }} disabled={!resultUrl} variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Download
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}