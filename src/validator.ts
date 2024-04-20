import { GraphData } from "@/type";

import { graphNodesValidate } from "@/validators/graph_data_validator";
import { staticNodeValidator } from "@/validators/static_node_validator";
import { computedNodeValidator } from "@/validators/computed_node_validator";
import { relationValidator } from "@/validators/relation_validator";

export const validateGraphData = (data: GraphData) => {
  graphNodesValidate(data);
  Object.keys(data.nodes).forEach((nodeId) => {
    const node = data.nodes[nodeId];
    const isStaticNode = "value" in data;

    isStaticNode && staticNodeValidator(node);
    !isStaticNode && computedNodeValidator(node);
  });
  relationValidator(data);

  return true;
};
