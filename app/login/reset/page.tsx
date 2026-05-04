import { ResetForm } from "./reset-form";

export default function ResetPasswordPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 py-10">
      <div className="mb-8 text-center">
        <p className="text-6xl">🔑</p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-white">パスワードリセット</h1>
      </div>
      <section className="w-full max-w-sm rounded-lg border bg-card p-6 shadow-soft">
        <ResetForm />
        <p className="mt-4 text-center text-xs leading-5 text-muted-foreground">
          メールに届くリンクからパスワードを再設定できます。
        </p>
      </section>
    </main>
  );
}
