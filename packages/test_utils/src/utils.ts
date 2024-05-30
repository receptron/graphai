import { NodeState, TransactionLog } from "graphai";

export const anonymization = (data: Record<string, any>) => {
  return JSON.parse(JSON.stringify(data));
};

export const callbackLog = ({ nodeId, state, inputs, result, errorMessage }: TransactionLog) => {
  if (state === NodeState.Executing) {
    console.log(`${nodeId.padEnd(10)} =>( ${(JSON.stringify(inputs) ?? "").slice(0, 60)}`);
  } else if (state === NodeState.Injected || state == NodeState.Completed) {
    const shortName = state === NodeState.Injected ? "=  " : "{} ";
    console.log(`${nodeId.padEnd(10)} ${shortName} ${(JSON.stringify(result) ?? "").slice(0, 60)}`);
  } else if (state == NodeState.Failed) {
    console.log(`${nodeId.padEnd(10)} ERR ${(errorMessage ?? "").slice(0, 60)}`);
  } else {
    console.log(`${nodeId.padEnd(10)} ${state}`);
  }
};
