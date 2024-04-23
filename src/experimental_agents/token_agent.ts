import { AgentFunction } from "@/graphai";
import { get_encoding } from "tiktoken";

const defaultMaxToken = 5000;
const encoder = get_encoding("cl100k_base");

// This agent generate a reference string from a sorted array of strings,
// adding one by one until the token count exceeds the specified limit.
// Parameters:
//  inputKey?: string; // specifies the property to read. The default is "contents".
//  limit?: number; // specifies the maximum token count. The default is 5000.
// Inputs:
//  inputs[0].inputKey: Array<string>; // array of string sorted by relevance.
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
> = async ({ params, inputs }) => {
  const contents: Array<string> = inputs[0];
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
