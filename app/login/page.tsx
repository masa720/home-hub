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
    <main className="flex min-h-screen items-center justify-center px-5 py-10">
      <section className="w-full max-w-sm">
        <div className="mb-8">
          <p className="text-2xl font-bold text-foreground">HomeHub</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in with your email. No password needed.
          </p>
        </div>
        <LoginForm />
      </section>
    </main>
  );
}
