FROM node:22-slim

# Install build & runtime dependencies in one layer
RUN apt-get update && apt-get install -y \
    python3 \
    python-is-python3 \
    make \
    g++ \
    bash \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install dependencies with memory-saving flags
COPY package*.json ./
RUN npm install --legacy-peer-deps --no-audit --no-fund

# Copy source and build
COPY . .
RUN npm run build

# Use Render's preferred port 10000 as a fallback
EXPOSE 10000

ENV NODE_ENV=production

# Use the compiled server
CMD ["node", "server.js"]
