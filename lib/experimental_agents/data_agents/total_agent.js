"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.totalAgent = void 0;
const totalAgent = async ({ inputs }) => {
    return inputs.reduce((result, input) => {
        Object.keys(input).forEach((key) => {
            const value = input[key];
            if (result[key]) {
                result[key] += value;
            }
            else {
                result[key] = value;
            }
        });
        return result;
    }, {});
};
exports.totalAgent = totalAgent;
