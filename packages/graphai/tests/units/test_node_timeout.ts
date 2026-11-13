import assert from "node:assert";
import test from "node:test";
import { GraphAI, graphDataLatestVersion, strIntentionalError } from "../../src/index";

const activeTimeouts = () => process.getActiveResourcesInfo().filter((type) => type === "Timeout").length;

test("a completed node releases its timeout", async () => {
  const baseline = activeTimeouts();
  const graph = new GraphAI(
    {
      version: graphDataLatestVersion,
      nodes: { out: { agent: async () => "done", timeout: 2000, isResult: true } },
    },
    {},
  );
  assert.deepStrictEqual(await graph.run(), { out: "done" });
  assert.strictEqual(activeTimeouts(), baseline);
});

test("a retry replaces the previous attempt's timeout", async () => {
  const baseline = activeTimeouts();
  let attempts = 0;
  let timeoutsAtRetry = 0;
  const graph = new GraphAI(
    {
      version: graphDataLatestVersion,
      nodes: {
        out: {
          agent: async () => {
            if (++attempts === 1) {
              throw new Error(strIntentionalError);
            }
            timeoutsAtRetry = activeTimeouts();
            return "retried";
          },
          retry: 1,
          timeout: 2000,
          isResult: true,
        },
      },
    },
    {},
  );
  assert.deepStrictEqual(await graph.run(), { out: "retried" });
  assert.strictEqual(attempts, 2);
  assert.strictEqual(timeoutsAtRetry, baseline + 1);
  assert.strictEqual(activeTimeouts(), baseline);
});

test("a running timeout still fires", async () => {
  const graph = new GraphAI(
    {
      version: graphDataLatestVersion,
      nodes: { out: { agent: async () => new Promise<string>(() => {}), timeout: 10 } },
    },
    {},
  );
  await assert.rejects(graph.run(), /Timeout/);
});

test("aborting a graph releases the running node's timeout", async () => {
  const baseline = activeTimeouts();
  let notifyStarted: () => void = () => {};
  const started = new Promise<void>((resolve) => {
    notifyStarted = resolve;
  });
  const graph = new GraphAI(
    {
      version: graphDataLatestVersion,
      nodes: {
        out: {
          agent: async () => {
            notifyStarted();
            return new Promise<string>(() => {});
          },
          timeout: 2000,
        },
      },
    },
    {},
  );
  const running = graph.run();
  const settled = Promise.allSettled([running]);
  await started;
  graph.abort();
  await settled;
  assert.strictEqual(activeTimeouts(), baseline);
});

test("aborting from a retry's execution log does not arm another timeout", async () => {
  const baseline = activeTimeouts();
  const graph = new GraphAI(
    {
      version: graphDataLatestVersion,
      nodes: {
        out: {
          agent: async () => {
            throw new Error(strIntentionalError);
          },
          retry: 1,
          timeout: 2000,
        },
      },
    },
    {},
  );
  graph.onLogCallback = (log) => {
    if (log.state === "executing" && log.retryCount === 1) {
      graph.abort();
    }
  };
  await Promise.allSettled([graph.run()]);
  assert.strictEqual(activeTimeouts(), baseline);
});
