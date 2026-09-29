import Link from "next/link";
import { NewLinkForm } from "@/components/new-link-form";
import { CopyLinkButton } from "@/components/copy-link-button";
import { DeleteLinkButton } from "@/components/delete-link-button";
import { createClient } from "@/lib/supabase/server";
import { dayKey, startOfDayIso } from "@/lib/format";

type LinkRow = {
  id: string;
  name: string;
  slug: string;
  destination_url: string;
  created_at: string;
  clicks: { count: number }[];
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const today = startOfDayIso(dayKey(new Date()));

  const [{ data: links, error }, { count: clicksToday }] = await Promise.all([
    supabase
      .from("links")
      .select("id, name, slug, destination_url, created_at, clicks(count)")
      .order("created_at", { ascending: false }),
    supabase
      .from("clicks")
      .select("id", { count: "exact", head: true })
      .gte("clicked_at", today),
  ]);

  if (error) {
    return (
      <p className="rounded-3xl border border-line bg-card px-5 py-8 text-muted">
        Linkovi se ne mogu učitati. Provjeri da je migracija primijenjena na Supabase projekat.
      </p>
    );
  }

  const rows = (links ?? []) as LinkRow[];
  const totalClicks = rows.reduce((sum, link) => sum + (link.clicks[0]?.count ?? 0), 0);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-serif text-5xl">Tvoji linkovi</h1>
        <p className="mt-2 text-muted">Podijeli /r/ link. Odredište vidi samo onaj ko ga otvori.</p>
      </div>

      <section className="grid gap-3 sm:grid-cols-3">
        <Stat label="Linkova" value={rows.length} />
        <Stat label="Otvaranja" value={totalClicks} />
        <Stat label="Danas" value={clicksToday ?? 0} />
      </section>

      <NewLinkForm />

      {rows.length === 0 ? (
        <p className="rounded-3xl border border-dashed border-line bg-card px-5 py-8 text-muted">
          Još nema linkova. Dodaj prvi, npr. Google recenziju.
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {rows.map((link) => (
            <li key={link.id} className="rounded-3xl border border-line bg-card p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="font-serif text-3xl">{link.name}</h2>
                  <p className="mt-1 font-mono text-sm text-signal">/r/{link.slug}</p>
                  <p className="mt-1 max-w-xl truncate text-sm text-muted">{link.destination_url}</p>
                </div>
                <p className="font-serif text-4xl">{link.clicks[0]?.count ?? 0}</p>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <CopyLinkButton path={`/r/${link.slug}`} />
                <Link
                  href={`/app/linkovi/${link.id}`}
                  className="rounded-full border border-line px-3 py-1.5 text-sm hover:border-ink"
                >
                  Analitika
                </Link>
                <DeleteLinkButton id={link.id} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-3xl border border-line bg-card px-5 py-4">
      <p className="text-sm text-muted">{label}</p>
      <p className="font-serif text-4xl">{value}</p>
    </div>
  );
}
