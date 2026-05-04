"use client";

import { useCallback, useRef, useState } from "react";

type ColorPickerProps = {
  value: string;
  name?: string;
  onChange: (color: string) => void;
};

function hsvToHex(h: number, s: number, v: number) {
  const c = v * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = v - c;
  let r = 0, g = 0, b = 0;
  if (h < 60) { r = c; g = x; }
  else if (h < 120) { r = x; g = c; }
  else if (h < 180) { g = c; b = x; }
  else if (h < 240) { g = x; b = c; }
  else if (h < 300) { r = x; b = c; }
  else { r = c; b = x; }
  const toHex = (n: number) => Math.round((n + m) * 255).toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function hexToHsv(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  let h = 0;
  if (d !== 0) {
    if (max === r) h = 60 * (((g - b) / d) % 6);
    else if (max === g) h = 60 * ((b - r) / d + 2);
    else h = 60 * ((r - g) / d + 4);
  }
  if (h < 0) h += 360;
  const s = max === 0 ? 0 : d / max;
  return [h, s, max];
}

function clamp(val: number, min: number, max: number) {
  return Math.min(max, Math.max(min, val));
}

export function ColorPicker({ value, name, onChange }: ColorPickerProps) {
  const [hsv, setHsv] = useState(() => hexToHsv(value));
  const [hue, sat, val] = hsv;
  const svRef = useRef<HTMLDivElement>(null);
  const hueRef = useRef<HTMLDivElement>(null);

  const hex = hsvToHex(hue, sat, val);

  const updateSV = useCallback((clientX: number, clientY: number) => {
    const el = svRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const s = clamp((clientX - rect.left) / rect.width, 0, 1);
    const v = clamp(1 - (clientY - rect.top) / rect.height, 0, 1);
    const next: [number, number, number] = [hue, s, v];
    setHsv(next);
    onChange(hsvToHex(...next));
  }, [hue, onChange]);

  const updateHue = useCallback((clientY: number) => {
    const el = hueRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const h = clamp(((clientY - rect.top) / rect.height) * 360, 0, 359);
    const next: [number, number, number] = [h, sat, val];
    setHsv(next);
    onChange(hsvToHex(...next));
  }, [sat, val, onChange]);

  function handlePointer(
    update: (x: number, y: number) => void,
  ) {
    return (e: React.PointerEvent) => {
      e.preventDefault();
      const target = e.currentTarget as HTMLElement;
      target.setPointerCapture(e.pointerId);
      update(e.clientX, e.clientY);

      const onMove = (ev: PointerEvent) => update(ev.clientX, ev.clientY);
      const onUp = () => {
        target.removeEventListener("pointermove", onMove);
        target.removeEventListener("pointerup", onUp);
      };
      target.addEventListener("pointermove", onMove);
      target.addEventListener("pointerup", onUp);
    };
  }

  const hueColor = hsvToHex(hue, 1, 1);

  return (
    <div className="space-y-2 py-1">
      <div className="flex gap-2" style={{ maxWidth: 200 }}>
        <div
          ref={svRef}
          className="relative aspect-square flex-1 cursor-crosshair rounded-lg border border-border touch-none"
          style={{
            background: `linear-gradient(to top, #000, transparent), linear-gradient(to right, #fff, ${hueColor})`,
          }}
          onPointerDown={handlePointer(updateSV)}
        >
          <div
            className="pointer-events-none absolute size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-md"
            style={{
              left: `${sat * 100}%`,
              top: `${(1 - val) * 100}%`,
              backgroundColor: hex,
            }}
          />
        </div>
        <div
          ref={hueRef}
          className="relative w-6 cursor-pointer rounded-lg border border-border touch-none"
          style={{
            background: "linear-gradient(to bottom, #f00, #ff0, #0f0, #0ff, #00f, #f0f, #f00)",
          }}
          onPointerDown={handlePointer((_x, y) => updateHue(y))}
        >
          <div
            className="pointer-events-none absolute left-0 right-0 h-2 -translate-y-1/2 rounded border-2 border-white shadow-md"
            style={{ top: `${(hue / 360) * 100}%` }}
          />
        </div>
      </div>
      {name ? (
        <div className="flex items-center gap-2">
          <span
            className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold"
            style={{
              backgroundColor: `${hex}22`,
              borderColor: hex,
              color: hex,
            }}
          >
            {name}
          </span>
          <span className="text-xs text-muted-foreground">{hex}</span>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <span className="size-4 rounded-full" style={{ backgroundColor: hex }} />
          <span className="text-xs text-muted-foreground">{hex}</span>
        </div>
      )}
    </div>
  );
}
