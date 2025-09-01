export function ensureSessionId(): string {
  if (typeof window === 'undefined') return '';
  const name = 'sessionId=';
  const parts = document.cookie.split(';').map((p) => p.trim());
  const existing = parts.find((p) => p.startsWith(name));
  if (existing) return existing.slice(name.length);
  const id = crypto.randomUUID();
  document.cookie = `${name}${id}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
  return id;
}
