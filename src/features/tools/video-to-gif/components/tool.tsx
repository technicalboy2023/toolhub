"use client";

import { useState, useRef } from "react";
import { ToolDropzone } from "@/components/shared/tool-dropzone";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";

export default function VideoToGifTool() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [fps, setFps] = useState(10);
  const [width, setWidth] = useState(320);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleFile = (f: File) => {
    setFile(f);
    setPreviewUrl(URL.createObjectURL(f));
    setResultUrl(null);
  };

  const convert = async () => {
    if (!file) return;
    setProcessing(true);
    try {
      const video = document.createElement("video");
      video.src = URL.createObjectURL(file);
      video.muted = true;

      video.onloadedmetadata = () => {
        video.currentTime = 0;
        video.height = video.videoHeight;
        video.width = video.videoWidth;
      };

      video.onseeked = async () => {
        const canvas = document.createElement("canvas");
        const scale = width / video.videoWidth;
        canvas.width = width;
        canvas.height = video.videoHeight * scale;
        const ctx = canvas.getContext("2d")!;

        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
          if (!blob) return;
          setResultUrl(URL.createObjectURL(blob));
          setProcessing(false);
          toast.success("GIF created! Full GIF animation requires gif.js library.");
        }, "image/png");
      };

      video.currentTime = 0;
    } catch {
      toast.error("Failed to convert video to GIF");
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {!file ? (
        <ToolDropzone onFile={handleFile} accept="video/*" maxSize={500 * 1024 * 1024} label="Drop a video to convert to GIF" />
      ) : (
        <div className="space-y-4">
          {previewUrl && (
            // eslint-disable-next-line jsx-a11y/media-has-caption
            <video ref={videoRef} src={previewUrl} controls className="rounded-xl w-full max-h-48 bg-muted" />
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs text-muted-foreground">Width: {width}px</label>
              <Slider value={[width]} onValueChange={(val) => setWidth(Array.isArray(val) ? val[0] : val)} min={100} max={800} step={10} />
            </div>
            <div className="space-y-2">
              <label className="text-xs text-muted-foreground">FPS: {fps}</label>
              <Slider value={[fps]} onValueChange={(val) => setFps(Array.isArray(val) ? val[0] : val)} min={5} max={30} step={1} />
            </div>
          </div>

          <p className="text-xs text-muted-foreground">
            Note: Animated GIF generation requires gif.js. A static frame preview is provided.
          </p>

          <div className="flex gap-2">
            <Button onClick={convert} disabled={processing} className="flex-1">
              {processing ? "Converting..." : "Convert to GIF"}
            </Button>
            <Button onClick={() => {
              if (!resultUrl) return;
              const a = document.createElement("a");
              a.href = resultUrl;
              a.download = file!.name.replace(/\.[^.]+$/, ".png");
              a.click();
            }} disabled={!resultUrl} variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Download Frame
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}