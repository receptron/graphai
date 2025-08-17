import "dotenv/config";
import { anthropicAgent } from "../src/index";
import toolsAgent from "./tools_agent";
import { GraphAI, agentInfoWrapper, type AgentFunction } from "graphai";
import * as agents from "@graphai/vanilla";

import test from "node:test";
// import assert from "node:assert";

export const tools = [
  {
    type: "function",
    function: {
      name: "generalToolAgent--get_weather",
      description: "Get current weather for a city.",
      parameters: {
        type: "object",
        properties: {
          city: { type: "string", description: "City name." },
          unit: { type: "string", enum: ["C", "F"], description: "Temperature unit." },
        },
        required: ["city"],
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "generalToolAgent--get_fx_rate",
      description: "Get spot FX rate for a currency pair like USDJPY.",
      parameters: {
        type: "object",
        properties: {
          pair: { type: "string", pattern: "^[A-Za-z]{6}$", description: "Six-letter pair, e.g., USDJPY." },
        },
        required: ["pair"],
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "generalToolAgent--lookup_stock_price",
      description: "Get the latest stock price for a ticker.",
      parameters: {
        type: "object",
        properties: {
          ticker: { type: "string", description: "Ticker symbol, e.g., AAPL." },
          market: { type: "string", description: "Optional market code." },
        },
        required: ["ticker"],
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "generalToolAgent--translate_text",
      description: "Translate text to a target language.",
      parameters: {
        type: "object",
        properties: {
          text: { type: "string", description: "Source text." },
          target_lang: { type: "string", description: "Target language code, e.g., en, ja." },
        },
        required: ["text", "target_lang"],
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "generalToolAgent--geocode_address",
      description: "Convert a postal address to latitude/longitude.",
      parameters: {
        type: "object",
        properties: {
          address: { type: "string", description: "Full postal address." },
        },
        required: ["address"],
        additionalProperties: false,
      },
    },
  },
] as const;

const toolsTestDummyAgent: AgentFunction = async ({ namedInputs }) => {
  const { arg = {}, func } = namedInputs ?? {};

  if (func === "get_weather") {
    return {
      content: `Weather for ${arg.city ?? "Unknown"}: fine.`,
      data: { city: arg.city ?? null, temp: 22, unit: arg.unit ?? "C" },
    };
  }

  if (func === "get_fx_rate") {
    const pair = (arg.pair ?? "USDJPY").toUpperCase();
    return {
      content: `FX ${pair}: 150.12`,
      data: { pair, rate: 150.12, ts: Date.now() },
    };
  }

  if (func === "lookup_stock_price") {
    const ticker = String(arg.ticker ?? "AAPL").toUpperCase();
    return {
      content: `Price ${ticker}: $123.45 (+0.78)`,
      data: { ticker, price: 123.45, change: 0.78, currency: "USD" },
    };
  }

  if (func === "translate_text") {
    const text = arg.text ?? "";
    const target = arg.target_lang ?? "en";
    return {
      content: `Translated to ${target}.`,
      data: { source_text: text, target_lang: target, translated_text: `[${target}] ${text}` },
    };
  }

  if (func === "geocode_address") {
    const address = arg.address ?? "Unknown";
    return {
      content: `Geocoded "${address}".`,
      data: { address, location: { lat: 35.000001, lon: 135.000001 }, precision: "ROOFTOP" },
    };
  }

  return {};
};

const generalToolAgent = agentInfoWrapper(toolsTestDummyAgent);

test("test tools 1", async () => {
  const graph = {
    version: 0.5,
    nodes: {
      messages: {
        value: [],
      },
      text: {
        value: "",
      },
      tools: {
        isResult: true,
        agent: "toolsAgent",
        inputs: {
          messages: ":messages",
          userInput: { text: ":text"},
          tools,
          llmAgent: "anthropicAgent",
          llmModel: "claude-opus-4-1-20250805",
          stream: false,
        },
      },
    },
  };

  const graphai = new GraphAI(graph, { ...agents, toolsAgent, generalToolAgent, anthropicAgent });
  graphai.injectValue("text", "東京・大阪・札幌の天気、USDJPYのレート、AAPLとMSFTの株価を教えて");
  
  const res = await graphai.run() as any;
  console.log(JSON.stringify(res, null, 2));

  const graphai2 = new GraphAI(graph, { ...agents, toolsAgent, generalToolAgent, anthropicAgent });
  graphai2.injectValue("text", "ありがとう。インド、ムンバイの天気は？");
  graphai2.injectValue("messages", res.tools.messages);
  const res2 = await graphai2.run() as any;
  console.log(JSON.stringify(res2, null, 2));
  
  // assert.deepStrictEqual(expect, res);
});
