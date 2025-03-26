import { GraphAI, AgentFunctionContext } from "graphai";
import { AgentFunction, AgentFunctionInfo } from "graphai";
// import * as agents from "@graphai/vanilla";
import * as agents from "@graphai/agents";
import * as llm_agents from "@graphai/llm_agents";
import { openAIAgent } from "@graphai/openai_agent";
import { anthropicAgent } from "@graphai/anthropic_agent";
import { fetchAgent, wikipediaAgent } from "@graphai/service_agents";
import { streamAgentFilterGenerator, httpAgentFilter, cacheAgentFilterGenerator } from "@graphai/agent_filters";
import readline from "readline";
import "dotenv/config";

import sqlite3 from "sqlite3";

function cosineSimilarity(a: string, b: string) {
  const c = a.split(",").map((s) => parseFloat(s.trim()));
  const d = b.split(",").map((s) => parseFloat(s.trim()));
  const dot = c.reduce((sum, val, i) => sum + val * d[i], 0);
  const magc = Math.sqrt(c.reduce((sum, val) => sum + val ** 2, 0));
  const magd = Math.sqrt(d.reduce((sum, val) => sum + val ** 2, 0));
  return dot / (magc * magd);
}

const db = new sqlite3.Database("./test.db");

db.serialize(() => {
  db.run(`
      CREATE TABLE IF NOT EXISTS cache (
        prompt TEXT UNIQUE,
        answer TEXT,
        embedding TEXT
      )
    `);
});

type CacheRow = {
  prompt: string;
  answer: string;
  embedding: string;
};

const setCache = async (key: string, data: any) => {
  let value: any = null;
  const prompt = data[0];
  const answer = data[1];
  const embedding = key;

  await new Promise((resolve) => {
    db.serialize(() => {
      console.log("inserting into cache");
      db.run("INSERT INTO cache(prompt, answer, embedding) VALUES (?, ?, ?)", prompt, answer, embedding, () => {
        resolve(null);
      });
    });
  });
};

const getCache = async (key: any) => {
  return new Promise((resolve) => {
    db.serialize(() => {
      db.all("SELECT * FROM cache", (err, rows) => {
        let bestMatch: CacheRow | null = null;
        let bestScore = 0.8; // this can be tuned but regardless the output is going to be judged so if the outputed answer isnt good enough safeai will loop.
        for (const row of rows as CacheRow[]) {
          console.log("iterating iterating iterating");
          const cachedEmbedding = row.embedding;
          const similarity = cosineSimilarity(key, cachedEmbedding);

          if (similarity > bestScore) {
            bestScore = similarity;
            bestMatch = row;
          }
        }

        if (bestMatch) {
          console.log("semantic cache hit with similarity: ", bestScore);
          resolve(bestMatch.answer);
        } else {
          resolve(null);
        }
      });
    });
  });
};

const getCacheKey = (context: AgentFunctionContext) => {
  const { namedInputs, params, debugInfo } = context;
  const embedding = namedInputs.a[2].slice(10).trim();
  return embedding;
};

const main = async () => {
  const cacheAgentFilter = cacheAgentFilterGenerator({ getCache, setCache, getCacheKey });

  const agentFilters = [
    {
      name: "cacheAgentFilter",
      agent: cacheAgentFilter,
      nodeIds: ["llm", "node2"],
    },
  ];
  const camAi = {
    version: 0.5,
    nodes: {
      // initialize variable for user input. --> string
      userPrompt: {
        value: "",
      },

      chatHistory: {
        value: [],
      },

      // placeholder variable that is later injected with the default llmEngine that is going to be used whenever this vairable is read.
      //   llmEngine: {
      //     value: "",
      //   },

      // this currently is an llm call that is going to first just hit gpt-4o (my default as of right now), and decide which model to use based on their strenghts.
      modelDispatcher: {
        agent: "openAIAgent",
        params: {
          model: "gpt-4o",
        },
        inputs: {
          messages: ":chatHistory",
          system: [
            "You are a LLM model dispatcher that routes the user request to the appropriate LLM, based off of user sentiment and the complexity of the request. Classify the user query into one of `1.`, `2.`, and `3.` based off of both the complexity of question and the strengths of each model. Using the provided mappings, fill the JSON schema with the model_name and baseUrl. Do not tell me what number choice you've made.\n\n",
            "1. -  model_name: llama3.2:1b         baseUrl: http://localhost:11434/api/generate\n",
            "2. -  model_name: gemma3:1b           baseUrl: http://localhost:11434/api/generate\n",
            "3. -  model_name: deepseek-r1:1.5b    baseUrl: http://localhost:11434/api/generate\n",
          ],
          response_format: {
            type: "json_schema",
            json_schema: {
              name: "model_information",
              schema: {
                type: "object",
                properties: {
                  model: { type: "string" },
                  baseUrl: { type: "string" },
                },
                required: ["model", "baseUrl"],
                additionalProperties: false,
              },
              strict: true,
            },
          },
        },
      },
      topicEmbedding: {
        agent: "stringEmbeddingsAgent",
        inputs: { item: ":userPrompt" },
      },
      //   parses output of modelDispatcher and extracts the model name and base URL.
      modelDetails: {
        agent: "jsonParserAgent",
        inputs: {
          text: ":modelDispatcher.text",
        },
      },
      //   based on model details, its able to then call the appropriate model.
      llm: {
        agent: "openAIAgent",
        inputs: {
          prompt: ":userPrompt",
        },
        params: {
          model: ":modelDetails.model",
          baseURL: ":modelDetails.baseUrl",
        },
      },
      saveJson: {
        agent: "stringTemplateAgent",
        inputs: {
          prompt: ":userPrompt",
          answer: ":llm.message",
          embedding: ":topicEmbedding",
        },
        params: {
          template: ["prompt: ${prompt}", "answer: ${answer}", "embedding: ${embedding}"],
        },
      },
      node2: {
        inputs: {
          a: ":saveJson",
        },
        agent: "echoAgent",
        params: {
          abc: "123",
        },
      },
      squashAnswers: {
        agent: "stringTemplateAgent",
        inputs: {
          prompt: ":userPrompt",
          answer1: ":llm.message",
          answer2: ":node2",
        },
        params: {
          template: ["prompt: ${prompt}", "answer1: ${answer1}", "answer2: ${answer2}"],
        },
      },
      judge: {
        agent: "openAIAgent",
        params: {
          model: "gpt-4o",
          system:
            "given the two different inputs being fed into you through 'a' and 'b', choose based on the prompt which is the best answer and directly copy and return only that answer.",
        },
        inputs: {
          prompt: ":squashAnswers",
        },
        isResult: true,
      },
    },
  };

  const ask = (question: string): Promise<string> => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    return new Promise((resolve) =>
      rl.question(question, (answer) => {
        rl.close();
        resolve(answer);
      }),
    );
  };
  const prompt = await ask("prompt: ");
  const graphai = new GraphAI(camAi, agents, { agentFilters });
  graphai.injectValue("userPrompt", prompt);
  const res = await graphai.run();
  console.log(res);
};

main();
