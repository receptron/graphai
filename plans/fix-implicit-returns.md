# The last two implicit returns, and `noImplicitReturns` (#1378)

## What is left of #1378

#1378 found three functions that fall off the end without returning a value. #1381 fixed the one
that mattered most — an agent declaring `number[][]` and returning `undefined` is a contract the
engine trusts, and it now throws instead. The other two are both in
`packages/agentdoc/src/agentdoc.ts`, and with them written the flag can go into
`config/tsconfig.base.json` and keep all three fixed.

## The two sites, and why `""` is the right answer for both

- **`getAgents(agentKeys)`** builds a string out of a list of agent names and falls through when the
  list is empty. Its sibling `getRelatedAgents` in the same file is the same shape and already
  returns `""` for its empty case, so the file answers the question itself.
- **`agentAttribute(key)`** is a chain of `if (key === …)` returns with nothing at the end. Its only
  caller is the `reduce` immediately below it, over a literal list of exactly the keys the chain
  handles, so the fall-through is unreachable from the only thing that calls it.

Both are absorbed today by the `?? ""` in that same `reduce`, which is why neither has ever been
visible in a generated README.

## Behaviour preservation, proved by running the generator

The path that changed only runs for a package with **no** agents, so that is the input the proof
needs. A probe package — a `package.json` and a `lib/index.js` exporting nothing — was built in a
scratch directory and `main()` run against it twice: once with both returns written, once with both
reverted. The two generated READMEs are byte-identical.

The new test is also shown to fail without the fix: with the flag off and the `getAgents` return
removed, it reports `undefined == ''`. With the flag on, the reverted source does not compile at
all, which is the flag doing its job but is not evidence about the test — so the test was checked
with the flag off.

## The one thing that is not purely internal

`getAgents` is exported, and `@receptron/agentdoc` is published. For an in-repo caller `undefined`
and `""` are indistinguishable; for an outside caller of `getAgents([])` the return changes. A
consumer distinguishing the two would be depending on the missing branch, and the function's own
sibling already returns `""`, so this is a refinement rather than a break — but it is a public
surface and worth saying out loud.

## Deliberately not done

`getAgents` is not moved into its own file. It is already pure — a string array in, a string out,
no filesystem, clock or network — and already has a test, so the testability the rule is for is
already there. Moving it would either break the import path its tests and the published package use
or require a re-export, which this repository avoids without a specific reason.

## Verification

- the sweep at zero with `noImplicitReturns` on, over the surface #1383 defines
- the new tests red before the fix, with the expected message, and the package's suite green after
- `eslint` green in `packages/agentdoc` on the tracked files
- the generator run end to end on the no-agents input, output diffed

`yarn build` was not run: every package's `build` script begins with `rm -r lib/*`, and this working
copy holds untracked files under several `lib/` directories. `tsc` with the output redirected
elsewhere covers the same ground, declaration emit included.
