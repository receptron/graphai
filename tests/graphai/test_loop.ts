import { AgentFunction } from "@/graphai";
import { graphDataTestRunner } from "~/utils/runner";
import { sleeperAgent } from "@/experimental_agents";
import deepmerge from "deepmerge";

import test from "node:test";
import assert from "node:assert";

const pushAgent: AgentFunction<{}, Record<string, any>, Record<string, any>> = async (context) => {
  const { inputs } = context;
  const [ array, item ] = deepmerge({inputs}, {}).inputs;
  // TODO: Varidation
  array.push(item);
  return array;
};

const popAgent: AgentFunction<{}, Record<string, any>, Record<string, any>> = async (context) => {
  const { inputs } = context;
  const [ array ] = inputs;
  // TODO: Varidation
  const item = array.shift();
  return [array, item];
};

const graphdata_pop = {
  loop: {
    count: 4,
    assign: {
      reducer: "array"
    }
  },
  nodes: {
    array: {
      value: []
    },
    item: {
      agentId: "sleeper",
      params: {
        duration: 10,
        value: "hello"
      }
    },
    reducer: {
      agentId: "push",
      inputs: ["array", "item"]
    }
  }
};

test("test push", async () => {
  const result = await graphDataTestRunner("test_loop", graphdata_pop, { sleeper: sleeperAgent, push: pushAgent, pop: popAgent });
  console.log(result);
  assert.deepStrictEqual(result, {
    array: [ 'hello', 'hello', 'hello' ],
    item: 'hello',
    reducer: [ 'hello', 'hello', 'hello', 'hello' ]
  });
});
