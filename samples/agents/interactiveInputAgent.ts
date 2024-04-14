import { AgentFunction } from "@/graphai";
import { select } from "@inquirer/prompts";

export const interactiveInputSelectAgent: AgentFunction = async ({ inputs }) => {
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
  return { answer };
};
