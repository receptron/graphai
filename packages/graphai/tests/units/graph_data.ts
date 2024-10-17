import { graphDataLatestVersion } from "~/common";

export const graph_data = {
  version: graphDataLatestVersion,
  nodes: {
    echo: {
      agent: "echoAgent",
      params: {
        message: "hello",
      },
    },
    bypassAgent: {
      agent: "bypassAgent",
      params: { namedKey: "text" },
      inputs: { text: ":echo" },
    },
    bypassAgent2: {
      agent: "bypassAgent",
      params: { namedKey: "text" },
      inputs: { text: ":bypassAgent" },
    },
  },
};

export const graph_data_passthrough = {
  version: graphDataLatestVersion,
  nodes: {
    echo: {
      agent: "echoAgent",
      params: {
        message: "hello",
      },
    },
    bypassAgent: {
      isResult: true,
      agent: "bypassAgent",
      params: { namedKey: "text" },
      inputs: { text: [":echo"] },
      passThrough: {
        type: "bypass1",
      },
    },
    bypassAgent2: {
      isResult: true,
      agent: "bypassAgent",
      inputs: { text: ":bypassAgent" },
      params: { namedKey: "text" },
      passThrough: {
        type: "bypass2",
      },
    },
  },
};

export const graph_data_passthrough2 = {
  version: graphDataLatestVersion,
  nodes: {
    echo: {
      agent: "echoAgent",
      params: {
        message: "hello",
      },
    },
    bypassAgent: {
      isResult: true,
      agent: "bypassNamedAgent",
      inputs: { echo: ":echo" },
      passThrough: {
        type: "bypass1",
      },
    },
    bypassAgent2: {
      isResult: true,
      agent: "bypassNamedAgent",
      inputs: { bypass: ":bypassAgent" },
      passThrough: {
        type: "bypass2",
      },
    },
  },
};
