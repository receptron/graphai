import "dotenv/config";
import { graphDataTestRunner } from "@/utils/test_runner";
import * as agents from "@graphai/agents";

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
      // Ask the LLM to identify the language of :$0 (the first input to this graph).
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
      // Parses the arguments
      agent: "jsonParserAgent",
      inputs: [":identifier.choices.$0.message.tool_calls.$0.function.arguments"],
    },
    extractor: {
      // Creates a language context
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
      // Sets the isEnglish flag to the context.
      agent: "propertyFilterAgent",
      params: {
        inspect: [
          {
            propId: "isEnglish",
            equal: "English",
            // from: 1, // implied
          },
        ],
      },
      inputs: [":extractor", ":extractor.language"],
      isResult: true,
    },
  },
};

const wikipedia_graph = {
  nodes: {
    wikipedia: {
      // Fetches the content of the specified topic in :$0 (first parameter)
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
      // Asks the LLM to summarize it.
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
      // Extracts the response from the generated message
      agent: "copyAgent",
      isResult: true,
      inputs: [":summary.choices.$0.message.content"],
    },
  },
};

const translator_graph = {
  nodes: {
    english: {
      // Copies the input data ($0) if the context language is English
      agent: "copyAgent",
      if: ":$1.isEnglish",
      inputs: [":$0"],
    },
    nonEnglish: {
      // Prepares the prompt if the context language is not English.
      agent: "stringTemplateAgent",
      params: {
        template: "Translate the text below into ${0}",
      },
      inputs: [":$1.language"],
      unless: ":$1.isEnglish",
      isResult: true,
    },
    translate: {
      // Asks the LLM to translate the input data ($0)
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
      // Makes the result of either pass available
      agent: "copyAgent",
      anyInput: true,
      inputs: [":english", ":translate.choices.$0.message.content"],
      isResult: true,
    },
  },
};

export const graph_data = {
  version: 0.3,
  nodes: {
    topic: {
      // Gets the research topic from the user.
      agent: "textInputAgent",
      params: {
        message: "Type the topic you want to research:",
      },
    },
    detector: {
      // Detect the language and creates the language context.
      agent: "nestedAgent",
      console: {
        before: "Detecting language...",
      },
      inputs: [":topic"],
      graph: language_detection_graph,
      isResult: true,
    },
    wikipedia: {
      // Retrieves the Wikipedia content for the spcified topic and summarize it in English.
      agent: "nestedAgent",
      inputs: [":detector.result.text"],
      isResult: true,
      graph: wikipedia_graph,
    },
    translate: {
      // Tranalte it into the appropriate language if necessary.
      agent: "nestedAgent",
      inputs: [":wikipedia.result", ":detector.result"],
      isResult: true,
      graph: translator_graph,
    },
  },
};

export const main = async () => {
  const result: any = await graphDataTestRunner(
    __dirname,
    __filename,
    graph_data,
    agents,
    () => {},
    false,
  );
  console.log(result.translate.result);
};

if (process.argv[1] === __filename) {
  main();
}
