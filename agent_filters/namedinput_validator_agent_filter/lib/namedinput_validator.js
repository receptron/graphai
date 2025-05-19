"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.namedInputValidatorFilter = exports.agentInputValidator = void 0;
const ajv_1 = __importDefault(require("ajv"));
// export for test
const agentInputValidator = (inputSchema, namedInputs, nodeId, agentId) => {
    const ajv = new ajv_1.default();
    const validateSchema = ajv.compile(inputSchema);
    if (!validateSchema(namedInputs)) {
        // console.log(validateSchema.errors);
        throw new Error(`${nodeId}(${agentId ?? "func"}) schema not matched`);
    }
    return true;
};
exports.agentInputValidator = agentInputValidator;
const namedInputValidatorFilter = async (context, next) => {
    const { inputSchema, namedInputs } = context;
    const { agentId, nodeId } = context.debugInfo;
    if (inputSchema) {
        if (inputSchema.type !== "array") {
            (0, exports.agentInputValidator)(inputSchema, namedInputs || {}, nodeId, agentId);
        }
    }
    return next(context);
};
exports.namedInputValidatorFilter = namedInputValidatorFilter;
