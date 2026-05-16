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

  const formatHTML = (input: string, indentSize: number, useTabs: boolean): string => {
    if (!input.trim()) return "";

    const indentChar = useTabs ? "\t" : " ".repeat(indentSize);
    const inlineTags = new Set([
      "span",
      "a",
      "strong",
      "em",
      "b",
      "i",
      "u",
      "code",
      "small",
      "abbr",
      "cite",
      "dfn",
      "kbd",
      "s",
      "samp",
      "time",
      "var",
    ]);
    const voidTags = new Set([
      "area",
      "base",
      "br",
      "col",
      "embed",
      "hr",
      "img",
      "input",
      "link",
      "meta",
      "param",
      "source",
      "track",
      "wbr",
    ]);

    let result = "";
    let indentLevel = 0;
    let lastWasInline = false;
    let i = 0;

    while (i < input.length) {
      if (input[i] === "<") {
        // Found a tag
        const tagEnd = input.indexOf(">", i);
        if (tagEnd === -1) {
          // No closing >, treat as plain text
          result += input[i];
          i++;
          continue;
        }

        const tagContent = input.substring(i + 1, tagEnd).trim();
        const isClosing = tagContent.startsWith("/");
        const tagName = isClosing
          ? tagContent.substring(1).split(/\s+/)[0]
          : tagContent.split(/\s+/)[0];
        const isSelfClosing =
          !isClosing && tagContent.endsWith("/") || voidTags.has(tagName);

        // Add newline before tag if not inline and not first tag
        if (!lastWasInline && result.length > 0 && !isClosing) {
          result += "\n" + indentChar.repeat(indentLevel);
        }

        // Add the tag
        result += input.substring(i, tagEnd + 1);

        // Update indent level
        if (isClosing && !isSelfClosing) {
          indentLevel = Math.max(0, indentLevel - 1);
        } else if (!isClosing && !isSelfClosing) {
          indentLevel++;
        }

        // If self-closing or inline, don't increase indent for next line
        lastWasInline = isSelfClosing || inlineTags.has(tagName);

        i = tagEnd + 1;
      } else {
        // Plain text
        result += input[i];
        i++;
      }
    }

    return result;
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
        <Button onClick={() => {
          const size = parseInt(indentSize);
          setOutput(formatHTML(input, size, useTabs));
        }} className="gap-2">
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