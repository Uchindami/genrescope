import type { Context } from "hono";
import { getCookie } from "hono/cookie";
import {
  type ArtistDay,
  DEFAULT_FESTIVAL_DATA,
  type FestivalData,
  generatePoster,
} from "../../src/lib/poster/generate.tsx";
import {
  collectSpotifyData,
  generateLineup,
  lineupToFestivalData,
} from "../lib/lineup/generate";
import { TOKEN_COOKIE_NAME, type TokenData } from "../types";

const SPOTIFY_API_BASE = "https://api.spotify.com/v1";

// Partial settings from the client
interface PosterSettings {
  userName?: string;
  eventName?: [string, string];
  eventYear?: string;
  dateRange?: string;
  venue?: string;
  tagline?: string;
  hashtag?: string;
  website?: string;
  email?: string;
  socialHandle?: string;
  days?: Partial<ArtistDay>[];
  // Flag to use Spotify data for lineup generation
  useSpotifyData?: boolean;
}

/**
 * Get access token from cookie
 */
function getAccessToken(c: Context): string | null {
  const cookie = getCookie(c, TOKEN_COOKIE_NAME);
  if (!cookie) return null;

  try {
    const tokens = JSON.parse(cookie) as TokenData;
    // Check if expired
    if (Date.now() >= tokens.expiresAt) {
      return null;
    }
    return tokens.accessToken;
  } catch {
    return null;
  }
}

/**
 * Create a Spotify fetch function for the given context
 */
function createSpotifyFetch(c: Context) {
  const accessToken = getAccessToken(c);

  if (!accessToken) {
    return null;
  }

  return async <T>(endpoint: string): Promise<T> => {
    const response = await fetch(`${SPOTIFY_API_BASE}${endpoint}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Spotify API error: ${response.status}`);
    }

    return response.json();
  };
}

/**
 * Generate lineup from Spotify data
 */
async function generateSpotifyLineup(c: Context): Promise<FestivalData | null> {
  const spotifyFetch = createSpotifyFetch(c);

  if (!spotifyFetch) {
    console.log("[Poster] No Spotify auth, using defaults");
    return null;
  }

  try {
    console.log("[Poster] Generating lineup from Spotify data...");
    const data = await collectSpotifyData(spotifyFetch);
    const lineup = generateLineup(data);
    const festivalData = lineupToFestivalData(lineup);
    console.log(
      `[Poster] Generated lineup with ${lineup.totalArtists} artists`
    );
    return festivalData;
  } catch (error) {
    console.error("[Poster] Failed to generate Spotify lineup:", error);
    return null;
  }
}

/**
 * Merge user settings with generated or default data
 */
function mergeWithBase(
  settings: PosterSettings,
  baseData: FestivalData
): FestivalData {
  return {
    userName: settings.userName?.trim() || baseData.userName,
    eventName: [
      settings.eventName?.[0]?.trim() || baseData.eventName[0],
      settings.eventName?.[1]?.trim() || baseData.eventName[1],
    ],
    eventYear: settings.eventYear?.trim() || baseData.eventYear,
    dateRange: settings.dateRange?.trim() || baseData.dateRange,
    venue: settings.venue?.trim() || baseData.venue,
    tagline: settings.tagline?.trim() || baseData.tagline,
    hashtag: settings.hashtag?.trim() || baseData.hashtag,
    website: settings.website?.trim() || baseData.website,
    email: settings.email?.trim() || baseData.email,
    socialHandle: settings.socialHandle?.trim() || baseData.socialHandle,
    days: mergeDays(settings.days, baseData.days),
  };
}

function mergeDays(
  userDays: Partial<ArtistDay>[] | undefined,
  baseDays: ArtistDay[]
): ArtistDay[] {
  if (!userDays || userDays.length === 0) {
    return baseDays;
  }

  return userDays.map((day, index) => {
    const baseDay = baseDays[index] || {
      name: `Day ${index + 1}`,
      date: "",
      time: "",
      headliner: "Featured Artist",
      supporting: [],
      discovery: [],
    };

    return {
      name: day.name?.trim() || baseDay.name,
      date: day.date?.trim() || baseDay.date,
      time: day.time?.trim() || baseDay.time,
      headliner: day.headliner?.trim() || baseDay.headliner,
      supporting:
        day.supporting && day.supporting.length > 0
          ? day.supporting.filter((s) => s.trim())
          : baseDay.supporting,
      discovery:
        day.discovery && day.discovery.length > 0
          ? day.discovery.filter((s) => s.trim())
          : baseDay.discovery,
    };
  });
}

/**
 * POST /api/poster/generate
 * Generate a poster with personalized Spotify data or provided settings
 */
export async function generatePosterHandler(c: Context) {
  try {
    const body = await c.req.json<PosterSettings>().catch(() => ({}));

    // Determine base data: Spotify-generated or defaults
    let baseData: FestivalData;

    // If user explicitly provided day settings, use defaults as base
    // Otherwise, try to generate from Spotify data
    const hasUserDays = body.days && body.days.length > 0;
    const useSpotify = body.useSpotifyData !== false && !hasUserDays;

    if (useSpotify) {
      const spotifyData = await generateSpotifyLineup(c);
      baseData = spotifyData || DEFAULT_FESTIVAL_DATA;
    } else {
      baseData = DEFAULT_FESTIVAL_DATA;
    }

    // Merge user overrides with base data
    const festivalData = mergeWithBase(body, baseData);

    const pngBuffer = await generatePoster(festivalData);

    return new Response(pngBuffer, {
      headers: {
        "Content-Type": "image/png",
        "Content-Disposition": 'inline; filename="social-weekend-poster.png"',
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Poster generation error:", error);
    return c.json(
      {
        error: "Failed to generate poster",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      500
    );
  }
}
