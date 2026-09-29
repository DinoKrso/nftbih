import { SiteHeader } from "@/components/site-header";
import { LoginForm } from "@/components/login-form";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export default function LoginPage() {
  const configured = isSupabaseConfigured();

  return (
    <div className="min-h-full">
      <SiteHeader />
      <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-5 sm:py-10">
        <h1 className="font-serif text-4xl sm:text-5xl">Ulaz za klijente</h1>
        <p className="mt-2 max-w-xl text-muted">
          Nakon prijave praviš shareable link. Ko ga otvori, ide na tvoje odredište, a otvaranje ostaje u analitici.
        </p>
        {configured ? null : (
          <p className="mt-6 rounded-2xl border border-signal/40 bg-card px-4 py-3 text-sm">
            Baza još nije spojena. Besplatni Supabase plan već ima dva aktivna projekta, pa novi
            projekat za NFTBIH nije mogao da se otvori. Čim se oslobodi slot, login i linkovi rade
            ovdje.
          </p>
        )}
        <div className="mt-8">
          <LoginForm disabled={!configured} />
        </div>
      </main>
    </div>
  );
}
