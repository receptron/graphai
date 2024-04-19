import { GraphData } from "@/type";

import { graphNodesValidate } from "@/validators/graph_data_validator";
import { staticNodeValidator } from "@/validators/static_node_validator";
import { computedNodeValidator } from "@/validators/computed_node_validator";

export const validateGraphData = (data: GraphData) => {
  graphNodesValidate(data);
  Object.keys(data.nodes).forEach((nodeId) => {
    const node = data.nodes[nodeId];
    const isStaticNode = (node.agentId ?? data.agentId) === undefined;
    isStaticNode && staticNodeValidator(node);
    !isStaticNode && computedNodeValidator(node);
  });

  return true;
};
