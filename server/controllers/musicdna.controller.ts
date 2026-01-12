import type { Context } from "hono";
import {
  analyzeGenres,
  calculateDiversityMetrics,
  type MusicDNAResult,
  type SpotifyArtistWithGenres,
  type SpotifyTrackSimple,
} from "../lib/analysis";

const SPOTIFY_API_BASE = "https://api.spotify.com/v1";

// ============================================
// Helper Functions
// ============================================

/**
 * Extract access token from request (expects it in Authorization header or cookies)
 * This is a simplified version - in production, use proper auth middleware
 */
async function getAccessToken(c: Context): Promise<string | null> {
  // Check Authorization header first
  const authHeader = c.req.header("Authorization");
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.slice(7);
  }

  // Fall back to cookie-based token (handled by spotify.controller)
  const cookie = c.req.header("Cookie");
  if (cookie) {
    const match = cookie.match(/spotify_tokens=([^;]+)/);
    if (match) {
      try {
        const tokens = JSON.parse(decodeURIComponent(match[1]));
        return tokens.accessToken || null;
      } catch {
        return null;
      }
    }
  }

  return null;
}

/**
 * Fetch data from Spotify API
 */
async function spotifyFetch<T>(
  accessToken: string,
  endpoint: string
): Promise<T> {
  const response = await fetch(`${SPOTIFY_API_BASE}${endpoint}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!response.ok) {
    throw new Error(`Spotify API error: ${response.status}`);
  }

  return response.json();
}

/**
 * Fetch top artists for a specific time range
 */
async function fetchTopArtists(
  accessToken: string,
  timeRange: "long_term" | "medium_term" | "short_term",
  limit: number
): Promise<SpotifyArtistWithGenres[]> {
  const data = await spotifyFetch<{ items: SpotifyArtistWithGenres[] }>(
    accessToken,
    `/me/top/artists?time_range=${timeRange}&limit=${limit}`
  );
  return data.items;
}

/**
 * Fetch top tracks
 */
async function fetchTopTracks(
  accessToken: string,
  timeRange: "long_term" | "medium_term" | "short_term",
  limit: number
): Promise<SpotifyTrackSimple[]> {
  const data = await spotifyFetch<{
    items: Array<{
      id: string;
      name: string;
      artists: Array<{ id: string; name: string }>;
    }>;
  }>(accessToken, `/me/top/tracks?time_range=${timeRange}&limit=${limit}`);

  return data.items.map((track) => ({
    id: track.id,
    name: track.name,
    artists: track.artists,
  }));
}

// ============================================
// Controller Handler
// ============================================

/**
 * GET /api/music-dna
 *
 * Unified endpoint that returns complete Music DNA analysis:
 * - Genre analysis with weighted hierarchy
 * - Diversity metrics
 * - AI personality description (placeholder - integrated later)
 */
export const getMusicDNAHandler = async (c: Context) => {
  const accessToken = await getAccessToken(c);

  if (!accessToken) {
    return c.json({ error: "Not authenticated" }, 401);
  }

  try {
    // Fetch all data in parallel
    const [longTermArtists, shortTermArtists, topTracks] = await Promise.all([
      fetchTopArtists(accessToken, "long_term", 50),
      fetchTopArtists(accessToken, "short_term", 20),
      fetchTopTracks(accessToken, "long_term", 50),
    ]);

    // Run analysis
    const genreAnalysis = analyzeGenres(
      longTermArtists,
      shortTermArtists,
      topTracks
    );

    const diversityMetrics = calculateDiversityMetrics(
      longTermArtists,
      topTracks,
      genreAnalysis
    );

    // Build result (description will be added separately to avoid blocking)
    const result: MusicDNAResult = {
      genreAnalysis,
      diversityMetrics,
      description: "", // Filled by separate call to /api/generate-description
    };

    console.log("[MusicDNA] Analysis complete:", {
      genres: genreAnalysis.primary.length,
      diversity: genreAnalysis.diversity.toFixed(1),
      trend: genreAnalysis.temporal.recentTrend,
    });

    return c.json(result);
  } catch (error) {
    console.error("[MusicDNA] Analysis error:", error);

    if (error instanceof Error) {
      if (error.message.includes("401")) {
        return c.json({ error: "Session expired" }, 401);
      }
      return c.json({ error: error.message }, 500);
    }

    return c.json({ error: "Failed to analyze music data" }, 500);
  }
};
