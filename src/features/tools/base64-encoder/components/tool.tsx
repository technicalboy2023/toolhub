"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ResultPreview } from "@/components/shared/result-preview";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ArrowDownUp } from "lucide-react";

export default function Base64EncoderTool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<"encode" | "decode">("encode");

  const handleConvert = () => {
    setError(null);
    if (!input.trim()) {
      setOutput("");
      return;
    }

    try {
      if (mode === "encode") {
        setOutput(btoa(input));
      } else {
        setOutput(atob(input));
      }
    } catch (e: any) {
      setError("Invalid Base64 string. Please check your input.");
      setOutput("");
    }
  };

  const swapMode = () => {
    setMode(mode === "encode" ? "decode" : "encode");
    setInput(output);
    setOutput(input);
    setError(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <Tabs
          value={mode}
          onValueChange={(v) => {
            setMode(v as "encode" | "decode");
            setOutput("");
            setError(null);
          }}
        >
          <TabsList>
            <TabsTrigger value="encode">Encode</TabsTrigger>
            <TabsTrigger value="decode">Decode</TabsTrigger>
          </TabsList>
        </Tabs>

        <Button variant="outline" size="sm" onClick={swapMode} className="gap-1.5">
          <ArrowDownUp className="h-4 w-4" />
          Swap
        </Button>
      </div>

      <Textarea
        placeholder={mode === "encode" ? "Enter text to encode..." : "Enter Base64 to decode..."}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="min-h-[150px] resize-y text-base font-mono"
      />

      <Button onClick={handleConvert} className="w-full">
        {mode === "encode" ? "Encode to Base64" : "Decode from Base64"}
      </Button>

      {error && (
        <div className="rounded-xl bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {output && (
        <ResultPreview title={mode === "encode" ? "Base64 Encoded" : "Decoded Text"} copyable={output}>
          <pre className="text-sm whitespace-pre-wrap break-all font-mono">
            {output}
          </pre>
        </ResultPreview>
      )}
    </div>
  );
}