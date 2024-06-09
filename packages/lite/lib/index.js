"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Conductor = exports.NodeState = exports.computed = void 0;
const computed = async (nodes, func) => {
    const inputs = await Promise.all(nodes);
    return func(...inputs);
};
exports.computed = computed;
var NodeState;
(function (NodeState) {
    NodeState["Executing"] = "executing";
    NodeState["Completed"] = "completed";
})(NodeState || (exports.NodeState = NodeState = {}));
;
;
class Conductor {
    constructor(options) {
        this.logs = [];
        this.result = {};
        this.options = options;
        this.startTime = Date.now();
    }
    log(log, verbose) {
        this.logs.push(log);
        if (verbose) {
            if (log.state == NodeState.Executing) {
                console.log(`${log.state}: ${log.name} waited:${log.waited}ms`);
            }
            else if (log.state == NodeState.Completed) {
                console.log(`${log.state}: ${log.name} duration:${log.duration}ms`);
            }
        }
    }
    async computed(nodes, func, options) {
        // Wait until all the inputs became available
        const inputs = await Promise.all(nodes);
        const { verbose, recordInputs, recordOutput } = { ...this.options, ...options };
        const startTime = Date.now();
        this.log({
            name: options.name,
            time: startTime,
            state: NodeState.Executing,
            waited: startTime - this.startTime,
            inputs: recordInputs ? inputs : undefined,
        }, verbose);
        // Execute the asynchronous task.
        const output = await func(...inputs);
        const time = Date.now();
        this.log({
            name: options.name,
            time,
            state: NodeState.Completed,
            duration: time - startTime,
            output: recordOutput ? output : undefined,
        }, verbose);
        return output;
    }
}
exports.Conductor = Conductor;
