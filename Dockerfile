# Stage 1: Base image for Bun
FROM oven/bun:1 AS base
WORKDIR /usr/src/app

# Stage 2: Install dependencies
FROM base AS install
RUN mkdir -p /temp/dev
COPY package.json bun.lock /temp/dev/
RUN cd /temp/dev && bun install --frozen-lockfile

# Stage 3: Build frontend with Rsbuild
FROM base AS build
COPY --from=install /temp/dev/node_modules node_modules
COPY . .

ENV NODE_ENV=production

# Variables required for build
ARG PUBLIC_SUPABASE_URL
ARG PUBLIC_SUPABASE_PUBLISHABLE_KEY

# Make them available during build time
ENV PUBLIC_SUPABASE_URL=$PUBLIC_SUPABASE_URL
ENV PUBLIC_SUPABASE_PUBLISHABLE_KEY=$PUBLIC_SUPABASE_PUBLISHABLE_KEY
RUN bun run build

# Stage 4: Release (Final Image)
FROM base AS release

# Copy node_modules for runtime
COPY --from=install /temp/dev/node_modules node_modules

# Copy built frontend
COPY --from=build /usr/src/app/dist ./dist

# Copy server files
COPY --from=build /usr/src/app/server ./server
COPY --from=build /usr/src/app/package.json ./package.json

# Copy shared lib files (poster generation uses src/lib/poster)
COPY --from=build /usr/src/app/src/lib ./src/lib

# Expose the server port
EXPOSE 5000/tcp

# Run the Hono server
ENTRYPOINT ["bun", "run", "server/index.ts"]
