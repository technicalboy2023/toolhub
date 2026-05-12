"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { ResultPreview } from "@/components/shared/result-preview";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Copy, RefreshCw } from "lucide-react";
import { toast } from "sonner";

function generateUUIDv4(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (crypto.getRandomValues(new Uint8Array(1))[0] & 15) | (c === "x" ? 0 : 8);
    return r.toString(16);
  });
}

function generateUUIDv7(): string {
  const timestamp = Date.now().toString(16).padStart(12, "0");
  const random = Array.from(crypto.getRandomValues(new Uint8Array(10)))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  const version = "7";
  const variant = "8";
  return `${timestamp.slice(0, 8)}-${timestamp.slice(8, 12)}-${version}${random.slice(0, 3)}-${variant}${random.slice(3, 6)}-${random.slice(6, 16)}`;
}

export default function UuidGeneratorTool() {
  const [version, setVersion] = useState("v4");
  const [count, setCount] = useState(1);
  const [uuids, setUuids] = useState<string[]>([]);

  const generate = useCallback(() => {
    const fn = version === "v4" ? generateUUIDv4 : generateUUIDv7;
    setUuids(Array.from({ length: count }, () => fn()));
  }, [version, count]);

  const copyAll = async () => {
    try {
      await navigator.clipboard.writeText(uuids.join("\n"));
      toast.success("Copied all UUIDs");
    } catch {
      toast.error("Failed to copy");
    }
  };

  return (
    <div className="space-y-6">
      <Tabs value={version} onValueChange={setVersion}>
        <TabsList className="w-full">
          <TabsTrigger value="v4" className="flex-1">UUID v4 (Random)</TabsTrigger>
          <TabsTrigger value="v7" className="flex-1">UUID v7 (Time-based)</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="flex items-center gap-3">
        <label className="text-sm font-medium whitespace-nowrap">Count:</label>
        <div className="flex gap-1">
          {[1, 5, 10, 25].map((n) => (
            <Button
              key={n}
              variant={count === n ? "default" : "outline"}
              size="sm"
              onClick={() => setCount(n)}
            >
              {n}
            </Button>
          ))}
        </div>
      </div>

      <Button onClick={generate} className="w-full gap-2">
        <RefreshCw className="h-4 w-4" />
        Generate {count > 1 ? `${count} UUIDs` : "UUID"}
      </Button>

      {uuids.length > 0 && (
        <ResultPreview title={`Generated UUIDs (${version})`} copyable={uuids.join("\n")}>
          <div className="space-y-1">
            {uuids.map((uuid, i) => (
              <div key={i} className="flex items-center justify-between py-1.5 border-b border-border/10 last:border-0">
                <code className="text-sm font-mono">{uuid}</code>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(uuid);
                    toast.success("Copied");
                  }}
                  className="p-1 rounded-md hover:bg-muted transition-colors"
                  aria-label="Copy UUID"
                >
                  <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                </button>
              </div>
            ))}
          </div>
        </ResultPreview>
      )}
    </div>
  );
}