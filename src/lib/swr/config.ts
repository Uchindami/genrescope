import type { SWRConfiguration } from "swr";

export const swrConfig: SWRConfiguration = {
  // Revalidation
  revalidateOnFocus: true, // Refetch when user returns to tab
  revalidateOnReconnect: true, // Refetch when network reconnects
  revalidateOnMount: true, // Refetch on component mount
  revalidateIfStale: true, // Only revalidate if data is stale

  // Deduplication
  dedupingInterval: 2000, // Dedupe requests within 2 seconds

  // Performance
  suspense: false, // Don't use Suspense (we'll use isLoading)
  keepPreviousData: true, // Keep old data while revalidating

  // Error handling & Retry
  shouldRetryOnError: true,
  errorRetryCount: 3,
  errorRetryInterval: 5000, // 5 seconds between retries

  // Loading behavior
  loadingTimeout: 3000, // Trigger slow connection warning

  // Polling (disabled by default, enabled per-hook)
  refreshInterval: 0,

  // Optimistic updates
  optimisticData: undefined,

  // Comparison
  compare: (a, b) => {
    // Deep equality check for complex objects
    return JSON.stringify(a) === JSON.stringify(b);
  },

  // Middleware for auth & logging
  use: [], // We'll add middleware here
};

// Development-specific overrides
if (import.meta.env.DEV) {
  swrConfig.onSuccess = (data, key) => {
    console.log("[SWR] Success:", { key, data });
  };

  swrConfig.onError = (error, key) => {
    console.error("[SWR] Error:", { key, error });
  };

  swrConfig.onErrorRetry = (error, key, config, revalidate, opts) => {
    console.warn("[SWR] Retry:", { key, attempt: opts.retryCount, error });
  };
}

// Environment-specific cache TTLs
export const cacheTTL = {
  session: 60 * 1000, // 1 minute
  profile: 5 * 60 * 1000, // 5 minutes
  topTracks: 10 * 60 * 1000, // 10 minutes
  topArtists: 10 * 60 * 1000, // 10 minutes
  genres: 10 * 60 * 1000, // 10 minutes
  description: 30 * 60 * 1000, // 30 minutes (expensive GPT call)
} as const;
