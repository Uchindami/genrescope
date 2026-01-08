import useSWR from "swr";
import { useAuth } from "@/context/AuthContext";
import type { TopTrack } from "@/features/spotifyService";
import { cacheTTL } from "@/lib/swr/config";
import { swrKeys } from "@/lib/swr/keys";
import { apiClient } from "@/lib/api/client";

type TimeRange = "short_term" | "medium_term" | "long_term";

interface UseSpotifyTopTracksOptions {
  enabled?: boolean;
  timeRange?: TimeRange;
  limit?: number;
}

export function useSpotifyTopTracks(options: UseSpotifyTopTracksOptions = {}) {
  const { isAuthenticated } = useAuth();
  const {
    enabled = isAuthenticated,
    timeRange = "long_term",
    limit = 30,
  } = options;

  return useSWR<TopTrack[]>(
    enabled ? swrKeys.spotify.topTracks(timeRange, limit) : null,
    async () => {
      // Fetch and transform response
      const response = await apiClient.request<{ tracks: TopTrack[] }>({
        endpoint: `/api/spotify/top-tracks?time_range=${timeRange}&limit=${limit}`,
      });
      return response.tracks; // Extract tracks array
    },
    {
      dedupingInterval: 2000,
      revalidateOnFocus: false, // Don't refetch tracks on focus (expensive)
      revalidateOnReconnect: true,
      focusThrottleInterval: cacheTTL.topTracks,
      keepPreviousData: true,

      // Transform response
      onSuccess: (data) => {
        if (import.meta.env.DEV) {
          console.log(`[useSpotifyTopTracks] Fetched ${data.length} tracks`);
        }
      },
    }
  );
}
