"use client";

import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { ResultPreview } from "@/components/shared/result-preview";

export default function TimestampConverterTool() {
  const [timestamp, setTimestamp] = useState("");
  const [dateInput, setDateInput] = useState("");

  // Auto-update current Unix time every second
  useMemo(() => {
    const interval = setInterval(() => {
      // Don't update if user is typing
      if (document.activeElement !== document.getElementById("timestamp-input")) {
        setTimestamp(Date.now().toString());
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const timestampResult = useMemo(() => {
    const ts = Number(timestamp);
    if (!timestamp.trim() || isNaN(ts)) return null;

    // Auto-detect if input is seconds vs milliseconds (if > 1e10, it's ms)
    const seconds = ts > 1e10 ? Math.floor(ts / 1000) : ts;
    const date = new Date(seconds * 1000);

    if (date.toString() === "Invalid Date") return null;

    // Calculate relative time
    const now = Date.now();
    const diffSeconds = Math.floor((date.getTime() - now) / 1000);
    const relativeTime = getRelativeTime(diffSeconds);

    return {
      utc: date.toUTCString(),
      // Show in multiple timezones: UTC, IST (Asia/Kolkata), US/Eastern, US/Pacific
      ist: new Date(seconds * 1000).toLocaleString("en-US", { timeZone: "Asia/Kolkata" }),
      eastern: new Date(seconds * 1000).toLocaleString("en-US", { timeZone: "America/New_York" }),
      pacific: new Date(seconds * 1000).toLocaleString("en-US", { timeZone: "America/Los_Angeles" }),
      iso: date.toISOString(),
      unixSeconds: Math.floor(date.getTime() / 1000),
      unixMs: date.getTime(),
      year: date.getFullYear(),
      month: date.toLocaleString("en", { month: "long" }),
      day: date.getDate(),
      weekday: date.toLocaleString("en", { weekday: "long" }),
      relativeTime, // "3 days ago", "2 hours from now", etc.
    };
  }, [timestamp]);

  const dateResult = useMemo(() => {
    if (!dateInput.trim()) return null;
    const date = new Date(dateInput);
    if (date.toString() === "Invalid Date") return null;

    return {
      unixSeconds: Math.floor(date.getTime() / 1000),
      unixMs: date.getTime(),
      iso: date.toISOString(),
      utc: date.toUTCString(),
    };
  }, [dateInput]);

  // Helper function to get relative time string
  function getRelativeTime(diffSeconds: number): string {
    const absSeconds = Math.abs(diffSeconds);
    const isFuture = diffSeconds > 0;

    if (absSeconds < 5) {
      return isFuture ? "just now" : "just now";
    } else if (absSeconds < 60) {
      return isFuture ? `in ${absSeconds} seconds` : `${absSeconds} seconds ago`;
    } else if (absSeconds < 3600) {
      const minutes = Math.floor(absSeconds / 60);
      return isFuture ? `in ${minutes} minute${minutes !== 1 ? 's' : ''}` : `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
    } else if (absSeconds < 86400) {
      const hours = Math.floor(absSeconds / 3600);
      return isFuture ? `in ${hours} hour${hours !== 1 ? 's' : ''}` : `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    } else if (absSeconds < 2592000) { // 30 days
      const days = Math.floor(absSeconds / 86400);
      return isFuture ? `in ${days} day${days !== 1 ? 's' : ''}` : `${days} day${days !== 1 ? 's' : ''} ago`;
    } else if (absSeconds < 31536000) { // 365 days
      const months = Math.floor(absSeconds / 2592000);
      return isFuture ? `in ${months} month${months !== 1 ? 's' : ''}` : `${months} month${months !== 1 ? 's' : ''} ago`;
    } else {
      const years = Math.floor(absSeconds / 31536000);
      return isFuture ? `in ${years} year${years !== 1 ? 's' : ''}` : `${years} year${years !== 1 ? 's' : ''} ago`;
    }
  }

  return (
    <div className="space-y-10">
      {/* Timestamp to Date */}
      <div className="space-y-4">
        <h3 className="font-medium">Unix Timestamp → Date</h3>
        <Input
          id="timestamp-input"
          type="text"
          placeholder="Enter Unix timestamp (e.g., 1700000000 or 1700000000000)"
          value={timestamp}
          onChange={(e) => setTimestamp(e.target.value)}
        />

        {timestampResult && (
          <div className="rounded-xl bg-muted/50 p-4 space-y-2">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Current Unix Time</p>
              <p className="font-mono text-lg">{timestampResult.unixSeconds}</p>
              {timestampResult.relativeTime && (
                <p className="text-xs text-muted-foreground mt-1">({timestampResult.relativeTime})</p>
              )}
            </div>

            {[
              { label: "UTC", value: timestampResult.utc },
              { label: "IST (India)", value: timestampResult.ist },
              { label: "US/Eastern", value: timestampResult.eastern },
              { label: "US/Pacific", value: timestampResult.pacific },
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