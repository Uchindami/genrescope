import { useMemo } from "react";
import spotifyService from "@/features/spotifyService";
import { useGPTDescription } from "./useGPTDescription";
import { useSpotifyGenres } from "./useSpotifyGenres";
import { useSpotifyProfile } from "./useSpotifyProfile";
import { useSpotifyTopTracks } from "./useSpotifyTopTracks";

/**
 * Composite hook for Music DNA analysis
 *
 * Handles sequential dependent queries:
 * 1. Profile (independent)
 * 2. Genres + TopTracks (dependent on auth, parallel)
 * 3. Description (dependent on topTracks)
 */
export function useMusicAnalysis() {
  // Step 1: Fetch profile (always enabled when authenticated)
  const profile = useSpotifyProfile();

  // Step 2: Fetch genres and tracks in parallel (enabled when profile succeeds)
  const genres = useSpotifyGenres({
    enabled: profile.isLoading === false && !profile.error,
  });

  const topTracks = useSpotifyTopTracks({
    enabled: profile.isLoading === false && !profile.error,
    timeRange: "long_term",
    limit: 30,
  });


  // Step 3: Format songs for GPT (memoized)
  const formattedSongs = useMemo(() => {
    if (!topTracks.data) {
      console.log('[useMusicAnalysis] No tracks data yet');
      return "";
    }
    const formatted = spotifyService.formatTracksForDescription(topTracks.data);
    console.log('[useMusicAnalysis] Formatted songs:', formatted.slice(0, 100) + '...');
    return formatted;
  }, [topTracks.data]);

  // Step 4: Fetch description (enabled when tracks are loaded)
  const descriptionEnabled = !!topTracks.data && !topTracks.error;
  console.log('[useMusicAnalysis] Description hook enabled:', descriptionEnabled, 'Songs length:', formattedSongs.length);
  
  const description = useGPTDescription({
    enabled: descriptionEnabled,
    songs: formattedSongs,
  });

  // Combine states
  const isLoading =
    profile.isLoading ||
    genres.isLoading ||
    topTracks.isLoading ||
    description.isLoading;
  const error =
    profile.error || genres.error || topTracks.error || description.error;

  // Individual loading states for progressive rendering
  const loadingStates = {
    profile: profile.isLoading,
    genres: genres.isLoading,
    tracks: topTracks.isLoading,
    description: description.isLoading,
  };

  // Refetch all data
  const refetchAll = () => {
    profile.mutate();
    genres.mutate();
    topTracks.mutate();
    description.mutate();
  };

  return {
    // Data
    profile: profile.data,
    genres: genres.data,
    topTracks: topTracks.data,
    description: description.data,

    // States
    isLoading,
    loadingStates,
    error,

    // Individual states for fine-grained control
    profileState: { isLoading: profile.isLoading, error: profile.error },
    genresState: { isLoading: genres.isLoading, error: genres.error },
    tracksState: { isLoading: topTracks.isLoading, error: topTracks.error },
    descriptionState: {
      isLoading: description.isLoading,
      error: description.error,
    },

    // Actions
    refetchAll,
    mutateProfile: profile.mutate,
    mutateGenres: genres.mutate,
    mutateTracks: topTracks.mutate,
    mutateDescription: description.mutate,
  };
}
