import { AgentFunction } from "@/graphai";
import { graphDataTestRunner } from "~/utils/runner";
import { defaultTestAgents } from "~/agents/agents";

import test from "node:test";
import assert from "node:assert";

const graphdata_counter = {
  loop: {
    count: 10,
  },
  nodes: {
    data: {
      value: { v: 0 },
      update: "counter",
    },
    counter: {
      agentId: "counterAgent",
      inputs: ["data"],
    },
  },
};

const counterAgent: AgentFunction = async ({ inputs }) => {
  return { v: (inputs[0].v || 0) + 1 };
};

test("test counter", async () => {
  const result = await graphDataTestRunner(__filename, graphdata_counter, {
    counterAgent,
  });
  assert.deepStrictEqual(result, { data: { v: 9 }, counter: { v: 10 } });
});

test("test counter2", async () => {
  const nested_graphdata = {
    loop: {
      count: 10,
    },
    nodes: {
      workingMemory: {
        value: {},
        update: "nested1", // update data from nested1 data
      },
      nested1: {
        agentId: "nestedAgent",
        graph: graphdata_counter,
        params: {
          resultFrom: "counter", // nestedAgent result is counter node result in graphdata_counter
          injectionTo: ["data"], // inject workingMemory data to data node in graphdata_counter
        },
        inputs: ["workingMemory"],
      },
    },
  };

  const result = await graphDataTestRunner(__filename, nested_graphdata, {
    ...defaultTestAgents,
    counterAgent,
  });
  assert.deepStrictEqual(result, { workingMemory: { v: 90 }, nested1: { v: 100 } });
});

test("test counter3", async () => {
  const nested_graphdata = {
    concurrency: 2,
    loop: {
      count: 10,
    },
    nodes: {
      workingMemory: {
        value: {},
        update: "merge", // update data from nested1 data
      },
      workingMemory2: {
        agentId: "totalAgent",
        inputs: ["workingMemory"],
      },
      mapping: {
        agentId: "mapAgent",
        inputs: ["workingMemory", "workingMemory2"],
        params: {
          injectionTo: "receiver",
          resultFrom: "nested1",          
        },
        graph: {
          nodes: {
            receiver: {
              value: {}
            },
            nested1: {
              agentId: "nestedAgent",
              graph: graphdata_counter,
              params: {
                resultFrom: "counter", // nestedAgent result is counter node result in graphdata_counter
                injectionTo: ["data"], // inject workingMemory data to data node in graphdata_counter
              },
              inputs: ["receiver"],
            },
          }
        }
      },
      merge: {
        agentId: "totalAgent",
        inputs: ["mapping.contents"],
      },
    },
  };

  const result = await graphDataTestRunner(__filename, nested_graphdata, {
    ...defaultTestAgents,
    counterAgent,
  });
  assert.deepStrictEqual(result, {
    workingMemory: { v: 10220 },
    workingMemory2: { v: 10220 },
    nested1_0: { v: 10230 },
    nested1_1: { v: 10230 },
    merge: { v: 20460 },
  });
});
