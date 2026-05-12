"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ResultPreview } from "@/components/shared/result-preview";
import { toast } from "sonner";

function formatXml(xml: string): string {
  const div = document.createElement("div");
  div.textContent = xml;
  let formatted = div.innerHTML;
  formatted = formatted.replace(/>\s*</g, ">\n<");
  formatted = formatted.replace(/></g, ">\n<");

  let indent = 0;
  return formatted
    .split("\n")
    .map((line) => {
      const trimmed = line.trim();
      if (trimmed.startsWith("</")) indent--;
      const result = "  ".repeat(Math.max(0, indent)) + trimmed;
      if (trimmed.startsWith("<") && !trimmed.startsWith("</") && !trimmed.endsWith("/>")) indent++;
      return result;
    })
    .join("\n");
}

function validateXml(xml: string): boolean {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xml, "text/xml");
    return !doc.querySelector("parsererror");
  } catch {
    return false;
  }
}

export default function XmlFormatterTool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const handleFormat = () => {
    if (!input.trim()) return;
    try {
      if (!validateXml(input)) {
        toast.error("Invalid XML");
        return;
      }
      setOutput(formatXml(input));
    } catch {
      toast.error("Failed to format XML");
    }
  };

  const handleMinify = () => {
    if (!input.trim()) return;
    setOutput(input.replace(/>\s*</g, "><").trim());
  };

  return (
    <div className="space-y-6">
      <Textarea
        placeholder='<root><item id="1">Hello</item></root>'
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="min-h-[200px] resize-y text-base font-mono"
      />

      <div className="flex gap-2">
        <Button onClick={handleFormat} variant="default">Format</Button>
        <Button onClick={handleMinify} variant="outline">Minify</Button>
      </div>

      {output && (
        <ResultPreview title="Formatted XML" copyable={output}>
          <pre className="text-sm whitespace-pre-wrap break-all font-mono">{output}</pre>
        </ResultPreview>
      )}
    </div>
  );
}