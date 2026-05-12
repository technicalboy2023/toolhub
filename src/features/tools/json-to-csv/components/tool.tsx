"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ResultPreview } from "@/components/shared/result-preview";
import { ArrowDownUp } from "lucide-react";

function jsonToCsv(json: string): string {
  const data = JSON.parse(json);
  const arr = Array.isArray(data) ? data : [data];
  if (arr.length === 0) return "";

  const headers = Object.keys(arr[0]);
  const lines = arr.map((obj: Record<string, any>) =>
    headers.map((h) => {
      const val = obj[h] ?? "";
      const str = String(val);
      return str.includes(",") || str.includes('"') || str.includes("\n")
        ? `"${str.replace(/"/g, '""')}"`
        : str;
    }).join(","),
  );

  return [headers.join(","), ...lines].join("\n");
}

export default function JsonToCsvTool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleConvert = () => {
    setError(null);
    if (!input.trim()) {
      setOutput("");
      return;
    }
    try {
      setOutput(jsonToCsv(input));
    } catch (e: any) {
      setError(`Invalid JSON: ${e.message}`);
    }
  };

  const sampleData = JSON.stringify([
    { name: "John", email: "john@example.com", age: 30 },
    { name: "Jane", email: "jane@example.com", age: 25 },
  ], null, 2);

  return (
    <div className="space-y-6">
      <Textarea
        placeholder={`Paste JSON here...\n${sampleData}`}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="min-h-[200px] resize-y text-base font-mono"
      />

      <Button onClick={handleConvert} className="w-full gap-2">
        <ArrowDownUp className="h-4 w-4" />
        Convert to CSV
      </Button>

      {error && (
        <div className="rounded-xl bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {output && (
        <ResultPreview title="CSV Output" copyable={output}>
          <pre className="text-sm whitespace-pre-wrap break-all font-mono">{output}</pre>
        </ResultPreview>
      )}
    </div>
  );
}