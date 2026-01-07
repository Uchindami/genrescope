import type { ErrorHandler } from "hono";

/**
 * Global error handler for Hono
 * Catches all unhandled errors and returns a consistent JSON response
 */
export const errorHandler: ErrorHandler = (err, c) => {
  console.error(`[Error] ${err.message}`, err.stack);

  const statusCode = c.res.status === 200 ? 500 : c.res.status;

  return c.json(
    {
      success: false,
      message: err.message || "Internal Server Error",
      stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
    },
    statusCode as 500
  );
};
