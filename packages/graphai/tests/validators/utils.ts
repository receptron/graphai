import { GraphData, GraphAI } from "@/index";
import { ValidationError } from "@/validators/common";

import assert from "node:assert";

export { anonymization } from "@graphai/test_utils";

export const rejectTest = async (
  graphData: GraphData, errorMessage: string, bypassAgentIds: string[] = ["echoAgent"], validationError: boolean = true) => {
  await assert.rejects(
    async () => {
      const graph = new GraphAI(graphData, {}, { bypassAgentIds });
      const results = await graph.run();
      console.log(results);
    },
    { name: "Error", message: validationError ? new ValidationError(errorMessage).message : errorMessage },
  );
};
