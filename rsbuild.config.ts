import { defineConfig, loadEnv } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";

const { publicVars, rawPublicVars } = loadEnv({ prefixes: ["PUBLIC_"] });

export default defineConfig({
  plugins: [pluginReact()],
  source: {
    entry: {
      index: "./src/main.tsx",
    },
    define: {
      ...publicVars,
      "process.env": JSON.stringify(rawPublicVars),
    },
  },
  resolve: {
    alias: {
      "@": "./src",
    },
  },
  html: {
    template: "./index.html",
  },
  server: {
    port: 3000,
    proxy: {
      // Auth routes
      "/login": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
      "/callback": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
      "/auth": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
      // API routes
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
      // Health check
      "/health": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
    },
  },
  output: {
    polyfill: "usage",
  },
});
