import useSWR from "swr";
import { useAuth } from "@/context/AuthContext";
import { apiClient } from "@/lib/api/client";
import { cacheTTL } from "@/lib/swr/config";
import { swrKeys } from "@/lib/swr/keys";

// ============================================
// Types (mirror of backend types)
// ============================================

export interface GenreBreakdown {
  name: string;
  percentage: number;
  weight: number;
  artistCount: number;
  specificity: number;
}

export interface TemporalGenreShift {
  recentTrend: "exploring" | "consistent" | "returning";
  shiftPercentage: number;
  topGrowingGenre?: string;
}

export interface GenreAnalysis {
  primary: GenreBreakdown[];
  diversity: number;
  temporal: TemporalGenreShift;
}

export interface DiversityMetrics {
  artistDiversityScore: number;
  genreDiversityScore: number;
  discoveryScore: number;
  loyaltyIndex: number;
  topArtistDependency: number;
}

export interface MusicDNAResult {
  genreAnalysis: GenreAnalysis;
  diversityMetrics: DiversityMetrics;
  description: string;
}

// ============================================
// Hook
// ============================================

interface UseMusicDNAOptions {
  enabled?: boolean;
}

/**
 * Hook to fetch comprehensive Music DNA analysis from the backend.
 * Returns genre breakdowns, diversity metrics, and personality description.
 */
export function useMusicDNA(options: UseMusicDNAOptions = {}) {
  const { isAuthenticated } = useAuth();
  const { enabled = isAuthenticated } = options;

  return useSWR<MusicDNAResult>(
    enabled ? swrKeys.musicDna.analysis() : null,
    async () => {
      return apiClient.request<MusicDNAResult>({
        endpoint: "/api/music-dna",
      });
    },
    {
      dedupingInterval: 5000,
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      focusThrottleInterval: cacheTTL.genres, // Reuse genres TTL
      keepPreviousData: true,
    }
  );
}
