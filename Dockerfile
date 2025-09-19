# ---------------------------
# Base image with dependencies
# ---------------------------
FROM node:20-alpine3.19 AS deps
WORKDIR /usr/src/app

# Install only prod deps first (faster caching)
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --production=true

# ---------------------------
# Build image with dev deps
# ---------------------------
FROM node:20-alpine3.19 AS build
WORKDIR /usr/src/app

# Install all deps (prod + dev) for building
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY . .
RUN yarn build

# ---------------------------
# Final production image
# ---------------------------
FROM node:20-alpine3.19 AS production
WORKDIR /usr/src/app

# Copy only prod deps from deps stage
COPY --from=deps /usr/src/app/node_modules ./node_modules

# Copy built app
COPY --from=build /usr/src/app/dist ./dist
COPY package.json yarn.lock ./

CMD ["node", "dist/main"]
