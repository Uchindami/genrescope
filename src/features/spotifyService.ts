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
// Spotify Service (Endpoint Helpers)
// ============================================
// Note: Actual fetching is handled by SWR hooks
// These are just for legacy compatibility and data transformation

/**
 * Format top tracks for description
 */
function formatTracksForDescription(tracks: TopTrack[]): string {
  return tracks.map((track) => `${track.name} - ${track.artist}`).join(", ");
}

const spotifyService = {
  formatTracksForDescription,
};

export default spotifyService;
export type { UserProfile, TopTrack, TopArtist, GenrePercentages };
