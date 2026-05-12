"use client";

import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowDownUp } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UnitCategory {
  name: string;
  units: { label: string; value: string; toBase: (v: number) => number; fromBase: (v: number) => number }[];
}

const categories: UnitCategory[] = [
  {
    name: "Length",
    units: [
      { label: "Meters", value: "m", toBase: (v) => v, fromBase: (v) => v },
      { label: "Kilometers", value: "km", toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
      { label: "Centimeters", value: "cm", toBase: (v) => v / 100, fromBase: (v) => v * 100 },
      { label: "Millimeters", value: "mm", toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
      { label: "Miles", value: "mi", toBase: (v) => v * 1609.344, fromBase: (v) => v / 1609.344 },
      { label: "Yards", value: "yd", toBase: (v) => v * 0.9144, fromBase: (v) => v / 0.9144 },
      { label: "Feet", value: "ft", toBase: (v) => v * 0.3048, fromBase: (v) => v / 0.3048 },
      { label: "Inches", value: "in", toBase: (v) => v * 0.0254, fromBase: (v) => v / 0.0254 },
    ],
  },
  {
    name: "Mass",
    units: [
      { label: "Kilograms", value: "kg", toBase: (v) => v, fromBase: (v) => v },
      { label: "Grams", value: "g", toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
      { label: "Milligrams", value: "mg", toBase: (v) => v / 1e6, fromBase: (v) => v * 1e6 },
      { label: "Pounds", value: "lb", toBase: (v) => v * 0.453592, fromBase: (v) => v / 0.453592 },
      { label: "Ounces", value: "oz", toBase: (v) => v * 0.0283495, fromBase: (v) => v / 0.0283495 },
      { label: "Tons (metric)", value: "t", toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
    ],
  },
  {
    name: "Temperature",
    units: [
      { label: "Celsius", value: "c", toBase: (v) => v, fromBase: (v) => v },
      { label: "Fahrenheit", value: "f", toBase: (v) => (v - 32) * 5 / 9, fromBase: (v) => v * 9 / 5 + 32 },
      { label: "Kelvin", value: "k", toBase: (v) => v - 273.15, fromBase: (v) => v + 273.15 },
    ],
  },
  {
    name: "Volume",
    units: [
      { label: "Liters", value: "l", toBase: (v) => v, fromBase: (v) => v },
      { label: "Milliliters", value: "ml", toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
      { label: "Gallons (US)", value: "gal", toBase: (v) => v * 3.78541, fromBase: (v) => v / 3.78541 },
      { label: "Quarts", value: "qt", toBase: (v) => v * 0.946353, fromBase: (v) => v / 0.946353 },
      { label: "Cups", value: "cup", toBase: (v) => v * 0.236588, fromBase: (v) => v / 0.236588 },
      { label: "Fluid Ounces", value: "floz", toBase: (v) => v * 0.0295735, fromBase: (v) => v / 0.0295735 },
    ],
  },
  {
    name: "Speed",
    units: [
      { label: "km/h", value: "kmh", toBase: (v) => v / 3.6, fromBase: (v) => v * 3.6 },
      { label: "mph", value: "mph", toBase: (v) => v * 0.44704, fromBase: (v) => v / 0.44704 },
      { label: "m/s", value: "ms", toBase: (v) => v, fromBase: (v) => v },
      { label: "Knots", value: "kn", toBase: (v) => v * 0.514444, fromBase: (v) => v / 0.514444 },
    ],
  },
];

export default function UnitConverterTool() {
  const [category, setCategory] = useState(categories[0].name);
  const [fromUnit, setFromUnit] = useState(categories[0].units[0].value);
  const [toUnit, setToUnit] = useState(categories[0].units[1].value);
  const [value, setValue] = useState("1");

  const currentCategory = categories.find((c) => c.name === category)!;

  const result = useMemo(() => {
    const from = currentCategory.units.find((u) => u.value === fromUnit);
    const to = currentCategory.units.find((u) => u.value === toUnit);
    if (!from || !to || !value) return null;
    const num = Number.parseFloat(value);
    if (isNaN(num)) return null;
    const base = from.toBase(num);
    const converted = to.fromBase(base);
    return converted;
  }, [category, fromUnit, toUnit, value, currentCategory]);

  const swapUnits = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  };

  return (
    <div className="space-y-6">
      <Select value={category} onValueChange={(v) => {
        if (!v) return;
        setCategory(v);
        const cat = categories.find((c) => c.name === v)!;
        setFromUnit(cat.units[0].value);
        setToUnit(cat.units[1].value);
      }}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select category" />
        </SelectTrigger>
        <SelectContent>
          {categories.map((c) => (
            <SelectItem key={c.name} value={c.name}>{c.name}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="grid grid-cols-[1fr_auto_1fr] gap-3 items-end">
        <div className="space-y-2">
          <label className="text-xs text-muted-foreground">From</label>
          <Input
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="text-base"
            placeholder="1"
          />
          <Select value={fromUnit} onValueChange={(v) => v && setFromUnit(v)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {currentCategory.units.map((u) => (
                <SelectItem key={u.value} value={u.value}>{u.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button variant="ghost" size="icon" onClick={swapUnits} className="mb-2">
          <ArrowDownUp className="h-4 w-4" />
        </Button>

        <div className="space-y-2">
          <label className="text-xs text-muted-foreground">To</label>
          <div className="flex items-center h-10 px-3 rounded-lg border bg-muted/30 text-base font-mono">
            {result !== null ? result.toLocaleString(undefined, { maximumFractionDigits: 10 }) : "—"}
          </div>
          <Select value={toUnit} onValueChange={(v) => v && setToUnit(v)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {currentCategory.units.map((u) => (
                <SelectItem key={u.value} value={u.value}>{u.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}