import { LogOut } from "lucide-react";
import { signOut } from "@/app/login/actions";
import { PageHeader } from "@/components/page-header";
import { SubmitButton } from "@/components/ui/submit-button";
import { createClient } from "@/lib/supabase/server";

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <>
      <PageHeader title="Settings" />
      <section className="rounded-2xl bg-card p-4 shadow-card">
        <p className="text-xs font-medium text-muted-foreground">Signed in as</p>
        <p className="mt-1 text-sm font-semibold text-foreground">{user?.email}</p>
      </section>
      <form action={signOut}>
        <SubmitButton variant="danger" className="w-full">
          <LogOut className="size-4" aria-hidden />
          Sign out
        </SubmitButton>
      </form>
    </>
  );
}
