import dataSumTemplateAgentInfo from "@/experimental_agents/data_agents/data_sum_template_agent";
import totalAgentInfo from "@/experimental_agents/data_agents/total_agent";

import { agentTestRunner } from "~/utils/runner";

[dataSumTemplateAgentInfo, totalAgentInfo].map((agentInfo) => {
  agentTestRunner(agentInfo);
});
