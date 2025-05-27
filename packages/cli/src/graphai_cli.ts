#!/usr/bin/env node

import "dotenv/config";
import { GraphAI } from "graphai";
import * as packages from "@graphai/agents";
import { tokenBoundStringsAgent } from "@graphai/token_bound_string_agent";
import { fileReadAgent, fileWriteAgent, pathUtilsAgent } from "@graphai/vanilla_node_agents";
import { streamAgentFilterGenerator } from "@graphai/stream_agent_filter";
import fs from "fs";
import path from "path";
import yaml from "yaml";

import { hasOption, args } from "./args";
import { readGraphaiData, mkdirLogDir, callbackLog } from "@receptron/test_utils";
import { option } from "./options";
import { mermaid } from "./mermaid";

const fileFullPath = (file: string) => {
  return path.isAbsolute(file) ? file : path.resolve(process.cwd(), file);
};

const agents = {
  ...packages,
  tokenBoundStringsAgent,
  fileReadAgent,
  fileWriteAgent,
  pathUtilsAgent,
};

const main = async () => {
  if (hasOption) {
    option(args, agents);
    return;
  }
  const file_path = fileFullPath(args.yaml_or_json_file as string);
  if (!fs.existsSync(file_path)) {
    console.log("no file exist: " + file_path);
    return;
  }
  if (args.log) {
    const logfile = fileFullPath(args.log);
    mkdirLogDir(path.dirname(logfile));
  }
  try {
    const graph_data = readGraphaiData(file_path);

    if (args.mermaid) {
      mermaid(graph_data);
      return;
    }
    if (args.json) {
      console.log(JSON.stringify(graph_data, null, 2));
      return;
    }
    if (args.yaml) {
      console.log(yaml.stringify(graph_data, null, 2));
      return;
    }
    const fds: Record<string, any> = {};
    let fdsIndex = 3;
    const getFd = (nodeId: string) => {
      if (fds[nodeId]) {
        return fds[nodeId];
      }
      fds[nodeId] = fs.createWriteStream(null as any, { fd: fdsIndex });
      fds[nodeId].on("error", () => {
        // nothing
      });
      fdsIndex = fdsIndex + 1;
      return fds[nodeId];
    };

    const consoleStreamAgentFilter = streamAgentFilterGenerator<string>((context, data) => {
      const fd = getFd(context.debugInfo.nodeId);
      try {
        fd.write(data);
      } catch (e) {
        // nothinfg
      }
      process.stdout.write(data);
    });

    const agentFilters = [
      {
        name: "consoleStreamAgentFilter",
        agent: consoleStreamAgentFilter,
      },
    ];
    const graph = new GraphAI(graph_data, agents, { agentFilters });

    if (args.verbose) {
      graph.onLogCallback = callbackLog;
    }
    if (args.i) {
      args.i.forEach((injectValue) => {
        const [key, value] = String(injectValue).split("=");
        if (key && value) {
          graph.injectValue(key, value);
        }
      });
    }
    try {
      const resultAll = !!args.all;
      const results = await graph.run(resultAll);
      console.log(JSON.stringify(results, null, 2));
    } catch (e) {
      console.log("error", e);
    }

    if (args.log) {
      const logfile = fileFullPath(args.log);
      fs.writeFileSync(logfile, JSON.stringify(graph.transactionLogs(), null, 2));
    }
  } catch (e) {
    console.log("error", e);
  }
};

main();
