import { GraphData } from "@/type";
import { parseNodeName } from "@/utils/utils";

export const relationValidator = (data: GraphData, staticNodeIds: string[], computedNodeIds: string[]) => {
  const nodeIds = new Set<string>(Object.keys(data.nodes));

  const pendings: Record<string, Set<string>> = {};
  const waitlist: Record<string, Set<string>> = {};

  // validate input relation and set pendings and wait list
  computedNodeIds.forEach((computedNodeId) => {
    const nodeData = data.nodes[computedNodeId];
    pendings[computedNodeId] = new Set<string>();
    if ("inputs" in nodeData && nodeData && nodeData.inputs) {
      nodeData.inputs.forEach((inputNodeId) => {
        const sourceNodeId = parseNodeName(inputNodeId).nodeId;
        if (sourceNodeId) {
          if (!nodeIds.has(sourceNodeId)) {
            throw new Error(`Inputs not match: NodeId ${computedNodeId}, Inputs: ${sourceNodeId}`);
          }
          waitlist[sourceNodeId] === undefined && (waitlist[sourceNodeId] = new Set<string>());
          pendings[computedNodeId].add(sourceNodeId);
          waitlist[sourceNodeId].add(computedNodeId);
        }
      });
    }
  });

  // TODO. validate update
  staticNodeIds.forEach((staticNodeId) => {
    const nodeData = data.nodes[staticNodeId];
    if ("value" in nodeData && nodeData.update) {
      const update = nodeData.update;
      const updateNodeId = parseNodeName(update).nodeId;
      if (!updateNodeId) {
        throw new Error("Update it a literal");
      }
      if (!nodeIds.has(updateNodeId)) {
        throw new Error(`Update not match: NodeId ${staticNodeId}, update: ${update}`);
      }
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
