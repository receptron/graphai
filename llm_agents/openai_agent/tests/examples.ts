import { writeGraphExample } from "@receptron/agentdoc";
import { graphDataOpenAIMath, graphDataOpenAIPaint, graphDataOpenAIImageDescription } from "./graphData";

writeGraphExample(
  {
    graphDataOpenAIMath,
  },
  __dirname + "/../docs/",
);
