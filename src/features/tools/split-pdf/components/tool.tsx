"use client";

import { useState } from "react";
import { ToolDropzone } from "@/components/shared/tool-dropzone";
import { Button } from "@/components/ui/button";
import { Download, FileText } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function SplitPdfTool() {
  const [file, setFile] = useState<File | null>(null);
  const [urls, setUrls] = useState<{ page: number; url: string }[]>([]);
  const [processing, setProcessing] = useState(false);
  const [pageCount, setPageCount] = useState(0);
  const [splitRange, setSplitRange] = useState("1");

  const handleFile = async (f: File) => {
    setFile(f);
    setUrls([]);
    try {
      const { PDFDocument } = await import("pdf-lib");
      const bytes = await f.arrayBuffer();
      const pdf = await PDFDocument.load(bytes);
      setPageCount(pdf.getPageCount());
    } catch {
      toast.error("Invalid PDF file");
    }
  };

  const split = async () => {
    if (!file) return;
    setProcessing(true);
    setUrls([]);
    try {
      const { PDFDocument } = await import("pdf-lib");
      const bytes = await file.arrayBuffer();
      const pdf = await PDFDocument.load(bytes);

      const newUrls: { page: number; url: string }[] = [];
      const ranges = splitRange.split(",").map((s) => s.trim());

      for (const range of ranges) {
        if (range.includes("-")) {
          const [start, end] = range.split("-").map(Number);
          for (let i = start; i <= Math.min(end, pdf.getPageCount()); i++) {
            const newPdf = await PDFDocument.create();
            const [page] = await newPdf.copyPages(pdf, [i - 1]);
            newPdf.addPage(page);
            const pdfBytes = await newPdf.save();
            const blob = new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" });
            newUrls.push({ page: i, url: URL.createObjectURL(blob) });
          }
        } else {
          const page = Number(range);
          const newPdf = await PDFDocument.create();
          const [copiedPage] = await newPdf.copyPages(pdf, [page - 1]);
          newPdf.addPage(copiedPage);
          const pdfBytes = await newPdf.save();
          const blob = new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" });
          newUrls.push({ page, url: URL.createObjectURL(blob) });
        }
      }

      setUrls(newUrls);
      setProcessing(false);
    } catch {
      toast.error("Failed to split PDF");
      setProcessing(false);
    }
  };

  const downloadAll = () => {
    urls.forEach(({ url, page }) => {
      const a = document.createElement("a");
      a.href = url;
      a.download = `page-${page}.pdf`;
      a.click();
    });
  };

  return (
    <div className="space-y-6">
      {!file ? (
        <ToolDropzone onFile={handleFile} accept=".pdf" />
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            PDF has {pageCount} page(s). Enter page numbers or ranges (e.g., "1,3-5"):
          </p>
          <Input value={splitRange} onChange={(e) => setSplitRange(e.target.value)} placeholder="1,3-5" />
          <div className="flex gap-2">
            <Button onClick={split} disabled={processing} className="flex-1">
              {processing ? "Splitting..." : "Split PDF"}
            </Button>
            <Button onClick={downloadAll} disabled={urls.length === 0} variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Download All ({urls.length})
            </Button>
          </div>
        </div>
      )}

      {urls.length > 0 && (
        <div className="space-y-2">
          {urls.map(({ page, url }) => (
            <div key={page} className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-indigo-500" />
                <span className="text-sm">Page {page}</span>
              </div>
              <a href={url} download={`page-${page}.pdf`} className="text-sm text-indigo-500 hover:underline">
                Download
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}