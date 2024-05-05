import { graphDataTestRunner } from "~/utils/runner";
import { defaultTestAgents } from "@/utils/test_agents";
import { functionAgent, copyAgent } from "@/experimental_agents";

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
    message: {
      value: "May the force be with you.",
    },
    source: {
      agentId: "functionAgent",
      params: {
        function: (message: string) => {
          return new Foo(message);
        },
      },
      inputs: ["message"],
    },
    destination: {
      agentId: "functionAgent",
      params: {
        function: (foo: Foo) => {
          return foo.getMessage();
        },
      },
      isResult: true,
      inputs: ["source"],
    },
  },
};

test("test any 1", async () => {
  const result = await graphDataTestRunner(__filename, graphdata_any, { functionAgent, copyAgent, ...defaultTestAgents }, () => {}, false);
  assert.deepStrictEqual(result, { destination: "May the force be with you." });
});
