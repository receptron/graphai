import { writeGraphExample } from "@receptron/agentdoc";
import { graphDataReplicateMath } from "./graphData";

writeGraphExample(
  {
    graphDataReplicateMath,
  },
  __dirname + "/../docs/",
);
