import { GraphAI, AgentFunction } from "@/graphai";
import * as readline from 'readline';
import path from "path";
import * as fs from "fs";
import { testAgent } from "~/agents/agents";

const getUserInput = async (question: string) : Promise<string> => {
  return new Promise((resolve, reject) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

const graph_data = {
  nodes: {
    node1: {
    }
  }
};

const runAgent = async (query: string) => {
  console.log("query=", query);
  const graph = new GraphAI(graph_data, testAgent);
  const result = await graph.run();
  const log_path = path.resolve(__dirname) + "/../tests/logs/interaction.log"
  fs.writeFileSync(log_path, JSON.stringify(graph.transactionLogs(), null, 2));
  console.log(result);
};

const main = async () => {
  const query = await getUserInput('Please enter your question: ');    
  await runAgent(query);
  console.log("COMPLETE 1");
};

main();