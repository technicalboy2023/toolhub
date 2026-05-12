"use client";

import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { ToolDropzone } from "@/components/shared/tool-dropzone";
import { ResultPreview } from "@/components/shared/result-preview";
import { Camera, Upload, Scan } from "lucide-react";
import { toast } from "sonner";

export default function QrScannerTool() {
  const [mode, setMode] = useState<"upload" | "camera">("upload");
  const [result, setResult] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const handleFile = async (f: File) => {
    try {
      const imageUrl = URL.createObjectURL(f);
      const img = new Image();
      img.onload = async () => {
        try {
          const jsQR = (await import("jsqr")).default;
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d")!;
          ctx.drawImage(img, 0, 0);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height);
          if (code) {
            setResult(code.data);
          } else {
            toast.error("No QR code found in image");
          }
        } catch {
          toast.error("QR scanning requires jsQR library");
        }
      };
      img.src = imageUrl;
    } catch {
      toast.error("Failed to process image");
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setScanning(true);
    } catch {
      toast.error("Camera access denied");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setScanning(false);
  };

  const captureFrame = async () => {
    if (!videoRef.current) return;
    try {
      const jsQR = (await import("jsqr")).default;
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(videoRef.current, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height);
      if (code) {
        setResult(code.data);
        stopCamera();
      } else {
        toast.error("No QR code found. Try adjusting the camera.");
      }
    } catch {
      toast.error("QR scanning requires jsQR library");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        <Button
          variant={mode === "upload" ? "default" : "outline"}
          onClick={() => { setMode("upload"); stopCamera(); }}
          className="flex-1 gap-2"
        >
          <Upload className="h-4 w-4" />
          Upload Image
        </Button>
        <Button
          variant={mode === "camera" ? "default" : "outline"}
          onClick={() => { setMode("camera"); setResult(null); }}
          className="flex-1 gap-2"
        >
          <Camera className="h-4 w-4" />
          Use Camera
        </Button>
      </div>

      {mode === "upload" ? (
        <ToolDropzone onFile={handleFile} accept="image/*" label="Upload an image containing a QR code" />
      ) : (
        <div className="space-y-4">
          {!scanning ? (
            <div className="flex flex-col items-center gap-4 py-8">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500">
                <Camera className="h-8 w-8 text-white" />
              </div>
              <p className="text-sm text-muted-foreground">Point your camera at a QR code</p>
              <Button onClick={startCamera} className="gap-2">
                <Camera className="h-4 w-4" />
                Start Camera
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
              <video ref={videoRef} autoPlay playsInline className="rounded-xl w-full bg-muted max-h-64" />
              <div className="flex gap-2">
                <Button onClick={captureFrame} className="flex-1 gap-2">
                  <Scan className="h-4 w-4" />
                  Scan QR Code
                </Button>
                <Button onClick={stopCamera} variant="outline">Stop Camera</Button>
              </div>
            </div>
          )}
        </div>
      )}

      {result && (
        <ResultPreview title="QR Code Content" copyable={result}>
          <p className="text-sm break-all">{result}</p>
        </ResultPreview>
      )}
    </div>
  );
}