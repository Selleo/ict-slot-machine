FROM node:21-slim AS base

RUN apt-get update
RUN apt-get install python3 make g++ -y
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
COPY ./src /app/src
COPY ./client /app/client
COPY ./client /app/client
COPY ./.env /app/.env
COPY ./index.html /app/index.html
COPY ./package.json /app/package.json
COPY ./pnpm-lock.yaml /app/pnpm-lock.yaml
COPY ./vite.config.js /app/vite.config.js
WORKDIR /app

FROM base AS prod-deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile


FROM base AS build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run build

FROM base
COPY --from=prod-deps /app/node_modules /app/node_modules
COPY --from=build /app/dist /app/dist
EXPOSE 8080 3000
CMD ["pnpm", "run" "start-prod"]
