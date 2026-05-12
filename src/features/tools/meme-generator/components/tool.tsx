"use client";

import { useState, useRef } from "react";
import { ToolDropzone } from "@/components/shared/tool-dropzone";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download } from "lucide-react";
import { toast } from "sonner";

export default function MemeGeneratorTool() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [topText, setTopText] = useState("");
  const [bottomText, setBottomText] = useState("");
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  const handleFile = (f: File) => {
    setFile(f);
    const url = URL.createObjectURL(f);
    setPreview(url);
    setResultUrl(null);
    const img = new Image();
    img.onload = () => { imgRef.current = img; renderMeme(); };
    img.src = url;
  };

  const renderMeme = () => {
    const img = imgRef.current;
    const canvas = canvasRef.current;
    if (!img || !canvas) return;

    const maxW = 600;
    const scale = Math.min(1, maxW / img.width);
    canvas.width = img.width * scale;
    canvas.height = img.height * scale;

    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    const fontSize = Math.max(24, canvas.width * 0.08);
    ctx.font = `bold ${fontSize}px Impact, Arial Black, sans-serif`;
    ctx.strokeStyle = "black";
    ctx.lineWidth = 3;
    ctx.fillStyle = "white";
    ctx.textAlign = "center";

    const drawText = (text: string, y: number) => {
      if (!text) return;
      const lines = text.toUpperCase().split("\n");
      lines.forEach((line, i) => {
        const lineY = y + i * fontSize * 1.2;
        ctx.strokeText(line, canvas.width / 2, lineY);
        ctx.fillText(line, canvas.width / 2, lineY);
      });
    };

    drawText(topText, fontSize);
    drawText(bottomText, canvas.height - 12);

    setResultUrl(canvas.toDataURL("image/png"));
  };

  const handleTextChange = (setter: (v: string) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setter(e.target.value);
    setTimeout(renderMeme, 0);
  };

  const download = () => {
    if (!resultUrl) return;
    const a = document.createElement("a");
    a.href = resultUrl;
    a.download = "meme.png";
    a.click();
  };

  return (
    <div className="space-y-6">
      {!file ? (
        <ToolDropzone onFile={handleFile} accept="image/*" label="Upload an image to make a meme" />
      ) : (
        <div className="space-y-6">
          <Input placeholder="Top text" value={topText} onChange={handleTextChange(setTopText)} />
          <Input placeholder="Bottom text" value={bottomText} onChange={handleTextChange(setBottomText)} />

          <div className="flex justify-center">
            <canvas ref={canvasRef} className="rounded-xl max-w-full" />
          </div>

          <Button onClick={download} disabled={!resultUrl} className="w-full gap-2">
            <Download className="h-4 w-4" />
            Download Meme
          </Button>
        </div>
      )}
    </div>
  );
}