"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

type StatsRangeSelectorProps = {
  currentRange: "3" | "6" | "all" | "custom";
  from: string;
  to: string;
};

const presets = [
  { value: "3", label: "3ヶ月" },
  { value: "6", label: "6ヶ月" },
  { value: "all", label: "全期間" },
  { value: "custom", label: "カスタム" },
] as const;

export function StatsRangeSelector({ currentRange, from, to }: StatsRangeSelectorProps) {
  const router = useRouter();
  const [showCustom, setShowCustom] = useState(currentRange === "custom");
  const [customFrom, setCustomFrom] = useState(from);
  const [customTo, setCustomTo] = useState(to);

  function handlePreset(value: string) {
    if (value === "custom") {
      setShowCustom(true);
      return;
    }
    setShowCustom(false);
    router.push(`/expenses/stats?range=${value}`);
  }

  function handleCustomApply() {
    if (customFrom && customTo && customFrom <= customTo) {
      router.push(`/expenses/stats?range=custom&from=${customFrom}&to=${customTo}`);
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2 overflow-x-auto pb-1">
        {presets.map((item) => (
          <Button
            key={item.value}
            type="button"
            variant="outline"
            size="sm"
            className={cn("shrink-0", currentRange === item.value && "border-primary bg-primary/20 text-primary")}
            onClick={() => handlePreset(item.value)}
          >
            {item.label}
          </Button>
        ))}
      </div>
      {showCustom ? (
        <div className="rounded-lg border bg-card p-3">
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
            <input
              type="month"
              value={customFrom}
              onChange={(e) => setCustomFrom(e.target.value)}
              className="h-10 w-full rounded-lg border bg-transparent px-2 text-sm text-white"
            />
            <span className="text-sm text-muted-foreground">〜</span>
            <input
              type="month"
              value={customTo}
              onChange={(e) => setCustomTo(e.target.value)}
              className="h-10 w-full rounded-lg border bg-transparent px-2 text-sm text-white"
            />
          </div>
          <Button type="button" size="sm" className="mt-2 w-full" onClick={handleCustomApply}>
            適用
          </Button>
        </div>
      ) : null}
    </div>
  );
}
