/**
 * Internal reusable type guards for API response shapes.
 * These are intentionally generic and can be shared across services if needed.
 */

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface MessageOnlyResponse {
  message: string;
}

export function isApiResponse<T>(data: unknown): data is ApiResponse<T> {
  if (!data || typeof data !== "object") return false;
  const obj = data as Record<string, unknown>;
  return "success" in obj;
}

export function isMessageOnly(data: unknown): data is MessageOnlyResponse {
  if (!data || typeof data !== "object") return false;
  const obj = data as Record<string, unknown>;
  return "message" in obj && typeof obj.message === "string";
}
