import useSWR from "swr";
import { useAuth } from "@/context/AuthContext";
import type { UserProfile } from "@/features/spotifyService";
import { cacheTTL } from "@/lib/swr/config";
import { swrKeys } from "@/lib/swr/keys";
import { apiClient } from "@/lib/api/client";

interface UseSpotifyProfileOptions {
  /**
   * Enable/disable the query
   * @default true if authenticated
   */
  enabled?: boolean;

  /**
   * Refresh interval in milliseconds
   * @default 0 (disabled)
   */
  refreshInterval?: number;
}

export function useSpotifyProfile(options: UseSpotifyProfileOptions = {}) {
  const { isAuthenticated } = useAuth();
  const { enabled = isAuthenticated, refreshInterval = 0 } = options;

  return useSWR<UserProfile>(
    // Key: Only fetch if authenticated and enabled
    enabled ? swrKeys.spotify.profile() : null,

    // Fetcher: Use apiClient directly - response is UserProfile object (NOT wrapped)
    async () => {
      return apiClient.request<UserProfile>({
        endpoint: "/api/spotify/me",
      });
    },

    // Options
    {
      dedupingInterval: 2000,
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      refreshInterval,

      // Cache strategy
      revalidateIfStale: true,
      keepPreviousData: true,

      // Consider data fresh for 5 minutes
      // SWR will still serve this data but revalidate in background
      focusThrottleInterval: cacheTTL.profile,

      // Retry on error
      shouldRetryOnError: true,
      errorRetryCount: 3,
      errorRetryInterval: 5000,

      // Error handling
      onError: (error) => {
        console.error("[useSpotifyProfile] Error:", error);
      },

      // Success handling
      onSuccess: (data) => {
        if (import.meta.env.DEV) {
          console.log("[useSpotifyProfile] Fetched:", data.displayName);
        }
      },
    }
  );
}
