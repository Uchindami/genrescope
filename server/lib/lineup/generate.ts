import type { ArtistDay, FestivalData } from "../../../src/lib/poster/types";
import type { SpotifyArtist } from "../../types";
import { assignToDays } from "./days";
import { buildDiscoveryTier } from "./discovery";
import { buildGenreProfile, scoreAllArtists } from "./scoring";
import { classifyIntoTiers } from "./tiers";
import {
  DEFAULT_LINEUP_CONFIG,
  type GeneratedLineup,
  type LineupConfig,
  type ScoredArtist,
  type SpotifyDataCollection,
} from "./types";

/**
 * Convert ScoredArtist to artist name string
 */
function toArtistName(artist: ScoredArtist): string {
  return artist.name;
}

/**
 * Generate a festival lineup from Spotify data
 */
export function generateLineup(
  data: SpotifyDataCollection,
  config: LineupConfig = DEFAULT_LINEUP_CONFIG
): GeneratedLineup {
  console.log("[Lineup] Starting lineup generation...");

  // Combine all top artists for genre analysis
  const allTopArtists = [
    ...data.topArtists.shortTerm,
    ...data.topArtists.mediumTerm,
    ...data.topArtists.longTerm,
  ];

  // Build genre profile
  const genreProfile = buildGenreProfile(allTopArtists);
  console.log(
    `[Lineup] Dominant genres: ${genreProfile.dominantGenres.join(", ")}`
  );

  // Score all known artists
  const scoredArtists = scoreAllArtists(data, genreProfile, config);
  console.log(`[Lineup] Scored ${scoredArtists.length} unique artists`);

  // Classify into tiers
  const { headliners, supporting, remaining } = classifyIntoTiers(
    scoredArtists,
    config
  );
  console.log(
    `[Lineup] Tiers: ${headliners.length} headliners, ${supporting.length} supporting`
  );

  // Build known artist set for discovery filtering
  const knownArtistIds = new Set(scoredArtists.map((a) => a.id));

  // Build discovery tier from related artists
  const discovery = buildDiscoveryTier(
    data.relatedArtists,
    genreProfile,
    knownArtistIds,
    config
  );
  console.log(`[Lineup] Discovery: ${discovery.length} artists`);

  // Assign to days
  const days = assignToDays(headliners, supporting, discovery, config);

  return {
    userName: data.profile.displayName,
    days,
    dominantGenres: genreProfile.dominantGenres,
    totalArtists: headliners.length + supporting.length + discovery.length,
  };
}

/**
 * Convert GeneratedLineup to FestivalData for poster generation
 */
export function lineupToFestivalData(lineup: GeneratedLineup): FestivalData {
  const currentYear = new Date().getFullYear().toString();
  const currentMonth = new Date()
    .toLocaleDateString("en-US", { month: "short" })
    .toUpperCase();

  return {
    userName: lineup.userName,
    eventName: ["SOCIAL", "WEEKEND"],
    eventYear: currentYear,
    dateRange: `${lineup.days[0]?.date || "TBA"} - ${lineup.days[lineup.days.length - 1]?.date || "TBA"}`,
    venue: "GENRESCOPE DIGITAL ARENA",
    tagline: lineup.dominantGenres.slice(0, 3).join(" • ").toUpperCase(),
    hashtag: "#SOCIALWEEKEND" + currentYear,
    website: "WWW.GENRESCOPE.CO",
    email: "HELLO@GENRESCOPE.CO",
    socialHandle: "@GENRESCOPE_WEB",
    days: lineup.days.map(
      (day): ArtistDay => ({
        name: day.name,
        date: day.date,
        time: day.time,
        headliner: toArtistName(day.headliner),
        supporting: day.supporting.map(toArtistName),
        discovery: day.discovery.map(toArtistName),
      })
    ),
  };
}

/**
 * Collect Spotify data for lineup generation
 * This is the main data fetching function that should be called with API access
 */
