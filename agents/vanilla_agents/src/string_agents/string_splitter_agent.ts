import { AgentFunction, AgentFunctionInfo, assert } from "graphai";
import { GraphAIText } from "@graphai/agent_utils";

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
    count: number;
    chunkSize: number;
    overlap: number;
  },
  GraphAIText
> = async ({ params, namedInputs }) => {
  assert(!!namedInputs, "stringSplitterAgent: namedInputs is UNDEFINED!");
  const source = namedInputs.text;
  const chunkSize = params.chunkSize ?? defaultChunkSize;
  const overlap = params.overlap ?? Math.floor(chunkSize / 8);
  const count = Math.floor(source.length / (chunkSize - overlap)) + 1;
  const contents = new Array(count).fill(undefined).map((_, i) => {
    const startIndex = i * (chunkSize - overlap);
    return source.substring(startIndex, startIndex + chunkSize);
  });

  return { contents, count, chunkSize, overlap };
};

// for test and document
const sampleInput = {
  text: "Here's to the crazy ones, the misfits, the rebels, the troublemakers, the round pegs in the square holes ... the ones who see things differently -- they're not fond of rules, and they have no respect for the status quo. ... You can quote them, disagree with them, glorify or vilify them, but the only thing you can't do is ignore them because they change things. ... They push the human race forward, and while some may see them as the crazy ones, we see genius, because the people who are crazy enough to think that they can change the world, are the ones who do.",
};

const sampleParams = { chunkSize: 64 };
const sampleResult = {
  contents: [
    "Here's to the crazy ones, the misfits, the rebels, the troublema",
    "roublemakers, the round pegs in the square holes ... the ones wh",
    " ones who see things differently -- they're not fond of rules, a",
    "rules, and they have no respect for the status quo. ... You can ",
    "You can quote them, disagree with them, glorify or vilify them, ",
    "y them, but the only thing you can't do is ignore them because t",
    "ecause they change things. ... They push the human race forward,",
    "forward, and while some may see them as the crazy ones, we see g",
    "we see genius, because the people who are crazy enough to think ",
    "o think that they can change the world, are the ones who do.",
    " do.",
  ],
  count: 11,
  chunkSize: 64,
  overlap: 8,
};

const stringSplitterAgentInfo: AgentFunctionInfo = {
  name: "stringSplitterAgent",
  agent: stringSplitterAgent,
  mock: stringSplitterAgent,
  inputs: {
    type: "object",
    properties: {
      text: {
        type: "string",
        description: "text to be chunked",
      },
    },
    required: ["text"],
  },
  output: {
    type: "object",
    properties: {
      contents: {
        type: "array",
        description: "the array of text chunks",
      },
      count: {
        type: "number",
        description: "the number of chunks",
      },
      chunkSize: {
        type: "number",
        description: "the chunk size",
      },
      overlap: {
        type: "number",
        description: "the overlap size",
      },
    },
  },
  samples: [
    {
      inputs: sampleInput,
      params: sampleParams,
      result: sampleResult,
    },
  ],
  description: "This agent strip one long string into chunks using following parameters",
  category: ["string"],
  author: "Satoshi Nakajima",
  repository: "https://github.com/receptron/graphai",
  source: "https://github.com/receptron/graphai/blob/main/agents/vanilla_agents/src/string_agents/string_splitter_agent.ts",
  package: "@graphai/vanilla",
  license: "MIT",
};
export default stringSplitterAgentInfo;
