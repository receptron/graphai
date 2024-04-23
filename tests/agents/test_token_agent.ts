import { tokenBoundStringsAgent } from "@/experimental_agents";
import { defaultTestContext } from "~/agents/utils";

import test from "node:test";
import assert from "node:assert";

test("test tokenBoundStringsAgent", async () => {
  const result = await tokenBoundStringsAgent({
    ...defaultTestContext,
    params: {
      limit: 80,
    },
    inputs: [
      [
        "Here's to the crazy ones. The misfits. The rebels. The troublemakers.",
        "The round pegs in the square holes. The ones who see things differently.",
        "They're not fond of rules. And they have no respect for the status quo.",
        "You can quote them, disagree with them, glorify or vilify them.",
        "About the only thing you can't do is ignore them.",
        "Because they change things.",
        "They push the human race forward.",
        "And while some may see them as the crazy ones, we see genius.",
        "Because the people who are crazy enough to think they can change the world, are the ones who do.",
      ]
    ],
  });
  assert.deepStrictEqual(result, {
    content:
      "Here's to the crazy ones. The misfits. The rebels. The troublemakers.\n" +
      "The round pegs in the square holes. The ones who see things differently.\n" +
      "They're not fond of rules. And they have no respect for the status quo.\n" +
      "You can quote them, disagree with them, glorify or vilify them.\n" +
      "About the only thing you can't do is ignore them.\n" +
      "Because they change things.",
    tokenCount: 79,
    endIndex: 6,
  });
});
