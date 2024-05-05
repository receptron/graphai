import { graphDataTestRunner } from "~/utils/runner";
import { defaultTestAgents } from "@/utils/test_agents";
import { functionAgent, copyAgent } from "@/experimental_agents";
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
    destination: {
      agentId: "copyAgent",
      isResult: true,
      inputs: ["source"],
    }
  },
};

test("test any 1", async () => {
  const result = await graphDataTestRunner(__filename, graphdata_any, { functionAgent, copyAgent, ...defaultTestAgents }, () => {}, false);
  const source = result.source as Foo;
  console.log(typeof source);
  console.log(Object.keys(source));
  console.log(source.getMessage());  
  const destination = result.destination as Foo;
  console.log(typeof destination);
  console.log(Object.keys(destination));
  console.log(destination.getMessage());  
  // assert.deepStrictEqual(result, {});
});