export async function collectSpotifyData(
  spotifyFetch: <T>(endpoint: string) => Promise<T>
): Promise<SpotifyDataCollection> {
  console.log("[Lineup] Collecting Spotify data...");

  // Fetch user profile
  const profile = await spotifyFetch<{ id: string; display_name: string }>(
    "/me"
  );

  // Fetch top artists for all time ranges
  const [shortTerm, mediumTerm, longTerm] = await Promise.all([
    spotifyFetch<{ items: SpotifyArtist[] }>(
      "/me/top/artists?time_range=short_term&limit=50"
    ),
    spotifyFetch<{ items: SpotifyArtist[] }>(
      "/me/top/artists?time_range=medium_term&limit=50"
    ),
    spotifyFetch<{ items: SpotifyArtist[] }>(
      "/me/top/artists?time_range=long_term&limit=50"
    ),
  ]);

  console.log(
    `[Lineup] Top artists: short=${shortTerm.items.length}, medium=${mediumTerm.items.length}, long=${longTerm.items.length}`
  );

  // Fetch recently played for recency scoring
  let recentlyPlayed: {
    artistIds: Set<string>;
    artistPlayCounts: Map<string, number>;
  };
  try {
    const recent = await spotifyFetch<{
      items: Array<{ track: { artists: Array<{ id: string }> } }>;
    }>("/me/player/recently-played?limit=50");

    const artistPlayCounts = new Map<string, number>();
    const artistIds = new Set<string>();

    for (const item of recent.items) {
      for (const artist of item.track.artists) {
        artistIds.add(artist.id);
        artistPlayCounts.set(
          artist.id,
          (artistPlayCounts.get(artist.id) || 0) + 1
        );
      }
    }

    recentlyPlayed = { artistIds, artistPlayCounts };
    console.log(`[Lineup] Recently played: ${artistIds.size} unique artists`);
  } catch (error) {
    console.warn("[Lineup] Could not fetch recently played, using empty set");
    recentlyPlayed = { artistIds: new Set(), artistPlayCounts: new Map() };
  }

  // Fetch related artists for top 10 artists (for discovery)
  const relatedArtists = new Map<string, SpotifyArtist[]>();
  const topArtistsForRelated = shortTerm.items.slice(0, 10);

  // Fetch related artists sequentially to avoid rate limiting
  for (const artist of topArtistsForRelated) {
    try {
      const related = await spotifyFetch<{ artists: SpotifyArtist[] }>(
        `/artists/${artist.id}/related-artists`
      );
      if (related.artists && related.artists.length > 0) {
        relatedArtists.set(artist.id, related.artists.slice(0, 10));
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Unknown error";
      console.warn(
        `[Lineup] Could not fetch related for ${artist.name}: ${errorMsg}`
      );
    }
    // Small delay to avoid rate limiting
    await new Promise((resolve) => setTimeout(resolve, 50));
  }

  console.log(
    `[Lineup] Related artists fetched for ${relatedArtists.size} artists`
  );

  // Fallback: if no related artists, use long-term artists not in short-term as "discovery"
  if (relatedArtists.size === 0) {
    console.log(
      "[Lineup] No related artists available, using fallback discovery"
    );
    const shortTermIds = new Set(shortTerm.items.map((a) => a.id));
    const fallbackDiscovery = longTerm.items
      .filter((a) => !shortTermIds.has(a.id))
      .slice(0, 15);

    if (fallbackDiscovery.length > 0) {
      // Use a special key for fallback discovery
      relatedArtists.set("__fallback__", fallbackDiscovery);
    }
  }

  return {
    profile: {
      id: profile.id,
      displayName: profile.display_name,
    },
    topArtists: {
      shortTerm: shortTerm.items,
      mediumTerm: mediumTerm.items,
      longTerm: longTerm.items,
    },
    recentlyPlayed,
    relatedArtists,
  };
}

export { assignToDays } from "./days";
export { buildDiscoveryTier } from "./discovery";
export { buildGenreProfile, scoreAllArtists } from "./scoring";
export { classifyIntoTiers } from "./tiers";
// Export all modules
export * from "./types";
