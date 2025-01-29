import { writeGraphExample } from "@receptron/agentdoc";
import { graphDataOpenAIMath, graphDataOpenAIImageDescription } from "./graphData";

writeGraphExample(
  {
    graphDataOpenAIMath,
    graphDataOpenAIImageDescription,
  },
  __dirname + "/../docs/",
);
