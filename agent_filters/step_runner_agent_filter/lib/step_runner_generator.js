"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stepRunnerGenerator = void 0;
const stepRunnerGenerator = (awaitStep) => {
    const stepRunnerFilter = async (context, next) => {
        const result = await next(context);
        await awaitStep(context, result);
        return result;
    };
    return stepRunnerFilter;
};
exports.stepRunnerGenerator = stepRunnerGenerator;
