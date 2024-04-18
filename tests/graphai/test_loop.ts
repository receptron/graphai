import { graphDataTestRunner } from "~/utils/runner";
import { sleeperAgent, pushAgent, popAgent } from "@/experimental_agents";

import test from "node:test";
import assert from "node:assert";

const graphdata_push = {
  loop: {
    count: 10,
  },
  nodes: {
    array: {
      value: [],
      update: "reducer",
    },
    item: {
      agentId: "sleeper",
      params: {
        duration: 10,
        value: "hello",
      },
    },
    reducer: {
      agentId: "push",
      inputs: ["array", "item"],
    },
  },
};

test("test loop & push", async () => {
  const result = await graphDataTestRunner("test_loop_pop", graphdata_push, { sleeper: sleeperAgent, push: pushAgent });
  assert.deepStrictEqual(result, {
    array: ["hello", "hello", "hello", "hello", "hello", "hello", "hello", "hello", "hello"],
    item: "hello",
    reducer: ["hello", "hello", "hello", "hello", "hello", "hello", "hello", "hello", "hello", "hello"],
  });
});

const graphdata_pop = {
  loop: {
    while: "source",
  },
  nodes: {
    source: {
      value: ["orange", "banana", "lemon"],
      update: "popper.array",
    },
    previous: {
      value: [],
      update: "reducer",
    },
    popper: {
      inputs: ["source"],
      agentId: "pop", // returns { array, item }
    },
    reducer: {
      agentId: "push",
      inputs: ["previous", "popper.item"],
    },
  },
};

test("test loop & pop", async () => {
  const result = await graphDataTestRunner("test_loop_pop", graphdata_pop, { sleeper: sleeperAgent, push: pushAgent, pop: popAgent });
  console.log(result);
  // assert.deepStrictEqual(result.reducer, ["lemon", "banana", "orange"]);
});
