"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { ResultPreview } from "@/components/shared/result-preview";
import { Button } from "@/components/ui/button";
import { Copy, Download } from "lucide-react";
import { toast } from "sonner";

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const clean = hex.replace("#", "");
  if (!/^[0-9a-fA-F]{6}$/.test(clean) && !/^[0-9a-fA-F]{3}$/.test(clean)) return null;
  const full = clean.length === 3 ? clean.split("").map((c) => c + c).join("") : clean;
  const num = Number.parseInt(full, 16);
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
}

function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

export default function ColorPickerTool() {
  const [color, setColor] = useState("#6366f1");

  const rgb = hexToRgb(color);
  const hsl = rgb ? rgbToHsl(rgb.r, rgb.g, rgb.b) : null;

  // Generate 5-shade palette (tints and shades)
  const generatePalette = (hex: string) => {
    const rgb = hexToRgb(hex);
    if (!rgb) return [];

    const palette = [];
    // Original color
    palette.push({ ...rgb, label: "Original" });

    // 2 tints (lighter)
    for (let i = 1; i <= 2; i++) {
      const factor = 0.2 * i;
      palette.push({
        r: Math.min(255, rgb.r + (255 - rgb.r) * factor),
        g: Math.min(255, rgb.g + (255 - rgb.g) * factor),
        b: Math.min(255, rgb.b + (255 - rgb.b) * factor),
        label: `Tint ${i}`
      });
    }

    // 2 shades (darker)
    for (let i = 1; i <= 2; i++) {
      const factor = 0.2 * i;
      palette.push({
        r: Math.max(0, rgb.r - rgb.r * factor),
        g: Math.max(0, rgb.g - rgb.g * factor),
        b: Math.max(0, rgb.b - rgb.b * factor),
        label: `Shade ${i}`
      });
    }

    return palette;
  };

  // Generate color suggestions
  const generateSuggestions = (hex: string) => {
    const rgb = hexToRgb(hex);
    if (!rgb) return [];

    const suggestions = [];

    // Complementary (opposite on color wheel)
    const compHsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    const compHue = (compHsl.h + 180) % 360;
    const compRgb = hslToRgb(compHue, compHsl.s, compHsl.l);
    suggestions.push({ ...compRgb, label: "Complementary" });

    // Triadic (120° apart)
    const triadHue1 = (compHsl.h + 120) % 360;
    const triadHue2 = (compHsl.h + 240) % 360;
    const triadRgb1 = hslToRgb(triadHue1, compHsl.s, compHsl.l);
    const triadRgb2 = hslToRgb(triadHue2, compHsl.s, compHsl.l);
    suggestions.push({ ...triadRgb1, label: "Triadic 1" });
    suggestions.push({ ...triadRgb2, label: "Triadic 2" });

    // Analogous (30° apart)
    const analogHue1 = (compHsl.h + 30) % 360;
    const analogHue2 = (compHsl.h - 30 + 360) % 360;
    const analogRgb1 = hslToRgb(analogHue1, compHsl.s, compHsl.l);
    const analogRgb2 = hslToRgb(analogHue2, compHsl.s, compHsl.l);
    suggestions.push({ ...analogRgb1, label: "Analogous 1" });
    suggestions.push({ ...analogRgb2, label: "Analogous 2" });

    return suggestions;
  };

  const palette = color ? generatePalette(color) : [];
  const suggestions = color ? generateSuggestions(color) : [];

  const copyToClipboard = (text: string, format: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`Copied ${format}!`);
  };

  const cssVariable = `--primary-color: ${color};`;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div
          className="h-16 w-16 rounded-xl border shadow-lg shrink-0"
          style={{ backgroundColor: color }}
        />
        <Input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="h-16 w-24 p-1 cursor-pointer"
        />
        <div className="flex-1">
          <Input
            type="text"
            value={color}
            onChange={(e) => {
              const val = e.target.value.startsWith("#") ? e.target.value : `#${e.target.value}`;
              if (/^#[0-9a-fA-F]{6}$/.test(val)) setColor(val);
              else if (/^#[0-9a-fA-F]{3}$/.test(val)) setColor(val);
              else setColor(e.target.value);
            }}
            className="font-mono"
            placeholder="#000000"
          />
          <Button
            variant="outline"
            onClick={() => copyToClipboard(color, "HEX")}
            className="gap-2 mt-2"
          >
            <Copy className="h-3 w-3" />
            Copy HEX
          </Button>
        </div>
      </div>

      {rgb && hsl && (
        <>
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl bg-muted/50 p-4 space-y-2">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">RGB</p>
              <div className="space-y-1.5">
                {[
                  { label: "Red", value: rgb.r, max: 255 },
                  { label: "Green", value: rgb.g, max: 255 },
                  { label: "Blue", value: rgb.b, max: 255 },
                ].map((c) => (
                  <div key={c.label} className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground w-10">{c.label}</span>
                    <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${(c.value / c.max) * 100}%`, backgroundColor: c.label.toLowerCase() }}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => copyToClipboard(c.value.toString(), "RGB")}
                        className="gap-2"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                    <span className="text-xs font-mono w-8 text-right">{c.value}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                <p className="text-sm font-mono">rgb({rgb.r}, {rgb.g}, {rgb.b})</p>
                <Button
                  variant="outline"
                  onClick={() => copyToClipboard(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`, "RGB")}
                  className="gap-2"
                >
                  <Copy className="h-3 w-3" />
                  Copy RGB
                </Button>
              </div>
            </div>

            <div className="rounded-xl bg-muted/50 p-4 space-y-2">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">HSL</p>
              <div className="space-y-1.5">
                {[
                  { label: "Hue", value: hsl.h, max: 360 },
                  { label: "Saturation", value: hsl.s, max: 100 },
                  { label: "Lightness", value: hsl.l, max: 100 },
                ].map((c) => (
                  <div key={c.label} className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground w-10">{c.label}</span>
                    <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${(c.value / c.max) * 100}%`,
                          background: c.label === "Hue"
                            ? `linear-gradient(to right, red, yellow, lime, cyan, blue, magenta, red)`
                            : "currentColor"
                        }}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => copyToClipboard(c.value.toString(), "HSL")}
                        className="gap-2"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                    <span className="text-xs font-mono w-8 text-right">{c.value}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                <p className="text-sm font-mono">hsl({hsl.h}, {hsl.s}%, {hsl.l}%)</p>
                <Button
                  variant="outline"
                  onClick={() => copyToClipboard(`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`, "HSL")}
                  className="gap-2"
                >
                  <Copy className="h-3 w-3" />
                  Copy HSL
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-xl bg-muted/50 p-4">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Palette</p>
              <div className="grid grid-cols-5 gap-2">
                {palette.map((color, index) => (
                  <div key={index} className="aspect-square rounded">
                    <div
                      className="h-full w-full"
                      style={{ backgroundColor: `rgb(${color.r}, ${color.g}, ${color.b})` }}
                    >
                      <Button
                        variant="outline"
                        onClick={() => copyToClipboard(`rgb(${color.r}, ${color.g}, ${color.b})`, "Palette")}
                        className="absolute inset-0"
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {palette.map((color, index) => (
                  <span key={index} className="text-xs font-mono">
                    rgb({color.r}, {color.g}, {color.b}){index < palette.length - 1 ? ", " : ""}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-xl bg-muted/50 p-4">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Suggestions</p>
              <div className="grid grid-cols-3 gap-2">
                {suggestions.map((color, index) => (
                  <div key={index} className="aspect-square rounded">
                    <div
                      className="h-full w-full"
                      style={{ backgroundColor: `rgb(${color.r}, ${color.g}, ${color.b})` }}
                    >
                      <Button
                        variant="outline"
                        onClick={() => copyToClipboard(`rgb(${color.r}, ${color.g}, ${color.b})`, "Suggestion")}
                        className="absolute inset-0"
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {suggestions.map((color, index) => (
                  <span key={index} className="text-xs font-mono">
                    rgb({color.r}, {color.g}, {color.b}){index < suggestions.length - 1 ? ", " : ""}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      <div className="border-t pt-4">
        <div className="space-y-2">
          <p className="text-sm font-bold">CSS Variable</p>
          <div className="space-y-1">
            <div className="font-mono bg-muted px-3 py-2 rounded">
              {cssVariable}
            </div>
            <Button
              variant="outline"
              onClick={() => copyToClipboard(cssVariable, "CSS Variable")}
              className="gap-2"
            >
              <Copy className="h-3 w-3" />
              Copy CSS Variable
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper function to convert HSL to RGB
function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  h /= 360;
  s /= 100;
  l /= 100;

  let r, g, b;

  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const hue2rgb = (p: number, q: number, t: number): number => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255)
  };
}