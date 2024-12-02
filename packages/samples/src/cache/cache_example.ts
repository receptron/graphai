import { defaultTestContext, GraphAI, AgentFilterFunction } from "graphai";
import * as vanilla_agents from "@graphai/vanilla";
import { agentFilterRunnerBuilder, cacheAgentFilterGenerator } from "@graphai/agent_filters";

import sqlite3 from "sqlite3";

const db = new sqlite3.Database("./test.db");

db.serialize(() => {
  // db.run("drop table if exists cache");
  db.run("create table if not exists cache(key text unique, data)");
});

const setCache = async (key: string, data: any) => {
  await new Promise((resolve) => {
    db.serialize(() => {
      db.run("insert into cache(key, data) values(?,?)", key, JSON.stringify(data));
      resolve(null);
    });
  });
};
const getCache = async (key: string) => {
  return new Promise((resolve) => {
    db.serialize(() => {
      db.all("select * from cache where key = ?", key, (err, rows) => {
        if (rows && rows[0]) {
          console.log("cache hit");
          resolve(JSON.parse((rows[0] as any).data));
        } else {
          resolve(null);
        }
      });
    });
  });
  return null;
};

const main = async () => {
  const cacheAgentFilter = cacheAgentFilterGenerator({ getCache, setCache });

  const agentFilters = [
    {
      name: "cacheAgentFilter",
      agent: cacheAgentFilter,
    },
  ];
  const graphData = {
    version: 0.5,
    nodes: {
      node1: {
        agent: "echoAgent",
        params: {
          abc: "123",
        },
        isResult: true,
      },
      node2: {
        inputs: {
          a: ":node1.abc",
        },
        agent: "echoAgent",
        params: {
          abc: "123",
        },
        isResult: true,
      },
    },
  };
  const graphAI = new GraphAI(graphData, vanilla_agents, { agentFilters });
  const res = await graphAI.run();
  console.log(res);
};

main();
