import { main as gpt } from "./sample_gpt";
import { main as interaction } from "./interaction";
import { main as sample_co2 } from "./sample_co2";
import { main as sample_paper_ai } from "./sample_paper_ai";

const main = async () => {
  await gpt();
  await interaction();
  await sample_co2();
  await sample_paper_ai();
};

main();
