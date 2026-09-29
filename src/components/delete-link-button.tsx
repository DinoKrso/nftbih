"use client";

import { deleteLink } from "@/app/actions";

export function DeleteLinkButton({ id }: { id: string }) {
  return (
    <form action={deleteLink} className="w-full sm:w-auto">
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        onClick={(event) => {
          if (!window.confirm("Obrisati ovaj link? Analitika ide s njim.")) {
            event.preventDefault();
          }
        }}
        className="inline-flex min-h-11 w-full items-center justify-center rounded-full border border-line px-3 text-sm hover:border-signal hover:text-signal sm:w-auto"
      >
        Obriši
      </button>
    </form>
  );
}
