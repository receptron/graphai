import yargs from "yargs";

export const hasOption = ["-l", "--list", "-d", "--detail", "-s", "--sample"].some((o) => process.argv.includes(o));

export const args = yargs
  .scriptName("graphai")
  .option("list", {
    alias: "l",
    description: "agents list",
  })
  .option("sample", {
    alias: "s",
    description: "agent sample data",
    type: "string",
  })
  .option("d", {
    alias: "detail",
    describe: "agent detail",
    type: "string",
  })
  .option("v", {
    alias: "verbose",
    describe: "verbose log",
    demandOption: true,
    default: false,
    type: "boolean",
  })
  .option("m", {
    alias: "mermaid",
    describe: "mermaid",
    demandOption: true,
    default: false,
    type: "boolean",
  })
  .option("yaml", {
    describe: "dump yaml",
    demandOption: true,
    default: false,
    type: "boolean",
  })
  .option("json", {
    describe: "dump json",
    demandOption: true,
    default: false,
    type: "boolean",
  })
  .option("log", {
    description: "output log",
    demandOption: false,
    type: "string",
  })
  .command(hasOption ? "* [yaml_or_json_file]" : "* <yaml_or_json_file>", "run GraphAI with GraphAI file.")
  .positional("yaml_or_json_file", {
    describe: "yaml or json file",
    type: "string",
    demandOption: hasOption,
  })
  .parseSync();
