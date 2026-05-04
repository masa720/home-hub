import { LogOut } from "lucide-react";
import { signOut } from "@/app/login/actions";
import { PageHeader } from "@/components/page-header";
import { DisplayNameForm } from "@/components/settings/display-name-form";
import { SubmitButton } from "@/components/ui/submit-button";
import { getProfile } from "@/lib/db/profiles";
import { createClient } from "@/lib/supabase/server";

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const profile = user ? await getProfile(supabase, user.id) : null;

  return (
    <>
      <PageHeader title="⚙️ 設定" />
      <section className="space-y-4 rounded-lg border bg-card p-4">
        <div>
          <p className="text-sm font-semibold text-muted-foreground">👤 ユーザー名</p>
          <DisplayNameForm currentName={profile?.display_name ?? ""} />
        </div>
        <div>
          <p className="text-sm font-semibold text-muted-foreground">📧 メールアドレス</p>
          <p className="mt-1 text-white">{user?.email}</p>
        </div>
      </section>
      <form action={signOut}>
        <SubmitButton variant="ghost" className="w-full text-red-400">
          <LogOut className="size-4" aria-hidden />
          ログアウト
        </SubmitButton>
      </form>
    </>
  );
}
