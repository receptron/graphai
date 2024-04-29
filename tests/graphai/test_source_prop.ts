import { AgentFunction } from "@/graphai";
import { rejectTest } from "~/utils/runner";

import test from "node:test";

const graphData = {
  nodes: {
    input: {
      agentId: "testAgent",
    },
    test: {
      agentId: "testAgent",
      inputs: ["input"],
    },
    test2: {
      agentId: "testAgent",
      inputs: ["test.hoge"],
    },
  },
};

const testAgent: AgentFunction<Record<never, never>, string> = async () => {
  return "test";
};

test("test source props test", async () => {
  await rejectTest(graphData, "result is not object.", { testAgent });
});
