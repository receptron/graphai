import { extractDescriptions } from "../src/agentdoc";

import test from "node:test";
import assert from "node:assert";

test("test getAgents", async () => {
  const inputs = {
    type: "object",
    properties: {
      file: {
        type: "string",
        description: "Name of a single file to read",
      },
      array: {
        type: "array",
        items: {
          type: "string",
        },
        description: "List of multiple file names to read",
      },
    },
    oneOf: [{ required: ["file"] }, { required: ["array"] }],
  };
  const expect = [
    "     - file(string)",
    "       - Name of a single file to read",
    "     - array(array)",
    "       - List of multiple file names to read"
  ].join("\n");
  const result = extractDescriptions(inputs)
  assert.equal(expect, result);
  // console.log(result);
});
