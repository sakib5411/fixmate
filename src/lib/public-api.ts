import { API_URL } from "./config";

export interface PublicPayload<T, M = unknown> {
  success: boolean;
  data: T;
  meta?: M;
}

/** Server-side (RSC) fetch of a public endpoint — no auth, always fresh. */
export async function publicFetch<T, M = unknown>(
  path: string
): Promise<PublicPayload<T, M> | null> {
  try {
    const response = await fetch(`${API_URL}${path}`, { cache: "no-store" });
    if (!response.ok) return null;
    return (await response.json()) as PublicPayload<T, M>;
  } catch {
    return null;
  }
}
