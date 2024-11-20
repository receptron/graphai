"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.agentTestRunner = void 0;
const graphai_1 = require("graphai");
const agents = __importStar(require("@graphai/vanilla"));
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
                    forNestedGraph: graph ? {
                        graphData: graph,
                        agents,
                        graphOptions: {},
                    } : undefined,
                });
                node_assert_1.default.deepStrictEqual(actual, result);
            });
        }
    }
};
exports.agentTestRunner = agentTestRunner;
