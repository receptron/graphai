import { Arguments } from "yargs";
import { AgentFunctionInfo } from "graphai";

export const option = (args: Arguments, packages: Record<string, AgentFunctionInfo>) => {
  const list = () => {
    console.log("Available Agents");
    console.log(
      Object.entries(packages)
        .map(([k, v]) => "* " + k + " - " + v.description)
        .sort()
        .join("\n"),
    );
  };

  const getAgent = (agentId: string) => {
    return Object.entries(packages).find(([k, __v]) => k === agentId);
  };
  const detail = () => {
    const agent = getAgent(args.detail as string);
    if (!agent) {
      console.log("no agent: " + args.detail);
      return;
    }
    console.log("* " + agent[0]);
    const detail = agent[1];
    console.log([detail.name, " - ", detail.description].join(""));
    console.log("Author " + detail.author);
    console.log("Repository " + detail.repository);
    console.log("Licence " + detail.license);
  };
  const sample = () => {
    const agent = getAgent(args.sample as string);
    if (!agent) {
      console.log("no agent: " + args.sample);
      return;
    }
    const detail = agent[1];
    console.log("* " + agent[0]);
    console.log(JSON.stringify(detail.samples, null, 2));
  };

  if (args.list) {
    list();
  }
  if (args.detail) {
    detail();
  }
  if (args.sample) {
    sample();
  }
};
