"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ResultPreview } from "@/components/shared/result-preview";
import { RefreshCw, Copy, Shield } from "lucide-react";
import { toast } from "sonner";

const UPPERCASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const LOWERCASE = "abcdefghijklmnopqrstuvwxyz";
const NUMBERS = "0123456789";
const SYMBOLS = "!@#$%^&*()_+-=[]{}|;:,.<>?";

function generatePassword(length: number, useUpper: boolean, useLower: boolean, useNumbers: boolean, useSymbols: boolean): string {
  let chars = "";
  if (useUpper) chars += UPPERCASE;
  if (useLower) chars += LOWERCASE;
  if (useNumbers) chars += NUMBERS;
  if (useSymbols) chars += SYMBOLS;

  if (!chars) return "";

  const array = new Uint32Array(length);
  crypto.getRandomValues(array);

  let password = "";
  for (let i = 0; i < length; i++) {
    password += chars[array[i] % chars.length];
  }
  return password;
}

function calculateEntropy(password: string, charset: string): number {
  const charsetSize = charset.length;
  return password.length * Math.log2(charsetSize);
}

export default function PasswordGeneratorTool() {
  const [length, setLength] = useState(16);
  const [useUpper, setUseUpper] = useState(true);
  const [useLower, setUseLower] = useState(true);
  const [useNumbers, setUseNumbers] = useState(true);
  const [useSymbols, setUseSymbols] = useState(true);
  const [password, setPassword] = useState("");

  const generate = useCallback(() => {
    const pwd = generatePassword(length, useUpper, useLower, useNumbers, useSymbols);
    setPassword(pwd);
  }, [length, useUpper, useLower, useNumbers, useSymbols]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(password);
      toast.success("Password copied to clipboard");
    } catch {
      toast.error("Failed to copy");
    }
  };

  const charset = [useUpper, useLower, useNumbers, useSymbols].filter(Boolean);
  const entropy = password ? calculateEntropy(password, charset.join("")) : 0;

  const getStrength = (pwd: string): { label: string; color: string; width: string; entropy: number } => {
    let score = 0;
    if (pwd.length >= 8) score++;
    if (pwd.length >= 12) score++;
    if (pwd.length >= 16) score++;
    if (pwd.length >= 20) score++;
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) score++;
    if (/\d/.test(pwd)) score++;
    if (/[^a-zA-Z0-9]/.test(pwd)) score++;

    if (score <= 2) return { label: "Weak", color: "bg-red-500", width: "w-1/4", entropy: 0 };
    if (score <= 3) return { label: "Fair", color: "bg-amber-500", width: "w-2/4", entropy: 1 };
    if (score <= 4) return { label: "Good", color: "bg-yellow-500", width: "w-3/4", entropy: 2 };
    if (score <= 5) return { label: "Strong", color: "bg-emerald-500", width: "w-3/4", entropy: 3 };
    return { label: "Very Strong", color: "bg-emerald-500", width: "w-full", entropy: 4 };
  };

  const strength = password ? getStrength(password) : null;

  return (
    <div className="space-y-6">
      {/* Options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Password Length: {length}</label>
          <Input
            type="range"
            min={4}
            max={64}
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>4</span>
            <span>64</span>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Character Sets</label>
          <div className="grid grid-cols-2 gap-2">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={useUpper}
                onChange={() => setUseUpper(!useUpper)}
                className="border-2 border-foreground"
              />
              A-Z
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={useLower}
                onChange={() => setUseLower(!useLower)}
                className="border-2 border-foreground"
              />
              a-z
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={useNumbers}
                onChange={() => setUseNumbers(!useNumbers)}
                className="border-2 border-foreground"
              />
              0-9
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={useSymbols}
                onChange={() => setUseSymbols(!useSymbols)}
                className="border-2 border-foreground"
              />
              !@#$
            </label>
          </div>
        </div>
      </div>

      <Button onClick={generate} className="w-full gap-2">
        <RefreshCw className="h-4 w-4" />
        Generate Password
      </Button>

      {password && (
        <div className="space-y-4">
          {/* Entropy display */}
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Entropy</span>
            <span className="font-mono text-primary">~{entropy.toFixed(1)} bits</span>
          </div>

          {/* Strength bar */}
          {strength && (
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Strength</span>
                <span className="font-medium">{strength.label}</span>
              </div>
              <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                <div
                  className={`h-full ${strength.color} ${strength.width} rounded-full transition-all`}
                />
              </div>
            </div>
          )}

          {/* Character composition */}
          <div className="flex flex flex-wrap gap-2 text-xs">
            {useUpper && (
              <span className="border-2 border-foreground px-2 py-0.5 font-bold">
                {UPPERCASE.length}
              </span>
            )}
            {useLower && (
              <span className="border-2 border-foreground px-2 py-0.5 font-bold">
                {LOWERCASE.length}
              </span>
            )}
            {useNumbers && (
              <span className="border-2 border-foreground px-2 py-0.5 font-bold">
                {NUMBERS.length}
              </span>
            )}
            {useSymbols && (
              <span className="border-2 border-foreground px-2 py-0.5 font-bold">
                {SYMBOLS.length}
              </span>
            )}
          </div>

          <div className="flex gap-2">
            <Input value={password} readOnly className="text-base font-mono" />
            <Button variant="outline" size="icon" onClick={copyToClipboard}>
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
