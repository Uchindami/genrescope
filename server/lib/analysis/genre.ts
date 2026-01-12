import type {
  GenreAnalysis,
  GenreBreakdown,
  SpotifyArtistWithGenres,
  SpotifyTrackSimple,
  TemporalGenreShift,
} from "./types";

// ============================================
// Genre Hierarchy Configuration
// ============================================

interface GenreConfig {
  keywords: string[];
  weight: number;
}

/**
 * Hierarchical genre map with keywords and weights.
 * - Keywords: Strings to match in Spotify's raw genre tags.
 * - Weight: Multiplier for niche/specific genres (1.0 is baseline).
 */
const GENRE_HIERARCHY: Record<string, GenreConfig> = {
  electronic: {
    keywords: [
      "electronic",
      "edm",
      "house",
      "techno",
      "trance",
      "dubstep",
      "drum and bass",
      "ambient",
      "downtempo",
      "chillwave",
    ],
    weight: 1.0,
  },
  "hip-hop": {
    keywords: [
      "hip hop",
      "rap",
      "trap",
      "drill",
      "grime",
      "boom bap",
      "conscious hip hop",
    ],
    weight: 1.2,
  },
  rock: {
    keywords: [
      "rock",
      "alternative",
      "indie rock",
      "punk",
      "grunge",
      "metal",
      "post-punk",
      "shoegaze",
      "emo",
    ],
    weight: 1.0,
  },
  pop: {
    keywords: ["pop", "electropop", "synth-pop", "dance pop", "bubblegum pop"],
    weight: 0.9, // Slightly lower due to broad application
  },
  "r&b": {
    keywords: ["r&b", "soul", "neo-soul", "contemporary r&b", "funk"],
    weight: 1.1,
  },
  jazz: {
    keywords: [
      "jazz",
      "bebop",
      "fusion",
      "smooth jazz",
      "cool jazz",
      "hard bop",
    ],
    weight: 1.3, // Higher weight for niche appeal
  },
  latin: {
    keywords: [
      "latin",
      "reggaeton",
      "bachata",
      "salsa",
      "merengue",
      "latin trap",
    ],
    weight: 1.0,
  },
  afrobeats: {
    keywords: ["afrobeat", "afro", "afropop", "amapiano", "highlife"],
    weight: 1.2,
  },
  country: {
    keywords: [
      "country",
      "americana",
      "bluegrass",
      "country pop",
      "outlaw country",
    ],
    weight: 1.0,
  },
  metal: {
    keywords: [
      "metal",
      "metalcore",
      "death metal",
      "black metal",
      "thrash metal",
      "doom metal",
    ],
    weight: 1.3,
  },
  indie: {
    keywords: ["indie", "indie pop", "indie folk", "bedroom pop", "lo-fi"],
    weight: 1.1,
  },
  classical: {
    keywords: [
      "classical",
      "orchestral",
      "symphony",
      "baroque",
      "romantic era",
    ],
    weight: 1.4,
  },
};

// ============================================
// Genre Analysis Functions
// ============================================

interface GenreCount {
  count: number;
  weightedCount: number;
  artists: Set<string>;
  specificity: number;
}

/**
 * Calculate artist weights based on their appearance in top tracks.
 * Artists who appear more often in your top tracks are weighted higher.
 */
function calculateArtistWeights(
  topTracks: SpotifyTrackSimple[]
): Map<string, number> {
  const weights = new Map<string, number>();

  topTracks.forEach((track, index) => {
    // Position-based decay: position 1 = weight 1.0, last position = weight 0.5
    const positionWeight = 1 - (index / topTracks.length) * 0.5;

    for (const artist of track.artists) {
      const current = weights.get(artist.id) || 0;
      weights.set(artist.id, current + positionWeight);
    }
  });

  return weights;
}

/**
 * Normalize a genre string (lowercase, trim).
 */
function normalizeGenre(genre: string): string {
  return genre.toLowerCase().trim();
}

/**
 * Categorize a raw genre string into a parent category.
 * Returns the parent genre name and a specificity score.
 */
function categorizeGenre(genre: string): {
  parent: string;
  specificity: number;
} {
  const normalized = normalizeGenre(genre);
  const wordCount = normalized.split(" ").length;

  for (const [parent, config] of Object.entries(GENRE_HIERARCHY)) {
    for (const keyword of config.keywords) {
      if (normalized.includes(keyword)) {
        // More words = more specific genre
        const specificity = Math.min(1, wordCount / 3);
        return { parent, specificity };
      }
    }
  }

  return { parent: "other", specificity: 0.5 };
}

/**
 * Format genre name for display (Title Case).
 */
function formatGenreName(genre: string): string {
  return genre
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("-");
}

/**
 * Calculate Shannon Diversity Index.
 * Higher = more diverse listening taste.
 * Normalized to 0-100 scale.
 */
