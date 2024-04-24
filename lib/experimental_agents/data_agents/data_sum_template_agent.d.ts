import { AgentFunction } from "../../graphai";
export declare const dataSumTemplateAgent: AgentFunction<Record<string, any>, number, number>;
export declare const dataSumTemplateAgentInfo: {
    name: string;
    agent: AgentFunction<Record<string, any>, number, number>;
    mock: AgentFunction<Record<string, any>, number, number>;
};
export default dataSumTemplateAgentInfo;
