"use client";

import { useState, useMemo } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ResultPreview } from "@/components/shared/result-preview";
import { Badge } from "@/components/ui/badge";

export default function RemoveDuplicatesTool() {
  const [input, setInput] = useState("");
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [trimWhitespace, setTrimWhitespace] = useState(true);

  const { lines, unique, removed } = useMemo(() => {
    const allLines = input.split("\n");
    const processed = allLines.map((l) => (trimWhitespace ? l.trim() : l));
    const seen = new Set<string>();
    const uniqueLines: string[] = [];
    const removedLines: string[] = [];

    processed.forEach((line, i) => {
      const key = caseSensitive ? line : line.toLowerCase();
      if (seen.has(key)) {
        removedLines.push(allLines[i]);
      } else {
        seen.add(key);
        uniqueLines.push(allLines[i]);
      }
    });

    return {
      lines: allLines.length,
      unique: uniqueLines.length,
      removed: removedLines.length,
      result: uniqueLines.join("\n"),
    };
  }, [input, caseSensitive, trimWhitespace]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-4">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={caseSensitive}
            onChange={() => setCaseSensitive(!caseSensitive)}
            className="rounded"
          />
          Case sensitive
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={trimWhitespace}
            onChange={() => setTrimWhitespace(!trimWhitespace)}
            className="rounded"
          />
          Trim whitespace
        </label>
      </div>

      <Textarea
        placeholder="Paste text with duplicate lines..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="min-h-[200px] resize-y text-base font-mono"
      />

      {input && (
        <div className="flex gap-2 text-sm">
          <Badge variant="secondary" className="gap-1">
            Lines: <span className="font-mono">{lines}</span>
          </Badge>
          <Badge variant="secondary" className="gap-1">
            Unique: <span className="font-mono">{unique}</span>
          </Badge>
          <Badge variant="secondary" className="gap-1">
            Removed: <span className="font-mono">{removed}</span>
          </Badge>
        </div>
      )}

      {unique > 0 && (
        <ResultPreview title="Result (Unique Lines)" copyable={unique > 0 ? input.split("\n").filter((_, i) => {
          const processed = (trimWhitespace ? input.split("\n")[i].trim() : input.split("\n")[i]);
          const key = caseSensitive ? processed : processed.toLowerCase();
          const allProcessed = input.split("\n").map(l => trimWhitespace ? l.trim() : l);
          const keys = allProcessed.map(l => caseSensitive ? l : l.toLowerCase());
          return keys.indexOf(key) === i;
        }).join("\n") : undefined}>
          <pre className="text-sm whitespace-pre-wrap font-mono">
            {input.split("\n").map((line, i) => {
              const processed = trimWhitespace ? line.trim() : line;
              const key = caseSensitive ? processed : processed.toLowerCase();
              const allProcessed = input.split("\n").map((l) => trimWhitespace ? l.trim() : l);
              const keys = allProcessed.map((l) => caseSensitive ? l : l.toLowerCase());
              const isDuplicate = keys.indexOf(key) !== i;

              return (
                <div
                  key={i}
                  className={`py-0.5 ${isDuplicate ? "text-red-500/40 line-through" : ""}`}
                >
                  {line || " "}
                </div>
              );
            })}
          </pre>
        </ResultPreview>
      )}
    </div>
  );
}