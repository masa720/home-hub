"use client";

import Link from "next/link";
import { useState } from "react";
import { BookPlus, CalendarPlus, ListPlus, Menu, PlusCircle, Settings, X } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";

const quickLinks = [
  { href: "/shopping", label: "買い物追加", icon: ListPlus },
  { href: "/recipes", label: "レシピ追加", icon: BookPlus },
  { href: "/meal-plans", label: "献立追加", icon: CalendarPlus },
  { href: "/expenses", label: "支出追加", icon: PlusCircle },
];

export function AppMenu() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <Button
        type="button"
        variant="secondary"
        size="icon"
        aria-label={open ? "メニューを閉じる" : "メニューを開く"}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        {open ? <X className="size-5" aria-hidden /> : <Menu className="size-5" aria-hidden />}
      </Button>

      {open ? (
        <>
          <button
            type="button"
            className="fixed inset-0 z-40 cursor-default bg-transparent"
            aria-label="メニューを閉じる"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 top-12 z-50 w-72 rounded-lg border bg-card p-3 shadow-soft">
            <p className="px-2 pb-2 text-xs font-semibold text-muted-foreground">⚡ クイック操作</p>
            <div className="grid gap-2">
              {quickLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.href}
                    asChild
                    variant="ghost"
                    className="w-full justify-start text-foreground"
                    onClick={() => setOpen(false)}
                  >
                    <Link href={item.href}>
                      <Icon className="size-4" aria-hidden />
                      {item.label}
                    </Link>
                  </Button>
                );
              })}
            </div>
            <div className="mt-3 border-t pt-3">
              <p className="px-2 pb-2 text-xs font-semibold text-muted-foreground">その他</p>
              <ThemeToggle className="w-full justify-start" />
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
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
