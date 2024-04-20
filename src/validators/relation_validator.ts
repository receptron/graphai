import { GraphData, ComputedNodeData } from "@/type";

export const relationValidator = (data: GraphData) => {
  const nodeIds = Object.keys(data.nodes);

  nodeIds.forEach((nodeId) => {
    const nodeData = data.nodes[nodeId] as ComputedNodeData;
    if (nodeData.inputs) {
      nodeData.inputs.forEach((inputNodeId) => {
        const input = inputNodeId.split(".")[0];
        if (!nodeIds.includes(input)) {
          throw new Error(`Inputs not match: NodeId ${nodeId}, Inputs: ${input}`);
        }
      });
    }
  });
};
