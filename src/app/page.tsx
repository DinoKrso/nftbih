import Link from "next/link";
import { SiteHeader } from "@/components/site-header";

const steps = [
  {
    n: "01",
    title: "Otvori nalog",
    text: "Svaki klijent ulazi svojim emailom i vidi samo svoje linkove.",
  },
  {
    n: "02",
    title: "Zalijepi odredište",
    text: "Google recenzija, Instagram, meni, katalog. Pravi URL ostaje sakriven iza našeg.",
  },
  {
    n: "03",
    title: "Stavi link na karticu",
    text: "Kad neko otvori /r/ link, brojimo posjetu i odmah ga šaljemo dalje.",
  },
];

export default function Home() {
  return (
    <div className="min-h-full">
      <SiteHeader />
      <main className="mx-auto grid w-full max-w-5xl gap-10 px-5 py-12 md:grid-cols-[1.2fr_0.8fr] md:py-16">
        <section>
          <p className="text-xs tracking-[0.22em] text-muted uppercase">NFC · linkovi · analitika</p>
          <h1 className="mt-3 max-w-xl font-serif text-5xl leading-[0.95] md:text-7xl">
            Link koji broji ko ga je otvorio.
          </h1>
          <p className="mt-5 max-w-lg text-lg leading-relaxed text-muted">
            Na karticu ide NFTBIH link. Posjetilac stigne na Google recenziju ili bilo koji URL,
            a ti vidiš koliko je puta link otvoren, kada i s kojeg uređaja.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/login" className="rounded-full bg-signal px-5 py-3 text-sm text-white">
              Otvori nalog
            </Link>
            <Link href="/login" className="rounded-full border border-ink px-5 py-3 text-sm">
              Već imam nalog
            </Link>
          </div>
        </section>

        <aside className="rounded-[2rem] border border-ink bg-ink p-5 text-paper shadow-[8px_8px_0_#e23d12]">
          <p className="text-xs tracking-[0.18em] text-paper/60 uppercase">Primjer kartice</p>
          <p className="mt-6 font-serif text-4xl">Google recenzija</p>
          <p className="mt-4 font-mono text-sm text-[#f3c7b4]">nftbih.ba/r/k7mq2ab</p>
          <p className="mt-2 text-sm text-paper/70">vodi na Google review link</p>
          <div className="mt-8 grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-white/10 p-3">
              <p className="text-xs text-paper/60">Otvaranja</p>
              <p className="font-serif text-4xl">128</p>
            </div>
            <div className="rounded-2xl bg-white/10 p-3">
              <p className="text-xs text-paper/60">Danas</p>
              <p className="font-serif text-4xl">18</p>
            </div>
          </div>
        </aside>
      </main>

      <section className="mx-auto grid w-full max-w-5xl gap-4 px-5 pb-16 md:grid-cols-3">
        {steps.map((step) => (
          <article key={step.n} className="rounded-3xl border border-line bg-card p-5">
            <p className="font-mono text-xs text-signal">{step.n}</p>
            <h2 className="mt-3 font-serif text-3xl">{step.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">{step.text}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
