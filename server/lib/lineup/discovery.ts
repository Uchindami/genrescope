import type { SpotifyArtist } from "../../types";
import type { GenreProfile, LineupConfig, ScoredArtist } from "./types";

/**
 * Score a discovery artist based on genre overlap
 */
export function scoreDiscoveryArtist(
  artist: SpotifyArtist,
  genreProfile: GenreProfile,
  knownArtistIds: Set<string>
): ScoredArtist | null {
  // Skip if already known
  if (knownArtistIds.has(artist.id)) {
    return null;
  }

  // Calculate genre overlap
  let genreOverlap = 0;
  for (const genre of artist.genres) {
    const normalized = genre.toLowerCase();

    // Exact match with dominant genres
    if (genreProfile.dominantGenres.includes(normalized)) {
      genreOverlap += 2;
    }

    // Partial match
    for (const dominant of genreProfile.dominantGenres) {
      if (normalized.includes(dominant) || dominant.includes(normalized)) {
        genreOverlap += 0.5;
      }
    }
  }

  // Require minimum genre overlap for discovery
  if (genreOverlap < 1) {
    return null;
  }

  // Prefer rising artists (mid popularity)
  const popularityBonus =
    artist.popularity >= 30 && artist.popularity <= 70 ? 0.2 : 0;

  const compositeScore = Math.min(genreOverlap / 5, 1) + popularityBonus;

  return {
    id: artist.id,
    name: artist.name,
    genres: artist.genres,
    popularity: artist.popularity,
    imageUrl: artist.images[0]?.url || null,
    frequencyScore: 0,
    recencyScore: 0,
    popularityScore: artist.popularity / 100,
    genreRelevance: Math.min(genreOverlap / 5, 1),
    compositeScore,
    tier: "discovery",
  };
}

/**
 * Build discovery tier from related artists
 * If using fallback mode (key = "__fallback__"), use relaxed filtering
 */
export function buildDiscoveryTier(
  relatedArtistsMap: Map<string, SpotifyArtist[]>,
  genreProfile: GenreProfile,
  knownArtistIds: Set<string>,
  config: LineupConfig
): ScoredArtist[] {
  const discoveryMap = new Map<string, ScoredArtist>();

  // Check if we're in fallback mode
  const isFallbackMode = relatedArtistsMap.has("__fallback__");

  for (const [key, related] of relatedArtistsMap.entries()) {
    for (const artist of related) {
      // Skip if already processed
      if (discoveryMap.has(artist.id)) {
        continue;
      }

      // In fallback mode, allow known artists (they're still less familiar from long-term)
      // In normal mode, skip known artists
      if (!isFallbackMode && knownArtistIds.has(artist.id)) {
        continue;
      }

      // For fallback mode, create discovery with lower threshold
      if (isFallbackMode) {
        // Score these as "rediscovered" artists
        const scored: ScoredArtist = {
          id: artist.id,
          name: artist.name,
          genres: artist.genres,
          popularity: artist.popularity,
          imageUrl: artist.images[0]?.url || null,
          frequencyScore: 0.1, // Low frequency since not in short-term
          recencyScore: 0,
          popularityScore: artist.popularity / 100,
          genreRelevance: 0.5, // Assume reasonable relevance
          compositeScore: 0.3 + artist.popularity / 200, // Moderate score
          tier: "discovery",
        };
        discoveryMap.set(artist.id, scored);
      } else {
        // Normal scoring for related artists
        const scored = scoreDiscoveryArtist(
          artist,
          genreProfile,
          knownArtistIds
        );
        if (scored) {
          discoveryMap.set(artist.id, scored);
        }
      }
    }
  }

  // Sort by composite score and take top N
  return [...discoveryMap.values()]
    .sort((a, b) => b.compositeScore - a.compositeScore)
    .slice(0, config.thresholds.discoveryCount);
}
