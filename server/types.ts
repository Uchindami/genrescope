import type { Context } from "hono";

// Environment variables type
export interface Env {
  PORT: string;
  SPOTIFY_CLIENT_ID: string;
  SPOTIFY_CLIENT_SECRET: string;
  SPOTIFY_REDIRECT_URI: string;
  OPENAI_API_KEY: string;
  COOKIE_SECRET: string;
}

// ============================================
// Spotify OAuth Types
// ============================================

export interface SpotifyTokenResponse {
  access_token: string;
  token_type: string;
  scope: string;
  expires_in: number;
  refresh_token: string;
}

export interface TokenData {
  accessToken: string;
  refreshToken: string;
  expiresAt: number; // Unix timestamp
}

// PKCE state stored temporarily during auth flow
export interface PKCEState {
  codeVerifier: string;
  createdAt: number;
}

// ============================================
// Spotify API Types
// ============================================

export interface SpotifyImage {
  url: string;
  height: number | null;
  width: number | null;
}

export interface SpotifyUser {
  id: string;
  display_name: string;
  email: string;
  product: string;
  country: string;
  images: SpotifyImage[];
  followers: {
    total: number;
  };
}

export interface SpotifyArtistSimple {
  id: string;
  name: string;
  href: string;
}

export interface SpotifyArtist {
  id: string;
  name: string;
  genres: string[];
  popularity: number;
  images: SpotifyImage[];
  followers: {
    total: number;
  };
}

export interface SpotifyAlbum {
  id: string;
  name: string;
  images: SpotifyImage[];
  release_date: string;
}

export interface SpotifyTrack {
  id: string;
  name: string;
  artists: SpotifyArtistSimple[];
  album: SpotifyAlbum;
  duration_ms: number;
  popularity: number;
}

export interface SpotifyPaginatedResponse<T> {
  items: T[];
  total: number;
  limit: number;
  offset: number;
  next: string | null;
  previous: string | null;
}

// ============================================
// API Response Types
// ============================================

export interface GenrePercentages {
  [genre: string]: string;
}

export interface UserProfileResponse {
  id: string;
  displayName: string;
  email: string;
  product: string;
  imageUrl: string | null;
  followers: number;
}

export interface TopTracksResponse {
  tracks: Array<{
    id: string;
    name: string;
    artist: string;
    album: string;
    albumImage: string | null;
  }>;
}

export interface TopArtistsResponse {
  artists: Array<{
    id: string;
    name: string;
    genres: string[];
    imageUrl: string | null;
  }>;
}

// ============================================
// Spotify Scopes
// ============================================

export const SPOTIFY_SCOPES = [
  "user-read-email",
  "user-read-private",
  "user-library-read",
  "user-top-read",
  "user-follow-read",
  "user-read-recently-played",
] as const;

// ============================================
// Cookie Configuration
// ============================================

export const COOKIE_CONFIG = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 24 * 30, // 30 days
};

export const TOKEN_COOKIE_NAME = "spotify_tokens";
export const PKCE_COOKIE_NAME = "pkce_verifier";

// Helper type for Hono context
export type AppContext = Context;
