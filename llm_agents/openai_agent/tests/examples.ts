import { writeGraphExample } from "@receptron/agentdoc";
import { graphDataOpenAIMath, graphDataOpenAIPaint, graphDataOpenAIImageDescription } from "./graphData";

writeGraphExample(
  {
    graphDataOpenAIMath,
    graphDataOpenAIPaint,
    graphDataOpenAIImageDescription,
  },
  __dirname + "/../docs/",
);
