"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorLog = exports.callbackLog = exports.timeoutLog = void 0;
const type_1 = require("./type");
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
