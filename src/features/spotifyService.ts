// ============================================
// Types
// ============================================

interface UserProfile {
  id: string;
  displayName: string;
  email: string;
  product: string;
  imageUrl: string | null;
  followers: number;
}

interface TopTrack {
  id: string;
  name: string;
  artist: string;
  album: string;
  albumImage: string | null;
}

interface TopArtist {
  id: string;
  name: string;
  genres: string[];
  imageUrl: string | null;
}

interface GenrePercentages {
  [genre: string]: string;
}

// ============================================
// API Helper
// ============================================

async function apiFetch<T>(endpoint: string): Promise<T> {
  const response = await fetch(endpoint, {
    credentials: "include",
  });

  if (response.status === 401) {
    throw new Error("Not authenticated");
  }

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ error: "Unknown error" }));
    throw new Error(error.error || `API error: ${response.status}`);
  }

  return response.json();
}

// ============================================
// Spotify Service
// ============================================

/**
 * Get current user's Spotify profile
 */
async function getUserProfile(): Promise<UserProfile> {
  return apiFetch<UserProfile>("/api/spotify/me");
}

/**
 * Get user's top tracks
 */
async function getTopTracks(
  timeRange: "short_term" | "medium_term" | "long_term" = "long_term",
  limit = 30
): Promise<TopTrack[]> {
  const data = await apiFetch<{ tracks: TopTrack[] }>(
    `/api/spotify/top-tracks?time_range=${timeRange}&limit=${limit}`
  );
  return data.tracks;
}

/**
 * Get user's top artists
 */
async function getTopArtists(
  timeRange: "short_term" | "medium_term" | "long_term" = "long_term",
  limit = 50
): Promise<TopArtist[]> {
  const data = await apiFetch<{ artists: TopArtist[] }>(
    `/api/spotify/top-artists?time_range=${timeRange}&limit=${limit}`
  );
  return data.artists;
}

/**
 * Get genre percentages based on top artists
 */
async function getGenres(): Promise<GenrePercentages> {
  return apiFetch<GenrePercentages>("/api/spotify/genres");
}

/**
 * Format top tracks for display
 */
function formatTracksForDescription(tracks: TopTrack[]): string {
  return tracks.map((track) => `${track.name} - ${track.artist}`).join(", ");
}

const spotifyService = {
  getUserProfile,
  getTopTracks,
  getTopArtists,
  getGenres,
  formatTracksForDescription,
};

export default spotifyService;
export type { UserProfile, TopTrack, TopArtist, GenrePercentages };
