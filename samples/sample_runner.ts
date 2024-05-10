import "dotenv/config";

import { main as slashgpt } from "./llm/slashgpt";
import { main as interaction_text } from "./interaction/text";
import { main as interaction_select } from "./interaction/select";
import { main as sample_co2 } from "./sample_co2";
import { main as sample_paper_ai } from "./sample_paper_ai";
import { main as home } from "./home";

const main = async () => {
  await slashgpt();
  await interaction_text();
  await interaction_select();
  await sample_co2();
  await sample_paper_ai();
  await home();
};

main();
