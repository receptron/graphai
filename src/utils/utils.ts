export const sleep = async (milliseconds: number) => {
  return await new Promise((resolve) => setTimeout(resolve, milliseconds));
};

export const parseNodeName = (name: string) => {
  const parts = name.split(".");
  if (parts.length == 1) {
    return { sourceNodeId: parts[0] };
  } else {
    return { sourceNodeId: parts[0], propId: parts[1] };
  }
};
