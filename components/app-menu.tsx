"use client";

import Link from "next/link";
import { useState } from "react";
import { Settings, X } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";

export function AppMenu() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label={open ? "Close" : "Menu"}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        {open ? <X className="size-5" aria-hidden /> : <Settings className="size-5" aria-hidden />}
      </Button>

      {open ? (
        <>
          <button
            type="button"
            className="fixed inset-0 z-40 cursor-default bg-transparent"
            aria-label="Close"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 top-12 z-50 w-56 rounded-2xl border bg-card p-2 shadow-modal">
            <Button
              asChild
              variant="ghost"
              className="w-full justify-start text-foreground"
              onClick={() => setOpen(false)}
            >
              <Link href="/settings">
                <Settings className="size-4" aria-hidden />
                設定
              </Link>
            </Button>
            <div className="mt-1 border-t pt-1">
              <ThemeToggle className="w-full justify-start" />
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
