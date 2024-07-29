"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.streamAgentFilterGenerator = void 0;
const streamAgentFilterGenerator = (callback) => {
    const streamAgentFilter = async (context, next) => {
        if (context.debugInfo.isResult && context.filterParams.streamTokenCallback) {
            context.filterParams.streamTokenCallback = (data) => {
                callback(context, data);
            };
        }
        return next(context);
    };
    return streamAgentFilter;
};
exports.streamAgentFilterGenerator = streamAgentFilterGenerator;
