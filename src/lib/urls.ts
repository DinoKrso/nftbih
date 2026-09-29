export function normalizeDestination(raw: string) {
  const value = raw.trim();
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return null;
  }

  if (url.protocol !== "http:" && url.protocol !== "https:") return null;

  url.username = "";
  url.password = "";
  return url.toString();
}

export function isHttpUrl(value: string) {
  return normalizeDestination(value) !== null;
}
