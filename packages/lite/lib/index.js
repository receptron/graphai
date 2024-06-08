"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = exports.computed = void 0;
const computed = async (nodes, func) => {
    const inputs = await Promise.all(nodes);
    return func(...inputs);
};
exports.computed = computed;
class Logger {
    constructor(options) {
        this.logs = [];
        this.result = {};
        this.verbose = options.verbose ?? false;
        this.recordInputs = options.recordInputs ?? false;
        this.recordOutput = options.recordOutput ?? false;
        this.startTime = Date.now();
    }
    async computed(nodes, func, options = { name: "no name" }) {
        const inputs = await Promise.all(nodes);
        const startTime = Date.now();
        const logStart = {
            name: options.name,
            time: Date.now(),
            state: "started",
        };
        if (this.recordInputs) {
            logStart.inputs = inputs;
        }
        this.logs.push(logStart);
        if (this.verbose) {
            console.log(`starting: ${logStart.name} at ${logStart.time - this.startTime}`);
        }
        const output = await func(...inputs);
        const logEnd = {
            name: options.name,
            time: Date.now(),
            state: "completed",
        };
        logEnd.duration = logEnd.time - startTime;
        if (this.recordOutput) {
            logStart.outputs = output;
        }
        this.logs.push(logEnd);
        if (this.verbose) {
            console.log(`complted: ${logEnd.name} at ${logEnd.time - this.startTime}, duration:${logEnd.duration}ms`);
        }
        return output;
    }
}
exports.Logger = Logger;
