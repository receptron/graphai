# chore: add `prepack` and `publishConfig` to all publishable packages

## User Prompt

> npm の publish 時の設定  prepack で yarn build → lib/ 生成 → publishConfig で lib/ が参照される流れです。 を全てで追加できる？
>
> B案（lib/ のまま、prepack と publishConfig だけ追加）で、ブランチを作って進めて。

## Goal

Standardize the publish flow across every workspace package so that:

- `npm publish` / `yarn npm publish` always re-builds the package via `prepack` before packaging, guaranteeing a fresh `lib/` artifact.
- `publishConfig` is set so that scoped packages are published as public without needing the `--access public` flag in the release command.

Keep the existing `lib/` output path (do **not** migrate to `dist/`).

## Scope

Apply to all 33 workspace packages discovered under:

- `packages/*`
- `agents/*`
- `agent_filters/*`
- `llm_agents/*`

## Changes per package.json

1. Add to `scripts`:
   ```json
   "prepack": "yarn build"
   ```
2. Add top-level:
   ```json
   "publishConfig": {
     "access": "public"
   }
   ```

No changes to `main`, `types`, `files`, `directories`, or `tsconfig` — `lib/` stays as the output target.

## Non-goals

- No switch to `dist/`.
- No change to the per-package `build` scripts (some packages use `rm -r lib/* && tsc`, others `tsc`, others `echo nothing`).
- No change to the monorepo release process docs in `CLAUDE.md` beyond what is already accurate (`npm publish --access public` continues to work; `--access public` becomes redundant once `publishConfig` is in place, but is not harmful).

## Validation

- `yarn format`
- `yarn eslint`
- `yarn build`
