import stringSplitterAgentInfo from "@/experimental_agents/string_agents/string_splitter_agent";
import stringTemplateAgentInfo from "@/experimental_agents/string_agents/string_template_agent";

import totalAgentInfo from "@/experimental_agents/data_agents/total_agent";
import dataObjectMergeTemplateAgentInfo from "@/experimental_agents/data_agents/total_agent";
import dataSumTemplateAgentInfo from "@/experimental_agents/data_agents/data_sum_template_agent";

//import sleeperAgentInfo from "@/experimental_agents/sleeper_agents/sleeper_agent";
//import sleeperAgentDebugInfo from "@/experimental_agents/sleeper_agents/sleeper_agent_debug";

// import pushAgentInfo from "@/experimental_agents/array_agents/push_agent";
// import popAgentInfo from "@/experimental_agents/array_agents/pop_agent";
// import shiftAgentInfo from "@/experimental_agents/array_agents/shift_agent";

// import sortByValuesAgent from "@/experimental_agents/matrix_agents/sort_by_values_agent";
// import dotProductAgent from "@/experimental_agents/matrix_agents/dot_product_agent";

// import tokenBoundStringsAgent from "@/experimental_agents/token_agent";
// import * from "./test_agents";

import { agentTestRunner } from "~/utils/runner";

[stringSplitterAgentInfo, stringTemplateAgentInfo, dataSumTemplateAgentInfo, totalAgentInfo, dataObjectMergeTemplateAgentInfo].map((agentInfo) => {
  agentTestRunner(agentInfo);
});
