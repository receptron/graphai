import { writeGraphExample } from "@receptron/agentdoc";
import { graphDataGeminiMath } from "./graphData";

writeGraphExample(
  {
    graphDataGeminiMath,
  },
  __dirname + "/../docs/",
);
