import type { LineupConfig, ScoredArtist } from "./types";

/**
 * Classify scored artists into tiers
 */
export function classifyIntoTiers(
  scoredArtists: ScoredArtist[],
  config: LineupConfig
): {
  headliners: ScoredArtist[];
  supporting: ScoredArtist[];
  remaining: ScoredArtist[];
} {
  const headliners: ScoredArtist[] = [];
  const supporting: ScoredArtist[] = [];
  const remaining: ScoredArtist[] = [];

  for (const artist of scoredArtists) {
    // Headliner criteria: top positions AND high popularity
    if (
      headliners.length < config.thresholds.headlinerCount &&
      artist.popularity >= config.thresholds.headlinerMinPopularity
    ) {
      artist.tier = "headliner";
      headliners.push(artist);
    }
    // Supporting tier: next set of artists
    else if (supporting.length < config.thresholds.supportingCount) {
      artist.tier = "supporting";
      supporting.push(artist);
    }
    // Remaining for potential discovery or backup
    else {
      remaining.push(artist);
    }
  }

  // If we don't have enough headliners, promote from supporting
  while (
    headliners.length < config.thresholds.headlinerCount &&
    supporting.length > 0
  ) {
    const promoted = supporting.shift()!;
    promoted.tier = "headliner";
    headliners.push(promoted);
  }

  return { headliners, supporting, remaining };
}

/**
 * Check if an artist is already in the known list
 */
export function isKnownArtist(
  artistId: string,
  knownArtists: Set<string>
): boolean {
  return knownArtists.has(artistId);
}
