# The three remaining cheap type-checking flags (#1383)

## What changes

`config/tsconfig.base.json` gains `noUnusedLocals`, `noUnusedParameters` and `noImplicitOverride`.
They are the mechanical three of the four #1377 costed and left for separate decisions.

Nine sites change to satisfy them:

- eight unused parameters renamed to the `__` prefix this repository already uses — two each in
  `agent_filters/stream_agent_filter/src/console.ts` and `.../src/node.ts`, one in
  `llm_agents/token_bound_string_agent/src/token_bound_string_agent.ts`, and three in
  `packages/agent_filters/tests/express/` (`agent_dispatcher.ts`, `graph_sample.ts`, `hello.ts`)
- one `override` keyword on the `TaskManager` test double in
  `packages/graphai/tests/units/test_result.ts`

`noUnusedLocals` asks for nothing: see #1383 for why, and for the surface correction that made its
cost zero.

## Why the parameters were invisible until now

`@typescript-eslint/no-unused-vars` is already an error in `config/eslint.config.base.mjs`, but its
`args` option is unset and so defaults to `"after-used"` — an unused parameter is reported only when
no later parameter is used. All eight sites are the opposite shape, `(context, data)` with `data`
used, so they have been lint-green the whole time. That gap is the reason this flag is worth a line
of config even though the lint rule looks like it covers the same ground.

## Behaviour preservation, proved rather than argued

Every changed file was compiled from `HEAD` and from the working tree and the emitted JavaScript
diffed. The whole diff is eight parameter identifiers and one deleted commented-out line. The
`override` keyword erases, so `test_result.ts` emits byte-identical JavaScript.

Nothing reads any of the renamed names as data: `grep` for each as a string literal across the four
touched packages finds nothing.

## Verification

- the measurement sweep at zero with all three flags on, over the surface #1383 defines
- `noUnusedLocals` measured alone, also zero, which is the one claim the diff cannot show
- `eslint` green in each of the four touched packages
- the suites of the three packages with one: `packages/graphai`'s `test_result.ts`,
  `agent_filters/stream_agent_filter`, `llm_agents/token_bound_string_agent`
- `packages/agent_filters`' express server started and all three changed handlers driven for real
  (`/`, `/mock`, `POST /agents/:agentId`) plus the agent-not-found rejection

`yarn build` was not run: every package's `build` script begins with `rm -r lib/*`, and this working
copy holds untracked files under several `lib/` directories. `tsc` with the output redirected
elsewhere covers the same ground, declaration emit included.
