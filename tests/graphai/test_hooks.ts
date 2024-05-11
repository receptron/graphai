import { AgentFunction } from "@/graphai";
import { graphDataTestRunner } from "~/utils/runner";
import { sleep } from "@/utils/utils";

import test from "node:test";
import assert from "node:assert";

const graphdata_hook = {
  version: 0.3,
  nodes: {
    streamNode: {
      agent: "streamAgent",
      isResult: true,
    },
  },
};


const streamAgent: AgentFunction<{ stream: (data:string)=> void }, string, any> = async ({
  params,
}) => {
  const message = "May the force be with you";
  if (params.stream) {
    message.split('').forEach(async (word: string) => {
      await sleep(10);
      params.stream(word);    
    });
  }
  return message;
};

test("test dispatch", async () => {
  const result = await graphDataTestRunner(__filename, graphdata_hook, {streamAgent}, () => {}, false);
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
