import { AgentFunction, AgentFunctionInfo } from "graphai";
import { get_encoding } from "tiktoken";

const defaultMaxToken = 5000;
const encoder = get_encoding("cl100k_base");

// This agent generate a reference string from a sorted array of strings,
// adding one by one until the token count exceeds the specified limit.
// Parameters:
//  limit?: number; // specifies the maximum token count. The default is 5000.
// Inputs:
//  inputs[0]: Array<string>; // array of string sorted by relevance.
// Returns:
//  { content: string } // reference text
export const tokenBoundStringsAgent: AgentFunction<
  {
    limit?: number;
  },
  {
    content: string;
  },
  Array<string>
> = async ({ params, namedInputs }) => {
  const contents: Array<string> = namedInputs.chunks;
  const limit = params?.limit ?? defaultMaxToken;
  const addNext = (total: number, index: number): Record<string, number> => {
    const length = encoder.encode(contents[index] + "\n").length;
    if (total + length < limit && index + 1 < contents.length) {
      return addNext(total + length, index + 1);
    }
    return { endIndex: index + 1, tokenCount: total };
  };
  const { endIndex, tokenCount } = addNext(0, 0);
  const content = contents
    .filter((value, index) => {
      return index < endIndex;
    })
    .join("\n");
  return { content, tokenCount, endIndex };
};

const tokenBoundStringsAgentInfo: AgentFunctionInfo = {
  name: "tokenBoundStringsAgent",
  agent: tokenBoundStringsAgent,
  mock: tokenBoundStringsAgent,
  inputs: {
    type: "object",
    properties: {
      chunks: {
        type: "array",
        description: "an array of strings",
      },
    },
  },
  output: {
    type: "object",
    properties: {
      content: {
        type: "string",
        description: "token bound string",
      },
      tokenCount: {
        type: "number",
        description: "token count",
      },
      endIndex: {
        type: "number",
        description: "number of chunks",
      },
    },
  },
  samples: [
    {
      inputs: {
        chunks: [
          "Here's to the crazy ones. The misfits. The rebels. The troublemakers.",
          "The round pegs in the square holes. The ones who see things differently.",
          "They're not fond of rules. And they have no respect for the status quo.",
          "You can quote them, disagree with them, glorify or vilify them.",
          "About the only thing you can't do is ignore them.",
          "Because they change things.",
          "They push the human race forward.",
          "And while some may see them as the crazy ones, we see genius.",
          "Because the people who are crazy enough to think they can change the world, are the ones who do.",
        ],
      },
      params: {
        limit: 80,
      },
      result: {
        content:
          "Here's to the crazy ones. The misfits. The rebels. The troublemakers.\n" +
          "The round pegs in the square holes. The ones who see things differently.\n" +
          "They're not fond of rules. And they have no respect for the status quo.\n" +
          "You can quote them, disagree with them, glorify or vilify them.\n" +
          "About the only thing you can't do is ignore them.\n" +
          "Because they change things.",
        tokenCount: 79,
        endIndex: 6,
      },
    },
  ],
  description: "token bound Agent",
  category: [],
  author: "Receptron team",
  repository: "https://github.com/receptron/graphai",
  license: "MIT",
};
export default tokenBoundStringsAgentInfo;
