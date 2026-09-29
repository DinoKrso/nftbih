const SARAJEVO = "Europe/Sarajevo";

export function formatDateTime(iso: string) {
  return new Intl.DateTimeFormat("bs-BA", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: SARAJEVO,
  }).format(new Date(iso));
}

export function dayKey(date: Date) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: SARAJEVO,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

export function startOfDayIso(key: string) {
  const utcMidnight = new Date(`${key}T00:00:00Z`);
  const hour = Number(
    new Intl.DateTimeFormat("en-GB", {
      timeZone: SARAJEVO,
      hour: "2-digit",
      hourCycle: "h23",
    }).format(utcMidnight),
  );
  return new Date(utcMidnight.getTime() - hour * 60 * 60 * 1000).toISOString();
}

export function recentDayKeys(count: number) {
  const [year, month, day] = dayKey(new Date()).split("-").map(Number);
  return Array.from({ length: count }, (_, index) => {
    const date = new Date(Date.UTC(year, month - 1, day - (count - 1 - index), 12));
    return dayKey(date);
  });
}

export function dayLabel(key: string) {
  const [year, month, day] = key.split("-").map(Number);
  return new Intl.DateTimeFormat("bs-BA", {
    day: "numeric",
    month: "short",
    timeZone: SARAJEVO,
  }).format(new Date(Date.UTC(year, month - 1, day, 12)));
}

export function deviceLabel(userAgent: string | null) {
  if (!userAgent) return "Nepoznato";
  if (/iPhone|iPad/.test(userAgent)) return "iPhone / iPad";
  if (/Android/.test(userAgent)) return "Android";
  if (/Mac OS/.test(userAgent)) return "Mac";
  if (/Windows/.test(userAgent)) return "Windows";
  return "Ostalo";
}

export function referrerLabel(referrer: string | null) {
  if (!referrer) return "Direktan otvor";
  try {
    return new URL(referrer).hostname.replace(/^www\./, "");
  } catch {
    return referrer;
  }
}
