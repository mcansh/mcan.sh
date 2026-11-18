# Anti-slop provenance

This directory is vendored from [mcansh/oxc-config at `497c8ef`](https://github.com/mcansh/oxc-config/tree/497c8efe1596235be7f55ecd55962b00f44f80ac/src/plugins/anti-slop), which forks [dmmulroy/anti-slop](https://github.com/dmmulroy/anti-slop). The files match that revision byte for byte. Its `UPSTREAM.md` records the upstream revisions, the adopted rule fixes, and the upstream rules that remain unadopted.

The previous copy matched oxc-config `028356e`, the original mcan.sh snapshot, apart from formatting.

This project now enables the incoming rules that do not need the ESLint Stylistic vendor:

- `anti-slop/no-array-filter-map`
- `anti-slop/no-reduce-accumulator-copy`
- `oxc/no-accumulating-spread`

It also enables Oxlint's `curly` rule with `multi-or-nest`, matching `@mcansh/oxc-config`. `anti-slop/require-readable-spacing` and the Effect group stay unadopted.

To update, compare this directory against the newer oxc-config source and copy it when no local edits exist here.
