import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import gptServices from "@/features/GPTchatService";
import spotifyService, {
  type GenrePercentages,
  type UserProfile,
} from "@/features/spotifyService";

interface UseUserDataReturn {
  profile: UserProfile | null;
  genres: GenrePercentages | null;
  description: string | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useUserData(): UseUserDataReturn {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [genres, setGenres] = useState<GenrePercentages | null>(null);
  const [description, setDescription] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!isAuthenticated) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Fetch profile and genres in parallel
      const [profileData, genreData, topTracks] = await Promise.all([
        spotifyService.getUserProfile(),
        spotifyService.getGenres(),
        spotifyService.getTopTracks(),
      ]);

      setProfile(profileData);
      setGenres(genreData);

      // Generate description from top tracks
      const songsString = spotifyService.formatTracksForDescription(topTracks);
      const descriptionData = await gptServices.getDescription(songsString);
      setDescription(descriptionData);
    } catch (err) {
      console.error("[useUserData] Error fetching data:", err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch user data"
      );
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!authLoading) {
      fetchData();
    }
  }, [authLoading, fetchData]);

  return {
    profile,
    genres,
    description,
    isLoading: isLoading || authLoading,
    error,
    refetch: fetchData,
  };
}
