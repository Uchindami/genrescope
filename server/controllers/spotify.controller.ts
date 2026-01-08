import type { Context } from "hono";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";
import {
  COOKIE_CONFIG,
  type GenrePercentages,
  PKCE_COOKIE_NAME,
  type SpotifyArtist,
  type SpotifyPaginatedResponse,
  type SpotifyTrack,
  type SpotifyUser,
  TOKEN_COOKIE_NAME,
  type TokenData,
  type TopArtistsResponse,
  type TopTracksResponse,
  type UserProfileResponse,
} from "../types";
import {
  buildAuthUrl,
  exchangeCodeForTokens,
  generateCodeChallenge,
  generateCodeVerifier,
  refreshAccessToken,
} from "../utils/pkce";

const SPOTIFY_API_BASE = "https://api.spotify.com/v1";

// ============================================
// Token Management
// ============================================

function getTokens(c: Context): TokenData | null {
  const cookie = getCookie(c, TOKEN_COOKIE_NAME);
  if (!cookie) return null;

  try {
    return JSON.parse(cookie) as TokenData;
  } catch {
    return null;
  }
}

function setTokens(c: Context, tokens: TokenData): void {
  setCookie(c, TOKEN_COOKIE_NAME, JSON.stringify(tokens), COOKIE_CONFIG);
}

function clearTokens(c: Context): void {
  deleteCookie(c, TOKEN_COOKIE_NAME, { path: "/" });
  deleteCookie(c, PKCE_COOKIE_NAME, { path: "/" });
}

async function getValidAccessToken(c: Context): Promise<string | null> {
  const tokens = getTokens(c);
  if (!tokens) return null;

  // Check if token is expired (with 5 min buffer)
  const isExpired = Date.now() >= tokens.expiresAt - 5 * 60 * 1000;

  if (!isExpired) {
    return tokens.accessToken;
  }

  // Attempt to refresh
  try {
    const clientId = process.env.SPOTIFY_CLIENT_ID!;
    const refreshed = await refreshAccessToken(tokens.refreshToken, clientId);

    const newTokens: TokenData = {
      accessToken: refreshed.access_token,
      refreshToken: refreshed.refresh_token || tokens.refreshToken,
      expiresAt: Date.now() + refreshed.expires_in * 1000,
    };

    setTokens(c, newTokens);
    console.log("[Spotify] Token refreshed successfully");
    return newTokens.accessToken;
  } catch (error) {
    console.error("[Spotify] Token refresh failed:", error);
    clearTokens(c);
    return null;
  }
}

// ============================================
// Spotify API Helper
// ============================================

