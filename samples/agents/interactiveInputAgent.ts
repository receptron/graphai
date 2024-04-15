import { AgentFunction } from "@/graphai";
import { select } from "@inquirer/prompts";
import input from "@inquirer/input";

export const interactiveInputSelectAgent: AgentFunction<{ resultKey?: string; isReturnString: boolean }, string | { [x: string]: string }> = async ({
  inputs,
  params,
}) => {
  const { resultKey, isReturnString } = params;
  const choices = Array.from(inputs.keys()).map((k) => {
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

export const interactiveInputTextAgent: AgentFunction<{ resultKey?: string; isReturnString: boolean }, string | { [x: string]: string }> = async ({
  params,
}) => {
  const { resultKey, isReturnString } = params;
  const answer = await input({ message: "Enter message" });
  if (isReturnString) {
    return answer;
  }
  return { [resultKey ?? "answer"]: answer };
};
