import * as agents from "@graphai/vanilla";
import { graphDataTestRunner } from "@receptron/test_utils";

import { graphDataBypass, graphDataBypass2, graphDataBypass3, graphDataBypass4, graphDataBypass5 } from "./graphData";

import test from "node:test";
import assert from "node:assert";

test("test bypass1", async () => {
  const result = await graphDataTestRunner(__dirname, __filename, graphDataBypass, agents);
  // console.log(JSON.stringify(result));
  assert.deepStrictEqual(result, {
    copyAgent2: [
      {
        message: "hello",
      },
    ],
    copyAgent: [
      {
        message: "hello",
      },
    ],
    echo: {
      message: "hello",
    },
  });
});

test("test bypass2", async () => {
  const result = await graphDataTestRunner(__dirname, "test_bypass_2", graphDataBypass2, agents);
  // console.log(JSON.stringify(result));
  assert.deepStrictEqual(result, {
    echo: { message: ["hello", "hello"] },
    mapNode: { copyAgent: ["hello", "hello"] },
    copyAgent2: [["hello", "hello"]],
  });
});

test("test bypass3", async () => {
  const result = await graphDataTestRunner(__dirname, "test_bypass_3", graphDataBypass3, agents);
  // console.log( JSON.stringify(result));
  assert.deepStrictEqual(result, {
    echo: { message: ["hello", "hello"] },
    mapNode: { copyAgent3: ["hello", "hello"] },
    copyAgent4: ["hello", "hello"],
  });
});

test("test bypass4", async () => {
  const result = await graphDataTestRunner(__dirname, "test_bypass_4", graphDataBypass4, agents);
  // console.log( JSON.stringify(result));
  assert.deepStrictEqual(result, {
    echo: { message: ["hello", "hello"] },
    mapNode: {
      copyAgent2: [
        ["hello", "hello"],
        ["hello", "hello"],
      ],
    },
    copyAgent3: [
      ["hello", "hello"],
      ["hello", "hello"],
    ],
  });
});

test("test bypass 5", async () => {
  const result = await graphDataTestRunner(__dirname, __filename, graphDataBypass5, agents);
  // console.log(JSON.stringify(result));
  assert.deepStrictEqual(result, {
    echo: { message: "hello" },
    copyAgent: [{ message: "hello" }, { message: "hello" }, { message: "hello" }],
    copyAgent2: [
      [{ message: "hello" }, { message: "hello" }, { message: "hello" }],
      [{ message: "hello" }, { message: "hello" }, { message: "hello" }],
    ],
    copyAgent3: [
      [
        [{ message: "hello" }, { message: "hello" }, { message: "hello" }],
        [{ message: "hello" }, { message: "hello" }, { message: "hello" }],
      ],
      [
        [{ message: "hello" }, { message: "hello" }, { message: "hello" }],
        [{ message: "hello" }, { message: "hello" }, { message: "hello" }],
      ],
    ],
  });
});
