import { AgentFunction } from "@/graphai";
import { get_encoding } from "tiktoken";

export const tokenBoundStringsAgent: AgentFunction<
  {
    inputKey?: string;
    limit?: number;
  },
  {
    content: string;
  }
> = async ({ params, inputs }) => {
  const enc = get_encoding("cl100k_base");
  const contents: Array<string> = inputs[0][params?.inputKey ?? "contents"];
  const limit = params?.limit ?? 5000;
  const addNext = (total: number, index: number): number => {
    const length = enc.encode(contents[index]).length;
    if (total + length < limit && index + 1 < contents.length) {
      return addNext(total + length, index + 1);
    }
    return index + 1;
  };
  const endIndex = addNext(0, 0);
  const content = contents
    .filter((value, index) => {
      return index < endIndex;
    })
    .join("\n");
  return { content, endIndex };
};