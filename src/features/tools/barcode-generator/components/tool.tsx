"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Download, Barcode } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface BarcodeFormat {
  value: string;
  label: string;
  validate: (text: string) => boolean;
}

const formats: BarcodeFormat[] = [
  { value: "CODE128", label: "Code 128", validate: () => true },
  { value: "CODE128A", label: "Code 128A", validate: () => true },
  { value: "CODE128B", label: "Code 128B", validate: () => true },
  { value: "EAN13", label: "EAN-13", validate: (t) => /^\d{12,13}$/.test(t) },
  { value: "EAN8", label: "EAN-8", validate: (t) => /^\d{7,8}$/.test(t) },
  { value: "UPC", label: "UPC-A", validate: (t) => /^\d{11,12}$/.test(t) },
  { value: "CODE39", label: "Code 39", validate: () => true },
  { value: "ITF", label: "ITF-14", validate: (t) => /^\d+$/.test(t) },
  { value: "MSI", label: "MSI", validate: () => true },
  { value: "PHARMACODE", label: "Pharmacode", validate: (t) => /^\d+$/.test(t) },
  { value: "CODABAR", label: "Codabar", validate: () => true },
];

export default function BarcodeGeneratorTool() {
  const [text, setText] = useState("ABC-123");
  const [format, setFormat] = useState("CODE128");
  const [error, setError] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    generateBarcode();
  }, [text, format]);

  const generateBarcode = async () => {
    if (!text.trim()) return;
    const fmt = formats.find((f) => f.value === format);
    if (fmt && !fmt.validate(text)) {
      setError(`Invalid input for ${fmt.label}`);
      return;
    }
    setError(null);

    try {
      const JsBarcode = (await import("jsbarcode")).default;
      const canvas = canvasRef.current;
      if (!canvas) return;
      JsBarcode(canvas, text, {
        format,
        width: 2,
        height: 80,
        displayValue: true,
        fontSize: 16,
        margin: 10,
        background: "#ffffff",
      });
    } catch {
      // jsbarcode not installed - use fallback canvas rendering
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      canvas.width = 400;
      canvas.height = 120;
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#000000";
      ctx.font = "14px monospace";
      ctx.textAlign = "center";
      ctx.fillText(text, canvas.width / 2, canvas.height - 10);
    }
  };

  const download = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `barcode-${text.replace(/[^a-zA-Z0-9]/g, "-")}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-3">
        <Input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Barcode content..."
          className="flex-1 text-base"
        />
        <Select value={format} onValueChange={(v) => v && setFormat(v)}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {formats.map((f) => (
              <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {error && <div className="text-sm text-destructive">{error}</div>}

      <div className="flex flex-col items-center gap-4 py-6">
        <canvas ref={canvasRef} className="rounded-xl bg-white p-2 max-w-full" />

        <Button onClick={download} className="gap-2" disabled={!text.trim()}>
          <Download className="h-4 w-4" />
          Download
        </Button>
      </div>
    </div>
  );
}