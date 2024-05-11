import { GraphAI } from "@/graphai";
import { defaultTestAgents } from "@/utils/test_agents";
import { AgentFunction } from "@/graphai";
import { sleep } from "@/utils/utils";

import test from "node:test";
// import assert from "node:assert";

const graphdata_hook = {
  version: 0.3,
  nodes: {
    source: {
      value: "May the force be with you"
    },
    streamNode: {
      agent: "streamAgent",
      params: {
        streamx: "~test_hook",
      },
      isResult: true,
      inputs: [":source"],
    },
  },
};


const streamAgent: AgentFunction<{ stream: (data:Record<string, any>)=> void }, string, string> = async ({
  params, inputs
}) => {
  const [message] = inputs;
  if (params.stream) {
    message.split('').forEach(async (word: string) => {
      await sleep(10);
      params.stream({word});
    });
  }
  return message;
};

const test_hook = (data: Record<string, any>) => {
  console.log(data.word);
}

test("test hook", async () => {
  const graph = new GraphAI(graphdata_hook, { ...defaultTestAgents, streamAgent }, { hooks: { test_hook }});
  const result = await graph.run(false);  
  console.log(result);
  /*
  assert.deepStrictEqual(result, {
    node1: { node1: "output" },
    node2: { port1: { node2: "dispatch" } },
    node3: { node3: "output", node1: "output", node2: "dispatch" },
    node4: { node4: "output", node3: "output", node1: "output", node2: "dispatch" },
    node5: { node5: "output", node4: "output", node3: "output", node1: "output", node2: "dispatch" },
  });
  */
});
