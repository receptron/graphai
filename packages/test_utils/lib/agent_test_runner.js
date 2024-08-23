"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.agentTestRunner = void 0;
const graphai_1 = require("graphai");
const node_test_1 = __importDefault(require("node:test"));
const node_assert_1 = __importDefault(require("node:assert"));
// for agent
const agentTestRunner = async (agentInfo) => {
    const { agent, samples, inputs: inputSchema } = agentInfo;
    if (samples.length === 0) {
        console.log(`test ${agentInfo.name}: No test`);
    }
    else {
        for await (const sampleKey of samples.keys()) {
            (0, node_test_1.default)(`test ${agentInfo.name} ${sampleKey}`, async () => {
                const { params, inputs, result, graph } = samples[sampleKey];
                const flatInputs = Array.isArray(inputs) ? inputs : [];
                const namedInputs = Array.isArray(inputs) ? {} : inputs;
                const actual = await agent({
                    ...graphai_1.defaultTestContext,
                    params,
                    inputs: flatInputs,
                    inputSchema,
                    namedInputs,
                    graphData: graph,
                });
                node_assert_1.default.deepStrictEqual(actual, result);
            });
        }
    }
};
exports.agentTestRunner = agentTestRunner;
