"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.namedInputValidatorFilter = exports.agentInputValidator = void 0;
const ajv_1 = __importDefault(require("ajv"));
// export for test
const agentInputValidator = (inputSchema, namedInputs) => {
    const ajv = new ajv_1.default();
    const validateSchema = ajv.compile(inputSchema);
    if (!validateSchema(namedInputs)) {
        // console.log(validateSchema.errors);
        throw new Error("schema not matched");
    }
    return true;
};
exports.agentInputValidator = agentInputValidator;
const namedInputValidatorFilter = async (context, next) => {
    const { inputSchema, namedInputs } = context;
    if (inputSchema) {
        if (inputSchema.type !== "array") {
            (0, exports.agentInputValidator)(inputSchema, namedInputs || {});
        }
    }
    return next(context);
};
exports.namedInputValidatorFilter = namedInputValidatorFilter;
