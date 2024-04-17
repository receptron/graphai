import { AgentFunction } from "@/graphai";
import { graphDataTestRunner } from "~/utils/runner";
import { sleeperAgent } from "@/experimental_agents";
import deepmerge from "deepmerge";

import test from "node:test";
import assert from "node:assert";

const pushAgent: AgentFunction<Record<string, any>, Record<string, any>, Record<string, any>> = async (context) => {
  const { inputs } = context;
  const [array, item] = deepmerge({ inputs }, {}).inputs;
  // TODO: Varidation
  array.push(item);
  return array;
};

const graphdata_push = {
  loop: {
    count: 10,
  },
  nodes: {
    array: {
      value: [],
      next: "reducer",
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

const popAgent: AgentFunction<Record<string, any>, Record<string, any>, Record<string, any>> = async (context) => {
  const { inputs } = context;
  const [array] = deepmerge({ inputs }, {}).inputs;
  // TODO: Varidation
  const item = array.pop();
  return { array, item };
};

const graphdata_pop = {
  loop: {
    count: 5,
    while: "source"
  },
  nodes: {
    source: {
      value: ["orange", "banana", "lemon"],
      next: "popper.array",
    },
    previous: {
      value: [],
      next: "reducer",
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
