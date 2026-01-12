import type { SpotifyArtist } from "../../types";

// ============================================
// Lineup Algorithm Types
// ============================================

export type ArtistTier = "headliner" | "supporting" | "discovery";

export interface ScoredArtist {
  id: string;
  name: string;
  genres: string[];
  popularity: number;
  imageUrl: string | null;
  // Scoring components
  frequencyScore: number; // 0-1, position in top artists
  recencyScore: number; // 0-1, recently played bonus
  popularityScore: number; // 0-1, spotify popularity / 100
  genreRelevance: number; // 0-1, overlap with user's genres
  // Computed
  compositeScore: number;
  tier: ArtistTier;
  // For day assignment
  energyLevel?: number; // 0-1, average energy of tracks
}

export interface LineupDay {
  name: string;
  date: string;
  time: string;
  theme: "upbeat" | "experimental" | "emotional";
  headliner: ScoredArtist;
  supporting: ScoredArtist[];
  discovery: ScoredArtist[];
}

export interface GeneratedLineup {
  userName: string;
  days: LineupDay[];
  dominantGenres: string[];
  totalArtists: number;
}

// ============================================
// Algorithm Configuration
// ============================================

export interface LineupConfig {
  // Scoring weights (must sum to 1)
  weights: {
    frequency: number;
    recency: number;
    popularity: number;
    genreRelevance: number;
  };
  // Tier thresholds
  thresholds: {
    headlinerMinPopularity: number;
    headlinerCount: number;
    supportingCount: number;
    discoveryCount: number;
  };
  // Day configuration
  days: {
    count: number;
    supportingPerDay: number;
    discoveryPerDay: number;
  };
}

export const DEFAULT_LINEUP_CONFIG: LineupConfig = {
  weights: {
    frequency: 0.35,
    recency: 0.2,
    popularity: 0.25,
    genreRelevance: 0.2,
  },
  thresholds: {
    headlinerMinPopularity: 60,
    headlinerCount: 3,
    supportingCount: 12,
    discoveryCount: 15,
  },
  days: {
    count: 3,
    supportingPerDay: 2,
    discoveryPerDay: 3,
  },
};

// ============================================
// Spotify Data Collection Types
// ============================================

export interface SpotifyDataCollection {
  profile: {
    id: string;
    displayName: string;
  };
  topArtists: {
    shortTerm: SpotifyArtist[];
    mediumTerm: SpotifyArtist[];
    longTerm: SpotifyArtist[];
  };
  recentlyPlayed: {
    artistIds: Set<string>;
    artistPlayCounts: Map<string, number>;
  };
  relatedArtists: Map<string, SpotifyArtist[]>;
}

export interface GenreProfile {
  genres: Map<string, number>; // genre -> count
  dominantGenres: string[]; // top 5 genres
  totalCount: number;
}
