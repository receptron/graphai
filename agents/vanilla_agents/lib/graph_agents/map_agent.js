"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapAgent = void 0;
const graphai_1 = require("graphai");
const mapAgent = async ({ params, namedInputs, agents, log, taskManager, graphData, agentFilters, debugInfo, config }) => {
    if (taskManager) {
        const status = taskManager.getStatus();
        (0, graphai_1.assert)(status.concurrency > status.running, `mapAgent: Concurrency is too low: ${status.concurrency}`);
    }
    (0, graphai_1.assert)(!!namedInputs.rows, "mapAgent: rows property is required in namedInput");
    (0, graphai_1.assert)(!!graphData, "mapAgent: graph is required");
    const rows = namedInputs.rows.map((item) => item);
    if (params.limit && params.limit < rows.length) {
        rows.length = params.limit; // trim
    }
    const resultAll = params.resultAll ?? false;
    const { nodes } = graphData;
    const nestedGraphData = { ...graphData, nodes: { ...nodes }, version: graphai_1.graphDataLatestVersion }; // deep enough copy
    const nodeIds = Object.keys(namedInputs);
    nodeIds.forEach((nodeId) => {
        const mappedNodeId = nodeId === "rows" ? "row" : nodeId;
        if (nestedGraphData.nodes[mappedNodeId] === undefined) {
            // If the input node does not exist, automatically create a static node
            nestedGraphData.nodes[mappedNodeId] = { value: namedInputs[nodeId] };
        }
        else {
            // Otherwise, inject the proper data here (instead of calling injectTo method later)
            nestedGraphData.nodes[mappedNodeId]["value"] = namedInputs[nodeId];
        }
    });
    try {
        if (nestedGraphData.version === undefined && debugInfo.version) {
            nestedGraphData.version = debugInfo.version;
        }
        const graphs = rows.map((row) => {
            const graphAI = new graphai_1.GraphAI(nestedGraphData, agents || {}, {
                taskManager,
                agentFilters: agentFilters || [],
                config,
            });
            graphAI.injectValue("row", row, "__mapAgent_inputs__");
            return graphAI;
        });
        const runs = graphs.map((graph) => {
            return graph.run(resultAll);
        });
        const results = await Promise.all(runs);
        const nodeIds = Object.keys(results[0]);
        // assert(nodeIds.length > 0, "mapAgent: no return values (missing isResult)");
        const compositeResult = nodeIds.reduce((tmp, nodeId) => {
            tmp[nodeId] = results.map((result) => {
                return result[nodeId];
            });
            return tmp;
        }, {});
        if (log) {
            const logs = graphs.map((graph, index) => {
                return graph.transactionLogs().map((log) => {
                    log.mapIndex = index;
                    return log;
                });
            });
            log.push(...logs.flat());
        }
        return compositeResult;
    }
    catch (error) {
        if (error instanceof Error) {
            return {
                onError: {
                    message: error.message,
                    error,
                },
            };
        }
        throw error;
    }
};
exports.mapAgent = mapAgent;
const mapAgentInfo = {
    name: "mapAgent",
    agent: exports.mapAgent,
    mock: exports.mapAgent,
    samples: [
        {
            inputs: {
                rows: [1, 2],
            },
            params: {},
            result: {
                test: [[1], [2]],
            },
            graph: {
                nodes: {
                    test: {
                        agent: "bypassAgent",
                        inputs: [":row"],
                        isResult: true,
                    },
                },
            },
        },
        {
            inputs: {
                rows: ["apple", "orange", "banana", "lemon", "melon", "pineapple", "tomato"],
            },
            params: {},
            graph: {
                nodes: {
                    node2: {
                        agent: "stringTemplateAgent",
                        params: {
                            template: "I love ${0}.",
                        },
                        inputs: [":row"],
                        isResult: true,
                    },
                },
            },
            result: {
                node2: ["I love apple.", "I love orange.", "I love banana.", "I love lemon.", "I love melon.", "I love pineapple.", "I love tomato."],
            },
        },
        {
            inputs: {
                rows: [1, 2],
            },
            params: { resultAll: true },
            result: {
                test: [[1], [2]],
                row: [1, 2],
            },
            graph: {
                nodes: {
                    test: {
                        agent: "bypassAgent",
                        inputs: [":row"],
                    },
                },
            },
        },
        {
            inputs: {
                rows: [1, 2],
            },
            params: { resultAll: true },
            result: {
                test: [[1], [2]],
                map: [
                    {
                        test: [[[1]], [[1]]],
                    },
                    {
                        test: [[[2]], [[2]]],
                    },
                ],
                row: [1, 2],
            },
            graph: {
                nodes: {
                    test: {
                        agent: "bypassAgent",
                        inputs: [":row"],
                    },
                    map: {
                        agent: "mapAgent",
                        inputs: { rows: [":test", ":test"] },
                        graph: {
                            nodes: {
                                test: {
                                    isResult: true,
                                    agent: "bypassAgent",
                                    inputs: [":row"],
                                },
                            },
                        },
                    },
                },
            },
        },
    ],
    description: "Map Agent",
    category: ["graph"],
    author: "Receptron team",
    repository: "https://github.com/receptron/graphai",
    license: "MIT",
};
exports.default = mapAgentInfo;
