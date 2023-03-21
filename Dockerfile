FROM jarredsumner/bun:edge as deps
WORKDIR /workdir/

COPY package.json bun.lockb ./
RUN bun install

################################################################################

FROM jarredsumner/bun:edge as build
WORKDIR /workdir/

COPY --from=deps /workdir/node_modules /workdir/node_modules

COPY . /workdir/
RUN bun run build

################################################################################

FROM jarredsumner/bun:edge
WORKDIR /workdir/

COPY --from=deps /workdir/node_modules /workdir/node_modules
COPY --from=deps /workdir/package.json /workdir/package.json
COPY --from=deps /workdir/bun.lockb /workdir/bun.lockb
COPY --from=build /workdir/build /workdir/build
COPY --from=build /workdir/public/build /workdir/public/build

EXPOSE 3000
CMD ["bun", "run", "start"]
