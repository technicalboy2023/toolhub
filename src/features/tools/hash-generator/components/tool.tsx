"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Hash, Copy, Download } from "lucide-react";
import { toast } from "sonner";
import { md5Hash } from "../utils/md5";

export default function HashGeneratorTool() {
  const [input, setInput] = useState("");
  const [hashes, setHashes] = useState({
    md5: "",
    sha1: "",
    sha256: "",
    sha512: "",
  });

  // Generate all hashes when input changes (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (input.trim()) {
        generateAllHashes();
      } else {
        setHashes({ md5: "", sha1: "", sha256: "", sha512: "" });
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [input]);

  const generateAllHashes = async () => {
    if (!input.trim()) return;

    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(input);

      // Generate MD5 using custom implementation
      const md5 = md5Hash(input);

      // Generate other hashes using Web Crypto API
      const [sha1, sha256, sha512] = await Promise.all([
        crypto.subtle.digest("SHA-1", data),
        crypto.subtle.digest("SHA-256", data),
        crypto.subtle.digest("SHA-512", data),
      ]);

      const hexFromBuffer = (buffer: ArrayBuffer) => {
        const hashArray = Array.from(new Uint8Array(buffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      };

      setHashes({
        md5,
        sha1: hexFromBuffer(sha1),
        sha256: hexFromBuffer(sha256),
        sha512: hexFromBuffer(sha512),
      });
    } catch (error) {
      console.error("Hash generation error:", error);
    }
  };

  const copyToClipboard = async (hash: string, format: string) => {
    await navigator.clipboard.writeText(hash);
    toast.success(`Copied ${format}!`);
  };

  const downloadAll = () => {
    const content = `Input: ${input}

MD5: ${hashes.md5}
SHA-1: ${hashes.sha1}
SHA-256: ${hashes.sha256}
SHA-512: ${hashes.sha512}`;

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "all-hashes.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-bold">Input Text</label>
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter text to hash..."
          className="min-h-[100px] font-mono text-sm"
        />
      </div>

      <div className="text-sm text-muted-foreground">
        <p className="font-bold mb-2">Hash Algorithms:</p>
        <p className="mb-4">All hashes are generated automatically as you type</p>
      </div>

      {Object.entries(hashes).map(([algorithm, hash]) => (
        hash && (
          <div key={algorithm} className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold">
                {algorithm.toUpperCase()} Hash
              </label>
              <span className="text-xs text-muted-foreground">
                {hash.length} characters
              </span>
            </div>
            <Textarea
              value={hash}
              readOnly
              className="min-h-[80px] font-mono text-sm bg-muted"
            />
            <div className="flex gap-3">
              <Button
                onClick={() => copyToClipboard(hash, algorithm.toUpperCase())}
                variant="outline"
                className="gap-2 flex-1"
              >
                <Copy className="h-4 w-4" />
                Copy {algorithm.toUpperCase()}
              </Button>
            </div>
          </div>
        )
      ))}

      {Object.values(hashes).some(hash => hash) && (
        <Button onClick={downloadAll} variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Download All
        </Button>
      )}

      <div className="text-sm text-muted-foreground">
        <p className="font-bold mb-1">Hash Algorithms:</p>
        <ul className="list-disc list-inside space-y-1">
          <li><strong>MD5:</strong> 128-bit hash, fast but less secure</li>
          <li><strong>SHA-1:</strong> 160-bit hash, deprecated for security</li>
          <li><strong>SHA-256:</strong> 256-bit hash, recommended for general use</li>
          <li><strong>SHA-512:</strong> 512-bit hash, highest security</li>
        </ul>
      </div>
    </div>
  );
}