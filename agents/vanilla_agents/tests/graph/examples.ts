import { writeGraphExample } from "@receptron/agentdoc";
import {
  dynamicGraphData,
  dynamicGraphData2,
  dynamicGraphData3,
  nestedGraphData,
  nestedGraphData2,
  graphDataMap1,
  graphDataMap3,
  graphDataMap4,
  graphDataMap5,
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
    graphDataMap1,
    graphDataMap3,
    graphDataMap4,
    graphDataMap5,
    graphDataPush,
    graphDataPop,
    graphDataNested,
    graphDataNestedPop,
    graphDataNestedInjection,
  },
  __dirname + "/../../docs/",
);
