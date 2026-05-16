"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, Copy, FileText, Code } from "lucide-react";
import { marked } from "marked";
import DOMPurify from "dompurify";

export default function MarkdownConverterTool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [conversionMode, setConversionMode] = useState("md-to-html");
  const [activeTab, setActiveTab] = useState<"write" | "preview" | "html">("write");

  const markdownToHTML = async () => {
    if (!input.trim()) return;

    try {
      // Use marked for markdown to HTML conversion
      const html = await marked.parse(input);
      // Sanitize HTML to prevent XSS
      const sanitizedHtml = DOMPurify.sanitize(html);
      setOutput(sanitizedHtml);
    } catch (error) {
      console.error("Markdown conversion error:", error);
      setOutput("Error converting markdown");
    }
  };

  const htmlToMarkdown = () => {
    if (!input.trim()) return;
    // Simple regex-based HTML to markdown (marked doesn't support reverse conversion)
    let markdown = input
      .replace(/<h1>(.*?)<\/h1>/gim, "# $1\n")
      .replace(/<h2>(.*?)<\/h2>/gim, "## $1\n")
      .replace(/<h3>(.*?)<\/h3>/gim, "### $1\n")
      .replace(/<strong>(.*?)<\/strong>/gim, "**$1**")
      .replace(/<em>(.*?)<\/em>/gim, "*$1*")
      .replace(/<code>(.*?)<\/code>/gim, "`$1`")
      .replace(/<p>/gim, "")
      .replace(/<\/p>/gim, "\n")
      .replace(/\n\s*\n/gim, "\n\n")
      .trim();

    setOutput(markdown);
  };

  const convert = () => {
    if (conversionMode === "md-to-html") {
      markdownToHTML();
    } else {
      htmlToMarkdown();
    }
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(output);
  };

  const download = () => {
    const extension = conversionMode === "md-to-html" ? "html" : "md";
    const blob = new Blob([output], {
      type: conversionMode === "md-to-html" ? "text/html" : "text/markdown"
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `converted.${extension}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-4 items-center">
        <label className="text-sm font-bold">Conversion:</label>
        <Select value={conversionMode} onValueChange={(value) => setConversionMode(value || "md-to-html")}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="md-to-html">Markdown to HTML</SelectItem>
            <SelectItem value="html-to-md">HTML to Markdown</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        <div className="flex gap-4">
          <Button
            onClick={() => setActiveTab("write")}
            className={`${activeTab === "write" ? "btn-primary" : "btn-secondary"} gap-2`}
          >
            Write
          </Button>
          <Button
            onClick={() => setActiveTab("preview")}
            className={`${activeTab === "preview" ? "btn-primary" : "btn-secondary"} gap-2`}
          >
            Preview
          </Button>
          <Button
            onClick={() => setActiveTab("html")}
            className={`${activeTab === "html" ? "btn-primary" : "btn-secondary"} gap-2`}
          >
            HTML Output
          </Button>
        </div>

        {activeTab === "write" && (
          <div className="space-y-2">
            <label className="text-sm font-bold">
              {conversionMode === "md-to-html" ? "Markdown Input" : "HTML Input"}
            </label>
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={conversionMode === "md-to-html"
                ? "# Hello World\n\nThis is **bold** and *italic*."
                : "<h1>Hello World</h1>\n<p>This is <strong>bold</strong> and <em>italic</em>.</p>"
              }
              className="min-h-[200px] font-mono text-sm"
            />
          </div>
        )}

        {activeTab === "preview" && (
          <div className="space-y-2">
            <label className="text-sm font-bold">Preview</label>
            <div
              className="prose prose-sm max-w-none min-h-[200px] bg-muted p-4 rounded"
              dangerouslySetInnerHTML={{ __html: output }}
            />
          </div>
        )}

        {activeTab === "html" && (
          <div className="space-y-2">
            <label className="text-sm font-bold">HTML Output</label>
            <Textarea
              value={output}
              readOnly
              className="min-h-[200px] font-mono text-sm bg-muted"
            />
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-3">
        <Button onClick={convert} className="gap-2">
          {conversionMode === "md-to-html" ? (
            <>
              <FileText className="h-4 w-4" />
              Convert to HTML
            </>
          ) : (
            <>
              <Code className="h-4 w-4" />
              Convert to Markdown
            </>
          )}
        </Button>
        <Button onClick={copyToClipboard} variant="outline" className="gap-2" disabled={!output}>
          <Copy className="h-4 w-4" />
          Copy
        </Button>
        <Button onClick={download} variant="outline" className="gap-2" disabled={!output}>
          <Download className="h-4 w-4" />
          Download
        </Button>
      </div>

      <div className="text-sm text-muted-foreground">
        <p className="font-bold mb-1">Supported Markdown:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Headers (# ## ###)</li>
          <li>Bold (**text**)</li>
          <li>Italic (*text*)</li>
          <li>Code (`text`)</li>
        </ul>
      </div>
    </div>
  );
}