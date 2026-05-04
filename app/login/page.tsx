import { redirect } from "next/navigation";
import { CalendarDays, ListChecks, BookOpen, DollarSign } from "lucide-react";
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
    <main className="flex min-h-screen flex-col items-center justify-center px-4 py-10">
      <div className="mb-8 text-center">
        <p className="text-6xl">🏠</p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-white">HomeHub</h1>
        <div className="mt-4 flex justify-center gap-5 text-muted-foreground">
          <div className="flex flex-col items-center gap-1">
            <ListChecks className="size-5" />
            <span className="text-[10px] font-semibold">買い物</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <CalendarDays className="size-5" />
            <span className="text-[10px] font-semibold">献立</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <BookOpen className="size-5" />
            <span className="text-[10px] font-semibold">レシピ</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <DollarSign className="size-5" />
            <span className="text-[10px] font-semibold">家計簿</span>
          </div>
        </div>
      </div>

      <section className="w-full max-w-sm rounded-lg border bg-card p-6 shadow-soft">
        <LoginForm />
        <p className="mt-4 text-center text-xs leading-5 text-muted-foreground">
          メールに届くリンクからログインします。
          <br />
          パスワードは不要です。
        </p>
      </section>
    </main>
  );
}
