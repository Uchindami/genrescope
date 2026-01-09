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

# Expose the server port
EXPOSE 5000/tcp

# Run the Hono server
ENTRYPOINT ["bun", "run", "server/index.ts"]
