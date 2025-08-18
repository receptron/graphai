import { type TransactionLog, type AgentFilterFunction, GraphAI, GraphAILogger } from "graphai";
import * as agents from "@graphai/vanilla";
import { logger } from "./common";
import util from "util";

const graph = {
  version: 0.5,
  nodes: {
    init: {
      value: [],
    },
    nodeA: {
      agent: "copyAgent",
      inputs: {
        data: ":init",
      },
    },
  },
};

// GraphAI Callback logger example
const callback = (log: TransactionLog) => {
  logger(JSON.stringify(log));
};

export const callbackLog = async () => {
  const graphai = new GraphAI(graph, agents);
  graphai.registerCallback(callback);
  const res = (await graphai.run(true)) as any;
  console.log(JSON.stringify(res, null, 2));
};

// GraphAI Agent Filter logger example
const loggerAgentFilter: AgentFilterFunction = async (context, next) => {
  const { debugInfo, namedInputs } = context;
  logger(JSON.stringify({ states: "before", debugInfo, namedInputs }));

  const result = await next(context);
  logger(JSON.stringify({ states: "after", result }));
  return result;
};

export const agentFilterLog = async () => {
  const agentFilters = [
    {
      name: "loggerAgentFilter",
      agent: loggerAgentFilter,
    },
  ];
  const graphai = new GraphAI(graph, agents, { agentFilters });

  const res = (await graphai.run(true)) as any;

  console.log(JSON.stringify(res, null, 2));
};

// customLogger Example
export const customLoggerExample = async () => {
  const consoleAndFileLogger = (level: string, ...args: any[]) => {
    const consoleMethod = (console as any)[level] || console.log;
    consoleMethod(...args);

    const log = `[${level.toUpperCase()}] ` + util.format(...args) + "\n";

    logger(JSON.stringify({ states: "customLogger", log }));
  };

  GraphAILogger.setLogger(consoleAndFileLogger);

  const graphInvalid = {
    version: 0.5,
    nodes: {
      init: {
        value: [],
      },
      nodeA: {
        agent: "pushAgent",
        inputs: {
          data: ":init",
        },
      },
    },
  };

  const graphai = new GraphAI(graphInvalid, agents);

  const res = (await graphai.run(true)) as any;

  console.log(JSON.stringify(res, null, 2));
};

const main = async () => {
  await callbackLog();
  await agentFilterLog();
  await customLoggerExample();
};

main();
