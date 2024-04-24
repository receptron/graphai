"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bypassAgent = void 0;
const bypassAgent = async (context) => {
    if (context.inputs.length === 1) {
        return context.inputs[0];
    }
    return context.inputs;
};
exports.bypassAgent = bypassAgent;
