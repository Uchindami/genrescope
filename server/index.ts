import { Hono } from "hono";
import { serveStatic } from "hono/bun";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { errorHandler } from "./middleware/error.middleware";
import api from "./routes/api.routes";

const app = new Hono();

// Global middleware
app.use("*", logger());
app.use(
  "*",
  cors({
    origin: ["http://localhost:3000", "https://genrescope.onrender.com"],
    credentials: true,
  })
);

// Global error handler
app.onError(errorHandler);

// Mount API routes
app.route("/", api);

// Health check endpoint
app.get("/health", (c) => c.json({ status: "ok", timestamp: Date.now() }));

// Serve static files from dist
app.use("/*", serveStatic({ root: "./dist" }));

// SPA fallback
app.get("*", serveStatic({ path: "./dist/index.html" }));

// Start server
const port = Number(process.env.PORT) || 5000;

console.log(`🔥 Hono server starting on port ${port}`);

export default {
  port,
  fetch: app.fetch,
};
