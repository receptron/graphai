import { AgentFilterFunction } from "graphai";
import Ajv from "ajv";

// export for test
export const agentInputValidator = (inputSchema: any, namedInputs: any) => {
  const ajv = new Ajv();
  const validateSchema = ajv.compile(inputSchema);
  if (!validateSchema(namedInputs)) {
    // console.log(validateSchema.errors);
    throw new Error("schema not matched");
  }
  return true;
};

export const namedInputValidatorFilter: AgentFilterFunction = async (context, next) => {
  const { inputSchema, namedInputs } = context;
  
  if (inputSchema) {
    if (inputSchema.type !== "array") {
      agentInputValidator(inputSchema, namedInputs || {});
    }
  }

  return next(context);
};
