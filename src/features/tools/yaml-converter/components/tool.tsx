"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ResultPreview } from "@/components/shared/result-preview";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

function jsonToYaml(obj: any, indent = 0): string {
  const prefix = "  ".repeat(indent);
  if (obj === null || obj === undefined) return "null";
  if (typeof obj === "string") {
    return obj.includes(":") || obj.includes("#") || obj.includes("\n")
      ? `"${obj.replace(/"/g, '\\"')}"`
      : obj;
  }
  if (typeof obj === "number" || typeof obj === "boolean") return String(obj);
  if (Array.isArray(obj)) {
    if (obj.length === 0) return "[]";
    return obj.map((item) => {
      if (typeof item === "object" && item !== null) {
        return `\n${prefix}- ${jsonToYaml(item, indent + 2).trimStart()}`;
      }
      return `\n${prefix}- ${jsonToYaml(item, indent)}`;
    }).join("");
  }
  if (typeof obj === "object") {
    const keys = Object.keys(obj);
    if (keys.length === 0) return "{}";
    return keys.map((key) => {
      const val = obj[key];
      if (typeof val === "object" && val !== null) {
        return `\n${prefix}${key}:\n${prefix}  ${jsonToYaml(val, indent).trim()}`;
      }
      return `\n${prefix}${key}: ${jsonToYaml(val, indent + 2).trim()}`;
    }).join("");
  }
  return String(obj);
}

function yamlToJson(yaml: string): string {
  const lines = yaml.split("\n");
  const result: Record<string, any> = {};
  const stack: { indent: number; obj: any }[] = [{ indent: -1, obj: result }];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const indent = line.search(/\S/);
    const isArray = trimmed.startsWith("- ");
    const clean = isArray ? trimmed.slice(2).trim() : trimmed;
    const colonIdx = clean.indexOf(":");

    if (colonIdx === -1 && isArray) {
      // array item
      while (stack.length > 1 && stack[stack.length - 1].indent >= indent) stack.pop();
      const parent = stack[stack.length - 1].obj;
      if (!Array.isArray(parent)) {
        stack[stack.length - 1].obj = [];
      }
      const arr = stack[stack.length - 1].obj as any[];
      const val = parseValue(clean);
      arr.push(val);
      if (typeof val === "object" && val !== null) {
        stack.push({ indent, obj: val });
      }
      continue;
    }

    while (stack.length > 1 && stack[stack.length - 1].indent >= indent) stack.pop();

    const key = colonIdx >= 0 ? clean.slice(0, colonIdx).trim() : clean;
    const value = colonIdx >= 0 ? clean.slice(colonIdx + 1).trim() : "";

    const parent = stack[stack.length - 1].obj;

    if (value === "" || (value.startsWith("{") || value.startsWith("["))) {
      const newObj = value ? parseValue(value) : {};
      parent[key] = newObj;
      stack.push({ indent, obj: newObj });
    } else {
      parent[key] = parseValue(value);
    }
  }

  return JSON.stringify(result, null, 2);
}

function parseValue(val: string): any {
  if (val === "null") return null;
  if (val === "true") return true;
  if (val === "false") return false;
  if (/^\d+$/.test(val)) return Number.parseInt(val, 10);
  if (/^\d+\.\d+$/.test(val)) return Number.parseFloat(val);
  val = val.replace(/^"(.*)"$/, "$1").replace(/^'(.*)'$/, "$1");
  return val;
}

export default function YamlConverterTool() {
  const [mode, setMode] = useState<"json-to-yaml" | "yaml-to-json">("json-to-yaml");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleConvert = () => {
    setError(null);
    if (!input.trim()) { setOutput(""); return; }
    try {
      if (mode === "json-to-yaml") {
        const parsed = JSON.parse(input);
        setOutput(jsonToYaml(parsed).trim());
      } else {
        setOutput(yamlToJson(input));
      }
    } catch (e: any) {
      setError(e.message);
    }
  };

  return (
    <div className="space-y-6">
      <Tabs value={mode} onValueChange={(v) => setMode(v as any)}>
        <TabsList className="w-full">
          <TabsTrigger value="json-to-yaml" className="flex-1">JSON → YAML</TabsTrigger>
          <TabsTrigger value="yaml-to-json" className="flex-1">YAML → JSON</TabsTrigger>
        </TabsList>
      </Tabs>

      <Textarea
        placeholder={mode === "json-to-yaml" ? '{"key": "value"}' : "key: value"}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="min-h-[200px] resize-y text-base font-mono"
      />

      <Button onClick={handleConvert} className="w-full">
        {mode === "json-to-yaml" ? "Convert to YAML" : "Convert to JSON"}
      </Button>

      {error && <div className="rounded-xl bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}

      {output && (
        <ResultPreview title={mode === "json-to-yaml" ? "YAML Output" : "JSON Output"} copyable={output}>
          <pre className="text-sm whitespace-pre-wrap break-all font-mono">{output}</pre>
        </ResultPreview>
      )}
    </div>
  );
}