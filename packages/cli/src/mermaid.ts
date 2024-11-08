import { GraphData, inputs2dataSources } from "graphai";
import { parseNodeName } from "graphai/lib/utils/utils";

const mapData = (nodeId: string, inputs: any) => {
  inputs2dataSources(inputs).map(source => {
    if (source.nodeId) {
      if (source.propIds) {
        console.log(` ${source.nodeId}(${source.nodeId}) -- ${source.propIds.join(".")} --> ${nodeId}`);
      } else {
        console.log(` ${source.nodeId}(${source.nodeId}) --> ${nodeId}`);
      }
    }
  });
};

export const mermaid = (graphData: GraphData) => {
  console.log("flowchart TD");
  Object.keys(graphData.nodes).forEach((nodeId) => {
    const node = graphData.nodes[nodeId];
    // label / name
    if ("agent" in node) {
      if (node.inputs) {
        mapData(nodeId, node.inputs);
      }
    }
    if ("update" in node) {
      mapData(nodeId, {update: node.update});
    }
  });
};
