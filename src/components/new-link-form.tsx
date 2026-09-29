"use client";

import { useActionState } from "react";
import { createLink, type FormState } from "@/app/actions";

export function NewLinkForm() {
  const [state, action, pending] = useActionState(createLink, null as FormState);

  return (
    <form action={action} className="rounded-3xl border border-line bg-card p-5">
      <h2 className="font-serif text-3xl">Novi link</h2>
      <p className="mt-1 text-sm text-muted">
        Odredište je pravi URL, npr. Google recenzija. Na karticu ide naš /r/ link.
      </p>
      <div className="mt-4 grid gap-3 md:grid-cols-[1fr_1.4fr_auto] md:items-end">
        <label className="flex flex-col gap-1 text-sm">
          <span>Naziv</span>
          <input
            required
            name="name"
            maxLength={80}
            placeholder="Google recenzija"
            className="w-full rounded-2xl border border-line bg-paper px-3 py-2 text-base outline-none focus:border-ink"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span>Odredište</span>
          <input
            required
            name="destination"
            type="url"
            placeholder="https://g.page/r/..."
            className="w-full rounded-2xl border border-line bg-paper px-3 py-2 text-base outline-none focus:border-ink"
          />
        </label>
        <button
          type="submit"
          disabled={pending}
          className="min-h-11 rounded-full bg-ink px-4 text-sm text-paper disabled:opacity-50"
        >
          {pending ? "Spremam…" : "Napravi link"}
        </button>
      </div>
      {state?.error ? <p className="mt-3 text-sm text-signal">{state.error}</p> : null}
      {state?.message ? <p className="mt-3 text-sm text-moss">{state.message}</p> : null}
    </form>
  );
}
