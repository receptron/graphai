import { writeGraphExample } from "@receptron/agentdoc";
import { graphDataLiteral, graphDataInputs, graphDataAny, graphDataAny2, graphDataNested } from "./graphData";

writeGraphExample(
  {
    graphDataLiteral,
    graphDataInputs,
    graphDataAny,
    graphDataAny2,
    graphDataNested,
  },
  __dirname + "/../../docs/",
);
