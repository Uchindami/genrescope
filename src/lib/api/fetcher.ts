import { apiClient } from "./client";

/**
 * Create SWR fetcher with retry logic
 */
export function createFetcher() {
  return async <T>(url: string): Promise<T> => {
    return apiClient.request<T>({
      endpoint: url,
    });
  };
}

/**
 * Fetcher for POST requests (for useSWRMutation)
 */
export function createMutationFetcher<TData = unknown, TBody = unknown>() {
  return async (url: string, options: { arg: TBody }): Promise<TData> => {
    return apiClient.request<TData>({
      endpoint: url,
      method: "POST",
      body: options.arg,
    });
  };
}
