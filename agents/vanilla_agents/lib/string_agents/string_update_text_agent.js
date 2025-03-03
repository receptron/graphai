"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const generator_1 = require("../generator");
const graphai_1 = require("graphai");
const stringUpdateTextGraph = {
    version: graphai_1.graphDataLatestVersion,
    nodes: {
        newText: {
            value: "",
        },
        oldText: {
            value: "",
        },
        isNewText: {
            if: ":newText",
            agent: "copyAgent",
            inputs: {
                text: ":newText",
            },
        },
        isOldText: {
            unless: ":newText",
            agent: "copyAgent",
            inputs: {
                text: ":oldText",
            },
        },
        updatedText: {
            agent: "copyAgent",
            anyInput: true,
            inputs: {
                text: [":isNewText.text", ":isOldText.text"],
            },
        },
        resultText: {
            isResult: true,
            agent: "copyAgent",
            anyInput: true,
            inputs: {
                text: ":updatedText.text.$0",
            },
        },
    },
};
const stringUpdateTextAgent = (0, generator_1.nestedAgentGenerator)(stringUpdateTextGraph, { resultNodeId: "resultText" });
const stringUpdateTextAgentInfo = {
    name: "stringUpdateTextAgent",
    agent: stringUpdateTextAgent,
    mock: stringUpdateTextAgent,
    samples: [
        {
            inputs: { newText: "new", oldText: "old" },
            params: {},
            result: { text: "new" },
        },
        {
            inputs: { newText: "", oldText: "old" },
            params: {},
            result: { text: "old" },
        },
        {
            inputs: {},
            params: {},
            result: { text: "" },
        },
        {
            inputs: { oldText: "old" },
            params: {},
            result: { text: "old" },
        },
    ],
    description: "",
    category: [],
    author: "",
    repository: "",
    tools: [],
    license: "",
    hasGraphData: true,
};
exports.default = stringUpdateTextAgentInfo;
