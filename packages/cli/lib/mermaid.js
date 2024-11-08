"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mermaid = void 0;
const graphai_1 = require("graphai");
const mapData = (nodeId, inputs) => {
    (0, graphai_1.inputs2dataSources)(inputs).map(source => {
        if (source.nodeId) {
            if (source.propIds) {
                console.log(` ${source.nodeId}(${source.nodeId}) -- ${source.propIds.join(".")} --> ${nodeId}`);
            }
            else {
                console.log(` ${source.nodeId}(${source.nodeId}) --> ${nodeId}`);
            }
        }
    });
};
const mermaid = (graphData) => {
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
            mapData(nodeId, { update: node.update });
        }
    });
};
exports.mermaid = mermaid;
