import "dotenv/config";
import { graphDataTestRunner } from "~/utils/runner";
import { groqAgent, openAIAgent, nestedAgent, copyAgent, propertyFilterAgent, stringTemplateAgent, wikipediaAgent, jsonParserAgent } from "@/experimental_agents";
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
        system:
          "You are responsible in identifying the language of the input and translate it into English. " +
          "Call the 'translated' function with 'language' and 'englishTranslation'. " +
          "If the input is already in English, call the 'translated' function with 'englishTranslate=the input text', and 'langage=English'.",
        tools: tools_translated,
        tool_choice: { type: "function", function: { name: "translated" } },
      },
      inputs: [":$0"],
    },
    parser: {
      agent: "jsonParserAgent",
      inputs: [":identifier.choices.$0.message.tool_calls.$0.function.arguments"],
    },
    extractor: {
      agent: "stringTemplateAgent",
      params: {
        template: {
          language: "${0}",
          text: "${1}",
        },
      },
      inputs: [":parser.language", ":parser.englishTranslation"],
    },
    result: {
      agent: "propertyFilterAgent",
      params: {
        inspect: [{
          propId: "isEnglish",
          equal: "English",
          // from: 1, // implied
        },{
          propId: "isNonEnglish",
          notEqual: "English",
        }]
      },
      inputs: [":extractor", ":extractor.language"],
      isResult: true,
    },
  },
};

const wikipedia_graph = {
  nodes: {
    wikipedia: {
      agent: "wikipediaAgent",
      console: {
        before: "Fetching data from Wikipedia...",
      },
      params: {
        lang: "en",
      },
      inputs: [":$0"],
    },
    summary: {
      agent: "openAIAgent",
      console: {
        before: "Summarizing it...",
      },
      params: {
        model: "gpt-4o",
        system: "Summarize the text below in 200 words",
      },
      inputs: [":wikipedia.content"],
    },
    result: {
      agent: "copyAgent",
      isResult: true,
      inputs: [":summary.choices.$0.message.content"],
    },
  },
};

const translator_graph = {
  nodes: {
    english: {
      agent: "copyAgent",
      if: ":$1.isEnglish",
      inputs: [":$0"],
    },
    nonEnglish: {
      agent: "stringTemplateAgent",
      params: {
        template: "Translate the text below into ${0}",
      },
      inputs: [":$1.language"],
      if: ":$1.isNonEnglish",
      isResult: true,
    },
    translate: {
      agent: "openAIAgent",
      console: {
        before: "Translating it...",
      },
      params: {
        model: "gpt-4o",
        system: ":nonEnglish",
      },
      inputs: [":$0"],
      isResult: true,
    },
    result: {
      agent: "copyAgent",
      anyInput: true,
      inputs: [":english", ":translate.choices.$0.message.content"],
      isResult: true,
    },
  },
};

const graph_data = {
  version: 0.3,
  nodes: {
    topic: {
      agent: () => input({ message: "Type the topic you want to research:" }),
    },
    detector: {
      agent: "nestedAgent",
      console: {
        before: "Detecting language...",
      },
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
    translate: {
      agent: "nestedAgent",
      inputs: [":wikipedia.result", ":detector.result"],
      isResult: true,
      graph: translator_graph,
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
      wikipediaAgent,
      jsonParserAgent,
      stringTemplateAgent,
    },
    () => {},
    false,
  );
  console.log(result.translate.result);
};

if (process.argv[1] === __filename) {
  main();
}
