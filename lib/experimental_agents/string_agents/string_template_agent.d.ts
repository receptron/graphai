import { AgentFunction } from "../../graphai";
export declare const stringTemplateAgent: AgentFunction<{
    template: string;
}, string, string>;
declare const stringTemplateAgentInfo: {
    name: string;
    agent: AgentFunction<{
        template: string;
    }, string, string>;
    mock: AgentFunction<{
        template: string;
    }, string, string>;
    samples: {
        inputs: string[];
        params: {
            template: string;
        };
        result: string;
    }[];
    description: string;
    category: never[];
    author: string;
    repository: string;
    license: string;
};
export default stringTemplateAgentInfo;
