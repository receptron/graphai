"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mermaid = void 0;
const graphai_1 = require("graphai");
const BASE_INDENT = "  ";
const sanitizeNodeId = (nodeId) => {
    return `n_${nodeId.replace(/\./g, "_")}`;
};
const getFullNodeId = (nodeId, parentPath) => {
    return parentPath ? `${parentPath}.${nodeId}` : nodeId;
};
const getIndentLevel = (parentPath) => {
    return parentPath.split(".").filter(Boolean).length;
};
const formatLine = (content, depth = 0) => {
    return BASE_INDENT + BASE_INDENT.repeat(depth) + content;
};
const processConnections = (inputs, targetNodeId, parentPath, state) => {
    const depth = getIndentLevel(parentPath);
    let sources = (0, graphai_1.inputs2dataSources)(inputs);
    if (!Array.isArray(sources)) {
        sources = [sources];
    }
    sources.forEach((source) => {
        if (source.nodeId) {
            const sourceFullId = getFullNodeId(source.nodeId, parentPath);
            const sourceMermaidId = sanitizeNodeId(sourceFullId);
            const targetMermaidId = sanitizeNodeId(targetNodeId);
            const connection = source.propIds
                ? `${sourceMermaidId} -- ${source.propIds.join(".")} --> ${targetMermaidId}`
                : `${sourceMermaidId} --> ${targetMermaidId}`;
            state.lines.push(formatLine(connection, depth));
        }
    });
};
const processNode = (nodeId, node, parentPath, state) => {
    const fullNodeId = getFullNodeId(nodeId, parentPath);
    const mermaidNodeId = sanitizeNodeId(fullNodeId);
    const depth = getIndentLevel(parentPath);
    if ("graph" in node) {
        state.lines.push(formatLine(`subgraph ${mermaidNodeId}[${nodeId}: ${node.agent || ""}]`, depth));
        if (node.graph && typeof node.graph === "object" && node.graph.nodes) {
            Object.entries(node.graph.nodes).forEach(([subNodeId, subNode]) => {
                processNode(subNodeId, subNode, fullNodeId, state);
            });
        }
        state.lines.push(formatLine("end", depth));
        state.nestedGraphNodes.push(mermaidNodeId);
    }
    else if ("agent" in node) {
        state.lines.push(formatLine(`${mermaidNodeId}(${nodeId}<br/>${node.agent})`, depth));
        state.computedNodes.push(mermaidNodeId);
    }
    else {
        state.lines.push(formatLine(`${mermaidNodeId}(${nodeId})`, depth));
        state.staticNodes.push(mermaidNodeId);
    }
    if (node.inputs) {
        processConnections(node.inputs, fullNodeId, parentPath, state);
    }
    if ("update" in node) {
        processConnections({ update: node.update }, fullNodeId, parentPath, state);
    }
};
const addNodeClasses = (state) => {
    if (state.staticNodes.length > 0) {
        state.lines.push(formatLine(`class ${state.staticNodes.join(",")} staticNode`));
    }
    if (state.computedNodes.length > 0) {
        state.lines.push(formatLine(`class ${state.computedNodes.join(",")} computedNode`));
    }
    if (state.nestedGraphNodes.length > 0) {
        state.lines.push(formatLine(`class ${state.nestedGraphNodes.join(",")} nestedGraph`));
    }
};
const mermaid = (graphData) => {
    const state = {
        lines: ["flowchart TD"],
        staticNodes: [],
        computedNodes: [],
        nestedGraphNodes: [],
    };
    Object.entries(graphData.nodes).forEach(([nodeId, node]) => {
        processNode(nodeId, node, "", state);
    });
    addNodeClasses(state);
    console.log(state.lines.join("\n"));
};
exports.mermaid = mermaid;
