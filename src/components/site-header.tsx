import Link from "next/link";
import { signOut } from "@/app/actions";

export function SiteHeader({ email }: { email?: string }) {
  return (
    <header className="border-b border-line bg-paper/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-5 py-4">
        <Link href={email ? "/app" : "/"} className="font-serif text-3xl leading-none tracking-tight">
          NFTBIH
        </Link>
        {email ? (
          <div className="flex items-center gap-3 text-sm">
            <span className="hidden max-w-56 truncate text-muted sm:inline">{email}</span>
            <form action={signOut}>
              <button
                type="submit"
                className="rounded-full border border-line bg-card px-3 py-1.5 hover:border-ink"
              >
                Odjava
              </button>
            </form>
          </div>
        ) : (
          <Link
            href="/login"
            className="rounded-full bg-ink px-4 py-2 text-sm text-paper hover:bg-signal"
          >
            Prijava
          </Link>
        )}
      </div>
    </header>
  );
}
