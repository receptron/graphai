"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.copy2ArrayAgent = void 0;
const copy2ArrayAgent = async ({ inputs }) => {
    return new Array(10).fill(undefined).map(() => {
        return inputs[0];
    });
};
exports.copy2ArrayAgent = copy2ArrayAgent;
