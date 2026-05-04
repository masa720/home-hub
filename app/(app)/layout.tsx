import { redirect } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { getProfile } from "@/lib/db/profiles";
import { createClient } from "@/lib/supabase/server";

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const profile = await getProfile(supabase, user.id);

  if (!profile.display_name) {
    redirect("/setup");
  }

  return <AppShell>{children}</AppShell>;
}
