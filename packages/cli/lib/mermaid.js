"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mermaid = void 0;
const utils_1 = require("graphai/lib/utils/utils");
const mermaid = (graphData) => {
    console.log("flowchart TD");
    Object.keys(graphData.nodes).forEach((nodeId) => {
        const node = graphData.nodes[nodeId];
        // label / name
        if ("agent" in node) {
            if (node.inputs) {
                node.inputs.forEach((input) => {
                    const source = (0, utils_1.parseNodeName)(input, graphData.version ?? 0.2);
                    if (source.propIds) {
                        console.log(` ${source.nodeId}(${source.nodeId}) -- ${source.propIds.join(".")} --> ${nodeId}`);
                    }
                    else {
                        console.log(` ${source.nodeId}(${source.nodeId}) --> ${nodeId}`);
                    }
                });
            }
        }
        if ("value" in node) {
            // console.log(node.value);
        }
    });
};
exports.mermaid = mermaid;
