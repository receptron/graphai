import { anonymization, rejectTest } from "@receptron/test_utils";
import { graphDataLatestVersion } from "../common";

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
        inputs: { text: ":dummy" },
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
        inputs: { text: ":computed2" },
      },
      computed2: {
        agent: "echoAgent",
        inputs: { text: ":computed1" },
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
        inputs: { text: ":computed1" },
      },
      computed3: {
        agent: "echoAgent",
        inputs: { text: ":computed3" },
      },
    },
  });
  await rejectTest(__dirname, graph_data, "Some nodes are not executed: computed3");
});

test("test closed loop validation nested named Inputs", async () => {
  const graph_data = anonymization({
    version: graphDataLatestVersion,
    nodes: {
      computed1: {
        agent: "echoAgent",
      },
      computed2: {
        agent: "echoAgent",
        inputs: { text: ":computed1" },
      },
      computed3: {
        agent: "echoAgent",
        inputs: { text: { item: ":computed3" } },
      },
    },
  });
  await rejectTest(__dirname, graph_data, "Some nodes are not executed: computed3");
});

test("test closed loop validation nested named Inputs", async () => {
  const graph_data = anonymization({
    version: graphDataLatestVersion,
    nodes: {
      computed1: {
        agent: "echoAgent",
      },
      computed2: {
        agent: "echoAgent",
        inputs: { text: ":computed1" },
      },
      computed3: {
        agent: "echoAgent",
        inputs: { text: { item: ["123", { array: [false, ":computed3"] }] } },
      },
    },
  });
  await rejectTest(__dirname, graph_data, "Some nodes are not executed: computed3");
});

test("test closed loop validation nested named Inputs", async () => {
  const graph_data = anonymization({
    version: graphDataLatestVersion,
    nodes: {
      computed1: {
        agent: "echoAgent",
      },
      computed2: {
        agent: "echoAgent",
        inputs: { text: ":computed1" },
      },
      computed3: {
        agent: "echoAgent",
        if: ":computed3",
      },
    },
  });
  await rejectTest(__dirname, graph_data, "Some nodes are not executed: computed3");
});

test("test closed loop validation nested named Inputs", async () => {
  const graph_data = anonymization({
    version: graphDataLatestVersion,
    nodes: {
      computed1: {
        agent: "echoAgent",
      },
      computed2: {
        agent: "echoAgent",
        inputs: { text: ":computed1" },
      },
      computed3: {
        agent: "echoAgent",
        if: ":computed4",
      },
    },
  });
  await rejectTest(__dirname, graph_data, "If not match: NodeId computed3, Inputs: computed4");
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
        inputs: {
          text1: ":staticNode1",
          text2: ":computedNode3",
        },
      },
      computedNode2: {
        agent: "echoAgent",
        inputs: {
          text: ":computedNode1",
        },
      },
      computedNode3: {
        agent: "echoAgent",
        inputs: {
          text: ":computedNode2",
        },
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
        inputs: [],
      },
      computedNode2: {
        agent: "echoAgent",
        inputs: {
          message1: ":computedNode1",
          message2: ":computedNode4",
        },
      },
      computedNode3: {
        agent: "echoAgent",
        inputs: {
          message1: ":computedNode2",
        },
      },
      computedNode4: {
        agent: "echoAgent",
        inputs: {
          message2: ":computedNode3",
        },
      },
    },
  });
  // ToDo: More friendly message to tell user cycle detected
  await rejectTest(__dirname, graphData, "Some nodes are not executed: computedNode2, computedNode3, computedNode4");
});
