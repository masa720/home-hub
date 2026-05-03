import { BottomNav } from "@/components/bottom-nav";
import { AppMenu } from "@/components/app-menu";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto min-h-screen w-full max-w-3xl px-4 pb-28 pt-5 sm:px-6">
      <div className="mb-4 flex justify-end">
        <AppMenu />
      </div>
      <main className="space-y-6">{children}</main>
      <BottomNav />
    </div>
  );
}
