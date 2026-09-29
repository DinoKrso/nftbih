"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";
import { normalizeDestination } from "@/lib/urls";

export type FormState = {
  error?: string;
  message?: string;
} | null;

const SLUG_ALPHABET = "abcdefghijkmnopqrstuvwxyz23456789";

function authError(message: string) {
  const lower = message.toLowerCase();
  if (lower.includes("invalid login")) return "Pogrešan email ili lozinka.";
  if (lower.includes("already registered") || lower.includes("already been registered")) {
    return "Nalog s tim emailom već postoji. Prijavi se.";
  }
  if (lower.includes("password")) return "Lozinka mora imati najmanje 6 znakova.";
  if (lower.includes("email")) return "Unesi ispravan email.";
  if (lower.includes("rate limit")) return "Previše pokušaja. Sačekaj malo pa probaj opet.";
  return "Nešto nije prošlo. Probaj ponovo.";
}

function makeSlug() {
  const bytes = crypto.getRandomValues(new Uint8Array(7));
  return Array.from(bytes, (byte) => SLUG_ALPHABET[byte % SLUG_ALPHABET.length]).join("");
}

async function requireUser() {
  if (!isSupabaseConfigured()) redirect("/login");
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const userId = data?.claims?.sub;
  if (!userId) redirect("/login");
  return { supabase, userId };
}

export async function signIn(_prev: FormState, formData: FormData): Promise<FormState> {
  if (!isSupabaseConfigured()) {
    return { error: "Supabase još nije spojen." };
  }

  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) return { error: authError(error.message) };
  redirect("/app");
}

export async function signUp(_prev: FormState, formData: FormData): Promise<FormState> {
  if (!isSupabaseConfigured()) {
    return { error: "Supabase još nije spojen." };
  }

  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) return { error: authError(error.message) };
  if (!data.session) {
    return {
      message: "Nalog je napravljen. Ako je stigao email za potvrdu, otvori ga pa se prijavi.",
    };
  }

  redirect("/app");
}

export async function signOut() {
  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }
  redirect("/");
}

export async function createLink(_prev: FormState, formData: FormData): Promise<FormState> {
  const name = String(formData.get("name") ?? "").trim();
  const destination = normalizeDestination(String(formData.get("destination") ?? ""));

  if (name.length < 1 || name.length > 80) {
    return { error: "Naziv treba imati između 1 i 80 znakova." };
  }
  if (!destination) {
    return { error: "Odredište mora biti http ili https link." };
  }

  const { supabase, userId } = await requireUser();

  for (let attempt = 0; attempt < 4; attempt += 1) {
    const { error } = await supabase.from("links").insert({
      user_id: userId,
      name,
      slug: makeSlug(),
      destination_url: destination,
    });

    if (!error) {
      revalidatePath("/app");
      return { message: "Link je spreman. Kopiraj ga na karticu." };
    }

    if (error.code !== "23505") {
      return { error: "Link nije sačuvan. Provjeri da li je baza spojena." };
    }
  }

  return { error: "Nisam uspio napraviti jedinstveni kod. Probaj ponovo." };
}

export async function deleteLink(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const { supabase } = await requireUser();
  await supabase.from("links").delete().eq("id", id);
  revalidatePath("/app");
  redirect("/app");
}
