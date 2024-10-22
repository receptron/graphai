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
                if (Array.isArray(node.inputs)) {
                    node.inputs.forEach((input) => {
                        const source = (0, utils_1.parseNodeName)(input);
                        if (source.propIds) {
                            console.log(` ${source.nodeId}(${source.nodeId}) -- ${source.propIds.join(".")} --> ${nodeId}`);
                        }
                        else {
                            console.log(` ${source.nodeId}(${source.nodeId}) --> ${nodeId}`);
                        }
                    });
                }
                else {
                    // LATER: Display the inputName as well.
                    const inputNames = Object.keys(node.inputs);
                    inputNames.forEach((inputName) => {
                        const input = node.inputs[inputName];
                        const source = (0, utils_1.parseNodeName)(input);
                        if (source.propIds) {
                            console.log(` ${source.nodeId}(${source.nodeId}) -- ${source.propIds.join(".")} --> ${nodeId}`);
                        }
                        else {
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
exports.mermaid = mermaid;
