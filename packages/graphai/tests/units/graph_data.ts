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
      inputs: [":echo"],
    },
    bypassAgent2: {
      agent: "bypassAgent",
      inputs: [":bypassAgent"],
    },
  },
};

export const graph_injection_data = {
  version: graphDataLatestVersion,
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
      inputs: [":echo"],
      passThrough: {
        type: "bypass1",
      },
    },
    bypassAgent2: {
      isResult: true,
      agent: "bypassAgent",
      inputs: [":bypassAgent"],
      params: {
        flat: true,
      },
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

export const graph_data_while = {
  version: graphDataLatestVersion,
  loop: {
    while: ":result",
  },
  nodes: {
    result: {
      value: 3,
      update: ":next",
      isResult: true,
    },
    next: {
      isResult: true,
      agent: "dataSumTemplateAgent",
      inputs: [":result", -1],
    },
  },
};

export const graph_data_do_while = {
  version: graphDataLatestVersion,
  loop: {
    doWhile: ":next",
  },
  nodes: {
    result: {
      value: 3,
      update: ":next",
      isResult: true,
    },
    next: {
      isResult: true,
      agent: "dataSumTemplateAgent",
      inputs: [":result", -1],
    },
  },
};
