"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.echoForkIndexAgent = void 0;
const echoForkIndexAgent = async ({ debugInfo: { forkIndex } }) => {
    return { forkIndex };
};
exports.echoForkIndexAgent = echoForkIndexAgent;
