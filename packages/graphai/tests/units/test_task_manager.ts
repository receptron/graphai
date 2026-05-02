import { TaskManager } from "../../src/task_manager";
import { ComputedNode } from "../../src/node";

import test from "node:test";
import assert from "node:assert";

type Stub = { nodeId: string; graphId: string; priority: number; label?: string };
const makeNode = (nodeId: string, priority = 0, graphId = "g1", label?: string): ComputedNode => {
  const stub: Stub = { nodeId, graphId, priority, label };
  return stub as unknown as ComputedNode;
};

const collectExecutionOrder = () => {
  const executed: string[] = [];
  const callback = (node: ComputedNode) => {
    executed.push(node.nodeId);
  };
  return { executed, callback };
};

test("TaskManager runs tasks immediately when concurrency available", () => {
  const tm = new TaskManager(3);
  const { executed, callback } = collectExecutionOrder();

  tm.addTask(makeNode("a"), "g1", callback);
  tm.addTask(makeNode("b"), "g1", callback);

  assert.deepStrictEqual(executed, ["a", "b"]);
  const status = tm.getStatus();
  assert.equal(status.running, 2);
  assert.equal(status.queue, 0);
});

test("TaskManager queues tasks beyond concurrency limit", () => {
  const tm = new TaskManager(2);
  const { executed, callback } = collectExecutionOrder();

  const a = makeNode("a");
  const b = makeNode("b");
  const c = makeNode("c");
  const d = makeNode("d");

  tm.addTask(a, "g1", callback);
  tm.addTask(b, "g1", callback);
  tm.addTask(c, "g1", callback);
  tm.addTask(d, "g1", callback);

  assert.deepStrictEqual(executed, ["a", "b"]);
  assert.equal(tm.getStatus().queue, 2);
  assert.equal(tm.getStatus().running, 2);
});

test("TaskManager dequeues next task on completion (FIFO within same priority)", () => {
  const tm = new TaskManager(2);
  const { executed, callback } = collectExecutionOrder();

  const a = makeNode("a");
  const b = makeNode("b");
  const c = makeNode("c");
  const d = makeNode("d");

  tm.addTask(a, "g1", callback);
  tm.addTask(b, "g1", callback);
  tm.addTask(c, "g1", callback);
  tm.addTask(d, "g1", callback);

  tm.onComplete(a);
  assert.deepStrictEqual(executed, ["a", "b", "c"]);

  tm.onComplete(b);
  assert.deepStrictEqual(executed, ["a", "b", "c", "d"]);

  assert.equal(tm.getStatus().queue, 0);
  assert.equal(tm.getStatus().running, 2);
});

test("TaskManager dequeues higher priority first", () => {
  const tm = new TaskManager(1);
  const { executed, callback } = collectExecutionOrder();

  const a = makeNode("a", 0); // executes immediately
  const low = makeNode("low", 1);
  const high = makeNode("high", 10);
  const mid = makeNode("mid", 5);

  tm.addTask(a, "g1", callback);
  tm.addTask(low, "g1", callback);
  tm.addTask(high, "g1", callback);
  tm.addTask(mid, "g1", callback);

  assert.deepStrictEqual(executed, ["a"]);

  tm.onComplete(a);
  assert.deepStrictEqual(executed, ["a", "high"]);

  tm.onComplete(high);
  assert.deepStrictEqual(executed, ["a", "high", "mid"]);

  tm.onComplete(mid);
  assert.deepStrictEqual(executed, ["a", "high", "mid", "low"]);
});

test("TaskManager preserves FIFO order for tasks with equal priority", () => {
  const tm = new TaskManager(1);
  const { executed, callback } = collectExecutionOrder();

  const first = makeNode("first");
  const a = makeNode("a", 5);
  const b = makeNode("b", 5);
  const c = makeNode("c", 5);

  tm.addTask(first, "g1", callback);
  tm.addTask(a, "g1", callback);
  tm.addTask(b, "g1", callback);
  tm.addTask(c, "g1", callback);

  tm.onComplete(first);
  tm.onComplete(a);
  tm.onComplete(b);

  assert.deepStrictEqual(executed, ["first", "a", "b", "c"]);
});

test("TaskManager isRunning detects running and queued tasks per graphId", () => {
  const tm = new TaskManager(1);
  const { callback } = collectExecutionOrder();

  const a = makeNode("a", 0, "graphA");
  const b = makeNode("b", 0, "graphB"); // queued

  tm.addTask(a, "graphA", callback);
  tm.addTask(b, "graphB", callback);

  assert.equal(tm.isRunning("graphA"), true);
  assert.equal(tm.isRunning("graphB"), true); // queued counts as running per current impl
  assert.equal(tm.isRunning("graphC"), false);

  tm.onComplete(a);
  assert.equal(tm.isRunning("graphA"), false);
  assert.equal(tm.isRunning("graphB"), true);

  tm.onComplete(b);
  assert.equal(tm.isRunning("graphB"), false);
});

