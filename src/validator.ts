import { GraphData } from "@/type";

import { graphNodesValidate } from "@/validators/graph_data_validator";
import { staticNodeValidator } from "@/validators/static_node_validator";
import { computedNodeValidator } from "@/validators/computed_node_validator";
import { relationValidator } from "@/validators/relation_validator";
import { agentValidator } from "@/validators/agent_validator";

export const validateGraphData = (data: GraphData, agentIds: string[]) => {
  graphNodesValidate(data);
  const computedNodeIds: string[] = [];
  const staticNodeIds: string[] = [];
  const graphAgentIds = new Set<string>();
  Object.keys(data.nodes).forEach((nodeId) => {
    const node = data.nodes[nodeId];
    const isStaticNode = "value" in node;
    const agentId = isStaticNode ? "" : node.agentId;
    isStaticNode && staticNodeValidator(node) && staticNodeIds.push(nodeId);
    !isStaticNode && computedNodeValidator(node) && computedNodeIds.push(nodeId) && graphAgentIds.add(agentId);
  });
  agentValidator(graphAgentIds, new Set<string>(agentIds));
  relationValidator(data, staticNodeIds, computedNodeIds);

  return true;
};
