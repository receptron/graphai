"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorLog = exports.callbackLog = exports.timeoutLog = exports.executeLog = exports.injectValueLog = void 0;
const type_1 = require("./type");
const injectValueLog = (log, value) => {
    (log.state = type_1.NodeState.Injected), (log.endTime = Date.now());
    log.result = value;
};
exports.injectValueLog = injectValueLog;
const executeLog = (log, retryCount, transactionId, inputs) => {
    log.state = type_1.NodeState.Executing;
    log.retryCount = retryCount > 0 ? retryCount : undefined;
    log.startTime = transactionId;
    log.inputs = inputs.length > 0 ? inputs : undefined;
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
