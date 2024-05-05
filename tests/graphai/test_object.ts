import { graphDataTestRunner } from "~/utils/runner";
import { defaultTestAgents } from "@/utils/test_agents";
import { functionAgent, copyAgent } from "@/experimental_agents";

import test from "node:test";
import assert from "node:assert";

class WordStreamer {
  public onWord = (__word: string | undefined) => {};

  constructor(message: string) {
    const words = message.split(' ');
    const streamSimulator = () => {
      setTimeout(() => {
        const word = words.shift();
        this.pushWord(word);
        if (word) {
          streamSimulator();
        }
      }, 200);
    };
    streamSimulator();
  }

  public pushWord(word: string | undefined) {
    this.onWord(word);
  }
}

const theMessage = "May the force be with you.";

const graphdata_any = {
  version: 0.2,
  nodes: {
    message: {
      value: theMessage,
    },
    source: {
      agentId: "functionAgent",
      params: {
        function: (message: string) => {
          return new WordStreamer(message);
        },
      },
      inputs: ["message"],
    },
    destination: {
      agentId: "functionAgent",
      params: {
        function: (streamer: WordStreamer) => {
          const words = new Array<string>();
          return new Promise((resolve) => {
            streamer.onWord = (word: string | undefined) => {
              if (word) {
                words.push(word);
              } else {
                resolve(words.join(' '));
              }
            }
          });
        },
      },
      isResult: true,
      inputs: ["source"],
    },
  },
};

test("test any 1", async () => {
  const result = await graphDataTestRunner(__filename, graphdata_any, { functionAgent, copyAgent, ...defaultTestAgents }, () => {}, false);
  assert.deepStrictEqual(result, { destination: theMessage });
});
