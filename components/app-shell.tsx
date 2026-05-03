import Link from "next/link";
import { BottomNav } from "@/components/bottom-nav";
import { AppMenu } from "@/components/app-menu";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto min-h-screen w-full max-w-3xl px-4 pb-28 pt-5 sm:px-6">
      <header className="mb-5 flex items-center justify-between gap-3">
        <Link href="/" className="min-w-0" aria-label="HomeHub ホーム">
          <span className="block truncate text-2xl font-bold tracking-normal text-white">HomeHub</span>
        </Link>
        <AppMenu />
      </header>
      <main className="space-y-6">{children}</main>
      <BottomNav />
    </div>
  );
}
