import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-5 text-center">
      <p className="text-5xl font-bold text-foreground">404</p>
      <p className="mt-2 text-sm text-muted-foreground">Page not found</p>
      <Link href="/" className="mt-6 text-sm font-semibold text-accent">
        Go home
      </Link>
    </main>
  );
}
