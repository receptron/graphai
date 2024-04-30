"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.agentTestRunner = exports.defaultTestContext = void 0;
const node_assert_1 = __importDefault(require("node:assert"));
const node_test_1 = __importDefault(require("node:test"));
exports.defaultTestContext = {
    debugInfo: {
        nodeId: "test",
        retry: 0,
        verbose: true,
    },
    params: {},
    agents: {},
    log: [],
};
// for agent
const agentTestRunner = async (agentInfo) => {
    const { agent, samples } = agentInfo;
    if (samples.length === 0) {
        console.log(`test ${agentInfo.name}: No test`);
    }
    else {
        for await (const sampleKey of samples.keys()) {
            (0, node_test_1.default)(`test ${agentInfo.name} ${sampleKey}`, async () => {
                const { params, inputs, result } = samples[sampleKey];
                const actual = await agent({
                    ...exports.defaultTestContext,
                    params,
                    inputs,
                });
                node_assert_1.default.deepStrictEqual(actual, result);
            });
        }
    }
};
exports.agentTestRunner = agentTestRunner;
