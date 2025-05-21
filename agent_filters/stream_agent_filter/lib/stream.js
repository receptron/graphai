"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.streamAgentFilterGenerator = void 0;
const graphai_1 = require("graphai");
const streamAgentFilterGenerator = (callback) => {
    const streamAgentFilter = async (context, next) => {
        if (context.debugInfo.isResult) {
            context.filterParams.streamTokenCallback = (data) => {
                if (context.debugInfo.state === graphai_1.NodeState.Executing) {
                    callback(context, data);
                }
            };
        }
        return next(context);
    };
    return streamAgentFilter;
};
exports.streamAgentFilterGenerator = streamAgentFilterGenerator;
