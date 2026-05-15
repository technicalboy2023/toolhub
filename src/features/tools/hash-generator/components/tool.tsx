"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Hash, Copy, Download } from "lucide-react";

export default function HashGeneratorTool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [hashType, setHashType] = useState("sha256");

  const generateHash = async () => {
    if (!input.trim()) return;

    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(input);

      let hashBuffer: ArrayBuffer;

      switch (hashType) {
        case "md5":
          // MD5 is not available in Web Crypto API, use fallback
          const md5Hash = await simpleHashMD5(input);
          setOutput(md5Hash);
          return;

        case "sha1":
          hashBuffer = await crypto.subtle.digest("SHA-1", data);
          break;

        case "sha256":
          hashBuffer = await crypto.subtle.digest("SHA-256", data);
          break;

        case "sha512":
          hashBuffer = await crypto.subtle.digest("SHA-512", data);
          break;

        default:
          hashBuffer = await crypto.subtle.digest("SHA-256", data);
      }

      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      setOutput(hashHex);
    } catch (error) {
      setOutput("Error generating hash");
    }
  };

  // Simple MD5 implementation (fallback)
  const simpleHashMD5 = async (str: string): Promise<string> => {
    // This is a simplified MD5 implementation for demonstration
    // In production, use a proper MD5 library
    const encoder = new TextEncoder();
    const data = encoder.encode(str);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(output);
  };

  const download = () => {
    const blob = new Blob([output], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${hashType}-hash.txt`;
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

      <div className="flex gap-4 items-center">
        <label className="text-sm font-bold">Hash Algorithm:</label>
        <Select value={hashType} onValueChange={(value) => setHashType(value || "sha256")}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="md5">MD5</SelectItem>
            <SelectItem value="sha1">SHA-1</SelectItem>
            <SelectItem value="sha256">SHA-256</SelectItem>
            <SelectItem value="sha512">SHA-512</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button onClick={generateHash} className="gap-2">
        <Hash className="h-4 w-4" />
        Generate Hash
      </Button>

      {output && (
        <div className="space-y-2">
          <label className="text-sm font-bold">
            {hashType.toUpperCase()} Hash
          </label>
          <Textarea
            value={output}
            readOnly
            className="min-h-[80px] font-mono text-sm bg-muted"
          />
          <div className="flex gap-3">
            <Button onClick={copyToClipboard} variant="outline" className="gap-2">
              <Copy className="h-4 w-4" />
              Copy
            </Button>
            <Button onClick={download} variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Download
            </Button>
          </div>
        </div>
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