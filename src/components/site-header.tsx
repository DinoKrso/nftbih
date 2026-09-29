import Link from "next/link";
import { signOut } from "@/app/actions";

export function SiteHeader({ email }: { email?: string }) {
  return (
    <header className="border-b border-line bg-paper/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-3 px-4 py-3 sm:px-5 sm:py-4">
        <Link href={email ? "/app" : "/"} className="font-serif text-2xl leading-none tracking-tight sm:text-3xl">
          NFTBIH
        </Link>
        {email ? (
          <div className="flex items-center gap-3 text-sm">
            <span className="hidden max-w-56 truncate text-muted sm:inline">{email}</span>
            <form action={signOut}>
              <button
                type="submit"
                className="min-h-11 rounded-full border border-line bg-card px-3 hover:border-ink"
              >
                Odjava
              </button>
            </form>
          </div>
        ) : (
          <Link
            href="/login"
            className="inline-flex min-h-11 items-center rounded-full bg-ink px-4 text-sm text-paper hover:bg-signal"
          >
            Prijava
          </Link>
        )}
      </div>
    </header>
  );
}
