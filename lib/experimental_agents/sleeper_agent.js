"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sleeperAgent = void 0;
const utils_1 = require("../utils/utils");
const sleeperAgent = async (context) => {
    const { params, inputs } = context;
    await (0, utils_1.sleep)(params.duration);
    return inputs.reduce((result, input) => {
        return { ...result, ...input };
    }, params.result ?? {});
};
exports.sleeperAgent = sleeperAgent;
