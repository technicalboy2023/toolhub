"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Download, QrCode } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";

export default function QrGeneratorTool() {
  const [text, setText] = useState("https://toolhub.app");
  const [size, setSize] = useState(256);
  const [errorCorrection, setErrorCorrection] = useState("M");
  const [qrDataUrl, setQrDataUrl] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    generateQR();
  }, [text, size, errorCorrection]);

  const generateQR = useCallback(async () => {
    if (!text.trim()) return;
    try {
      const QRCode = (await import("qrcode")).default;
      const url = await QRCode.toDataURL(text, {
        width: size,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#ffffff",
        },
        errorCorrectionLevel: errorCorrection as any,
      });
      setQrDataUrl(url);
    } catch (e) {
      console.error(e);
    }
  }, [text, size, errorCorrection]);

  const download = () => {
    if (!qrDataUrl) return;
    const link = document.createElement("a");
    link.download = `qrcode-${text.slice(0, 20).replace(/[^a-zA-Z0-9]/g, "-")}.png`;
    link.href = qrDataUrl;
    link.click();
  };

  const downloadSvg = async () => {
    if (!text.trim()) return;
    try {
      const QRCode = (await import("qrcode")).default;
      const url = await QRCode.toString(text, {
        type: "svg",
        margin: 2,
        color: { dark: "#000000", light: "#ffffff" },
        errorCorrectionLevel: errorCorrection as any,
      });
      const blob = new Blob([url], { type: "image/svg+xml" });
      const link = document.createElement("a");
      link.download = `qrcode-${text.slice(0, 20).replace(/[^a-zA-Z0-9]/g, "-")}.svg`;
      link.href = URL.createObjectURL(blob);
      link.click();
      URL.revokeObjectURL(link.href);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text or URL..."
          className="text-base"
        />

        <div className="flex flex-wrap gap-4">
          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground">Size</label>
            <div className="flex gap-1">
              {[128, 256, 512, 1024].map((s) => (
                <Button key={s} variant={size === s ? "default" : "outline"} size="sm" onClick={() => setSize(s)}>
                  {s}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground">Error Correction</label>
            <div className="flex gap-1">
              {[
                { key: "L", label: "L (7%)" },
                { key: "M", label: "M (15%)" },
                { key: "Q", label: "Q (25%)" },
                { key: "H", label: "H (30%)" },
              ].map((ec) => (
                <Button
                  key={ec.key}
                  variant={errorCorrection === ec.key ? "default" : "outline"}
                  size="sm"
                  onClick={() => setErrorCorrection(ec.key)}
                >
                  {ec.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center gap-4 py-6">
        <div className="relative">
          {qrDataUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={qrDataUrl}
              alt="QR Code"
              className="rounded-xl shadow-lg"
              width={size}
              height={size}
            />
          ) : (
            <div className="flex items-center justify-center w-64 h-64 rounded-xl bg-muted">
              <QrCode className="h-12 w-12 text-muted-foreground" />
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <Button onClick={download} className="gap-2">
            <Download className="h-4 w-4" />
            Download PNG
          </Button>
          <Button onClick={downloadSvg} variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Download SVG
          </Button>
        </div>
      </div>
    </div>
  );
}