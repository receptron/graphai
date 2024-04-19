import { graphDataTestRunner } from "~/utils/runner";

import test from "node:test";
import assert from "node:assert";

test("test invalid 1", async () => {
  const graph_data = JSON.parse(JSON.stringify({}));
  await assert.rejects(
    async () => {
      await graphDataTestRunner(__filename, graph_data, {});
    },
    { name: "Error", message: "Invalid Graph Data: no nodes" },
  );
});
