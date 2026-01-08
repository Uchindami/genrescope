import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import spotifyService, { type UserProfile } from "@/features/spotifyService";

interface UseProfileReturn {
  profile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useProfile(): UseProfileReturn {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    if (!isAuthenticated) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const profileData = await spotifyService.getUserProfile();
      setProfile(profileData);
    } catch (err) {
      console.error("[useProfile] Error fetching profile:", err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch profile"
      );
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!authLoading) {
      fetchProfile();
    }
  }, [authLoading, fetchProfile]);

  return {
    profile,
    isLoading: isLoading || authLoading,
    error,
    refetch: fetchProfile,
  };
}
