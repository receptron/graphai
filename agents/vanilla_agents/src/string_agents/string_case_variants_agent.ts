import { AgentFunction, AgentFunctionInfo } from "graphai";
import type { GraphAIText } from "@graphai/agent_utils";

export const stringCaseVariantsAgent: AgentFunction<
  { suffix?: string },
  { lowerCamelCase: string; snakeCase: string; kebabCase: string; normalized: string },
  GraphAIText
> = async ({ namedInputs, params }) => {
  const { suffix } = params;
  const normalizedArray = namedInputs.text
    .trim()
    .replace(/[\s-_]+/g, " ")
    .toLowerCase()
    .split(" ");
  if (suffix && normalizedArray[normalizedArray.length - 1] !== suffix) {
    normalizedArray.push(suffix);
  }
  const normalized = normalizedArray.join(" ");

  const lowerCamelCase = normalizedArray
    .map((word, index) => {
      if (index === 0) return word;
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join("");

  const snakeCase = normalized.replace(/\s+/g, "_");
  const kebabCase = normalized.replace(/\s+/g, "-");

  return { lowerCamelCase, snakeCase, kebabCase, normalized };
};

const stringCaseVariantsAgentInfo: AgentFunctionInfo = {
  name: "stringCaseVariantsAgent",
  agent: stringCaseVariantsAgent,
  mock: stringCaseVariantsAgent,
  samples: [
    {
      inputs: { text: "this is a pen" },
      params: {},
      result: {
        kebabCase: "this-is-a-pen",
        lowerCamelCase: "thisIsAPen",
        normalized: "this is a pen",
        snakeCase: "this_is_a_pen",
      },
    },
    {
      inputs: { text: "string case variants" },
      params: { suffix: "agent" },
      result: {
        kebabCase: "string-case-variants-agent",
        lowerCamelCase: "stringCaseVariantsAgent",
        normalized: "string case variants agent",
        snakeCase: "string_case_variants_agent",
      },
    },
  ],
  description: "Format String Cases agent",
  category: ["string"],
  author: "Receptron team",
  repository: "https://github.com/receptron/graphai",
  license: "MIT",
};
export default stringCaseVariantsAgentInfo;
