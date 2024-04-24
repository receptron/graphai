import { rejectTest } from "~/utils/runner";
import { defaultTestAgents } from "~/agents/agents";
import { anonymization } from "~/utils/utils";

import test from "node:test";
import assert from "node:assert";

test("test computed node validation value", async () => {
  const graph_data = anonymization({
    nodes: {
      computed1: {
        agentId: "echoAgent",
      },
      computed2: {
        agentId: "echoAgent",
        inputs: ["dummy"],
      },
    },
  });
  await rejectTest(graph_data, "Inputs not match: NodeId computed2, Inputs: dummy");
});

test("test computed node validation value", async () => {
  const graph_data = anonymization({
    nodes: {
      computed1: {
        agentId: "echoAgent",
        inputs: ["computed2"],
      },
      computed2: {
        agentId: "echoAgent",
        inputs: ["computed1"],
      },
    },
  });
  await rejectTest(graph_data, "No Initial Runnning Node");
});

test("test no initial running node", async () => {
  const graph_data = anonymization({
    nodes: {
      computed1: {
        agentId: "echoAgent",
        inputs: ["computed2"],
      },
      computed2: {
        agentId: "echoAgent",
        inputs: ["computed1"],
      },
    },
  });
  await rejectTest(graph_data, "No Initial Runnning Node");
});

test("test closed loop validation", async () => {
  const graph_data = anonymization({
    nodes: {
      computed1: {
        agentId: "echoAgent",
      },
      computed2: {
        agentId: "echoAgent",
        inputs: ["computed1"],
      },
      computed3: {
        agentId: "echoAgent",
        inputs: ["computed3"],
      },
    },
  });
  await rejectTest(graph_data, "Some nodes are not executed: computed3");
});
