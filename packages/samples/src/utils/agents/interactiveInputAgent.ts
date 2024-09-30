import { AgentFunction } from "graphai";
import { select } from "@inquirer/prompts";

export const interactiveInputSelectAgent: AgentFunction<{ resultKey?: string; isReturnString: boolean }, string | { [x: string]: string }> = async ({
  namedInputs,
  params,
}) => {
  const { resultKey, isReturnString } = params;
  const choices = Array.from(namedInputs.array.keys()).map((k) => {
    return {
      name: "input_" + String(k),
      value: String(k),
    };
  });
  console.log(choices);
  const answer = await select({
    message: "which one do you like?",
    choices,
  });
  if (isReturnString) {
    return answer;
  }
  return { [resultKey ?? "answer"]: answer };
};
