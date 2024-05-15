import "dotenv/config";
import { graphDataTestRunner } from "~/utils/runner";
import { groqAgent, openAIAgent, nestedAgent, copyAgent, propertyFilterAgent, wikipediaAgent } from "@/experimental_agents";
import input from "@inquirer/input";

const tools_translated = [
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

const language_detection_graph = {
  nodes: {
    identifier: {
      // This node sends those messages to Llama3 on groq to get the answer.
      agent: "openAIAgent",
      params: {
        model: "gpt-4o",
        system: "You are responsible in identifying the language of the input and translate it into English. " +
              "Call the 'translated' function with 'language' and 'englishTranslation'. " +
              "If the input is already in English, call the 'translated' function with 'englishTranslate=the input text', and 'langage=English'." ,
        tools: tools_translated,
        tool_choice: { type: "function", function: { name: "translated" } },
      },
      inputs: [":$0"],
    },
    parser: {
      agent: (args: string) => JSON.parse(args),
      inputs: [":identifier.choices.$0.message.tool_calls.$0.function.arguments"],
    },
    extractor: {
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
    },
    result: {
      agent: (data: Record<string, any>) => ({
        isEnglish: data.language === "English",
        isNonEnglish: data.language !== "English",
        ...data
      }),
      inputs: [":extractor"],
      isResult: true
    },
  }
};

const wikipedia_graph = {
  nodes: {
    wikipedia: {
      agent: "wikipediaAgent",
      params: {
        lang: "en",
      },
      inputs: [":$0"],
    },
    summary: {
      agent: "openAIAgent",
      params: {
        model: "gpt-4o",
        system: "Summarize the text below in 200 words" ,
      },
      inputs: [":wikipedia.content"],
    },
    result: {
      agent: "copyAgent",
      isResult: true,
      inputs: [":summary.choices.$0.message.content"]
    }
  }
};

const graph_data = {
  version: 0.3,
  nodes: {
    topic: {
      agent: () => input({ message: "Type the topic you want to research:" }),
    },
    detector: {
      agent: "nestedAgent",
      inputs: [":topic"],
      graph: language_detection_graph,
      isResult: true,
    },
    wikipedia: {
      agent: "nestedAgent",
      inputs: [":detector.result.text"],
      isResult: true,
      graph: wikipedia_graph,
    },
    english: {
      agent: "copyAgent",
      if: ":detector.result.isEnglish",
      inputs: [":wikipedia.result"],
    },
    nonEnglish: {
      agent: "stringTemplateAgent",
      params: {
        template: "Translate the text below into ${0}"
      },
      inputs: [":detector.result.language"],
      if: ":detector.result.isNonEnglish",
      isResult: true,
    },
    translate: {
      agent: "openAIAgent",
      params: {
        model: "gpt-4o",
        system: ":nonEnglish" ,
      },
      inputs: [":wikipedia.result"],
      isResult: true,
    },
    result: {
      agent: "copyAgent",
      anyInput: true,
      inputs: [":english", ":translate.choices.$0.message.content"],
      isResult: true
    }
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
      wikipediaAgent,
    },
    () => {},
    false,
  );
  console.log(result.result);
};

if (process.argv[1] === __filename) {
  main();
}
