/**
 * SWR Cache Key Factory
 *
 * Hierarchical structure enables:
 * - Easy invalidation (mutate by prefix)
 * - Type safety
 * - Self-documenting API
 * - Consistent naming
 */

export const swrKeys = {
  // ==================== Auth ====================
  auth: {
    all: () => ["auth"] as const,
    session: () => [...swrKeys.auth.all(), "session"] as const,
  },

  // ==================== Spotify ====================
  spotify: {
    all: () => ["spotify"] as const,

    profile: () => [...swrKeys.spotify.all(), "profile"] as const,

    topTracks: (
      timeRange: "short_term" | "medium_term" | "long_term",
      limit: number
    ) => [...swrKeys.spotify.all(), "topTracks", timeRange, limit] as const,

    topArtists: (
      timeRange: "short_term" | "medium_term" | "long_term",
      limit: number
    ) => [...swrKeys.spotify.all(), "topArtists", timeRange, limit] as const,

    genres: () => [...swrKeys.spotify.all(), "genres"] as const,
  },

  // ==================== GPT ====================
  gpt: {
    all: () => ["gpt"] as const,

    description: (songsHash: string) =>
      [...swrKeys.gpt.all(), "description", songsHash] as const,
  },
} as const;

/**
 * Helper to convert key array to cache key string
 * SWR uses JSON.stringify internally, but this is useful for logging
 */
export function keyToString(key: readonly unknown[]): string {
  return key.join(" > ");
}

/**
 * Helper to generate stable hash for songs list
 * Used for GPT description caching
 */
export function hashSongs(songs: string): string {
  // Simple hash function for caching GPT calls
  let hash = 0;
  for (let i = 0; i < songs.length; i++) {
    const char = songs.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash.toString(36);
}

// Example usage:
// swrKeys.spotify.topTracks('long_term', 30)
// => ['spotify', 'topTracks', 'long_term', 30]
