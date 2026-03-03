/**
 * Validates that a URL is safe (http/https only).
 * Returns the URL if valid, empty string otherwise.
 */
export function sanitizeUrl(url: string | undefined | null): string {
  if (!url || typeof url !== "string") return "";
  const trimmed = url.trim();
  if (!trimmed) return "";
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol === "http:" || parsed.protocol === "https:") {
      return trimmed;
    }
    return "";
  } catch {
    return "";
  }
}
