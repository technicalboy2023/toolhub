"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ResultPreview } from "@/components/shared/result-preview";
import { Code, Braces, Minus, Maximize2 } from "lucide-react";
import { toast } from "sonner";

export default function JsonFormatterTool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);

  const format = (spaces: number) => {
    if (!input.trim()) return;
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, spaces));
      setError(null);
    } catch (e: any) {
      setError(e.message);
      setOutput("");
    }
  };

  const minify = () => {
    if (!input.trim()) return;
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
      setError(null);
    } catch (e: any) {
      setError(e.message);
      setOutput("");
    }
  };

  const validate = () => {
    if (!input.trim()) return;
    try {
      JSON.parse(input);
      toast.success("Valid JSON");
      setError(null);
    } catch (e: any) {
      setError(e.message);
    }
  };

  return (
    <div className="space-y-6">
      <Textarea
        placeholder='Paste your JSON here...{"key": "value"}'
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="min-h-[200px] resize-y text-base font-mono"
      />

      <div className="flex flex-wrap gap-2">
        <Button onClick={() => format(2)} variant="default" size="sm" className="gap-1.5">
          <Code className="h-4 w-4" />
          Format (2 spaces)
        </Button>
        <Button onClick={() => format(4)} variant="outline" size="sm" className="gap-1.5">
          <Braces className="h-4 w-4" />
          Format (4 spaces)
        </Button>
        <Button onClick={minify} variant="outline" size="sm" className="gap-1.5">
          <Minus className="h-4 w-4" />
          Minify
        </Button>
        <Button onClick={validate} variant="secondary" size="sm" className="gap-1.5">
          <Maximize2 className="h-4 w-4" />
          Validate
        </Button>
      </div>

      {error && (
        <div className="rounded-xl bg-destructive/10 p-4 text-sm text-destructive font-mono">
          {error}
        </div>
      )}

      {output && (
        <ResultPreview title="Formatted JSON" copyable={output}>
          <pre className="text-sm whitespace-pre-wrap break-all font-mono">
            {output}
          </pre>
        </ResultPreview>
      )}
    </div>
  );
}