async function spotifyFetch<T>(
  c: Context,
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const accessToken = await getValidAccessToken(c);

  if (!accessToken) {
    throw new Error("Not authenticated");
  }

  const response = await fetch(`${SPOTIFY_API_BASE}${endpoint}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      ...options.headers,
    },
  });

  if (response.status === 401) {
    clearTokens(c);
    throw new Error("Session expired");
  }

  if (!response.ok) {
    const error = await response.text();
    console.error(`[Spotify] API error: ${response.status}`, error);
    throw new Error(`Spotify API error: ${response.status}`);
  }

  return response.json();
}

// ============================================
// Auth Handlers
// ============================================

/**
 * Initiate Spotify OAuth with PKCE
 */
export const loginHandler = async (c: Context) => {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const redirectUri = process.env.SPOTIFY_REDIRECT_URI;

  if (!(clientId && redirectUri)) {
    return c.json({ error: "Missing Spotify configuration" }, 500);
  }

  // Generate PKCE verifier and challenge
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = await generateCodeChallenge(codeVerifier);

  // Store verifier in cookie for callback
  setCookie(c, PKCE_COOKIE_NAME, codeVerifier, {
    ...COOKIE_CONFIG,
    maxAge: 60 * 10, // 10 minutes
  });

  const authUrl = buildAuthUrl(clientId, redirectUri, codeChallenge);
  return c.redirect(authUrl);
};

/**
 * Handle Spotify OAuth callback with PKCE
 */
export const callbackHandler = async (c: Context) => {
  const code = c.req.query("code");
  const error = c.req.query("error");
  const codeVerifier = getCookie(c, PKCE_COOKIE_NAME);

  // Clear PKCE cookie
  deleteCookie(c, PKCE_COOKIE_NAME, { path: "/" });

  if (error) {
    console.error("[Spotify] Auth error:", error);
    return c.redirect("/?error=auth_failed");
  }

  if (!(code && codeVerifier)) {
    return c.redirect("/?error=invalid_callback");
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID!;
  const redirectUri = process.env.SPOTIFY_REDIRECT_URI!;

  try {
    const tokenResponse = await exchangeCodeForTokens(
      code,
      codeVerifier,
      clientId,
      redirectUri
    );

    const tokens: TokenData = {
      accessToken: tokenResponse.access_token,
      refreshToken: tokenResponse.refresh_token,
      expiresAt: Date.now() + tokenResponse.expires_in * 1000,
    };

    setTokens(c, tokens);
    console.log("[Spotify] Auth successful, tokens stored");

    // Redirect to landing page (terminal will be shown)
    return c.redirect("/");
  } catch (err) {
    console.error("[Spotify] Token exchange failed:", err);
    return c.redirect("/?error=token_exchange_failed");
  }
};

/**
 * Refresh tokens endpoint
 */
export const refreshHandler = async (c: Context) => {
  const tokens = getTokens(c);

  if (!tokens) {
    return c.json({ error: "Not authenticated" }, 401);
  }

  try {
    const clientId = process.env.SPOTIFY_CLIENT_ID!;
    const refreshed = await refreshAccessToken(tokens.refreshToken, clientId);

    const newTokens: TokenData = {
      accessToken: refreshed.access_token,
      refreshToken: refreshed.refresh_token || tokens.refreshToken,
      expiresAt: Date.now() + refreshed.expires_in * 1000,
    };

    setTokens(c, newTokens);
    return c.json({ success: true, expiresAt: newTokens.expiresAt });
  } catch {
    clearTokens(c);
    return c.json({ error: "Refresh failed" }, 401);
  }
};

/**
 * Logout - clear all tokens
 */
export const logoutHandler = (c: Context) => {
  clearTokens(c);
  return c.json({ success: true });
};

/**
 * Check session status
 */
export const sessionHandler = async (c: Context) => {
  const accessToken = await getValidAccessToken(c);

  if (!accessToken) {
    return c.json({ authenticated: false });
  }

  const tokens = getTokens(c);
  return c.json({
    authenticated: true,
    expiresAt: tokens?.expiresAt,
  });
};

// ============================================
// Spotify API Proxy Handlers
// ============================================

/**
 * Get current user profile
 */
export const getProfileHandler = async (c: Context) => {
  try {
    const data = await spotifyFetch<SpotifyUser>(c, "/me");

    const response: UserProfileResponse = {
      id: data.id,
      displayName: data.display_name,
      email: data.email,
      product: data.product,
      imageUrl: data.images.length > 0 ? data.images[0].url : null,
      followers: data.followers.total,
    };

    return c.json(response);
  } catch (error) {
    if (error instanceof Error && error.message === "Not authenticated") {
      return c.json({ error: "Not authenticated" }, 401);
    }
    throw error;
  }
};

/**
 * Get user's top tracks
 */
export const getTopTracksHandler = async (c: Context) => {
  const timeRange = c.req.query("time_range") || "long_term";
  const limit = c.req.query("limit") || "30";

  try {
    const data = await spotifyFetch<SpotifyPaginatedResponse<SpotifyTrack>>(
      c,
      `/me/top/tracks?time_range=${timeRange}&limit=${limit}`
    );

    const response: TopTracksResponse = {
      tracks: data.items.map((track) => ({
        id: track.id,
        name: track.name,
        artist: track.artists[0]?.name || "Unknown",
        album: track.album.name,
        albumImage: track.album.images[0]?.url || null,
      })),
    };

    return c.json(response);
  } catch (error) {
    if (error instanceof Error && error.message === "Not authenticated") {
      return c.json({ error: "Not authenticated" }, 401);
    }
    throw error;
  }
};

/**
 * Get user's top artists
 */
export const getTopArtistsHandler = async (c: Context) => {
  const timeRange = c.req.query("time_range") || "long_term";
  const limit = c.req.query("limit") || "50";

  try {
    const data = await spotifyFetch<SpotifyPaginatedResponse<SpotifyArtist>>(
      c,
      `/me/top/artists?time_range=${timeRange}&limit=${limit}`
    );

    const response: TopArtistsResponse = {
      artists: data.items.map((artist) => ({
        id: artist.id,
        name: artist.name,
        genres: artist.genres,
        imageUrl: artist.images[0]?.url || null,
      })),
    };

    return c.json(response);
  } catch (error) {
    if (error instanceof Error && error.message === "Not authenticated") {
      return c.json({ error: "Not authenticated" }, 401);
    }
    throw error;
  }
};

/**
 * Get genre percentages from top artists
 */
export const getGenresHandler = async (c: Context) => {
  try {
    const data = await spotifyFetch<SpotifyPaginatedResponse<SpotifyArtist>>(
      c,
      "/me/top/artists?time_range=long_term&limit=50"
    );

    const keywords = ["indie", "rap", "hip hop", "pop", "afro", "rock", "jazz"];
    const counts: Record<string, number> = {};

    for (const artist of data.items) {
      for (const genre of artist.genres) {
        const lowerGenre = genre.toLowerCase();
        for (const keyword of keywords) {
          if (lowerGenre.includes(keyword)) {
            counts[keyword] = (counts[keyword] || 0) + 1;
          }
        }
      }
    }

    const total = Object.values(counts).reduce((sum, count) => sum + count, 0);

    const percentages: GenrePercentages = {};
    for (const [genre, count] of Object.entries(counts)) {
      percentages[genre] = ((count / total) * 100).toFixed(2);
    }

    return c.json(percentages);
  } catch (error) {
    if (error instanceof Error && error.message === "Not authenticated") {
      return c.json({ error: "Not authenticated" }, 401);
    }
    throw error;
  }
};
