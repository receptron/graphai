import { GraphData } from "@/type";

import { graphNodesValidate } from "@/validators/graph_data_validator";
import { staticNodeValidator } from "@/validators/static_node_validator";
import { computedNodeValidator } from "@/validators/computed_node_validator";
import { relationValidator } from "@/validators/relation_validator";

export const validateGraphData = (data: GraphData) => {
  graphNodesValidate(data);
  const computedNodeIds: string[] = [];
  const staticNodeIds: string[] = [];
  Object.keys(data.nodes).forEach((nodeId) => {
    const node = data.nodes[nodeId];
    const isStaticNode = (node.agentId ?? data.agentId) === undefined;
    isStaticNode && staticNodeValidator(node) && staticNodeIds.push(nodeId);
    !isStaticNode && computedNodeValidator(node) && computedNodeIds.push(nodeId);
  });
  relationValidator(data, staticNodeIds, computedNodeIds);

  return true;
};
