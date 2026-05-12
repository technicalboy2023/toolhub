"use client";

import { useState, useMemo } from "react";
import { Textarea } from "@/components/ui/textarea";
import { ResultPreview } from "@/components/shared/result-preview";

export default function WordCounterTool() {
  const [text, setText] = useState("");

  const stats = useMemo(() => {
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const chars = text.length;
    const charsNoSpaces = text.replace(/\s/g, "").length;
    const sentences = text.trim() ? text.split(/[.!?]+/).filter(Boolean).length : 0;
    const paragraphs = text.trim() ? text.split(/\n\s*\n/).filter(Boolean).length : 0;
    const lines = text ? text.split("\n").length : 0;
    return { words, chars, charsNoSpaces, sentences, paragraphs, lines };
  }, [text]);

  return (
    <div className="space-y-6">
      <Textarea
        placeholder="Paste or type your text here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="min-h-[200px] resize-y text-base"
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {[
          { label: "Words", value: stats.words },
          { label: "Characters", value: stats.chars },
          { label: "Characters (no spaces)", value: stats.charsNoSpaces },
          { label: "Sentences", value: stats.sentences },
          { label: "Paragraphs", value: stats.paragraphs },
          { label: "Lines", value: stats.lines },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl bg-muted/50 p-4 text-center"
          >
            <div className="text-2xl font-bold gradient-text-blue">
              {stat.value.toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {text && (
        <ResultPreview title="Word Frequency (Top 10)" copyable={text}>
          <div className="space-y-1">
            {Object.entries(
              text
                .toLowerCase()
                .replace(/[^\w\s]/g, "")
                .split(/\s+/)
                .filter(Boolean)
                .reduce((acc: Record<string, number>, word) => {
                  acc[word] = (acc[word] || 0) + 1;
                  return acc;
                }, {}),
            )
              .sort(([, a], [, b]) => b - a)
              .slice(0, 10)
              .map(([word, count]) => (
                <div
                  key={word}
                  className="flex justify-between text-sm py-1 border-b border-border/20 last:border-0"
                >
                  <span>{word}</span>
                  <span className="text-muted-foreground">{count}</span>
                </div>
              ))}
          </div>
        </ResultPreview>
      )}
    </div>
  );
}