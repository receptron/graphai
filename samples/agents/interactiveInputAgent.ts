import { AgentFunction } from "@/graphai";
import { select } from "@inquirer/prompts";
import input from "@inquirer/input";

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

export const interactiveInputTextAgent: AgentFunction = async ({ inputs }) => {
  const answer = await input({ message: "Enter message" });
  return { answer };
};
