"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.agentFilterRunnerBuilder = exports.agentTestRunner = exports.defaultTestContext = exports.getAgentInfo = void 0;
const utils_1 = require("../utils/utils");
const node_assert_1 = __importDefault(require("node:assert"));
const node_test_1 = __importDefault(require("node:test"));
exports.getAgentInfo = utils_1.agentInfoWrapper;
exports.defaultTestContext = {
    debugInfo: {
        nodeId: "test",
        retry: 0,
        verbose: true,
    },
    params: {},
    filterParams: {},
    agents: {},
    log: [],
};
// for agent
const agentTestRunner = async (agentInfo) => {
    const { agent, samples, skipTest } = agentInfo;
    if (samples.length === 0 || skipTest) {
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
// for agent and agent filter.
const agentFilterRunnerBuilder = (__agentFilters) => {
    const agentFilters = __agentFilters;
    const agentFilterRunner = (context, agent) => {
        let index = 0;
        const next = (context) => {
            const agentFilter = agentFilters[index++];
            if (agentFilter) {
                return agentFilter.agent(context, next);
            }
            return agent(context);
        };
        return next(context);
    };
    return agentFilterRunner;
};
exports.agentFilterRunnerBuilder = agentFilterRunnerBuilder;
