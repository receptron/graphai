import "dotenv/config";
import { graphDataTestRunner } from "@/utils/test_runner";
import * as agents from "@graphai/agents";
import * as path from "path";
import * as fs from "fs";
import { graph_data } from "../net/weather";

const filePath = path.join(__dirname, "../../../../README.md");
const document = fs.readFileSync(filePath, "utf8");
const sample_output = `
This sample graph was designed to simulate an interview with a famous person. The flow involves multiple agents working together to process user input, generate conversational context, and manage an iterative chat process.

1. The user is prompted to input the name of a famous person through the \`name\` node.
2. The \`context\` node generates the interview context using the input name.
3. The \`messages\` node initializes the conversation with system and greeting messages.
4. The \`chat\` node manages the conversation flow using a nested graph, iterating 6 times.
5. Within the nested graph:
   - The \`groq\` node generates a response from the model.
   - The \`output\` node formats the response and prints it to the console.
   - The \`reducer\` node appends the new message to the messages array.
   - The \`swappedContext\` node swaps the roles of interviewer and interviewee.
   - The \`swappedMessages\` node updates the messages for the next iteration.
6. The cycle repeats for 6 iterations, simulating a back-and-forth interview.
`;

const graph_data_explain = {
  version: 0.3,
  nodes: {
    describer: {
      agent: "openAIAgent",
      params: {
        model: "gpt-4o",
        system:
          "You an expert in GraphAI programming. You are responsible in reading the graph data an explain how it works.\n" +
          "Here is the documation of GraphAI.\n" +
          document +
          "\n[Sample Output]\n" +
          sample_output,
      },
      inputs: [JSON.stringify(graph_data, null, 2)],
    },
    description: {
      agent: "copyAgent",
      inputs: [":describer.choices.$0.message.content"],
      isResult: true,
    },
  },
};

export const main = async () => {
  const result = await graphDataTestRunner(__dirname, __filename, graph_data_explain, agents);
  console.log(result.description);
};

if (process.argv[1] === __filename) {
  main();
}
