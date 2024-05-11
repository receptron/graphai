import "dotenv/config";

import { main as streaming_groq } from "./streaming/groq";
import { main as streaming_openai } from "./streaming/openai";
import { main as streaming_slashgpt } from "./streaming/slashgpt";
import { main as streaming_openai_agent } from "./streaming/openai_agent";

import { main as slashgpt } from "./llm/slashgpt";
import { main as groq } from "./llm/groq";
import { main as interaction_text } from "./interaction/text";
import { main as interaction_select } from "./interaction/select";
import { main as sample_co2 } from "./tools/sample_co2";
import { main as tools_home } from "./tools/home";
import { main as net_paper_ai } from "./net/paper_ai";

const main = async () => {
  // streaming
  await streaming_groq();
  await streaming_openai();
  await streaming_slashgpt();
  await streaming_openai_agent();

  // llm
  await slashgpt();
  await groq();
  // interaction
  await interaction_text();
  await interaction_select();
  // chat wikipedia

  // tools
  await sample_co2();
  await tools_home();

  await net_paper_ai();
};

main();
