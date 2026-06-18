export async function fetchJsonArray<T>(url: string): Promise<T[]> {
  const res = await fetch(url);
  if (!res.ok) return [];

  const data = await res.json();
  return Array.isArray(data) ? data : [];
}
