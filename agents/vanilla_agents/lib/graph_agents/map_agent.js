"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapAgent = void 0;
const graphai_1 = require("graphai");
const mapAgent = async ({ params, namedInputs, log, debugInfo, forNestedGraph, onLogCallback }) => {
    (0, graphai_1.assert)(!!forNestedGraph, "Please update graphai to 0.5.19 or higher");
    const { agents, graphData, graphOptions } = forNestedGraph;
    const { taskManager } = graphOptions;
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
    const throwError = params.throwError ?? false;
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
            const graphAI = new graphai_1.GraphAI(nestedGraphData, agents || {}, graphOptions);
            graphAI.injectValue("row", row, "__mapAgent_inputs__");
            // for backward compatibility. Remove 'if' later
            if (onLogCallback) {
                graphAI.onLogCallback = onLogCallback;
            }
            return graphAI;
        });
        const runs = graphs.map((graph) => {
            return graph.run(resultAll);
        });
        const results = await Promise.all(runs);
        const nodeIds = Object.keys(results[0]);
        // assert(nodeIds.length > 0, "mapAgent: no return values (missing isResult)");
        if (log) {
            const logs = graphs.map((graph, index) => {
                return graph.transactionLogs().map((log) => {
                    log.mapIndex = index;
                    return log;
                });
            });
            log.push(...logs.flat());
        }
        if (params.compositeResult) {
            const compositeResult = nodeIds.reduce((tmp, nodeId) => {
                tmp[nodeId] = results.map((result) => {
                    return result[nodeId];
                });
                return tmp;
            }, {});
            return compositeResult;
        }
        return results;
    }
    catch (error) {
        if (error instanceof Error && !throwError) {
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
            result: [{ test: [1] }, { test: [2] }],
            graph: {
                nodes: {
                    test: {
                        agent: "copyAgent",
                        params: { namedKey: "rows" },
                        inputs: { rows: [":row"] },
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
                            template: "I love ${word}.",
                        },
                        inputs: { word: ":row" },
                        isResult: true,
                    },
                },
            },
            result: [
                { node2: "I love apple." },
                { node2: "I love orange." },
                { node2: "I love banana." },
                { node2: "I love lemon." },
                { node2: "I love melon." },
                { node2: "I love pineapple." },
                { node2: "I love tomato." },
            ],
        },
        {
            inputs: {
                rows: [{ fruit: "apple" }, { fruit: "orange" }],
            },
            params: {},
            graph: {
                nodes: {
                    node2: {
                        agent: "stringTemplateAgent",
                        params: {
                            template: "I love ${item}.",
                        },
                        inputs: { item: ":row.fruit" },
                        isResult: true,
                    },
                },
            },
            result: [{ node2: "I love apple." }, { node2: "I love orange." }],
        },
        {
            inputs: {
                rows: [{ fruit: "apple" }, { fruit: "orange" }],
                name: "You",
                verb: "like",
            },
            params: {},
            graph: {
                nodes: {
                    node2: {
                        agent: "stringTemplateAgent",
                        params: {
                            template: "${name} ${verb} ${fruit}.",
                        },
                        inputs: { fruit: ":row.fruit", name: ":name", verb: ":verb" },
                        isResult: true,
                    },
                },
            },
            result: [{ node2: "You like apple." }, { node2: "You like orange." }],
        },
        {
            inputs: {
                rows: [1, 2],
            },
            params: {
                resultAll: true,
            },
            result: [
                {
                    test: [1],
                    row: 1,
                },
                {
                    test: [2],
                    row: 2,
                },
            ],
            graph: {
                nodes: {
                    test: {
                        agent: "copyAgent",
                        params: { namedKey: "rows" },
                        inputs: { rows: [":row"] },
                    },
                },
            },
        },
        {
            inputs: {
                rows: [1, 2],
            },
            params: {
                resultAll: true,
            },
            result: [
                {
                    map: [
                        {
                            test: 1,
                        },
                        {
                            test: 1,
                        },
                    ],
                    row: 1,
                    test: 1,
                },
                {
                    map: [
                        {
                            test: 2,
                        },
                        {
                            test: 2,
                        },
                    ],
                    test: 2,
                    row: 2,
                },
            ],
            graph: {
                nodes: {
                    test: {
                        agent: "copyAgent",
                        params: { namedKey: "row" },
                        inputs: { row: ":row" },
                    },
                    map: {
                        agent: "mapAgent",
                        inputs: { rows: [":test", ":test"] },
                        graph: {
                            nodes: {
                                test: {
                                    isResult: true,
                                    agent: "copyAgent",
                                    params: { namedKey: "row" },
                                    inputs: { row: ":row" },
                                },
                            },
                        },
                    },
                },
            },
        },
        // old response
        {
            inputs: {
                rows: [1, 2],
            },
            params: {
                compositeResult: true,
            },
            result: {
                test: [[1], [2]],
            },
            graph: {
                nodes: {
                    test: {
                        agent: "copyAgent",
                        params: { namedKey: "rows" },
                        inputs: { rows: [":row"] },
                        isResult: true,
                    },
                },
            },
        },
        {
            inputs: {
                rows: ["apple", "orange", "banana", "lemon", "melon", "pineapple", "tomato"],
            },
            params: {
                compositeResult: true,
            },
            graph: {
                nodes: {
                    node2: {
                        agent: "stringTemplateAgent",
                        params: {
                            template: "I love ${row}.",
                        },
                        inputs: { row: ":row" },
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
            params: {
                resultAll: true,
                compositeResult: true,
            },
            result: {
                test: [[1], [2]],
                row: [1, 2],
            },
            graph: {
                nodes: {
                    test: {
                        agent: "copyAgent",
                        params: { namedKey: "rows" },
                        inputs: { rows: [":row"] },
                    },
                },
            },
        },
        {
            inputs: {
                rows: [1, 2],
            },
            params: {
                resultAll: true,
                compositeResult: true,
            },
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
                        agent: "copyAgent",
                        params: { namedKey: "rows" },
                        inputs: { rows: [":row"] },
                    },
                    map: {
                        agent: "mapAgent",
                        inputs: { rows: [":test", ":test"] },
                        params: {
                            compositeResult: true,
                        },
                        graph: {
                            nodes: {
                                test: {
                                    isResult: true,
                                    agent: "copyAgent",
                                    params: { namedKey: "rows" },
                                    inputs: { rows: [":row"] },
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
