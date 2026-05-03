import { redirect } from "next/navigation";
import { LoginForm } from "@/app/login/login-form";
import { createClient } from "@/lib/supabase/server";

export default async function LoginPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/");
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <section className="w-full max-w-md rounded-lg border bg-card p-6 shadow-soft">
        <div className="mb-8 space-y-2">
          <p className="text-sm font-semibold text-emerald-300">HomeHub</p>
          <h1 className="text-2xl font-bold text-white">家庭の予定と買い物をひとつに</h1>
          <p className="text-sm leading-6 text-muted-foreground">
            メールに届くリンクからログインします。パスワードは不要です。
          </p>
        </div>
        <LoginForm />
      </section>
    </main>
  );
}
