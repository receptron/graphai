import { GraphAI, AgentFunctionContext } from "graphai";
import * as vanilla_agents from "@graphai/vanilla";
import { cacheAgentFilterGenerator } from "@graphai/agent_filters";
import { openAIAgent } from "@graphai/openai_agent";
import readline from "readline";
import "dotenv/config";

import sqlite3 from "sqlite3";

// calculus doing me right for once
function cosineSimilarity(a: string, b: string) {
  const c = a.split(",").map((s) => parseFloat(s.trim()));
  const d = b.split(",").map((s) => parseFloat(s.trim()));
  const dot = c.reduce((sum, val, i) => sum + val * d[i], 0);
  const magc = Math.sqrt(c.reduce((sum, val) => sum + val ** 2, 0));
  const magd = Math.sqrt(d.reduce((sum, val) => sum + val ** 2, 0));
  return dot / (magc * magd);
}

const parseOutput = (output: string[]) => {
  let prompt = "",
    answer = "",
    embedding: number[] = [];

  for (const line of output) {
    if (line.startsWith("prompt:")) {
      prompt = line.replace("prompt:", "").trim();
    } else if (line.startsWith("answer:")) {
      answer = line.replace("answer:", "").trim();
    } else if (line.startsWith("embedding:")) {
      const raw = line.replace("embedding:", "").trim();
      embedding = JSON.parse(raw);
    }
  }

  return { prompt, answer, embedding };
};

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
  // if (typeof data === "object" && data !== null && Object.keys(data).length === 1) {
  //   const maybeArray = Object.values(data)[0];
  //   if (Array.isArray(maybeArray) && maybeArray.length === 3) {
  //     value = maybeArray;
  //     console.log("actually setting cache");
  //     console.log("");
  //     console.log("");
  //   }
  // }

  // if (value === null) {
  //   return;
  // }
  // const { prompt, answer, embedding } = parseOutput(value);
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
          // resolve("CACHE HIT CACHE HIT CACHE HIT");
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
      agentIds: ["echoAgent", "stringTemplateAgent"],
    },
  ];
  const graphData = {
    version: 0.5,
    nodes: {
      userPrompt: {
        value: "",
      },
      topicEmbedding: {
        agent: "stringEmbeddingsAgent",
        inputs: { item: ":userPrompt" },
      },
      opposite: {
        agent: "openAIAgent",
        inputs: {
          prompt: ":userPrompt",
        },
        params: {
          system: "say the opposite of the inputted prompt",
          model: "gpt-4o",
        },
      },
      saveJson: {
        agent: "stringTemplateAgent",
        inputs: {
          prompt: ":userPrompt",
          answer: ":opposite.text",
          embedding: ":topicEmbedding",
        },
        params: {
          template: ["prompt: ${prompt}", "answer: ${answer}", "embedding: ${embedding}"],
        },
      },
      // you should see car:toyato unless its a cache hit
      node2: {
        inputs: {
          a: ":saveJson",
        },
        agent: "echoAgent",
        params: {
          car: "toyota",
        },
        isResult: true,
      },
    },
  };

  const graphAI = new GraphAI(graphData, { ...vanilla_agents, openAIAgent }, { agentFilters });
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
  graphAI.injectValue("userPrompt", prompt);
  const res = await graphAI.run();
  console.log(res);
};

main();
