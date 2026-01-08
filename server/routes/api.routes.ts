import { Hono } from "hono";
import { generateDescriptionHandler } from "../controllers/openai.controller";
import {
  callbackHandler,
  disconnectHandler,
  getGenresHandler,
  getProfileHandler,
  getTopArtistsHandler,
  getTopTracksHandler,
  loginHandler,
  logoutHandler,
  refreshHandler,
  sessionHandler,
} from "../controllers/spotify.controller";

const api = new Hono();

// ============================================
// Spotify OAuth Routes
// ============================================
api.get("/login", loginHandler);
api.get("/callback", callbackHandler);
api.post("/auth/refresh", refreshHandler);
api.post("/auth/logout", logoutHandler);
api.delete("/auth/disconnect", disconnectHandler);
api.get("/auth/session", sessionHandler);

// ============================================
// Spotify API Proxy Routes
// ============================================
api.get("/api/spotify/me", getProfileHandler);
api.get("/api/spotify/top-tracks", getTopTracksHandler);
api.get("/api/spotify/top-artists", getTopArtistsHandler);
api.get("/api/spotify/genres", getGenresHandler);

// ============================================
// OpenAI Routes
// ============================================
api.get("/api/generate-description", generateDescriptionHandler);

export default api;
