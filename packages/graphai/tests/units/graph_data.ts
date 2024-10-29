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
    copyAgent: {
      agent: "copyAgent",
      params: { namedKey: "text" },
      inputs: { text: ":echo" },
    },
    copyAgent2: {
      agent: "copyAgent",
      params: { namedKey: "text" },
      inputs: { text: ":copyAgent" },
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
    copyAgent: {
      isResult: true,
      agent: "copyAgent",
      params: { namedKey: "text" },
      inputs: { text: [":echo"] },
      passThrough: {
        type: "bypass1",
      },
    },
    copyAgent2: {
      isResult: true,
      agent: "copyAgent",
      inputs: { text: ":copyAgent" },
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
    copyAgent: {
      isResult: true,
      agent: "copyAgent",
      inputs: { echo: ":echo" },
      passThrough: {
        type: "bypass1",
      },
    },
    copyAgent2: {
      isResult: true,
      agent: "copyAgent",
      inputs: { bypass: ":copyAgent" },
      passThrough: {
        type: "bypass2",
      },
    },
  },
};
