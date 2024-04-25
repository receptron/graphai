"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.totalAgent = void 0;
const totalAgent = async ({ inputs }) => {
    return inputs.reduce((result, input) => {
        const inputArray = Array.isArray(input) ? input : [input];
        inputArray.forEach((innerInput) => {
            Object.keys(innerInput).forEach((key) => {
                const value = innerInput[key];
                if (result[key]) {
                    result[key] += value;
                }
                else {
                    result[key] = value;
                }
            });
        });
        return result;
    }, {});
};
exports.totalAgent = totalAgent;
