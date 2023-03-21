FROM oven/bun:0.5 as deps
WORKDIR /workdir/

COPY package.json bun.lockb ./
ENV HUSKY=0
RUN bun install

################################################################################

FROM oven/bun:0.5 as build
WORKDIR /workdir/

COPY --from=deps /workdir/node_modules /workdir/node_modules

COPY . /workdir/
RUN bun run build

################################################################################

FROM oven/bun:0.5
WORKDIR /workdir/

COPY --from=deps /workdir/node_modules /workdir/node_modules
COPY --from=deps /workdir/package.json /workdir/package.json
COPY --from=deps /workdir/bun.lockb /workdir/bun.lockb
COPY --from=build /workdir/build /workdir/build
COPY --from=build /workdir/public/build /workdir/public/build

EXPOSE 3000
CMD ["bun", "run", "start"]
