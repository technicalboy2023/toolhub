"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ResultPreview } from "@/components/shared/result-preview";

type CaseType =
  | "upper"
  | "lower"
  | "title"
  | "sentence"
  | "camel"
  | "pascal"
  | "snake"
  | "kebab"
  | "constant"
  | "toggle";

const cases: { key: CaseType; label: string; transform: (s: string) => string }[] = [
  { key: "upper", label: "UPPER CASE", transform: (s) => s.toUpperCase() },
  { key: "lower", label: "lower case", transform: (s) => s.toLowerCase() },
  {
    key: "title",
    label: "Title Case",
    transform: (s) => s.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()),
  },
  {
    key: "sentence",
    label: "Sentence case",
    transform: (s) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase(),
  },
  {
    key: "camel",
    label: "camelCase",
    transform: (s) =>
      s
        .toLowerCase()
        .replace(/[^a-zA-Z0-9]+(.)/g, (_, c) => c.toUpperCase()),
  },
  {
    key: "pascal",
    label: "PascalCase",
    transform: (s) => {
      const camel = s
        .toLowerCase()
        .replace(/[^a-zA-Z0-9]+(.)/g, (_, c) => c.toUpperCase());
      return camel.charAt(0).toUpperCase() + camel.slice(1);
    },
  },
  {
    key: "snake",
    label: "snake_case",
    transform: (s) =>
      s
        .replace(/([A-Z])/g, "_$1")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "_")
        .replace(/^_|_$/g, ""),
  },
  {
    key: "kebab",
    label: "kebab-case",
    transform: (s) =>
      s
        .replace(/([A-Z])/g, "-$1")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, ""),
  },
  {
    key: "constant",
    label: "CONSTANT_CASE",
    transform: (s) =>
      s
        .replace(/([A-Z])/g, "_$1")
        .toUpperCase()
        .replace(/[^A-Z0-9]+/g, "_")
        .replace(/^_|_$/g, ""),
  },
  {
    key: "toggle",
    label: "tOgGlE cAsE",
    transform: (s) =>
      s
        .split("")
        .map((c, i) => (i % 2 === 0 ? c.toLowerCase() : c.toUpperCase()))
        .join(""),
  },
];

export default function CaseConverterTool() {
  const [input, setInput] = useState("");
  const [activeCase, setActiveCase] = useState<CaseType | null>(null);

  const output = activeCase
    ? cases.find((c) => c.key === activeCase)?.transform(input) ?? input
    : input;

  return (
    <div className="space-y-6">
      <Textarea
        placeholder="Type or paste text to convert..."
        value={input}
        onChange={(e) => {
          setInput(e.target.value);
          if (activeCase) setActiveCase(null);
        }}
        className="min-h-[150px] resize-y text-base"
      />

      <div className="flex flex-wrap gap-2">
        {cases.map((c) => (
          <Button
            key={c.key}
            variant={activeCase === c.key ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveCase(c.key)}
            className="font-mono text-xs"
          >
            {c.label}
          </Button>
        ))}
      </div>

      {input && (
        <ResultPreview title="Converted Text" copyable={output}>
          <pre className="text-sm whitespace-pre-wrap break-words font-sans">
            {output}
          </pre>
        </ResultPreview>
      )}
    </div>
  );
}