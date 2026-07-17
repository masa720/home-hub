import { Suspense } from "react";
import { redirect } from "next/navigation";
import { AppLoadingSkeleton } from "@/components/app-loading-skeleton";
import { AppShell } from "@/components/app-shell";
import { TimezoneSync } from "@/components/timezone-sync";
import { getRequestAuth, getRequestProfile } from "@/lib/auth/server";

async function ProtectedContent({ children }: { children: React.ReactNode }) {
  const { userId } = await getRequestAuth();

  if (!userId) {
    redirect("/login");
  }

  const profile = await getRequestProfile();

  if (!profile.display_name) {
    redirect("/setup");
  }

  return children;
}

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppShell>
      <TimezoneSync />
      <Suspense fallback={<AppLoadingSkeleton />}>
        <ProtectedContent>{children}</ProtectedContent>
      </Suspense>
    </AppShell>
  );
}
