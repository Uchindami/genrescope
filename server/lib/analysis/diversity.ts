import type {
  DiversityMetrics,
  GenreAnalysis,
  SpotifyArtistWithGenres,
  SpotifyTrackSimple,
} from "./types";

// ============================================
// Diversity Metrics Functions
// ============================================

/**
 * Calculate diversity and listening behavior metrics.
 *
 * @param topArtists - User's top artists
 * @param topTracks - User's top tracks
 * @param genreAnalysis - Already-computed genre analysis
 */
export function calculateDiversityMetrics(
  topArtists: SpotifyArtistWithGenres[],
  topTracks: SpotifyTrackSimple[],
  genreAnalysis: GenreAnalysis
): DiversityMetrics {
  // Artist diversity: How many unique artists appear in top tracks
  const uniqueArtists = new Set(
    topTracks.flatMap((t) => t.artists.map((a) => a.id))
  );

  // Normalize to 0-100 (50 unique artists in 50 tracks = 100)
  const artistDiversityScore = Math.min(
    100,
    (uniqueArtists.size / topTracks.length) * 100
  );

  // Top artist dependency: What % of tracks come from top 10 artists
  const top10ArtistIds = new Set(topArtists.slice(0, 10).map((a) => a.id));
  const tracksFromTop10 = topTracks.filter((t) =>
    t.artists.some((a) => top10ArtistIds.has(a.id))
  ).length;

  const topArtistDependency = (tracksFromTop10 / topTracks.length) * 100;

  // Discovery score: Inverse of top artist dependency
  const discoveryScore = 100 - topArtistDependency;

  // Loyalty index: Same as top artist dependency
  const loyaltyIndex = topArtistDependency;

  return {
    artistDiversityScore: Math.round(artistDiversityScore),
    genreDiversityScore: Math.round(genreAnalysis.diversity),
    discoveryScore: Math.round(discoveryScore),
    loyaltyIndex: Math.round(loyaltyIndex),
    topArtistDependency: Math.round(topArtistDependency),
  };
}
