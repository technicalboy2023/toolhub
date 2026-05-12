"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { ResultPreview } from "@/components/shared/result-preview";

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
        </div>
      </div>

      {rgb && hsl && (
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
                  <span className="text-xs font-mono w-8 text-right">{c.value}</span>
                </div>
              ))}
            </div>
            <p className="text-sm font-mono mt-2">rgb({rgb.r}, {rgb.g}, {rgb.b})</p>
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
                  <span className="text-xs font-mono w-8 text-right">{c.value}</span>
                </div>
              ))}
            </div>
            <p className="text-sm font-mono mt-2">hsl({hsl.h}, {hsl.s}%, {hsl.l}%)</p>
          </div>
        </div>
      )}
    </div>
  );
}