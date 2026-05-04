import { redirect } from "next/navigation";
import { SetupForm } from "@/app/setup/setup-form";
import { getProfile } from "@/lib/db/profiles";
import { createClient } from "@/lib/supabase/server";

export default async function SetupPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const profile = await getProfile(supabase, user.id);

  if (profile.display_name) {
    redirect("/");
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <section className="w-full max-w-md rounded-lg border bg-card p-6 shadow-soft">
        <div className="mb-6 space-y-2">
          <p className="text-sm font-semibold text-primary">HomeHub</p>
          <h1 className="text-2xl font-bold text-white">👋 ようこそ！</h1>
          <p className="text-sm leading-6 text-muted-foreground">
            表示名を設定してください。あとから設定画面で変更できます。
          </p>
        </div>
        <SetupForm />
      </section>
    </main>
  );
}
