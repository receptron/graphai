import input from "@inquirer/input";

import { stepRunnerGenerator, StepRunnerAwaitFunction } from "./step_runner_generator";

const awaitStep: StepRunnerAwaitFunction = async (context, result) => {
  const { params, namedInputs, debugInfo } = context;
  const { nodeId, agentId, retry, state } = debugInfo;
  console.log({ nodeId, agentId, params, namedInputs, result, state });

  const message = "Puress enter to next";
  await input({ message: message ?? "Next" });
};

export const stepRunner = stepRunnerGenerator(awaitStep);
