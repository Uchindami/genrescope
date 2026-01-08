import useSWR from "swr";
import { useAuth } from "@/context/AuthContext";
import type { GenrePercentages } from "@/features/spotifyService";
import { cacheTTL } from "@/lib/swr/config";
import { swrKeys } from "@/lib/swr/keys";
import { apiClient } from "@/lib/api/client";

interface UseSpotifyGenresOptions {
  enabled?: boolean;
}

export function useSpotifyGenres(options: UseSpotifyGenresOptions = {}) {
  const { isAuthenticated } = useAuth();
  const { enabled = isAuthenticated } = options;

  return useSWR<GenrePercentages>(
    enabled ? swrKeys.spotify.genres() : null,
    async () => {
      // Response is direct GenrePercentages object (NOT wrapped)
      return apiClient.request<GenrePercentages>({
        endpoint: "/api/spotify/genres",
      });
    },
    {
      dedupingInterval: 2000,
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      focusThrottleInterval: cacheTTL.genres,
      keepPreviousData: true,
    }
  );
}
