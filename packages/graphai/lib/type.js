"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeState = void 0;
var NodeState;
(function (NodeState) {
    NodeState["Waiting"] = "waiting";
    NodeState["Queued"] = "queued";
    NodeState["Executing"] = "executing";
    NodeState["ExecutingServer"] = "executing-server";
    NodeState["Failed"] = "failed";
    NodeState["TimedOut"] = "timed-out";
    NodeState["Completed"] = "completed";
    NodeState["Injected"] = "injected";
    NodeState["Skipped"] = "skipped";
})(NodeState || (exports.NodeState = NodeState = {}));
