import "dotenv/config";
import { graphDataTestRunner } from "~/utils/runner";
import { groqAgent, openAIAgent, nestedAgent, copyAgent, propertyFilterAgent } from "@/experimental_agents";
import input from "@inquirer/input";

const tools = [
  {
    type: "function",
    function: {
      name: "translated",
      description: "Report the langauge of the input and its English translation.",
      parameters: {
        type: "object",
        properties: {
          englishTranslation: {
            type: "string",
            description: "English translation of the input",
          },
          language: {
            type: "string",
            description: "Identified language",
            values: ["English", "Japanese", "French", "Spenish", "Italian"],
          },
        },
        required: ["result"],
      },
    },
  },
];

const graph_data = {
  version: 0.3,
  nodes: {
    topic: {
      agent: () => input({ message: "Type the topic you want to research:" }),
    },
    translator: {
      agent: "nestedAgent",
      isResult: true,
      inputs: [":topic"],
      params: {
        namedInputs: ["topic"],
      },
      graph: {
        nodes: {
          identifier: {
            // This node sends those messages to Llama3 on groq to get the answer.
            agent: "openAIAgent",
            params: {
              model: "gpt-4o",
              system: "You are responsible in identifying the language of the input and translate it into English. " +
                    "Call the 'translated' function with 'language' and 'englishTranslation'. " +
                    "If the input is already in English, call the 'translated' function with 'englishTranslate=the input text', and 'langage=English'." ,
              tools,
              tool_choice: { type: "function", function: { name: "translated" } },
            },
            inputs: [":topic"],
          },
          parser: {
            agent: (args: string) => JSON.parse(args),
            inputs: [":identifier.choices.$0.message.tool_calls.$0.function.arguments"],
          },
          result: {
            agent: "propertyFilterAgent",
            params: {
              inject: [{
                propId: 'language',
                from: 1,
              },{
                propId: 'text',
                from: 2,
              }]
            },
            inputs: [{}, ":parser.language", ":parser.englishTranslation"],
            isResult: true
          }
        }
      },
    },
  },
};

export const main = async () => {
  const result: any = await graphDataTestRunner(
    __filename,
    graph_data,
    {
      groqAgent,
      nestedAgent,
      copyAgent,
      openAIAgent,
      propertyFilterAgent,
    },
    () => {},
    false,
  );
  console.log(JSON.stringify(result, null, 2));
};

if (process.argv[1] === __filename) {
  main();
}
