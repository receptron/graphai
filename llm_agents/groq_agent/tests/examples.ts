import { writeGraphExample } from "@receptron/agentdoc";
import { graphDataGroqMath } from "./graphData";

writeGraphExample(
  {
    graphDataGroqMath,
  },
  __dirname + "/../docs/",
);
