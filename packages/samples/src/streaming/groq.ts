import "dotenv/config";

import { GraphAI } from "graphai";
import * as agents from "@graphai/agents";
import { agentFilters } from "./streamAgentFilter";

const query =
  "I'd like to write a paper about data flow programming for AI application, which involves multiple asynchronous calls, some of operations are done on other machines (distributed computing). Please come up with the title and an abstract for this paper.";

const graph_data = {
  version: 0.5,
  nodes: {
    query: {
      agent: "groqAgent",
      params: {
        model: "mixtral-8x7b-32768",
        stream: true,
      },
      isResult: true,
      inputs: {
        prompt: query,
      },
    },
    answer: {
      agent: "copyAgent",
      params: { namedKey: "text" },
      inputs: { text: ":query.text" },
      isResult: true,
    },
  },
};

export const main = async () => {
  const graph = new GraphAI(graph_data, agents, { agentFilters });
  const result = await graph.run();
  console.log(result);
};

if (process.argv[1] === __filename) {
  main();
}

/*
  {
  id: 'chatcmpl-bfa3f433-6664-48d7-9f33-a1bd2c52ae28',
  object: 'chat.completion.chunk',
  created: 1715384049,
  model: 'mixtral-8x7b-32768',
  system_fingerprint: 'fp_c5f20b5bb1',
  choices: [ { index: 0, delta: {}, logprobs: null, finish_reason: 'stop' } ],
  x_groq: {
    id: 'req_01hxjdppt8fczvzy9pdvf3yeq3',
    usage: {
      queue_time: 0.059048685000000004,
      prompt_tokens: 60,
      prompt_time: 0.015,
      completion_tokens: 334,
      completion_time: 0.59,
      total_tokens: 394,
      total_time: 0.605
    }
  }
  }

{
  id: 'chatcmpl-944e8279-0b17-4a78-a568-ae6198436ee3',
  object: 'chat.completion',
  created: 1715384112,
  model: 'mixtral-8x7b-32768',
  choices: [
    {
      index: 0,
      message: [ {
        "role": "assistant",
        "content": ""
      }],
      logprobs: null,
      finish_reason: 'stop'
    }
  ],
  usage: {
    prompt_tokens: 60,
    prompt_time: 0.015,
    completion_tokens: 431,
    completion_time: 0.776,
    total_tokens: 491,
    total_time: 0.791
  },
  system_fingerprint: 'fp_c5f20b5bb1',
  x_groq: { id: 'req_01hxjdrm6sfxn8x1epbvgj9nxb' }
}
*/
