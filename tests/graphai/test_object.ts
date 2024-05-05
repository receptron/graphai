import { graphDataTestRunner } from "~/utils/runner";
import { defaultTestAgents } from "@/utils/test_agents";
import { functionAgent } from "@/experimental_agents";
import { GraphAI } from "@/graphai";

import test from "node:test";
import assert from "node:assert";

class Foo {
  private message: string;
  constructor(message: string) {
    this.message = message;
  }
  public getMessage() {
    return this.message;
  }
}

const graphdata_any = {
  version: 0.2,
  nodes: {
    source: {
      agentId: "functionAgent",
      params: {
        function: (info: Record<string, any>) => {
          return new Foo("Hello World");
        },
      },
      isResult: true,
    },
  },
};

test("test any 1", async () => {
  const result = await graphDataTestRunner(__filename, graphdata_any, { functionAgent }, () => {}, false);
  console.log(result.source);
  // assert.deepStrictEqual(result, {});
});

