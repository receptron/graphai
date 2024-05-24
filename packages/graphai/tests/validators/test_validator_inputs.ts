import { rejectTest, anonymization } from "./utils";

import test from "node:test";

test("test computed node validation value", async () => {
  const graph_data = anonymization({
    version: 0.3,
    nodes: {
      computed1: {
        agent: "echoAgent",
      },
      computed2: {
        agent: "echoAgent",
        inputs: [":dummy"],
      },
    },
  });
  await rejectTest(graph_data, "Inputs not match: NodeId computed2, Inputs: dummy");
});

test("test computed node validation value", async () => {
  const graph_data = anonymization({
    version: 0.3,
    nodes: {
      computed1: {
        agent: "echoAgent",
        inputs: [":computed2"],
      },
      computed2: {
        agent: "echoAgent",
        inputs: [":computed1"],
      },
    },
  });
  await rejectTest(graph_data, "No Initial Runnning Node");
});

test("test no initial running node", async () => {
  const graph_data = anonymization({
    version: 0.3,
    nodes: {
      computed1: {
        agent: "echoAgent",
        inputs: [":computed2"],
      },
      computed2: {
        agent: "echoAgent",
        inputs: [":computed1"],
      },
    },
  });
  await rejectTest(graph_data, "No Initial Runnning Node");
});

test("test closed loop validation", async () => {
  const graph_data = anonymization({
    version: 0.3,
    nodes: {
      computed1: {
        agent: "echoAgent",
      },
      computed2: {
        agent: "echoAgent",
        inputs: [":computed1"],
      },
      computed3: {
        agent: "echoAgent",
        inputs: [":computed3"],
      },
    },
  });
  await rejectTest(graph_data, "Some nodes are not executed: computed3");
});
