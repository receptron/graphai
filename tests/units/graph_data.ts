export const graph_data = {
  nodes: {
    echo: {
      agentId: "echoAgent",
      params: {
        message: "hello",
      },
    },
    bypassAgent: {
      agentId: "bypassAgent",
      inputs: ["echo"],
    },
    bypassAgent2: {
      agentId: "bypassAgent",
      inputs: ["bypassAgent"],
    },
  },
};

export const graph_injection_data = {
  nodes: {
    echo: {
      agentId: "echoAgent",
    },
    bypassAgent: {
      agentId: "injectAgent",
      inputs: ["echo"],
    },
    bypassAgent2: {
      agentId: "bypassAgent",
      inputs: ["bypassAgent"],
    },
  },
};
