import { anonymization, rejectTest } from "@receptron/test_utils";
import { graphDataLatestVersion } from "~/common";

import test from "node:test";

test("test computed node validation value", async () => {
  const graph_data = anonymization({
    version: graphDataLatestVersion,
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
  await rejectTest(__dirname, graph_data, "Inputs not match: NodeId computed2, Inputs: dummy");
});

test("test no initial running node", async () => {
  const graph_data = anonymization({
    version: graphDataLatestVersion,
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
  await rejectTest(__dirname, graph_data, "No Initial Runnning Node");
});

test("test closed loop validation", async () => {
  const graph_data = anonymization({
    version: graphDataLatestVersion,
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
  await rejectTest(__dirname, graph_data, "Some nodes are not executed: computed3");
});

test("test cycle detection validation: starts with static node", async () => {
  const graphData = anonymization({
    version: graphDataLatestVersion,
    nodes: {
      staticNode1: {
        value: "static value 1",
      },
      computedNode1: {
        agent: "echoAgent",
        inputs: [":staticNode1", ":computedNode3"],
      },
      computedNode2: {
        agent: "echoAgent",
        inputs: [":computedNode1"],
      },
      computedNode3: {
        agent: "echoAgent",
        inputs: [":computedNode2"],
      },
    },
  });
  // ToDo: More friendly message to tell user cycle detected
  await rejectTest(__dirname, graphData, "No Initial Runnning Node");
});

test("test cycle detection validation: starts with computed node", async () => {
  const graphData = anonymization({
    version: graphDataLatestVersion,
    nodes: {
      computedNode1: {
        agent: "echoAgent",
        inputs: {},
      },
      computedNode2: {
        agent: "echoAgent",
        inputs: { array: [":computedNode1", ":computedNode4"] },
      },
      computedNode3: {
        agent: "echoAgent",
        inputs: { array: [":computedNode2"] },
      },
      computedNode4: {
        agent: "echoAgent",
        inputs: { array: [":computedNode3"] },
      },
    },
  });
  // ToDo: More friendly message to tell user cycle detected
  await rejectTest(__dirname, graphData, "Some nodes are not executed: computedNode2, computedNode3, computedNode4");
});
