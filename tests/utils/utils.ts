export const sleep = async (milliseconds: number) => {
  return await new Promise((resolve) => setTimeout(resolve, milliseconds));
};

export const anonymization = (data: Record<string, any>) => {
  return JSON.parse(JSON.stringify(data));
};

export const defaultTestContext = {
  debugInfo: {
    nodeId: "test",
    retry: 0,
    verbose: true,
  },
  params: {},
  agents: {},
  log: [],
};
