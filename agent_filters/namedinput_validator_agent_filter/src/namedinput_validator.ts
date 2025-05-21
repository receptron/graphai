import { AgentFilterFunction } from "graphai";
import Ajv from "ajv";

// export for test
export const agentInputValidator = (inputSchema: any, namedInputs: any, nodeId: string, agentId: string | undefined) => {
  const ajv = new Ajv();
  const validateSchema = ajv.compile(inputSchema);
  if (!validateSchema(namedInputs)) {
    // console.log(validateSchema.errors);
    throw new Error(`${nodeId}(${agentId ?? "func"}) schema not matched`);
  }
  return true;
};

export const namedInputValidatorFilter: AgentFilterFunction = async (context, next) => {
  const { inputSchema, namedInputs } = context;
  const { agentId, nodeId } = context.debugInfo;

  if (inputSchema) {
    if (inputSchema.type !== "array") {
      agentInputValidator(inputSchema, namedInputs || {}, nodeId, agentId);
    }
  }

  return next(context);
};
