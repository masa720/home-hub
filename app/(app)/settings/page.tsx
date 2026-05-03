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
      <PageHeader title="設定" />
      <section className="rounded-lg border bg-card p-4">
        <p className="text-sm font-semibold text-muted-foreground">ログイン中</p>
        <p className="mt-2 text-white">{user?.email}</p>
      </section>
      <form action={signOut}>
        <SubmitButton variant="danger" className="w-full">
          <LogOut className="size-4" aria-hidden />
          ログアウト
        </SubmitButton>
      </form>
    </>
  );
}
