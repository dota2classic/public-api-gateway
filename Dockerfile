FROM node:20-alpine3.19 AS base

FROM base AS build
WORKDIR /usr/src/app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY . .
RUN yarn build

FROM node:20-alpine3.19 AS production
WORKDIR /usr/src/app

COPY package.json yarn.lock ./
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist

CMD ["node", "dist/main"]
