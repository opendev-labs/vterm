# Stage 1: Build environment
FROM node:18-slim AS builder

# Install build dependencies for node-pty and native modules
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package files and install ALL dependencies (including dev for building)
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy source and build the React app
COPY . .
RUN npm run build

# Stage 2: Production environment
FROM node:18-slim

# Install runtime dependencies (node-pty needs a shell)
RUN apt-get update && apt-get install -y \
    bash \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy built assets and server files from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/server.js ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/public ./public
COPY --from=builder /app/bin ./bin

EXPOSE 4000

ENV NODE_ENV=production
ENV PORT=4000

# Start the server
CMD ["node", "server.js"]
