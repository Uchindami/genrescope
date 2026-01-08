import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import gptServices from "@/features/GPTchatService";
import spotifyService, {
  type GenrePercentages,
  type UserProfile,
} from "@/features/spotifyService";
import { useProfile } from "./useProfile";

interface UseUserDataReturn {
  profile: UserProfile | null;
  genres: GenrePercentages | null;
  description: string | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useUserData(): UseUserDataReturn {
  const { isAuthenticated } = useAuth();
  const { profile, isLoading: profileLoading, error: profileError } = useProfile();
  const [genres, setGenres] = useState<GenrePercentages | null>(null);
  const [description, setDescription] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalysis = useCallback(async () => {
    if (!isAuthenticated || !profile) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Fetch genres and top tracks in parallel
      const [genreData, topTracks] = await Promise.all([
        spotifyService.getGenres(),
        spotifyService.getTopTracks(),
      ]);

      setGenres(genreData);

      // Generate description from top tracks
      const songsString = spotifyService.formatTracksForDescription(topTracks);
      const descriptionData = await gptServices.getDescription(songsString);
      setDescription(descriptionData);
    } catch (err) {
      console.error("[useUserData] Error fetching analysis:", err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch music analysis"
      );
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, profile]);

  useEffect(() => {
    if (!profileLoading && profile) {
      fetchAnalysis();
    }
  }, [profileLoading, profile, fetchAnalysis]);

  return {
    profile,
    genres,
    description,
    isLoading: isLoading || profileLoading,
    error: error || profileError,
    refetch: fetchAnalysis,
  };
}
