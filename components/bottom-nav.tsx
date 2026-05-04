"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ShoppingCart, CalendarDays, BookOpen, WalletCards } from "lucide-react";
import { cn } from "@/lib/utils/cn";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/shopping", label: "Buy", icon: ShoppingCart },
  { href: "/meal-plans", label: "Meals", icon: CalendarDays },
  { href: "/recipes", label: "Recipes", icon: BookOpen },
  { href: "/expenses", label: "Money", icon: WalletCards },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 bg-card/90 backdrop-blur-lg">
      <div className="mx-auto grid max-w-lg grid-cols-5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-0.5 pb-[max(env(safe-area-inset-bottom),0.5rem)] pt-2 text-[10px] font-medium text-muted-foreground transition-colors",
                isActive && "text-accent",
              )}
            >
              <Icon className={cn("size-[22px]", isActive && "stroke-[2.5]")} aria-hidden />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
