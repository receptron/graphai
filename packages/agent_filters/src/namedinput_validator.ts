import { AgentFilterFunction } from "graphai";
import Ajv from "ajv";

const agentInputValidator = (inputSchema: any, namedInputs: any) => {
  const ajv = new Ajv();
  const validateSchema = ajv.compile(inputSchema);
  if (!validateSchema(namedInputs)) {
    throw new Error("schema not matched");
  }
};

export const namedInputValidatorFilter: AgentFilterFunction = async (context, next) => {
  const { inputSchema, namedInputs } = context;
  if (context.inputSchema) {
    agentInputValidator(inputSchema, namedInputs || {});
  }

  return next(context);
};
