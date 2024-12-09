import { GraphData } from "@/type";

import { graphNodesValidator, graphDataValidator } from "@/validators/graph_data_validator";
import { nodeValidator } from "@/validators/nodeValidator";
import { staticNodeValidator } from "@/validators/static_node_validator";
import { computedNodeValidator } from "@/validators/computed_node_validator";
import { relationValidator } from "@/validators/relation_validator";
import { agentValidator } from "@/validators/agent_validator";

export const validateGraphData = (data: GraphData, agentIds: string[]) => {
  graphNodesValidator(data);
  graphDataValidator(data);
  const computedNodeIds: string[] = [];
  const staticNodeIds: string[] = [];
  const graphAgentIds = new Set<string>();
  Object.keys(data.nodes).forEach((nodeId) => {
    const node = data.nodes[nodeId];
    const isStaticNode = !("agent" in node);
    nodeValidator(node);
    const agentId = isStaticNode ? "" : node.agent;
    isStaticNode && staticNodeValidator(node) && staticNodeIds.push(nodeId);
    !isStaticNode && computedNodeValidator(node) && computedNodeIds.push(nodeId) && typeof agentId === "string" && graphAgentIds.add(agentId);
  });
  agentValidator(graphAgentIds, new Set<string>(agentIds));
  relationValidator(data, staticNodeIds, computedNodeIds);

  return true;
};
