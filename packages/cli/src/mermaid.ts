import { GraphData } from "graphai";
import { parseNodeName } from "graphai/lib/utils/utils";

export const mermaid = (graphData: GraphData) => {
  console.log("flowchart TD");
  Object.keys(graphData.nodes).forEach((nodeId) => {
    const node = graphData.nodes[nodeId];
    // label / name
    if ("agent" in node) {
      if (node.inputs) {
        if (Array.isArray(node.inputs)) {
          node.inputs.forEach((input) => {
            const source = parseNodeName(input, graphData.version ?? 0.2);
            if (source.propIds) {
              console.log(` ${source.nodeId}(${source.nodeId}) -- ${source.propIds.join(".")} --> ${nodeId}`);
            } else {
              console.log(` ${source.nodeId}(${source.nodeId}) --> ${nodeId}`);
            }
          });
        } else {
          // LATER: Display the inputName as well.
          const inputNames = Object.keys(node.inputs);
          inputNames.forEach((inputName) => {
            const input = (node.inputs as Record<string, any>)[inputName];
            const source = parseNodeName(input, graphData.version ?? 0.2);
            if (source.propIds) {
              console.log(` ${source.nodeId}(${source.nodeId}) -- ${source.propIds.join(".")} --> ${nodeId}`);
            } else {
              console.log(` ${source.nodeId}(${source.nodeId}) --> ${nodeId}`);
            }
          });
        }
      }
    }
    if ("value" in node) {
      // console.log(node.value);
    }
  });
};
