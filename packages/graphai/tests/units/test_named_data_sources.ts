import { namedInputs2dataSources, dataSourceNodeIds } from "@/utils/nodeUtils";

import test from "node:test";
import assert from "node:assert";

test("test namedInput", async () => {
  const dataSources = namedInputs2dataSources({ text: [":message"] }, 0.5);
  const pendings = dataSourceNodeIds(dataSources);
  assert.deepStrictEqual(pendings, ["message"]);
});

test("test namedInput array", async () => {
  const dataSources = namedInputs2dataSources({ array: [":abc", ":xyz"] }, 0.5);
  const pendings = dataSourceNodeIds(dataSources);
  assert.deepStrictEqual(pendings, ["abc", "xyz"]);
});

test("test namedInput no colon", async () => {
  const dataSources = namedInputs2dataSources({ text: ["message"] }, 0.5);
  const pendings = dataSourceNodeIds(dataSources);
  assert.deepStrictEqual(pendings, []);
});

test("test namedInput array no colon", async () => {
  const dataSources = namedInputs2dataSources({ array: ["abc", ":xyz"] }, 0.5);
  const pendings = dataSourceNodeIds(dataSources);
  assert.deepStrictEqual(pendings, ["xyz"]);
});

test("test namedInput nested object failed", async () => {
  const dataSources = namedInputs2dataSources({ array: { array: [":abc", ":xyz", { obj: { a: ":aaa", b: ":ccc", c: 1, d: false } }] } }, 0.5);
  const pendings = dataSourceNodeIds(dataSources);
  assert.deepStrictEqual(pendings, ["abc", "xyz", "aaa", "ccc"]);
});

test("test template namedInput", async () => {
  const dataSources = namedInputs2dataSources({ array: ["aaa${:abc} ${:xyz} ${:abc.xyz.$0} "] }, 0.5);
  const pendings = dataSourceNodeIds(dataSources);
  assert.deepStrictEqual(pendings, ["abc", "xyz", "abc"]);
});
