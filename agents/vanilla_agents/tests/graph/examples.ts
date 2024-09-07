import { writeGraphExample } from "@receptron/agentdoc";
import { dynamicGraphData, dynamicGraphData2, dynamicGraphData3, nestedGraphData, nestedGraphData2 } from "./graphData";

writeGraphExample({ dynamicGraphData, dynamicGraphData2, dynamicGraphData3, nestedGraphData, nestedGraphData2 }, __dirname + "/../../docs/");
