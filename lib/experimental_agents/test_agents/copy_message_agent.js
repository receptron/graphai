"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.copyMessageAgent = void 0;
const copyMessageAgent = async ({ params }) => {
    return {
        messages: new Array(params.count).fill(undefined).map(() => {
            return params.message;
        }),
    };
};
exports.copyMessageAgent = copyMessageAgent;
