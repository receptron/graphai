import { convOpenAIToolsToAnthropicToolMessage } from "../src/utils";
import test from "node:test";
import assert from "node:assert";

export const messages = [
  {
    role: "user",
    content: "東京・大阪・札幌の天気、USDJPYのレート、AAPLとMSFTの株価を教えて",
  },
  {
    role: "assistant",
    content: "東京、大阪、札幌の天気、USDJPYの為替レート、そしてAAPLとMSFTの株価を調べますね。",
    tool_calls: [
      {
        id: "toolu_0175tZ6uqBFKDCBy8zzUsSvq",
        function: {
          name: "generalToolAgent--get_weather",
          arguments: JSON.stringify({
            city: "東京",
          }),
        },
      },
      {
        id: "toolu_01ARZ5jPUrvLcvLmRMhSbqDr",
        function: {
          name: "generalToolAgent--get_weather",
          arguments: JSON.stringify({
            city: "大阪",
          }),
        },
      },
      {
        id: "toolu_014c5kSFrHGMghGwJrTwLRM8",
        function: {
          name: "generalToolAgent--get_weather",
          arguments: JSON.stringify({
            city: "札幌",
          }),
        },
      },
      {
        id: "toolu_01MZ6NVQeMcz8pFz3FJbvmty",
        function: {
          name: "generalToolAgent--get_fx_rate",
          arguments: JSON.stringify({
            pair: "USDJPY",
          }),
        },
      },
      {
        id: "toolu_01YSrHvagEqz9nd6fw3Qv4cP",
        function: {
          name: "generalToolAgent--lookup_stock_price",
          arguments: JSON.stringify({
            ticker: "AAPL",
          }),
        },
      },
      {
        id: "toolu_01MJj66daUKkPYb2fA2WToR9",
        function: {
          name: "generalToolAgent--lookup_stock_price",
          arguments: JSON.stringify({
            ticker: "MSFT",
          }),
        },
      },
    ],
  },
  {
    role: "tool",
    tool_call_id: "toolu_0175tZ6uqBFKDCBy8zzUsSvq",
    content: "Weather for 東京: fine.",
    extra: {
      agent: "generalToolAgent",
      arg: {
        city: "東京",
      },
      func: "get_weather",
    },
  },
  {
    role: "tool",
    tool_call_id: "toolu_01ARZ5jPUrvLcvLmRMhSbqDr",
    content: "Weather for 大阪: fine.",
    extra: {
      agent: "generalToolAgent",
      arg: {
        city: "大阪",
      },
      func: "get_weather",
    },
  },
  {
    role: "tool",
    tool_call_id: "toolu_014c5kSFrHGMghGwJrTwLRM8",
    content: "Weather for 札幌: fine.",
    extra: {
      agent: "generalToolAgent",
      arg: {
        city: "札幌",
      },
      func: "get_weather",
    },
  },
  {
    role: "tool",
    tool_call_id: "toolu_01MZ6NVQeMcz8pFz3FJbvmty",
    content: "FX USDJPY: 150.12",
    extra: {
      agent: "generalToolAgent",
      arg: {
        pair: "USDJPY",
      },
      func: "get_fx_rate",
    },
  },
  {
    role: "tool",
    tool_call_id: "toolu_01YSrHvagEqz9nd6fw3Qv4cP",
    content: "Price AAPL: $123.45 (+0.78)",
    extra: {
      agent: "generalToolAgent",
      arg: {
        ticker: "AAPL",
      },
      func: "lookup_stock_price",
    },
  },
  {
    role: "tool",
    tool_call_id: "toolu_01MJj66daUKkPYb2fA2WToR9",
    content: "Price MSFT: $123.45 (+0.78)",
    extra: {
      agent: "generalToolAgent",
      arg: {
        ticker: "MSFT",
      },
      func: "lookup_stock_price",
    },
  },
  {
    role: "assistant",
    content:
      "## 現在の情報をまとめました：\n\n### 🌤️ 天気\n- **東京**: 晴れ\n- **大阪**: 晴れ  \n- **札幌**: 晴れ\n\n### 💱 為替レート\n- **USD/JPY**: 150.12円\n\n### 📈 株価\n- **AAPL (Apple)**: $123.45 (+0.78)\n- **MSFT (Microsoft)**: $123.45 (+0.78)\n\n本日は3都市とも晴天に恵まれているようですね。為替は1ドル150円台で推移しており、両株式とも上昇傾向を示しています。",
  },
  {
    role: "user",
    content: "ありがとう。インド、ムンバイの天気は？",
  },
];

