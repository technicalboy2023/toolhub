"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ResultPreview } from "@/components/shared/result-preview";
import { ArrowDownUp } from "lucide-react";

function csvToJson(csv: string, delimiter = ","): string {
  const lines = csv.trim().split("\n");
  if (lines.length < 1) return "[]";

  const headers = lines[0].split(delimiter).map((h) => h.trim().replace(/^"|"$/g, ""));
  const result = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(delimiter).map((v) => v.trim().replace(/^"|"$/g, ""));
    if (values.length === 0 || (values.length === 1 && values[0] === "")) continue;

    const obj: Record<string, string> = {};
    headers.forEach((header, j) => {
      obj[header] = values[j] || "";
    });
    result.push(obj);
  }

  return JSON.stringify(result, null, 2);
}

export default function CsvToJsonTool() {
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
      setOutput(csvToJson(input));
    } catch (e: any) {
      setError(e.message);
    }
  };

  return (
    <div className="space-y-6">
      <Textarea
        placeholder={`Paste CSV here...\nname,email,age\nJohn,john@example.com,30\nJane,jane@example.com,25`}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="min-h-[200px] resize-y text-base font-mono"
      />

      <Button onClick={handleConvert} className="w-full gap-2">
        <ArrowDownUp className="h-4 w-4" />
        Convert to JSON
      </Button>

      {error && (
        <div className="rounded-xl bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {output && (
        <ResultPreview title="JSON Output" copyable={output}>
          <pre className="text-sm whitespace-pre-wrap break-all font-mono">{output}</pre>
        </ResultPreview>
      )}
    </div>
  );
}