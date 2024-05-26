import path from "path";
import { AgentFunction } from "graphai";
import { ChatSession, ChatConfig, ManifestData, ChatData } from "slashgpt";

const config = new ChatConfig(path.resolve(__dirname));

export const slashGPTAgent: AgentFunction<
  {
    manifest: ManifestData;
    query?: string;
    function_result?: boolean;
  },
  ChatData[],
  string
> = async ({ params, inputs, debugInfo: { verbose, nodeId }, filterParams }) => {
  if (verbose) {
    console.log("executing", nodeId, params);
  }
  const session = new ChatSession(config, params.manifest ?? {});

  const query = params?.query ? [params.query] : [];
  const contents = query.concat(inputs);

  session.append_user_question(contents.join("\n"));
  await session.call_loop(
    () => {},
    (token: string) => {
      if (filterParams && filterParams.streamTokenCallback && token) {
        filterParams.streamTokenCallback(token);
      }
    },
  );
  return session.history.messages();
};

const slashGPTAgentInfo = {
  name: "slashGPTAgent",
  agent: slashGPTAgent,
  mock: slashGPTAgent,
  samples: [
    {
      inputs: [],
      params: {
        query: "Come up with ten business ideas for AI startup",
      },
      result: [
        {
          role: "user",
          content: "Come up with ten business ideas for AI startup",
          preset: false,
        },
        {
          role: "assistant",
          content:
            "1. AI-powered personal shopping assistant that helps users find clothes that fit their style and budget.\n2. AI-powered health monitoring system that analyzes user data to provide personalized healthcare recommendations.\n3. AI-powered chatbot for customer service that can handle a variety of queries and provide quick responses.\n4. AI-powered virtual personal trainer that creates customized workout plans based on user goals and progress.\n5. AI-powered language translation service that can accurately translate text and voice in real-time.\n6. AI-powered financial advisor that analyzes user spending habits and offers personalized advice for saving and investing.\n7. AI-powered content creation platform that uses algorithms to generate engaging articles, videos, and social media posts.\n8. AI-powered job matching platform that connects job seekers with relevant opportunities based on their skills and experience.\n9. AI-powered cybersecurity solution that continuously monitors and protects against online threats and data breaches.\n10. AI-powered educational platform that uses personalized learning algorithms to help students improve their skills and knowledge in various subjects.",
          preset: false,
        },
      ],
    },
  ],
  skipTest: true,
  description: "Slash GPT Agent",
  category: ["llm"],
  author: "Receptron team",
  repository: "https://github.com/receptron/graphai",
  license: "MIT",

  stream: true,
  npms: ["slashgpt"],
};
export default slashGPTAgentInfo;
