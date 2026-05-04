import Link from "next/link";
import { BottomNav } from "@/components/bottom-nav";
import { AppMenu } from "@/components/app-menu";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto min-h-screen w-full max-w-lg pb-24 pt-[env(safe-area-inset-top)]">
      <header className="sticky top-0 z-30 flex items-center justify-between gap-3 bg-background/80 px-5 py-3 backdrop-blur-lg">
        <Link href="/" className="min-w-0" aria-label="HomeHub">
          <span className="text-lg font-bold tracking-tight text-foreground">HomeHub</span>
        </Link>
        <AppMenu />
      </header>
      <main className="space-y-4 px-5">{children}</main>
      <BottomNav />
    </div>
  );
}
