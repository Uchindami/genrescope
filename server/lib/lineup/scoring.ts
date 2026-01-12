import type { SpotifyArtist } from "../../types";
import type {
  GenreProfile,
  LineupConfig,
  ScoredArtist,
  SpotifyDataCollection,
} from "./types";

/**
 * Build a genre profile from all top artists
 */
export function buildGenreProfile(topArtists: SpotifyArtist[]): GenreProfile {
  const genres = new Map<string, number>();

  for (const artist of topArtists) {
    for (const genre of artist.genres) {
      const normalized = genre.toLowerCase();
      genres.set(normalized, (genres.get(normalized) || 0) + 1);
    }
  }

  // Sort by count and take top 5
  const sorted = [...genres.entries()].sort((a, b) => b[1] - a[1]);
  const dominantGenres = sorted.slice(0, 5).map(([genre]) => genre);

  return {
    genres,
    dominantGenres,
    totalCount: sorted.reduce((sum, [, count]) => sum + count, 0),
  };
}

/**
 * Calculate frequency score based on position in top artists
 * Artists appearing in multiple time ranges get boosted
 */
export function calculateFrequencyScore(
  artistId: string,
  data: SpotifyDataCollection
): number {
  let score = 0;
  let appearances = 0;

  // Short term (most recent) - highest weight
  const shortIdx = data.topArtists.shortTerm.findIndex(
    (a) => a.id === artistId
  );
  if (shortIdx !== -1) {
    score += (1 - shortIdx / data.topArtists.shortTerm.length) * 0.5;
    appearances++;
  }

  // Medium term
  const medIdx = data.topArtists.mediumTerm.findIndex((a) => a.id === artistId);
  if (medIdx !== -1) {
    score += (1 - medIdx / data.topArtists.mediumTerm.length) * 0.3;
    appearances++;
  }

  // Long term (all time)
  const longIdx = data.topArtists.longTerm.findIndex((a) => a.id === artistId);
  if (longIdx !== -1) {
    score += (1 - longIdx / data.topArtists.longTerm.length) * 0.2;
    appearances++;
  }

  // Bonus for appearing in multiple time ranges
  if (appearances > 1) {
    score *= 1 + appearances * 0.1;
  }

  return Math.min(score, 1);
}

/**
 * Calculate recency score from recently played tracks
 */
export function calculateRecencyScore(
  artistId: string,
  data: SpotifyDataCollection
): number {
  if (!data.recentlyPlayed.artistIds.has(artistId)) {
    return 0;
  }

  const playCount = data.recentlyPlayed.artistPlayCounts.get(artistId) || 0;
  // Normalize: cap at 10 plays for max score
  return Math.min(playCount / 10, 1);
}

/**
 * Calculate genre relevance based on overlap with user's dominant genres
 */
export function calculateGenreRelevance(
  artist: SpotifyArtist,
  genreProfile: GenreProfile
): number {
  if (artist.genres.length === 0) {
    return 0.3; // Default score for artists without genre data
  }

  let relevance = 0;

  for (const genre of artist.genres) {
    const normalized = genre.toLowerCase();

    // Direct match with dominant genres
    if (genreProfile.dominantGenres.includes(normalized)) {
      relevance += 0.3;
    }

    // Partial match (genre contains dominant genre keyword)
    for (const dominant of genreProfile.dominantGenres) {
      if (normalized.includes(dominant) || dominant.includes(normalized)) {
        relevance += 0.1;
      }
    }
  }

  return Math.min(relevance, 1);
}

/**
 * Calculate composite score for an artist
 */
export function calculateCompositeScore(
  frequencyScore: number,
  recencyScore: number,
  popularityScore: number,
  genreRelevance: number,
  config: LineupConfig
): number {
  return (
    frequencyScore * config.weights.frequency +
    recencyScore * config.weights.recency +
    popularityScore * config.weights.popularity +
    genreRelevance * config.weights.genreRelevance
  );
}

/**
 * Score a single artist
 */
export function scoreArtist(
  artist: SpotifyArtist,
  data: SpotifyDataCollection,
  genreProfile: GenreProfile,
  config: LineupConfig
): ScoredArtist {
  const frequencyScore = calculateFrequencyScore(artist.id, data);
  const recencyScore = calculateRecencyScore(artist.id, data);
  const popularityScore = artist.popularity / 100;
  const genreRelevance = calculateGenreRelevance(artist, genreProfile);

  const compositeScore = calculateCompositeScore(
    frequencyScore,
    recencyScore,
    popularityScore,
    genreRelevance,
    config
  );

  return {
    id: artist.id,
    name: artist.name,
    genres: artist.genres,
    popularity: artist.popularity,
    imageUrl: artist.images[0]?.url || null,
    frequencyScore,
    recencyScore,
    popularityScore,
    genreRelevance,
    compositeScore,
    tier: "supporting", // Will be assigned in tiers.ts
  };
}

/**
 * Score all unique artists from the data collection
 */
export function scoreAllArtists(
  data: SpotifyDataCollection,
  genreProfile: GenreProfile,
  config: LineupConfig
): ScoredArtist[] {
  // Collect all unique artists
  const artistMap = new Map<string, SpotifyArtist>();

  for (const artist of data.topArtists.shortTerm) {
    artistMap.set(artist.id, artist);
  }
  for (const artist of data.topArtists.mediumTerm) {
    if (!artistMap.has(artist.id)) {
      artistMap.set(artist.id, artist);
    }
  }
  for (const artist of data.topArtists.longTerm) {
    if (!artistMap.has(artist.id)) {
      artistMap.set(artist.id, artist);
    }
  }

  // Score each artist
  const scored = [...artistMap.values()].map((artist) =>
    scoreArtist(artist, data, genreProfile, config)
  );

  // Sort by composite score descending
  return scored.sort((a, b) => b.compositeScore - a.compositeScore);
}
