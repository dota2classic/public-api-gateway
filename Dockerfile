FROM oven/bun:latest AS base

FROM base AS build

WORKDIR /usr/src/app
COPY package.json bun.lockb ./
RUN bun install --no-lockfile
COPY . .
RUN bun build

FROM base AS production

COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/package.json .
COPY --from=build /usr/src/app/bun.lockb .

CMD ["bun", "dist/main.js"]
