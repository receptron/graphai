"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorLog = exports.callbackLog = exports.timeoutLog = exports.executeLog = exports.injectValueLog = void 0;
const type_1 = require("./type");
const injectValueLog = (nodeId, retryCount, value) => {
    const log = {
        nodeId,
        retryCount,
        state: type_1.NodeState.Injected,
        startTime: Date.now(),
        endTime: Date.now(),
        result: value,
    };
    return log;
};
exports.injectValueLog = injectValueLog;
const executeLog = (nodeId, retryCount, transactionId, agentId, params, results) => {
    const log = {
        nodeId,
        retryCount: retryCount > 0 ? retryCount : undefined,
        state: type_1.NodeState.Executing,
        startTime: transactionId,
        agentId,
        params,
        inputs: results.length > 0 ? results : undefined,
    };
    return log;
};
exports.executeLog = executeLog;
const timeoutLog = (log) => {
    log.errorMessage = "Timeout";
    log.state = type_1.NodeState.TimedOut;
    log.endTime = Date.now();
};
exports.timeoutLog = timeoutLog;
const callbackLog = (log, result, localLog) => {
    log.endTime = Date.now();
    log.result = result;
    if (localLog.length > 0) {
        log.log = localLog;
    }
};
exports.callbackLog = callbackLog;
const errorLog = (log, errorMessage) => {
    log.state = type_1.NodeState.Failed;
    log.endTime = Date.now();
    log.errorMessage = errorMessage;
};
exports.errorLog = errorLog;
