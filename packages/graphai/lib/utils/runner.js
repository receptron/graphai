"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.agentFilterRunnerBuilder = void 0;
// for test and server.
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
