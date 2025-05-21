import "dotenv/config";
import { GraphAI } from "../../src";
import * as agents from "~/test_agents";

import test from "node:test";
import assert from "node:assert";

test("test params literal", async () => {
  const graphData = {
    version: 0.5,
    nodes: {
      graphIndex: {
        value: "a",
      },
      message: {
        value: "hello",
      },
      graphData: {
        agent: "lookupDictionaryAgent",
        params: {
          a: {
            version: 0.5,
            nodes: {
              test: {
                isResult: true,
                console: {
                  after: true,
                },
                agent: "copyAgent",
                inputs: {
                  data: "hello",
                  loop: ":message",
                },
              },
            },
          },
        },
        inputs: {
          namedKey: ":graphIndex",
        },
        console: { after: true },
      },
      nested: {
        isResult: true,
        agent: "nestedAgent",
        graph: ":graphData",
        inputs: {
          message: ":message",
        },
      },
    },
  };

  const graphai = new GraphAI(graphData, {
    ...agents,
  });
  const result = await graphai.run();
  console.log(JSON.stringify(result, null, 2));

  assert.deepStrictEqual(result, {
    nested: {
      test: {
        data: "hello",
        loop: "hello",
      },
    },
  });
});
