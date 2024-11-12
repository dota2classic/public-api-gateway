#FROM oven/bun:latest AS base
#
#FROM base AS build
#
#WORKDIR /usr/src/app
#COPY package.json bun.lockb ./
#RUN bun install --no-lockfile
#COPY . .
#RUN bun run build
#
#FROM base AS production
#
#COPY --from=build /usr/src/app/node_modules ./node_modules
#COPY --from=build /usr/src/app/dist ./dist
#COPY --from=build /usr/src/app/package.json .
#COPY --from=build /usr/src/app/bun.lockb .
#
#CMD ["sh", "-c", "bun", "run", "dist/main.js"]

FROM node:20-alpine3.19 AS base

FROM base AS build

WORKDIR /usr/src/app
COPY package.json ./
RUN yarn install --no-lockfile
COPY . .
RUN yarn build

FROM base AS production

COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/package.json .

CMD ["sh", "-c", "yarn start:prod"]
