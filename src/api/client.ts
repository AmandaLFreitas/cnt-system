export async function fetchJson<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const res = await fetch(input, {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `HTTP ${res.status}`);
  }
  return res.json();
}

export function toIsoDateTime(date: string | undefined | null): string | undefined {
  if (!date) return undefined;
  return date.includes('T') ? date : `${date}T00:00:00Z`;
}

