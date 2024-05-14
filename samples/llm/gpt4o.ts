import "dotenv/config";
import { graphDataTestRunner } from "~/utils/runner";
import { sleeperAgent, openAIAgent } from "@/experimental_agents";

const query =
  "I'd like to write a paper about data flow programming for AI application, which involves multiple asynchronous calls, some of operations are done on other machines (distributed computing). Please come up with the title and an abstract for this paper.";

const graph_data = {
  version: 0.3,
  nodes: {
    messages: {
      value: [
        {
          role: "user",
          content: [{
            type: "text", 
            text: query,
          }]
        }
      ],
    },
    query: {
      agent: "openAIAgent",
      params: {
        model: "gpt-4o",
      },
      isResult: true,
      inputs: [undefined, ":messages"]
    },
    answer: {
      agent: "sleeperAgent",
      inputs: [":query.choices.$0.message"],
      isResult: true,
    },
  },
};

export const main = async () => {
  const result = await graphDataTestRunner(__filename, graph_data, { openAIAgent, sleeperAgent });
  console.log(result);
};

if (process.argv[1] === __filename) {
  main();
}
