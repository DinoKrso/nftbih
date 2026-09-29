"use client";

import { useActionState } from "react";
import { signIn, signUp, type FormState } from "@/app/actions";

const initialState: FormState = null;

export function LoginForm({ disabled }: { disabled?: boolean }) {
  const [signInState, signInAction, signInPending] = useActionState(signIn, initialState);
  const [signUpState, signUpAction, signUpPending] = useActionState(signUp, initialState);

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <form action={signInAction} className="flex flex-col gap-3 rounded-3xl border border-line bg-card p-5">
        <div>
          <h2 className="font-serif text-3xl">Prijava</h2>
          <p className="mt-1 text-sm text-muted">Za klijente koji već imaju nalog.</p>
        </div>
        <Field label="Email" name="email" type="email" autoComplete="email" disabled={disabled} />
        <Field
          label="Lozinka"
          name="password"
          type="password"
          autoComplete="current-password"
          disabled={disabled}
        />
        {signInState?.error ? <p className="text-sm text-signal">{signInState.error}</p> : null}
        <button
          type="submit"
          disabled={disabled || signInPending}
          className="mt-2 min-h-11 rounded-full bg-ink px-4 text-sm text-paper disabled:opacity-50"
        >
          {signInPending ? "Prijava…" : "Prijavi se"}
        </button>
      </form>

      <form action={signUpAction} className="flex flex-col gap-3 rounded-3xl border border-line bg-card p-5">
        <div>
          <h2 className="font-serif text-3xl">Novi nalog</h2>
          <p className="mt-1 text-sm text-muted">Svaki klijent vidi samo svoje linkove.</p>
        </div>
        <Field label="Email" name="email" type="email" autoComplete="email" disabled={disabled} />
        <Field
          label="Lozinka"
          name="password"
          type="password"
          autoComplete="new-password"
          minLength={6}
          disabled={disabled}
        />
        {signUpState?.error ? <p className="text-sm text-signal">{signUpState.error}</p> : null}
        {signUpState?.message ? <p className="text-sm text-moss">{signUpState.message}</p> : null}
        <button
          type="submit"
          disabled={disabled || signUpPending}
          className="mt-2 min-h-11 rounded-full bg-signal px-4 text-sm text-white disabled:opacity-50"
        >
          {signUpPending ? "Pravim nalog…" : "Otvori nalog"}
        </button>
      </form>
    </div>
  );
}

function Field({
  label,
  name,
  type,
  autoComplete,
  minLength,
  disabled,
}: {
  label: string;
  name: string;
  type: string;
  autoComplete: string;
  minLength?: number;
  disabled?: boolean;
}) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span>{label}</span>
      <input
        required
        name={name}
        type={type}
        autoComplete={autoComplete}
        minLength={minLength}
        disabled={disabled}
        className="w-full rounded-2xl border border-line bg-paper px-3 py-2 text-base outline-none focus:border-ink"
      />
    </label>
  );
}
