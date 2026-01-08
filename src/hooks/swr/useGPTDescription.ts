import useSWR from "swr";
import { cacheTTL } from "@/lib/swr/config";
import { hashSongs, swrKeys } from "@/lib/swr/keys";
import { apiClient } from "@/lib/api/client";

interface UseGPTDescriptionOptions {
  /**
   * Enable the query (usually dependent on topTracks being loaded)
   */
  enabled?: boolean;

  /**
   * Formatted songs string
   */
  songs: string;
}

export function useGPTDescription(options: UseGPTDescriptionOptions) {
  const { enabled = false, songs } = options;

  // Generate stable hash for caching
  const songsHash = songs ? hashSongs(songs) : "";
  
  console.log('[useGPTDescription] Hook called:', { enabled, songsLength: songs?.length, songsHash });

  return useSWR<string>(
    // Only fetch if enabled and we have songs
    enabled && songs ? swrKeys.gpt.description(songsHash) : null,
    async () => {
      const encoded = encodeURIComponent(songs);
      console.log('[useGPTDescription] Fetcher executing for:', encoded.slice(0, 50));
      
      try {
        // Response is { description: string }, extract the description
        const response = await apiClient.request<{ description: string }>({
          endpoint: `/api/generate-description?songs=${encoded}`,
        });
        console.log('[useGPTDescription] Got description:', response.description.slice(0, 50));
        return response.description; // Extract description string
      } catch (error) {
        console.error('[useGPTDescription] Fetcher error:', error);
        throw error;
      }
    },
    {
      dedupingInterval: 5000, // Longer dedup for expensive calls
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateOnMount: true, // ✅ MUST be true to fetch on mount!

      // Aggressive caching (30 min) - GPT calls are expensive
      focusThrottleInterval: cacheTTL.description,

      // Longer timeout for GPT
      errorRetryInterval: 10_000,
      errorRetryCount: 2,

      // Keep old description while generating new one
      keepPreviousData: true,

      onSuccess: (data) => {
        if (import.meta.env.DEV) {
          console.log(
            "[useGPTDescription] Generated:",
            data.slice(0, 50) + "..."
          );
        }
      },
      
      onError: (error) => {
        console.error('[useGPTDescription] SWR Error:', error);
      },
    }
  );
}
