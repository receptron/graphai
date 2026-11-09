# The type-checking flags `strict` omits

Closes #1377.

## What changes

Five options added to `config/tsconfig.base.json`, which every package extends. No source file is
touched.

| Flag | What it catches |
| --- | --- |
| `noFallthroughCasesInSwitch` | a `case` that falls through without a `break` |
| `noUncheckedSideEffectImports` | an `import "./typo"` that resolves to nothing |
| `allowUnreachableCode: false` | code after a `return`, usually a merge artifact |
| `allowUnusedLabels: false` | a label nothing jumps to |
| `skipLibCheck: false` | type errors inside a dependency's `.d.ts`, which `true` hides |

## How the cost was measured

`strict: true` switches on none of these, and type errors have no suppression mechanism, so each one
has to be priced before it is switched on rather than after.

Each flag was set **in the config file** and measured with `tsc --noEmit --pretty false`. On the
command line it would not have been measured at all: the file already sets `skipLibCheck` further
down, and in JSON the later key wins, so an inserted one is silently discarded — a measurement that
reads zero because nothing changed looks exactly like a measurement that reads zero because the code
is clean.

The surface measured is the one that is actually enforced, which is wider than `src`:

- the packages whose `build` script runs `tsc` — the two whose build is `echo nothing` are not
  compiled by anything, and already carry type errors under the current config
- the test files each `test` script loads, because `ts-node/register` type-checks at run time. This
  is not a detail: of the flags considered, two were free in `src` and failed only in tests
- the entry points CI runs directly, outside any `build` or `test` script
- `llm_agents/playground`, which is not compiled but whose tests do run in CI

Baseline over that surface is zero, which is what makes a flag's count its cost rather than its
total. The real suites were then run with all five applied, because a clean `tsc` is not a passing
test run.

## Verification

- every flag alone, and all five together, over the full enforced surface
- `yarn test` in the packages with the largest suites, with the flags applied
- the effective configuration read back with `tsc --showConfig`, so a flag that silently failed to
  apply cannot read as a flag that cost nothing

## Not in this change

Everything else `strict` omits was measured too, and the counts are in #1377. The three implicit
`undefined` returns are #1378 — each needs a decision about what the function should do.
