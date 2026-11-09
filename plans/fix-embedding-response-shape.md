# stringEmbeddingsAgent: a response it cannot read must fail the node

Issue: [#1378](https://github.com/receptron/graphai/issues/1378)

## What is wrong

`stringEmbeddingsAgent` recognises two response shapes — OpenAI's `{ data: [{ embedding }] }`
and Ollama's `{ embeddings }` — and falls off the end of the function for anything else. The
declared result is `number[][]`, so an unrecognised 200 answer returns `undefined` while the
engine records the node as completed: the graph succeeds, the downstream input disappears,
and nothing is logged. An OpenAI-compatible proxy answering in its own shape is enough to
reach it.

The status check is also unreachable for the answers that need it most. `response.json()`
runs before `if (!response.ok)`, so a gateway that reports 502 in HTML raises a JSON parse
error and the intended status message is only ever seen from a provider whose error body is
itself JSON.

## The change

- Check `response.ok` before parsing, which is already what the sibling `vanillaFetchAgent`
  does.
- Move the shape rule into `src/embedding_response.ts` as `embeddingsOf(body)` — no fetch, no
  clock — which returns the vectors for either provider shape and **throws** naming what it
  received otherwise. A throw is what the engine understands: the node fails, the error
  reaches the caller. The silence is the defect, not the missing return.
- Cover both directions in `tests/agents/test_embedding_agent.ts`: both provider shapes, a
  provider that answered no vectors, and the inputs that must be refused — an unrecognised
  object, `null`, `undefined`, a string, a number, an array, a `data` holding non-numbers.
  The agent-level tests drive it through a stubbed `fetch` so no key and no network is needed.

## Deliberately unchanged

- The text of the existing `HTTP error! status:` message, so anything matching on it still
  matches.
- An empty `data` or `embeddings` array stays a success returning no vectors, as it did
  before. Whether a provider that answered fewer vectors than it was asked for should fail is
  a separate question — `embeddingsOf` is not told how many inputs were sent.
- Ollama's deprecated singular endpoint, `/api/embeddings`, is **not** accepted. It answers 200
  with a singular `{ embedding }` — a running Ollama returns one even for a model it cannot embed
  with at all, which is where the silent success above comes from in practice. It also reads
  `prompt`, where this agent sends `input`, so its answer is to a request that was never made.
  Accepting the key would turn a wrong-endpoint mistake into plausible-looking data; throwing
  names the key, which is the clue the caller needs. `/api/embed` and the OpenAI-compatible
  `/v1/embeddings` both answer 501 with a JSON body on that same server, so the status check
  carries them.
- `mock` is still the agent itself, so `samples` stays empty: filling it would make the agent
  test suite reach the network. That decision belongs to its own change.
- The two `agentdoc` sites in #1378 and the `noImplicitReturns` flag itself are not here.
  Those are shaping, this is a defect.

## Verifying

```
cd agents/vanilla_agents && yarn test
```

Against the pre-change source the two agent-level tests fail — the unreadable-success one with
a missing rejection, the gateway one with a `SyntaxError` from the HTML body — and the
provider-shape tests pass unchanged, which is where the behaviour had to be preserved.
