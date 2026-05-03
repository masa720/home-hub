import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-sm rounded-lg border bg-card p-6 text-center">
        <h1 className="text-xl font-bold text-white">ページが見つかりません</h1>
        <p className="mt-2 text-sm text-muted-foreground">URLを確認してください。</p>
        <Button asChild className="mt-5">
          <Link href="/">ホームへ戻る</Link>
        </Button>
      </div>
    </main>
  );
}
