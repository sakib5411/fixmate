import { authClient } from "./auth-client";
import { API_URL } from "./config";

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

interface ApiPayload<T, M = unknown> {
  success: boolean;
  data: T;
  meta?: M;
  message?: string;
}

/** Asks BetterAuth for a short JWT; null when the visitor is signed out. */
export async function getToken(): Promise<string | null> {
  try {
    const result = await authClient.token();
    return result?.data?.token ?? null;
  } catch {
    return null;
  }
}

async function request<T, M>(
  path: string,
  init: RequestInit = {},
  withAuth = true
): Promise<ApiPayload<T, M>> {
  const headers = new Headers(init.headers);

  if (withAuth) {
    const token = await getToken();
    if (token) headers.set("Authorization", `Bearer ${token}`);
  }

  const isFormData = init.body instanceof FormData;
  if (init.body && !isFormData) {
    headers.set("Content-Type", "application/json");
  }

  let response: Response;

  try {
    response = await fetch(`${API_URL}${path}`, {
      ...init,
      headers,
      credentials: "include",
    });
  } catch {
    throw new ApiError(
      "Could not reach the FixMate server. Please make sure the API is running.",
      0
    );
  }

  const payload = (await response.json().catch(() => null)) as ApiPayload<T, M> | null;

  if (!response.ok || !payload || payload.success === false) {
    throw new ApiError(
      payload?.message ?? `Request failed with status ${response.status}`,
      response.status
    );
  }

  return payload;
}

export async function apiGet<T, M = unknown>(path: string): Promise<ApiPayload<T, M>> {
  return request<T, M>(path);
}

export async function apiSend<T, M = unknown>(
  path: string,
  body: unknown,
  method: "POST" | "PATCH" | "PUT" | "DELETE" = "POST"
): Promise<ApiPayload<T, M>> {
  return request<T, M>(path, {
    method,
    body: body instanceof FormData ? body : JSON.stringify(body),
  });
}

export async function apiDelete<T>(path: string): Promise<ApiPayload<T>> {
  return request<T, unknown>(path, { method: "DELETE" });
}

/** Uploads an image to ImgBB through the API and returns the hosted URL. */
export async function uploadImage(file: File): Promise<string> {
  const form = new FormData();
  form.append("image", file);
  const payload = await request<{ url: string }, unknown>("/api/uploads", {
    method: "POST",
    body: form,
  });
  return payload.data.url;
}
