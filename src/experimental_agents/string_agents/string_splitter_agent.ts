import { AgentFunction } from "@/graphai";

// This agent strip one long string into chunks using following parameters
//
//  chunkSize: number; // default is 2048
//  overlap: number;   // default is 1/8th of chunkSize.
//
// see example
//  tests/agents/test_string_agent.ts
//
const defaultChunkSize = 2048;

export const stringSplitterAgent: AgentFunction<
  {
    chunkSize?: number;
    overlap?: number;
  },
  {
    contents: Array<string>;
  },
  string
> = async ({ params, inputs }) => {
  const source: string = inputs[0];
  const chunkSize = params.chunkSize ?? defaultChunkSize;
  const overlap = params.overlap ?? Math.floor(chunkSize / 8);
  const count = Math.floor(source.length / (chunkSize - overlap)) + 1;
  const contents = new Array(count).fill(undefined).map((_, i) => {
    const startIndex = i * (chunkSize - overlap);
    return source.substring(startIndex, startIndex + chunkSize);
  });

  return { contents, count, chunkSize, overlap };
};
