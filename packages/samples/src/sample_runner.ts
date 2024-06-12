import "dotenv/config";

import { main as streaming_groq } from "./streaming/groq";
import { main as streaming_openai } from "./streaming/openai";
import { main as streaming_slashgpt } from "./streaming/slashgpt";
import { main as streaming_openai_agent } from "./streaming/openai_agent";

import { main as benchmark } from "../../../agents/llm_agents/samples/benchmarks/benchmark";
import { main as benchmark2 } from "../../../agents/llm_agents/samples/benchmarks/benchmark2";

import { main as test_fibonacci } from "./test/fibonacci";
import { main as test_loop } from "./test/loop";

import { main as slashgpt } from "./llm/slashgpt";

import { main as net_paper_ai } from "./net/paper_ai";

import { main as interaction_select } from "./interaction/select";

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

  // test
  await test_fibonacci();
  await test_loop();

  // llm
  await slashgpt();

  // interaction
  await interaction_select();

  // net
  await net_paper_ai();

  // tools
  await sample_co2();
  await tools_home();
  await tools_grop();
};

main();
