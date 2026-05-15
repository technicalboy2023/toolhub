"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, Copy, FileCode, Braces } from "lucide-react";

export default function HTMLFormatterTool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [indentSize, setIndentSize] = useState("2");
  const [useTabs, setUseTabs] = useState(false);

  const formatHTML = () => {
    if (!input.trim()) return;

    try {
      // Simple HTML formatter using DOMParser
      const parser = new DOMParser();
      const doc = parser.parseFromString(input, "text/html");
      const formatted = new XMLSerializer().serializeToString(doc);
      setOutput(formatted);
    } catch (error) {
      // Fallback to basic formatting
      let formatted = input
        .replace(/></g, ">\n<")
        .split("\n")
        .map((line, index, arr) => {
          const indent = "  ".repeat(Math.max(0, arr.length - index - 1));
          return indent + line.trim();
        })
        .join("\n");
      setOutput(formatted);
    }
  };

  const minifyHTML = () => {
    if (!input.trim()) return;

    const minified = input
      .replace(/\s+/g, " ")
      .replace(/>\s+</g, "><")
      .replace(/\s*([<>])\s*/g, "$1")
      .trim();
    setOutput(minified);
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(output);
  };

  const download = () => {
    const blob = new Blob([output], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "formatted.html";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-bold">Input HTML</label>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste your HTML here..."
            className="min-h-[200px] font-mono text-sm"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold">Formatted Output</label>
          <Textarea
            value={output}
            readOnly
            className="min-h-[200px] font-mono text-sm bg-muted"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button onClick={formatHTML} className="gap-2">
          <FileCode className="h-4 w-4" />
          Format HTML
        </Button>
        <Button onClick={minifyHTML} variant="outline" className="gap-2">
          <Braces className="h-4 w-4" />
          Minify
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

      <div className="flex gap-4 items-center">
        <label className="text-sm font-bold">Indent Size:</label>
        <Select value={indentSize} onValueChange={(value) => setIndentSize(value || "2")}>
          <SelectTrigger className="w-24">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="2">2 spaces</SelectItem>
            <SelectItem value="4">4 spaces</SelectItem>
            <SelectItem value="8">8 spaces</SelectItem>
          </SelectContent>
        </Select>
        <label className="flex items-center gap-2 text-sm font-bold">
          <input
            type="checkbox"
            checked={useTabs}
            onChange={(e) => setUseTabs(e.target.checked)}
            className="rounded"
          />
          Use tabs
        </label>
      </div>
    </div>
  );
}