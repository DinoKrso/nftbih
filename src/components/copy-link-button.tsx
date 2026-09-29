"use client";

import { useState } from "react";

export function CopyLinkButton({ path }: { path: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      type="button"
      onClick={async () => {
        const url = `${window.location.origin}${path}`;
        await navigator.clipboard.writeText(url);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1600);
      }}
      className="inline-flex min-h-11 w-full items-center justify-center rounded-full bg-ink px-3 text-sm text-paper sm:w-auto"
    >
      {copied ? "Kopirano" : "Kopiraj link"}
    </button>
  );
}