test("TaskManager prepareForNesting / restoreAfterNesting bumps capacity", () => {
  const tm = new TaskManager(1);
  const { executed, callback } = collectExecutionOrder();

  tm.addTask(makeNode("a"), "g1", callback);
  assert.equal(tm.getStatus().running, 1);
  assert.equal(tm.getStatus().concurrency, 1);

  // prepareForNesting raises capacity but does not retroactively dequeue.
  // The next addTask is what will succeed because the limit is now higher.
  tm.prepareForNesting();
  assert.equal(tm.getStatus().concurrency, 2);

  tm.addTask(makeNode("b"), "g1", callback);
  assert.deepStrictEqual(executed, ["a", "b"]);

  tm.restoreAfterNesting();
  assert.equal(tm.getStatus().concurrency, 1);
});

test("TaskManager getStatus reports verbose node ids when requested", () => {
  const tm = new TaskManager(1);
  const { callback } = collectExecutionOrder();

  tm.addTask(makeNode("running"), "g1", callback);
  tm.addTask(makeNode("queued"), "g1", callback);

  const status = tm.getStatus(true) as { runningNodes: string[]; queuedNodes: string[] };
  assert.deepStrictEqual(status.runningNodes, ["running"]);
  assert.deepStrictEqual(status.queuedNodes, ["queued"]);
});

test("TaskManager reset clears queue and running set", () => {
  const tm = new TaskManager(1);
  const { callback } = collectExecutionOrder();

  tm.addTask(makeNode("a"), "g1", callback);
  tm.addTask(makeNode("b"), "g1", callback);

  tm.reset();
  assert.equal(tm.getStatus().running, 0);
  assert.equal(tm.getStatus().queue, 0);
  assert.equal(tm.isRunning("g1"), false);
});

// ---- label-based concurrency tests ----

test("TaskManager accepts ConcurrencyConfig object form", () => {
  const tm = new TaskManager({ global: 4, labels: { openai: 2 } });
  const status = tm.getStatus();
  assert.equal(status.concurrency, 4);
});

test("TaskManager enforces per-label concurrency limit", () => {
  const tm = new TaskManager({ global: 10, labels: { openai: 2 } });
  const { executed, callback } = collectExecutionOrder();

  tm.addTask(makeNode("o1", 0, "g1", "openai"), "g1", callback);
  tm.addTask(makeNode("o2", 0, "g1", "openai"), "g1", callback);
  tm.addTask(makeNode("o3", 0, "g1", "openai"), "g1", callback);
  tm.addTask(makeNode("o4", 0, "g1", "openai"), "g1", callback);

  assert.deepStrictEqual(executed, ["o1", "o2"]);
  assert.equal(tm.getStatus().queue, 2);
});

test("TaskManager dispatches different labels independently", () => {
  const tm = new TaskManager({ global: 10, labels: { openai: 2, vertex: 1 } });
  const { executed, callback } = collectExecutionOrder();

  tm.addTask(makeNode("o1", 0, "g1", "openai"), "g1", callback);
  tm.addTask(makeNode("o2", 0, "g1", "openai"), "g1", callback);
  tm.addTask(makeNode("o3", 0, "g1", "openai"), "g1", callback);
  tm.addTask(makeNode("v1", 0, "g1", "vertex"), "g1", callback);
  tm.addTask(makeNode("v2", 0, "g1", "vertex"), "g1", callback);

  // openai limit=2 -> o1,o2 run; o3 queued.
  // vertex limit=1 -> v1 runs; v2 queued.
  assert.deepStrictEqual(executed, ["o1", "o2", "v1"]);
});

test("TaskManager skips head-of-queue when its label is full (HoL skip)", () => {
  const tm = new TaskManager({ global: 10, labels: { openai: 1 } });
  const { executed, callback } = collectExecutionOrder();

  // High-priority openai first -> runs immediately.
  tm.addTask(makeNode("o-high", 10, "g1", "openai"), "g1", callback);
  // Another high-priority openai blocked by label limit -> queued.
  tm.addTask(makeNode("o-blocked", 9, "g1", "openai"), "g1", callback);
  // Low-priority vertex (no limit) -> should be allowed to start because
  // the head of queue (o-blocked) is starved by its label.
  tm.addTask(makeNode("v-low", 1, "g1", "vertex"), "g1", callback);

  assert.deepStrictEqual(executed, ["o-high", "v-low"]);
  assert.equal(tm.getStatus().queue, 1);
});

