import Link from "next/link";
import { ChevronRight, LogOut } from "lucide-react";
import { signOut } from "@/app/login/actions";
import { PageHeader } from "@/components/page-header";
import { DisplayNameForm } from "@/components/settings/display-name-form";
import { HouseholdForm } from "@/components/settings/household-form";
import { SubmitButton } from "@/components/ui/submit-button";
import { getProfile } from "@/lib/db/profiles";
import { createClient } from "@/lib/supabase/server";

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const profile = user ? await getProfile(supabase, user.id) : null;

  let memberNames: string[] = [];
  if (profile?.household_id) {
    const { data: members } = await supabase
      .from("profiles")
      .select("display_name, email")
      .eq("household_id", profile.household_id)
      .neq("id", user!.id);
    memberNames = (members ?? []).map(
      (m) => m.display_name || m.email?.split("@")[0] || "不明",
    );
  }

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
      <section className="rounded-lg border bg-card p-4">
        <p className="text-sm font-semibold text-muted-foreground">👨‍👩‍👧 家族共有</p>
        <div className="mt-2">
          <HouseholdForm householdId={profile?.household_id ?? ""} memberNames={memberNames} />
        </div>
      </section>
      <nav className="overflow-hidden rounded-lg border bg-card">
        <Link href="/settings/stores" className="flex items-center justify-between px-4 py-3 text-white hover:bg-muted/50">
          <span className="text-sm font-semibold">🏪 店舗</span>
          <ChevronRight className="size-4 text-muted-foreground" />
        </Link>
        <Link href="/settings/categories" className="flex items-center justify-between border-t px-4 py-3 text-white hover:bg-muted/50">
          <span className="text-sm font-semibold">📂 支出カテゴリ</span>
          <ChevronRight className="size-4 text-muted-foreground" />
        </Link>
      </nav>
      <form action={signOut}>
        <SubmitButton variant="ghost" className="w-full text-red-400">
          <LogOut className="size-4" aria-hidden />
          ログアウト
        </SubmitButton>
      </form>
    </>
  );
}
