"use client";

import { deleteLink } from "@/app/actions";

export function DeleteLinkButton({ id }: { id: string }) {
  return (
    <form action={deleteLink}>
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        onClick={(event) => {
          if (!window.confirm("Obrisati ovaj link? Analitika ide s njim.")) {
            event.preventDefault();
          }
        }}
        className="rounded-full border border-line px-3 py-1.5 text-sm hover:border-signal hover:text-signal"
      >
        Obriši
      </button>
    </form>
  );
}
