import "dotenv/config";

import { main as streaming_groq } from "./streaming/groq";
import { main as streaming_openai } from "./streaming/openai";
import { main as streaming_slashgpt } from "./streaming/slashgpt";
import { main as streaming_openai_agent } from "./streaming/openai_agent";

import { main as benchmark } from "../../../agents/llm_agents/samples/benchmarks/benchmark";
import { main as benchmark2 } from "../../../agents/llm_agents/samples/benchmarks/benchmark2";

// import { main as wikipedia } from "../../../agents/llm_agents/samples/embeddings/wikipedia";

import { main as test_fibonacci } from "./test/fibonacci";
import { main as test_loop } from "./test/loop";

import { main as slashgpt } from "./llm/slashgpt";
/*
import { main as groq } from "../../../agents/llm_agents/samples/llm/groq";
import { main as claude } from "../../../agents/llm_agents/samples/llm/claude";
import { main as gpt4o } from "../../../agents/llm_agents/samples/llm/gpt4o";
import { main as interview_jp } from "../../../agents/llm_agents/samples/llm/interview_jp";
import { main as interview } from "../../../agents/llm_agents/samples/llm/interview";
import { main as interview_ollama } from "../../../agents/llm_agents/samples/llm/interview_ollama";
import { main as interview_phi3 } from "../../../agents/llm_agents/samples/llm/interview_phi3";
import { main as research } from "../../../agents/llm_agents/samples/llm/review";
import { main as rewrite } from "../../../agents/llm_agents/samples/llm/rewrite";
import { main as describe_graph } from "../../../agents/llm_agents/samples/llm/describe_graph";
import { main as gemini } from "../../../agents/llm_agents/samples/llm/gemini";
*/

import { main as net_paper_ai } from "./net/paper_ai";

/*
import { main as net_rss } from "../../../agents/llm_agents/samples/net/rss";
import { main as weather } from "../../../agents/llm_agents/samples/net/weather";
*/

import { main as interaction_select } from "./interaction/select";
/*
import { main as interaction_text } from "../../../agents/llm_agents/samples/interaction/text";
import { main as interaction_chat } from "../../../agents/llm_agents/samples/interaction/chat";
import { main as interaction_chat_gemini } from "../../../agents/llm_agents/samples/interaction/chat_gemini";
import { main as interaction_metachat } from "../../../agents/llm_agents/samples/interaction/metachat";
import { main as interaction_metachat_gemini } from "../../../agents/llm_agents/samples/interaction/metachat_gemini";
import { main as interaction_reception } from "../../../agents/llm_agents/samples/interaction/reception";
import { main as interaction_reception_gemini } from "../../../agents/llm_agents/samples/interaction/reception_gemini";
import { main as interaction_wikipedia } from "../../../agents/llm_agents/samples/interaction/wikipedia";
*/
import { main as sample_co2 } from "./tools/sample_co2";
import { main as tools_home } from "./tools/home";
import { main as tools_grop } from "./tools/groq";

const main = async () => {
  // streaming
  await streaming_groq();
  await streaming_openai();
  await streaming_slashgpt();
  await streaming_openai_agent();

  await benchmark();
  await benchmark2();

  //  await wikipedia();

  // test
  await test_fibonacci();
  await test_loop();

  // llm
  await slashgpt();
  /*
  await groq();
  await claude();
  await gpt4o();
  await interview_jp();
  await interview();
  await interview_ollama();
  await interview_phi3();
  await research();
  await rewrite();
  await describe_graph();
  await gemini();
*/
  // interaction
  await interaction_select();
  /*  
  await interaction_text();
  await interaction_chat();
  await interaction_chat_gemini();
  await interaction_metachat();
  await interaction_metachat_gemini();
  await interaction_reception();
  await interaction_reception_gemini();
  await interaction_wikipedia();
*/

  // net
  await net_paper_ai();
  //  await net_rss();
  //  await weather();

  // tools
  await sample_co2();
  await tools_home();
  await tools_grop();
};

main();
