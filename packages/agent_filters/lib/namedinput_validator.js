"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.namedInputValidatorFilter = void 0;
const ajv_1 = __importDefault(require("ajv"));
const agentInputValidator = (inputSchema, namedInputs) => {
    const ajv = new ajv_1.default();
    const validateSchema = ajv.compile(inputSchema);
    if (!validateSchema(namedInputs)) {
        throw new Error("schema not matched");
    }
};
const namedInputValidatorFilter = async (context, next) => {
    const { inputSchema, namedInputs } = context;
    if (context.inputSchema) {
        agentInputValidator(inputSchema, namedInputs || {});
    }
    return next(context);
};
exports.namedInputValidatorFilter = namedInputValidatorFilter;
