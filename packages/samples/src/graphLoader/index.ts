import { GraphAI, GraphDataLoaderOption, GraphData } from "graphai";
import * as agents from "@graphai/vanilla";

import { parse } from "yaml";
import { readFileSync } from "fs";

const baseGraph = {
  version: 0.5,
  nodes: {
    inputs: {
      value: "fromParent",
    },
    fromParent: {
      agent: "nestedAgent",
      graphLoader: {
        fileName: "child.yaml",
      },
      inputs: {
        data: ":inputs",
      },
    },
    setting: {
      agent: "nestedAgent",
      graphLoader: {
        fileName: "child.yaml",
        option: {
          setting: "setting.yaml",
        },
      },
    },
  },
};

const readYaml = (fileName: string) => {
  const path = __dirname + "/" + fileName;
  const yamlStr = readFileSync(path, "utf8");
  const ret = parse(yamlStr);
  return ret;
};

export const main = async () => {
  const graphLoader = (args: GraphDataLoaderOption) => {
    const { fileName, option } = args;
    const graphData = readYaml(fileName);
    if (option && option.setting) {
      const settings = readYaml(option.setting);
      graphData.nodes["data"] = { value: settings.data };
    }
    return graphData as GraphData;
  };
  const graph = new GraphAI(baseGraph, agents, { graphLoader });
  const result = await graph.run(true);
  console.log(result);
};

main();
