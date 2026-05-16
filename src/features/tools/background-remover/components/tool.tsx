"use client";

import { useState, useEffect } from "react";
import { ToolDropzone } from "@/components/shared/tool-dropzone";
import { Button } from "@/components/ui/button";
import { Download, Upload } from "lucide-react";
import { toast } from "sonner";
import { removeBackground } from "@imgly/background-removal";

export default function BackgroundRemoverTool() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressText, setProgressText] = useState("");

  const handleFile = (f: File) => {
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setResultUrl(null);
    setProgress(0);
    setProgressText("");
  };

  const removeBackgroundAsync = async () => {
    if (!file) return;
    setProcessing(true);
    setProgress(0);
    setProgressText("Loading AI model...");

    try {
      const blob = await removeBackground(file, {
        progress: (p) => {
          const progressValue = typeof p === 'number' ? p : 0;
          setProgress(progressValue);
          if (progressValue < 30) {
            setProgressText("Loading AI model...");
          } else if (progressValue < 70) {
            setProgressText("Analyzing image...");
          } else {
            setProgressText("Finalizing...");
          }
        },
      });

      setResultUrl(URL.createObjectURL(blob));
      setProcessing(false);
      toast.success("Background removed successfully!");
    } catch (error) {
      console.error("Background removal error:", error);
      toast.error("Failed to remove background. Please try again.");
      setProcessing(false);
    }
  };

  const download = () => {
    if (!resultUrl || !file) return;
    const a = document.createElement("a");
    a.href = resultUrl;
    a.download = `bg-removed-${file.name.replace(/\.[^.]+$/, ".png")}`;
    a.click();
  };

  const tryAnother = () => {
    setFile(null);
    setPreview(null);
    setResultUrl(null);
    setProgress(0);
    setProgressText("");
    if (resultUrl) {
      URL.revokeObjectURL(resultUrl);
    }
  };

  return (
    <div className="space-y-6">
      {!file ? (
        <ToolDropzone onFile={handleFile} accept="image/*" />
      ) : (
        <div className="space-y-6">
          {processing && (
            <div className="card-bold p-6 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{progressText}</span>
                <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {preview && (
              <div>
                <p className="text-sm font-bold mb-2">Original</p>
                <img
                  src={preview}
                  alt="Original"
                  className="rounded-xl w-full max-h-64 object-contain bg-muted"
                />
              </div>
            )}
            {resultUrl && (
              <div>
                <p className="text-sm font-bold mb-2">Background Removed</p>
                <div className="rounded-xl w-full max-h-64 bg-[repeating-conic-gradient(#e5e5e5_0%_25%,#fff_0%_50%)] bg-[length:16px_16px] flex items-center justify-center overflow-hidden">
                  <img
                    src={resultUrl}
                    alt="Result"
                    className="max-h-64 object-contain"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-3">
            {!resultUrl ? (
              <Button
                onClick={removeBackgroundAsync}
                disabled={processing}
                className="flex-1 btn-primary"
              >
                {processing ? "Processing..." : "Remove Background"}
              </Button>
            ) : (
              <>
                <Button
                  onClick={download}
                  disabled={!resultUrl}
                  className="flex-1 btn-secondary gap-2"
                >
                  <Download className="h-4 w-4" />
                  Download PNG
                </Button>
                <Button
                  onClick={tryAnother}
                  className="btn-secondary gap-2"
                >
                  <Upload className="h-4 w-4" />
                  Try Another
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}