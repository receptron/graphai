"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.callbackLog = void 0;
const type_1 = require("graphai/lib/type");
const callbackLog = ({ nodeId, state, inputs, result, errorMessage }) => {
    if (state === type_1.NodeState.Executing) {
        console.log(`${nodeId.padEnd(10)} =>( ${(JSON.stringify(inputs) ?? "").slice(0, 60)}`);
    }
    else if (state === type_1.NodeState.Injected || state == type_1.NodeState.Completed) {
        const shortName = state === type_1.NodeState.Injected ? "=  " : "{} ";
        console.log(`${nodeId.padEnd(10)} ${shortName} ${(JSON.stringify(result) ?? "").slice(0, 60)}`);
    }
    else if (state == type_1.NodeState.Failed) {
        console.log(`${nodeId.padEnd(10)} ERR ${(errorMessage ?? "").slice(0, 60)}`);
    }
    else {
        console.log(`${nodeId.padEnd(10)} ${state}`);
    }
};
exports.callbackLog = callbackLog;
