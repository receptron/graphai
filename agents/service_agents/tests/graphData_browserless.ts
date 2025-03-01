import { GraphData } from "graphai";

// Graph for testing content retrieval
export const graphDataContent: GraphData = {
  version: 1,
  nodes: {
    start: {
      agent: "browserlessAgent",
      inputs: {
        url: "https://example.com",
        operation: "content",
      },
      params: {
        type: "json",
      },
    },
    success: {
      agent: "copyAgent",
      inputs: {
        value: {
          nodeId: "start",
        },
      },
      isResult: true,
    },
  },
};

// Graph for testing screenshot
export const graphDataScreenshot: GraphData = {
  version: 1,
  nodes: {
    start: {
      agent: "browserlessAgent",
      inputs: {
        url: "https://example.com",
        operation: "screenshot",
        options: {
          fullPage: true,
          type: "png",
        },
      },
      params: {
        type: "buffer",
      },
    },
    success: {
      agent: "copyAgent",
      inputs: {
        value: {
          nodeId: "start",
        },
      },
      isResult: true,
    },
  },
};

// Graph for testing missing API token
export const graphDataNoToken: GraphData = {
  version: 1,
  nodes: {
    start: {
      agent: "browserlessAgent",
      inputs: {
        url: "https://example.com",
        operation: "content",
      },
    },
    success: {
      agent: "copyAgent",
      inputs: {
        value: {
          nodeId: "start",
        },
      },
      isResult: true,
    },
  },
};

// Graph for testing error response handling
export const graphDataErrorResponse: GraphData = {
  version: 1,
  nodes: {
    start: {
      agent: "browserlessAgent",
      inputs: {
        url: "https://error.example.com",
        operation: "content",
      },
      params: {
        throwError: false,
      },
    },
    error: {
      agent: "copyAgent",
      inputs: {
        value: {
          nodeId: "start",
          propIds: ["onError"],
        },
      },
      isResult: true,
    },
  },
};
