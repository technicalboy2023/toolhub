"use client";

import { useState } from "react";
import { ToolDropzone } from "@/components/shared/tool-dropzone";
import { Button } from "@/components/ui/button";
import { Download, X } from "lucide-react";
import { toast } from "sonner";

export default function MergePdfTool() {
  const [files, setFiles] = useState<File[]>([]);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  const handleFile = (f: File) => {
    setFiles((prev) => [...prev, f]);
  };

  const removeFile = (i: number) => {
    setFiles((prev) => prev.filter((_, idx) => idx !== i));
    setResultUrl(null);
  };

  const merge = async () => {
    if (files.length < 2) {
      toast.error("Please add at least 2 PDF files");
      return;
    }
    setProcessing(true);
    try {
      const { PDFDocument } = await import("pdf-lib");
      const mergedPdf = await PDFDocument.create();

      for (const file of files) {
        const bytes = await file.arrayBuffer();
        const pdf = await PDFDocument.load(bytes);
        const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        pages.forEach((page) => mergedPdf.addPage(page));
      }

      const mergedBytes = await mergedPdf.save();
      const blob = new Blob([new Uint8Array(mergedBytes)], { type: "application/pdf" });
      setResultUrl(URL.createObjectURL(blob));
      setProcessing(false);
    } catch {
      toast.error("Failed to merge PDFs. Ensure all files are valid PDFs.");
      setProcessing(false);
    }
  };

  const download = () => {
    if (!resultUrl) return;
    const a = document.createElement("a");
    a.href = resultUrl;
    a.download = "merged.pdf";
    a.click();
  };

  return (
    <div className="space-y-6">
      <ToolDropzone onFile={handleFile} accept=".pdf" label="Drop PDF files here to merge" />

      {files.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium">{files.length} file(s) selected</p>
          {files.map((f, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
              <span className="text-sm truncate">{i + 1}. {f.name}</span>
              <button onClick={() => removeFile(i)} className="p-1 rounded hover:bg-muted transition-colors">
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-2">
        <Button onClick={merge} disabled={files.length < 2 || processing} className="flex-1">
          {processing ? "Merging..." : "Merge PDFs"}
        </Button>
        <Button onClick={download} disabled={!resultUrl} variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Download
        </Button>
      </div>
    </div>
  );
}