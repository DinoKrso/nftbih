import Link from "next/link";
import { notFound } from "next/navigation";
import { CopyLinkButton } from "@/components/copy-link-button";
import { createClient } from "@/lib/supabase/server";
import { dayKey, dayLabel, deviceLabel, formatDateTime, recentDayKeys, referrerLabel, startOfDayIso } from "@/lib/format";

type ClickRow = {
  id: string;
  clicked_at: string;
  referrer: string | null;
  user_agent: string | null;
};

export default async function LinkAnalyticsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const days = recentDayKeys(14);

  const [{ data: link }, { data: clicks }, { data: chartClicks }] = await Promise.all([
    supabase.from("links").select("id, name, slug, destination_url").eq("id", id).maybeSingle(),
    supabase
      .from("clicks")
      .select("id, clicked_at, referrer, user_agent")
      .eq("link_id", id)
      .order("clicked_at", { ascending: false })
      .limit(30),
    supabase
      .from("clicks")
      .select("clicked_at")
      .eq("link_id", id)
      .gte("clicked_at", startOfDayIso(days[0])),
  ]);

  if (!link) notFound();

  const events = (clicks ?? []) as ClickRow[];
  const counts = new Map(days.map((day) => [day, 0]));
  for (const event of (chartClicks ?? []) as { clicked_at: string }[]) {
    const key = dayKey(new Date(event.clicked_at));
    if (counts.has(key)) counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  const peak = Math.max(1, ...counts.values());

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link href="/app" className="text-sm text-muted hover:text-ink">
          Nazad na linkove
        </Link>
        <h1 className="mt-2 font-serif text-4xl break-words sm:text-5xl">{link.name}</h1>
        <p className="mt-2 font-mono text-sm break-all text-signal">/r/{link.slug}</p>
        <p className="mt-1 break-all text-sm text-muted">{link.destination_url}</p>
        <div className="mt-4">
          <CopyLinkButton path={`/r/${link.slug}`} />
        </div>
      </div>

      <section className="rounded-3xl border border-line bg-card p-4 sm:p-5">
        <h2 className="font-serif text-2xl sm:text-3xl">Zadnjih 14 dana</h2>
        <div className="mt-5 -mx-1 overflow-x-auto px-1 pb-1">
          <div className="flex w-max gap-2">
            {days.map((day) => {
              const count = counts.get(day) ?? 0;
              return (
                <div key={day} className="flex w-12 shrink-0 flex-col items-center gap-2">
                  <div className="flex h-28 w-full items-end rounded-xl bg-paper">
                    <div
                      className="w-full rounded-xl bg-signal"
                      style={{ height: `${Math.max(6, (count / peak) * 100)}%` }}
                    />
                  </div>
                  <p className="text-center text-[10px] text-muted">{dayLabel(day)}</p>
                  <p className="text-xs">{count}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-line bg-card p-5">
        <h2 className="font-serif text-3xl">Zadnja otvaranja</h2>
        {events.length === 0 ? (
          <p className="mt-3 text-sm text-muted">Još niko nije otvorio ovaj link.</p>
        ) : (
          <ul className="mt-4 divide-y divide-line">
            {events.map((event) => (
              <li key={event.id} className="grid gap-1 py-3 text-sm md:grid-cols-3">
                <span>{formatDateTime(event.clicked_at)}</span>
                <span className="text-muted">{deviceLabel(event.user_agent)}</span>
                <span className="truncate text-muted">{referrerLabel(event.referrer)}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
