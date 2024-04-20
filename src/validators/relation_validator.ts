import { GraphData } from "@/type";

export const relationValidator = (data: GraphData, staticNodeIds: string[], computedNodeIds: string[]) => {
  const nodeIds = Object.keys(data.nodes);

  const pendings: Record<string, Set<string>> = {};
  const waitlist: Record<string, Set<string>> = {};

  // validate input relation and set pendings and wait list
  computedNodeIds.forEach((nodeId) => {
    const nodeData = data.nodes[nodeId];
    pendings[nodeId] = new Set<string>();
    if (nodeData.inputs) {
      nodeData.inputs.forEach((inputNodeId) => {
        const input = inputNodeId.split(".")[0];
        if (!nodeIds.includes(input)) {
          throw new Error(`Inputs not match: NodeId ${nodeId}, Inputs: ${input}`);
        }
        waitlist[input] === undefined && (waitlist[input] = new Set<string>());
        pendings[nodeId].add(input);
        waitlist[input].add(nodeId);
      });
    }
  });

  const cycle = (possibles: string[]) => {
    possibles.forEach((possobleNodeId) => {
      (waitlist[possobleNodeId] || []).forEach((waitingNodeId) => {
        pendings[waitingNodeId].delete(possobleNodeId);
      });
    });

    const running: string[] = [];
    Object.keys(pendings).forEach((pendingNodeId) => {
      if (pendings[pendingNodeId].size === 0) {
        running.push(pendingNodeId);
        delete pendings[pendingNodeId];
      }
    });
    return running;
  };

  let runningQueue = cycle(staticNodeIds);
  if (runningQueue.length === 0) {
    throw new Error("No Initial Runnning Node");
  }

  do {
    runningQueue = cycle(runningQueue);
  } while (runningQueue.length > 0);

  if (Object.keys(pendings).length > 0) {
    throw new Error("Some nodes are not executed: " + Object.keys(pendings).join(", "));
  }
};
