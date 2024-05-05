import { graphDataTestRunner } from "~/utils/runner";
import { defaultTestAgents } from "@/utils/test_agents";
import { functionAgent, copyAgent } from "@/experimental_agents";

import test from "node:test";
import assert from "node:assert";

class Foo {
  public on = (__word: string | undefined) => {};
  constructor() {
  }

  public pushWord(word: string | undefined) {
    this.on(word);
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
          const words = message.split(' ');
          const foo = new Foo();
          const bar = () => {
            setTimeout(() => {
              const word = words.shift();
              foo.pushWord(word);
              if (word) {
                bar();
              }
            }, 200);
          };
          bar();

          return foo;
        },
      },
      inputs: ["message"],
    },
    destination: {
      agentId: "functionAgent",
      params: {
        function: (foo: Foo) => {
          const words = new Array<string>();
          return new Promise((resolve) => {
            foo.on = (word: string | undefined) => {
              if (word) {
                words.push(word);
              } else {
                resolve(words.join(' '));
              }
            }
          });
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