function calculateDiversity(genres: GenreBreakdown[]): number {
  if (genres.length === 0) return 0;
  if (genres.length === 1) return 0;

  const totalPercentage = genres.reduce((sum, g) => sum + g.percentage, 0);

  let diversity = 0;
  for (const genre of genres) {
    const proportion = genre.percentage / totalPercentage;
    if (proportion > 0) {
      diversity -= proportion * Math.log(proportion);
    }
  }

  // Normalize to 0-100 scale
  const maxDiversity = Math.log(genres.length);
  return maxDiversity > 0 ? Math.min(100, (diversity / maxDiversity) * 100) : 0;
}

/**
 * Extract unique genre names from a list of artists.
 */
function extractGenres(artists: SpotifyArtistWithGenres[]): string[] {
  const genres = new Set<string>();
  for (const artist of artists) {
    for (const genre of artist.genres) {
      const { parent } = categorizeGenre(genre);
      genres.add(parent);
    }
  }
  return Array.from(genres);
}

/**
 * Analyze temporal genre shift between time ranges.
 * Compares short-term vs long-term listening to detect trends.
 */
function analyzeTemporalShift(
  longTermArtists: SpotifyArtistWithGenres[],
  shortTermArtists: SpotifyArtistWithGenres[]
): TemporalGenreShift {
  const longGenres = extractGenres(longTermArtists);
  const shortGenres = extractGenres(shortTermArtists);

  const newGenres = shortGenres.filter((g) => !longGenres.includes(g));
  const oldGenres = longGenres.filter((g) => !shortGenres.includes(g));

  let trend: TemporalGenreShift["recentTrend"] = "consistent";
  let shiftPercentage = 0;

  if (longGenres.length > 0) {
    if (newGenres.length > longGenres.length * 0.3) {
      trend = "exploring";
      shiftPercentage = (newGenres.length / longGenres.length) * 100;
    } else if (oldGenres.length > 0 && newGenres.length === 0) {
      trend = "returning";
      shiftPercentage = (oldGenres.length / longGenres.length) * 100;
    }
  }

  return {
    recentTrend: trend,
    shiftPercentage: Math.round(shiftPercentage),
    topGrowingGenre: newGenres[0] ? formatGenreName(newGenres[0]) : undefined,
  };
}

// ============================================
// Main Analysis Function
// ============================================

/**
 * Analyze genres from Spotify artist data.
 * Uses weighted algorithm based on artist position in top tracks.
 *
 * @param longTermArtists - Top artists from long_term time range
 * @param shortTermArtists - Top artists from short_term time range
 * @param topTracks - Top tracks for weighting artists
 */
export function analyzeGenres(
  longTermArtists: SpotifyArtistWithGenres[],
  shortTermArtists: SpotifyArtistWithGenres[],
  topTracks: SpotifyTrackSimple[]
): GenreAnalysis {
  // Create artist weight map based on track appearances
  const artistWeights = calculateArtistWeights(topTracks);

  const genreCounts = new Map<string, GenreCount>();

  // Analyze long-term preferences with weighting
  for (const artist of longTermArtists) {
    const artistWeight = artistWeights.get(artist.id) || 1.0;

    for (const genre of artist.genres) {
      const { parent, specificity } = categorizeGenre(genre);
      const parentWeight = GENRE_HIERARCHY[parent]?.weight || 1.0;

      if (!genreCounts.has(parent)) {
        genreCounts.set(parent, {
          count: 0,
          weightedCount: 0,
          artists: new Set(),
          specificity: 0,
        });
      }

      const genreData = genreCounts.get(parent)!;
      genreData.count += 1;
      genreData.weightedCount += artistWeight * parentWeight;
      genreData.artists.add(artist.id);
      genreData.specificity = Math.max(genreData.specificity, specificity);
    }
  }

  // Calculate percentages
  const totalWeight = Array.from(genreCounts.values()).reduce(
    (sum, data) => sum + data.weightedCount,
    0
  );

  const primary: GenreBreakdown[] = Array.from(genreCounts.entries())
    .map(([name, data]) => ({
      name: formatGenreName(name),
      percentage:
        totalWeight > 0 ? (data.weightedCount / totalWeight) * 100 : 0,
      weight: data.weightedCount,
      artistCount: data.artists.size,
      specificity: data.specificity,
    }))
    .filter((g) => g.percentage >= 3) // Only show genres >= 3%
    .sort((a, b) => b.percentage - a.percentage)
    .slice(0, 10); // Top 10 genres

  // Calculate diversity index
  const diversity = calculateDiversity(primary);

  // Temporal analysis
  const temporal = analyzeTemporalShift(longTermArtists, shortTermArtists);

  return { primary, diversity, temporal };
}
