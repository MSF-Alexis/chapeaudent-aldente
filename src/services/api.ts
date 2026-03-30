const baseUrl =
  import.meta.env.VITE_API_URL ?? 'https://chapeaudent-aldente-api-vercel.vercel.app/api'

export async function apiFetch<T>(path: string): Promise<T> {
  const response = await fetch(`${baseUrl}${path}`)
  if (!response.ok) throw new Error(`HTTP ${response.status}`)
  return response.json() as Promise<T>
}
