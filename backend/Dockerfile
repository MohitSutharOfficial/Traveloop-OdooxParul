FROM node:20-alpine AS builder
WORKDIR /app

# Install all dependencies (including dev) for build
COPY package*.json ./
RUN npm ci

# Copy source and build
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app

# Install only production dependencies
COPY package*.json ./
RUN npm ci --production

# Copy built artifacts
COPY --from=builder /app/dist ./dist

ENV NODE_ENV=production
EXPOSE 3000
CMD ["node", "dist/server.js"]
