export const graph_data = {
  version: 0.3,
  nodes: {
    echo: {
      agent: "echoAgent",
      params: {
        message: "hello",
      },
    },
    bypassAgent: {
      agent: "bypassAgent",
      inputs: [":echo"],
    },
    bypassAgent2: {
      agent: "bypassAgent",
      inputs: [":bypassAgent"],
    },
  },
};

export const graph_injection_data = {
  version: 0.3,
  nodes: {
    echo: {
      agent: "echoAgent",
    },
    bypassAgent: {
      agent: "injectAgent",
      inputs: [":echo"],
    },
    bypassAgent2: {
      agent: "bypassAgent",
      inputs: [":bypassAgent"],
    },
  },
};