//console.log(JSON.stringify(convOpenAIToolsToAnthropicToolMessage(messages)));
test("message convOpenAIToolsToAnthropicToolMessage", () => {
  const res = convOpenAIToolsToAnthropicToolMessage(messages);

  const expect = [
    { role: "user", content: "東京・大阪・札幌の天気、USDJPYのレート、AAPLとMSFTの株価を教えて" },
    {
      role: "assistant",
      content: [
        { type: "text", text: "東京、大阪、札幌の天気、USDJPYの為替レート、そしてAAPLとMSFTの株価を調べますね。" },
        { type: "tool_use", id: "toolu_0175tZ6uqBFKDCBy8zzUsSvq", name: "generalToolAgent--get_weather", input: { city: "東京" } },
        { type: "tool_use", id: "toolu_01ARZ5jPUrvLcvLmRMhSbqDr", name: "generalToolAgent--get_weather", input: { city: "大阪" } },
        { type: "tool_use", id: "toolu_014c5kSFrHGMghGwJrTwLRM8", name: "generalToolAgent--get_weather", input: { city: "札幌" } },
        { type: "tool_use", id: "toolu_01MZ6NVQeMcz8pFz3FJbvmty", name: "generalToolAgent--get_fx_rate", input: { pair: "USDJPY" } },
        { type: "tool_use", id: "toolu_01YSrHvagEqz9nd6fw3Qv4cP", name: "generalToolAgent--lookup_stock_price", input: { ticker: "AAPL" } },
        { type: "tool_use", id: "toolu_01MJj66daUKkPYb2fA2WToR9", name: "generalToolAgent--lookup_stock_price", input: { ticker: "MSFT" } },
      ],
    },
    {
      role: "user",
      content: [
        { type: "tool_result", tool_use_id: "toolu_0175tZ6uqBFKDCBy8zzUsSvq", content: "Weather for 東京: fine." },
        { type: "tool_result", tool_use_id: "toolu_01ARZ5jPUrvLcvLmRMhSbqDr", content: "Weather for 大阪: fine." },
        { type: "tool_result", tool_use_id: "toolu_014c5kSFrHGMghGwJrTwLRM8", content: "Weather for 札幌: fine." },
        { type: "tool_result", tool_use_id: "toolu_01MZ6NVQeMcz8pFz3FJbvmty", content: "FX USDJPY: 150.12" },
        { type: "tool_result", tool_use_id: "toolu_01YSrHvagEqz9nd6fw3Qv4cP", content: "Price AAPL: $123.45 (+0.78)" },
        { type: "tool_result", tool_use_id: "toolu_01MJj66daUKkPYb2fA2WToR9", content: "Price MSFT: $123.45 (+0.78)" },
      ],
    },
    {
      role: "assistant",
      content:
        "## 現在の情報をまとめました：\n\n### 🌤️ 天気\n- **東京**: 晴れ\n- **大阪**: 晴れ  \n- **札幌**: 晴れ\n\n### 💱 為替レート\n- **USD/JPY**: 150.12円\n\n### 📈 株価\n- **AAPL (Apple)**: $123.45 (+0.78)\n- **MSFT (Microsoft)**: $123.45 (+0.78)\n\n本日は3都市とも晴天に恵まれているようですね。為替は1ドル150円台で推移しており、両株式とも上昇傾向を示しています。",
    },
    { role: "user", content: "ありがとう。インド、ムンバイの天気は？" },
  ];

  assert.deepStrictEqual(res, expect);
});
