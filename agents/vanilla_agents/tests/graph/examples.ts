import { writeGraphExample } from "@receptron/agentdoc";
import {
  dynamicGraphData,
  dynamicGraphData2,
  dynamicGraphData3,
  nestedGraphData,
  nestedGraphData2,
  graphdataMap1,
  graphdataMap3,
  graphdataMap4,
  graphdataMap5,
  graphDataPush,
  graphDataPop,
  graphDataNested,
  graphDataNestedPop,
  graphDataNestedInjection,
} from "./graphData";

writeGraphExample(
  {
    dynamicGraphData,
    dynamicGraphData2,
    dynamicGraphData3,
    nestedGraphData,
    nestedGraphData2,
    graphdataMap1,
    graphdataMap3,
    graphdataMap4,
    graphdataMap5,
    graphDataPush,
    graphDataPop,
    graphDataNested,
    graphDataNestedPop,
    graphDataNestedInjection,
  },
  __dirname + "/../../docs/",
);
