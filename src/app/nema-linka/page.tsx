import Link from "next/link";
import { SiteHeader } from "@/components/site-header";

export default function MissingLinkPage() {
  return (
    <div className="min-h-full">
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-5 sm:py-16">
        <h1 className="font-serif text-4xl sm:text-5xl">Ovaj link nije aktivan.</h1>
        <p className="mt-3 text-muted">Kod ne postoji ili je link obrisan.</p>
        <Link href="/" className="mt-6 inline-block text-sm underline">
          Nazad na NFTBIH
        </Link>
      </main>
    </div>
  );
}
