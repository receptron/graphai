"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = exports.computed = void 0;
const computed = async (nodes, func) => {
    const results = await Promise.all(nodes);
    return func(...results);
};
exports.computed = computed;
class Logger {
    constructor(options) {
        this.logs = [];
        this.result = {};
        this.verbose = options.verbose ?? false;
        this.startTime = Date.now();
    }
    async computed(nodes, func, options = { name: 'no name' }) {
        const results = await Promise.all(nodes);
        const startTime = Date.now();
        const logStart = {
            name: options.name,
            time: Date.now(),
            state: "started",
        };
        this.logs.push(logStart);
        if (this.verbose) {
            console.log(`starting: ${logStart.name} at ${logStart.time - this.startTime}`);
        }
        const result = await func(...results);
        const logEnd = {
            name: options.name,
            time: Date.now(),
            state: "completed",
        };
        logEnd.duration = logEnd.time - startTime,
            this.logs.push(logEnd);
        if (this.verbose) {
            console.log(`complted: ${logEnd.name} at ${logEnd.time - this.startTime}, duration:${logEnd.duration}ms`);
        }
        return result;
    }
}
exports.Logger = Logger;
