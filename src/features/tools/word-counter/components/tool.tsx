"use client";

import { useState, useMemo } from "react";
import { Textarea } from "@/components/ui/textarea";
import { ResultPreview } from "@/components/shared/result-preview";

export default function WordCounterTool() {
  const [text, setText] = useState("");

  const stats = useMemo(() => {
    const wordsArray = text.trim() ? text.trim().split(/\s+/) : [];
    const words = wordsArray.length;
    const chars = text.length;
    const charsNoSpaces = text.replace(/\s/g, "").length;
    const sentences = text.trim() ? text.split(/[.!?]+/).filter(Boolean).length : 0;
    const paragraphs = text.trim() ? text.split(/\n\s*\n/).filter(Boolean).length : 0;
    const lines = text ? text.split("\n").length : 0;

    // Reading time (avg 200 wpm)
    const readingTime = Math.ceil(words / 200);
    // Speaking time (avg 130 wpm)
    const speakingTime = Math.ceil(words / 130);

    // Unique words (case-insensitive)
    const uniqueWords = new Set(wordsArray.map(w => w.toLowerCase())).size;

    // Average word length
    const totalCharsInWords = wordsArray.reduce((sum, word) => sum + word.replace(/[^\w]/g, "").length, 0);
    const avgWordLength = words > 0 ? (totalCharsInWords / words).toFixed(1) : 0;

    return {
      words,
      chars,
      charsNoSpaces,
      sentences,
      paragraphs,
      lines,
      readingTime,
      speakingTime,
      uniqueWords,
      avgWordLength
    };
  }, [text]);

  // Stopwords for frequency filtering
  const stopwords = new Set([
    "the", "a", "an", "is", "are", "was", "were", "be", "been", "being",
    "have", "has", "had", "do", "does", "did", "will", "would", "could",
    "should", "may", "might", "shall", "can", "need", "dare", "ought",
    "used", "to", "of", "in", "for", "on", "with", "at", "by", "from", "as", "into"
  ]);

  return (
    <div className="space-y-6">
      <Textarea
        placeholder="Paste or type your text here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="min-h-[200px] resize-y text-base"
      />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Words", value: stats.words },
          { label: "Characters", value: stats.chars },
          { label: "Characters (no spaces)", value: stats.charsNoSpaces },
          { label: "Sentences", value: stats.sentences },
          { label: "Paragraphs", value: stats.paragraphs },
          { label: "Lines", value: stats.lines },
          { label: "Reading Time", value: `${stats.readingTime} min` },
          { label: "Speaking Time", value: `${stats.speakingTime} min` },
          { label: "Unique Words", value: stats.uniqueWords },
          { label: "Avg Word Length", value: stats.avgWordLength },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl bg-muted/50 p-4 text-center"
          >
            <div className="text-2xl font-bold gradient-text-blue">
              {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
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
                .filter(word => !stopwords.has(word))
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