test("TaskManager unlabeled tasks are not subject to label limits", () => {
  const tm = new TaskManager({ global: 5, labels: { openai: 1 } });
  const { executed, callback } = collectExecutionOrder();

  tm.addTask(makeNode("o1", 0, "g1", "openai"), "g1", callback);
  tm.addTask(makeNode("o2", 0, "g1", "openai"), "g1", callback); // blocked by label
  tm.addTask(makeNode("plain1"), "g1", callback);
  tm.addTask(makeNode("plain2"), "g1", callback);

  // o1 runs, o2 queued, plain1/plain2 run unaffected by label limit.
  assert.deepStrictEqual(executed, ["o1", "plain1", "plain2"]);
});

test("TaskManager labels not configured are not constrained", () => {
  const tm = new TaskManager({ global: 5, labels: { openai: 1 } });
  const { executed, callback } = collectExecutionOrder();

  // 'untracked' label has no entry in labels map -> should run freely up to global.
  tm.addTask(makeNode("u1", 0, "g1", "untracked"), "g1", callback);
  tm.addTask(makeNode("u2", 0, "g1", "untracked"), "g1", callback);
  tm.addTask(makeNode("u3", 0, "g1", "untracked"), "g1", callback);

  assert.deepStrictEqual(executed, ["u1", "u2", "u3"]);
});

test("TaskManager onComplete frees label slot for queued tasks", () => {
  const tm = new TaskManager({ global: 10, labels: { openai: 1 } });
  const { executed, callback } = collectExecutionOrder();

  const o1 = makeNode("o1", 0, "g1", "openai");
  const o2 = makeNode("o2", 0, "g1", "openai");
  const o3 = makeNode("o3", 0, "g1", "openai");

  tm.addTask(o1, "g1", callback);
  tm.addTask(o2, "g1", callback);
  tm.addTask(o3, "g1", callback);
  assert.deepStrictEqual(executed, ["o1"]);

  tm.onComplete(o1);
  assert.deepStrictEqual(executed, ["o1", "o2"]);

  tm.onComplete(o2);
  assert.deepStrictEqual(executed, ["o1", "o2", "o3"]);
});

test("TaskManager honors global limit even when label has capacity", () => {
  const tm = new TaskManager({ global: 2, labels: { openai: 10 } });
  const { executed, callback } = collectExecutionOrder();

  tm.addTask(makeNode("o1", 0, "g1", "openai"), "g1", callback);
  tm.addTask(makeNode("o2", 0, "g1", "openai"), "g1", callback);
  tm.addTask(makeNode("o3", 0, "g1", "openai"), "g1", callback);

  assert.deepStrictEqual(executed, ["o1", "o2"]);
  assert.equal(tm.getStatus().queue, 1);
});

test("TaskManager onComplete dispatches as many newly-eligible tasks as the global limit allows", () => {
  // Scenario: two labels each capped at 1, global capped at 3.
  // Initial state fills openai=1 (running), but vertex tasks are queued because
  // earlier head-of-queue tasks took slots. Releasing a global slot should
  // dispatch multiple queued tasks if their labels allow.
  const tm = new TaskManager({ global: 3, labels: { openai: 1, vertex: 1 } });
  const { executed, callback } = collectExecutionOrder();

  const o1 = makeNode("o1", 5, "g1", "openai");
  const v1 = makeNode("v1", 4, "g1", "vertex");
  const free1 = makeNode("free1", 3, "g1", "free"); // 'free' has no label limit
  const free2 = makeNode("free2", 2, "g1", "free");
  const free3 = makeNode("free3", 1, "g1", "free");

  tm.addTask(o1, "g1", callback);
  tm.addTask(v1, "g1", callback);
  tm.addTask(free1, "g1", callback);
  tm.addTask(free2, "g1", callback);
  tm.addTask(free3, "g1", callback);

  // global=3: o1, v1, free1 running. free2, free3 queued.
  assert.deepStrictEqual(executed, ["o1", "v1", "free1"]);

  tm.onComplete(o1);
  // Frees a global slot AND openai label. Next eligible (priority order): free2.
  // Should dispatch one (global was 2/3, now back to 3/3 after free2 starts).
  assert.deepStrictEqual(executed, ["o1", "v1", "free1", "free2"]);

  tm.onComplete(v1);
  assert.deepStrictEqual(executed, ["o1", "v1", "free1", "free2", "free3"]);
});

test("TaskManager reset clears per-label running state", () => {
  const tm = new TaskManager({ global: 10, labels: { openai: 1 } });
  const { callback } = collectExecutionOrder();

  tm.addTask(makeNode("o1", 0, "g1", "openai"), "g1", callback);
  tm.reset();

  // After reset, a new openai task should be allowed (label slot is free again).
  const after: string[] = [];
  tm.addTask(makeNode("o2", 0, "g1", "openai"), "g1", (n) => after.push(n.nodeId));
  assert.deepStrictEqual(after, ["o2"]);
});
