"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GraphAILogger = void 0;
const enabledLevels = {
    debug: true,
    info: true,
    log: true,
    warn: true,
    error: true,
};
let customLogger = null;
function setLevelEnabled(level, enabled) {
    enabledLevels[level] = enabled;
}
function setLogger(logger) {
    customLogger = logger;
}
function output(level, ...args) {
    if (!enabledLevels[level])
        return;
    if (customLogger) {
        customLogger(level, ...args);
    }
    else {
        (console[level] || console.log)(...args);
    }
}
function debug(...args) {
    output("debug", ...args);
}
function info(...args) {
    output("info", ...args);
}
function log(...args) {
    output("log", ...args);
}
function warn(...args) {
    output("warn", ...args);
}
function error(...args) {
    output("error", ...args);
}
exports.GraphAILogger = {
    setLevelEnabled,
    setLogger,
    debug,
    info,
    log,
    warn,
    error,
};
