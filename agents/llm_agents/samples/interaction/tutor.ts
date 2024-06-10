import "dotenv/config";
import { graphDataTestRunner } from "@receptron/test_utils";
import * as llm_agents from "@/index";
import * as agents from "@graphai/agents";

export const graph_data = {
  version: 0.3,
  nodes: {
    word: {
      agent: "textInputAgent",
      params: {
        message: "勉強したい英語の単語を入力してください:",
      },
    },
    meaning_llm: {
      agent: "openAIAgent",
      params: {
        model: "gpt-4o",
        system: "You are a dictionary writer. Write the meaning of the given word.",
      },
      inputs: { prompt: ":word" },
    },
    meaning: {
      agent: "copyAgent",
      isResult: true,
      inputs: [":meaning_llm.choices.$0.message.content"],
    },
    meaning_jp_llm: {
      agent: "openAIAgent",
      params: {
        model: "gpt-4o",
        system: "あなたは英語の教師です。与えられた単語の意味を日本語で説明してください。",
      },
      inputs: { prompt: ":word" },
    },
    meaning_jp: {
      agent: "copyAgent",
      isResult: true,
      inputs: [":meaning_jp_llm.choices.$0.message.content"],
    },
    samples_llm: {
      agent: "openAIAgent",
      params: {
        model: "gpt-4o",
        system:
          "与えられた単語を含む、英語の文章を10個作って、日本語に訳して。あまり難しい単語は使わずに。フォーマットはJSONで、以下のフォーマットで。\n" +
          "```json\n[{en:'Hello.', jp:'こんにちは。']\n```",
      },
      inputs: { prompt: ":word" },
    },
    samples: {
      agent: "jsonParserAgent",
      isResult: true,
      inputs: [":samples_llm.choices.$0.message.content"],
    },
    similar_llm: {
      agent: "openAIAgent",
      params: {
        model: "gpt-4o",
        system:
          "与えられた単語をと類似するいくつか単語を並べて、日本語で違いを説明して。フォーマットはJSONで、以下のフォーマットで。\n" +
          "```json\n[{word:'Awesome.', jp:'本当に素晴らしいことを強調したい時に使います。']\n```",
      },
      inputs: { prompt: ":word" },
    },
    similar: {
      agent: "jsonParserAgent",
      isResult: true,
      inputs: [":similar_llm.choices.$0.message.content"],
    },
    root_llm: {
      agent: "openAIAgent",
      params: {
        model: "gpt-4o",
        system: "あなたは英語の教師です。与えられた単語の語源を日本語で解説して。",
      },
      inputs: { prompt: ":word" },
    },
    root: {
      agent: "copyAgent",
      isResult: true,
      inputs: [":root_llm.choices.$0.message.content"],
    },
  },
};

export const main = async () => {
  const result = await graphDataTestRunner<{ messages: { role: string; content: string }[] }>(
    __dirname + "/../",
    __filename,
    graph_data,
    { ...agents, ...llm_agents },
    () => {},
    false,
  );
  console.log(result);
};

if (process.argv[1] === __filename) {
  main();
}
