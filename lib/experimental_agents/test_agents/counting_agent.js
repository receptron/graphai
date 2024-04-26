"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.countingAgent = void 0;
const countingAgent = async ({ params }) => {
    return {
        list: new Array(params.count).fill(undefined).map((_, i) => {
            return i;
        }),
    };
};
exports.countingAgent = countingAgent;
