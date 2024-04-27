import { AgentFunction } from "@/graphai";
import { graphDataTestRunner } from "~/utils/runner";
import { defaultTestAgents } from "~/utils/agents";

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
      isResult: true,
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
        // HACK until we fix the bug (inputs:["workingMemory", "workingMemory"])
        agentId: "totalAgent",
        inputs: ["workingMemory"],
      },
      mapping: {
        agentId: "mapAgent",
        inputs: ["workingMemory", "workingMemory2"],
        params: {
          injectionTo: "data",
        },
        graph: graphdata_counter,
      },
      merge: {
        agentId: "totalAgent",
        inputs: ["mapping.counter"],
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
    mapping: { counter: [{ v: 10230 }, { v: 10230 }] },
    merge: { v: 20460 },
  });
});
