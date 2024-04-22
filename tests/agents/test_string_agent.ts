import { stringTemplateAgent, stringSplitterAgent } from "@/experimental_agents";
import { defaultTestContext } from "~/agents/utils";

import test from "node:test";
import assert from "node:assert";

test("test stringTemplateAgent simple", async () => {
  const result = await stringTemplateAgent({
    ...defaultTestContext,
    params: { template: "${0}: ${1}" },
    inputs: [{ content: "hello" }, { content: "test" }],
  });
  assert.deepStrictEqual(result, {
    content: "hello: test",
  });
});

test("test stringTemplateAgent simple", async () => {
  const result = await stringTemplateAgent({
    ...defaultTestContext,
    params: { template: "${0}: ${1}", inputKey: "key" },
    inputs: [{ key: "hello" }, { key: "test" }],
  });
  assert.deepStrictEqual(result, {
    content: "hello: test",
  });
});

const sample_apple =
  "Here's to the crazy ones, the misfits, the rebels, the troublemakers, the round pegs in the square holes ... the ones who see things differently -- they're not fond of rules, and they have no respect for the status quo. ... You can quote them, disagree with them, glorify or vilify them, but the only thing you can't do is ignore them because they change things. ... They push the human race forward, and while some may see them as the crazy ones, we see genius, because the people who are crazy enough to think that they can change the world, are the ones who do.";

test("test stringSplitterAgent simple", async () => {
  const result = await stringSplitterAgent({
    ...defaultTestContext,
    params: { chunkSize: 64 },
    inputs: [{ content: sample_apple }],
  });
  assert.deepStrictEqual(result, {
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
  });
});
