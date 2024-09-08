import { writeGraphExample } from "@receptron/agentdoc";
import { graphDataAnthropicMath } from "./graphData";

writeGraphExample(
  {
    graphDataAnthropicMath,
  },
  __dirname + "/../docs/",
);
