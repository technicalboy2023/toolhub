"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { ResultPreview } from "@/components/shared/result-preview";

export default function TimestampConverterTool() {
  const [timestamp, setTimestamp] = useState("");
  const [dateInput, setDateInput] = useState("");

  const timestampResult = (() => {
    const ts = Number(timestamp);
    if (!timestamp.trim() || isNaN(ts)) return null;

    const seconds = ts > 1e12 ? Math.floor(ts / 1000) : ts;
    const date = new Date(seconds * 1000);

    if (date.toString() === "Invalid Date") return null;

    return {
      utc: date.toUTCString(),
      local: date.toLocaleString(),
      iso: date.toISOString(),
      unixSeconds: Math.floor(date.getTime() / 1000),
      unixMs: date.getTime(),
      year: date.getFullYear(),
      month: date.toLocaleString("en", { month: "long" }),
      day: date.getDate(),
      weekday: date.toLocaleString("en", { weekday: "long" }),
    };
  })();

  const dateResult = (() => {
    if (!dateInput.trim()) return null;
    const date = new Date(dateInput);
    if (date.toString() === "Invalid Date") return null;

    return {
      unixSeconds: Math.floor(date.getTime() / 1000),
      unixMs: date.getTime(),
      iso: date.toISOString(),
      utc: date.toUTCString(),
    };
  })();

  return (
    <div className="space-y-10">
      {/* Timestamp to Date */}
      <div className="space-y-4">
        <h3 className="font-medium">Unix Timestamp → Date</h3>
        <Input
          type="text"
          placeholder="Enter Unix timestamp (e.g., 1700000000 or 1700000000000)"
          value={timestamp}
          onChange={(e) => setTimestamp(e.target.value)}
        />

        {timestampResult && (
          <div className="rounded-xl bg-muted/50 p-4 space-y-2">
            {[
              { label: "UTC", value: timestampResult.utc },
              { label: "Local", value: timestampResult.local },
              { label: "ISO 8601", value: timestampResult.iso },
              { label: "Unix (seconds)", value: timestampResult.unixSeconds.toLocaleString() },
              { label: "Unix (milliseconds)", value: timestampResult.unixMs.toLocaleString() },
              { label: "Date", value: `${timestampResult.weekday}, ${timestampResult.month} ${timestampResult.day}, ${timestampResult.year}` },
            ].map((row) => (
              <div key={row.label} className="flex justify-between text-sm py-1 border-b border-border/10 last:border-0">
                <span className="text-muted-foreground">{row.label}</span>
                <code className="font-mono text-right ml-4">{row.value}</code>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Date to Timestamp */}
      <div className="space-y-4">
        <h3 className="font-medium">Date → Unix Timestamp</h3>
        <Input
          type="datetime-local"
          value={dateInput}
          onChange={(e) => setDateInput(e.target.value)}
          className="w-full"
        />

        {dateResult && (
          <ResultPreview title="Converted Values" copyable={String(dateResult.unixSeconds)}>
            <div className="space-y-2">
              {[
                { label: "Unix (seconds)", value: dateResult.unixSeconds.toLocaleString() },
                { label: "Unix (ms)", value: dateResult.unixMs.toLocaleString() },
                { label: "ISO 8601", value: dateResult.iso },
                { label: "UTC", value: dateResult.utc },
              ].map((row) => (
                <div key={row.label} className="flex justify-between text-sm py-1 border-b border-border/10 last:border-0">
                  <span className="text-muted-foreground">{row.label}</span>
                  <code className="font-mono text-right ml-4 text-xs">{row.value}</code>
                </div>
              ))}
            </div>
          </ResultPreview>
        )}
      </div>
    </div>
  );
}