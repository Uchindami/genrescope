// ============================================
// Music DNA Analysis Types
// ============================================

/**
 * Complete Music DNA analysis result
 */
export interface MusicDNAResult {
  genreAnalysis: GenreAnalysis;
  diversityMetrics: DiversityMetrics;
  description: string;
}

// ============================================
// Genre Analysis Types
// ============================================

export interface GenreAnalysis {
  primary: GenreBreakdown[];
  diversity: number; // Shannon diversity index (0-100)
  temporal: TemporalGenreShift;
}

export interface GenreBreakdown {
  name: string;
  percentage: number;
  weight: number;
  artistCount: number;
  specificity: number; // How niche this genre is (0-1)
}

export interface TemporalGenreShift {
  recentTrend: "exploring" | "consistent" | "returning";
  shiftPercentage: number;
  topGrowingGenre?: string;
}

// ============================================
// Diversity Metrics Types
// ============================================

export interface DiversityMetrics {
  artistDiversityScore: number; // 0-100
  genreDiversityScore: number; // 0-100
  discoveryScore: number; // How often they find new artists
  loyaltyIndex: number; // How much they stick to favorites
  topArtistDependency: number; // % of listening from top 10 artists
}

// ============================================
// Spotify Data Types (for internal use)
// ============================================

export interface SpotifyArtistWithGenres {
  id: string;
  name: string;
  genres: string[];
}

export interface SpotifyTrackSimple {
  id: string;
  name: string;
  artists: { id: string; name: string }[];
}
