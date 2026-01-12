import type { LineupConfig, LineupDay, ScoredArtist } from "./types";

type DayTheme = "upbeat" | "experimental" | "emotional";

/**
 * Get primary genre for an artist (first genre normalized)
 */
function getPrimaryGenre(artist: ScoredArtist): string {
  return artist.genres[0]?.toLowerCase() || "unknown";
}

/**
 * Calculate genre diversity score for a day
 * Higher score = more diverse genres
 */
function calculateGenreDiversity(artists: ScoredArtist[]): number {
  const genres = new Set<string>();
  for (const artist of artists) {
    for (const genre of artist.genres.slice(0, 2)) {
      genres.add(genre.toLowerCase());
    }
  }
  return genres.size;
}

/**
 * Calculate total popularity for a day
 */
function calculateDayStrength(artists: ScoredArtist[]): number {
  return artists.reduce((sum, a) => sum + a.compositeScore, 0);
}

/**
 * Assign artists to days with genre clustering and balance
 */
export function assignToDays(
  headliners: ScoredArtist[],
  supporting: ScoredArtist[],
  discovery: ScoredArtist[],
  config: LineupConfig
): LineupDay[] {
  const dayCount = config.days.count;
  const supportingPerDay = config.days.supportingPerDay;
  const discoveryPerDay = config.days.discoveryPerDay;

  const themes: DayTheme[] = ["upbeat", "experimental", "emotional"];
  const dayDates = ["23rd JAN", "24th JAN", "25th JAN"];
  const dayTimes = ["2pm - 11pm", "1pm - 12pm", "1pm - 10pm"];

  // Initialize days with headliners
  const days: LineupDay[] = headliners
    .slice(0, dayCount)
    .map((headliner, i) => ({
      name: `Day ${i + 1}`,
      date: dayDates[i] || `Day ${i + 1}`,
      time: dayTimes[i] || "TBA",
      theme: themes[i] || "upbeat",
      headliner,
      supporting: [],
      discovery: [],
    }));

  // Fill in remaining days if not enough headliners
  while (days.length < dayCount) {
    const idx = days.length;
    days.push({
      name: `Day ${idx + 1}`,
      date: dayDates[idx] || `Day ${idx + 1}`,
      time: dayTimes[idx] || "TBA",
      theme: themes[idx] || "upbeat",
      headliner: headliners[0] || supporting[0], // Fallback
      supporting: [],
      discovery: [],
    });
  }

  // Distribute supporting acts with genre consideration
  const availableSupporting = [...supporting];
  for (let round = 0; round < supportingPerDay; round++) {
    for (const day of days) {
      if (availableSupporting.length === 0) break;

      // Find best fit: prefer different primary genre than headliner
      const headlinerGenre = getPrimaryGenre(day.headliner);
      let bestIdx = 0;
      let bestScore = -1;

      for (let i = 0; i < availableSupporting.length; i++) {
        const artist = availableSupporting[i];
        let score = artist.compositeScore;

        // Bonus for genre diversity
        const artistGenre = getPrimaryGenre(artist);
        if (artistGenre !== headlinerGenre) {
          score += 0.1;
        }

        // Penalty if same genre as existing supporting
        const existingGenres = day.supporting.map(getPrimaryGenre);
        if (existingGenres.includes(artistGenre)) {
          score -= 0.05;
        }

        if (score > bestScore) {
          bestScore = score;
          bestIdx = i;
        }
      }

      day.supporting.push(availableSupporting.splice(bestIdx, 1)[0]);
    }
  }

  // Distribute discovery acts
  const availableDiscovery = [...discovery];
  for (let round = 0; round < discoveryPerDay; round++) {
    for (const day of days) {
      if (availableDiscovery.length === 0) break;

      // For discovery, prioritize genre matching with headliner
      const headlinerGenres = new Set(
        day.headliner.genres.map((g) => g.toLowerCase())
      );

      let bestIdx = 0;
      let bestOverlap = -1;

      for (let i = 0; i < availableDiscovery.length; i++) {
        const artist = availableDiscovery[i];
        let overlap = 0;

        for (const genre of artist.genres) {
          if (headlinerGenres.has(genre.toLowerCase())) {
            overlap++;
          }
        }

        if (overlap > bestOverlap) {
          bestOverlap = overlap;
          bestIdx = i;
        }
      }

      day.discovery.push(availableDiscovery.splice(bestIdx, 1)[0]);
    }
  }

  // Balance check: log day strengths
  for (const day of days) {
    const allArtists = [day.headliner, ...day.supporting, ...day.discovery];
    const strength = calculateDayStrength(allArtists);
    const diversity = calculateGenreDiversity(allArtists);
    console.log(
      `[Lineup] ${day.name}: strength=${strength.toFixed(2)}, diversity=${diversity}`
    );
  }

  return days;
}
