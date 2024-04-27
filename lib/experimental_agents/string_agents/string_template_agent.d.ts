import { AgentFunction } from "../../graphai";
export declare const stringTemplateAgent: AgentFunction<{
    template: string;
}, Record<string, any> | string, string>;
declare const stringTemplateAgentInfo: {
    name: string;
    agent: AgentFunction<{
        template: string;
    }, string | Record<string, any>, string>;
    mock: AgentFunction<{
        template: string;
    }, string | Record<string, any>, string>;
    samples: {
        inputs: string[];
        params: {
            template: string;
        };
        result: {
            content: string;
        };
    }[];
    description: string;
    author: string;
    repository: string;
    license: string;
};
export default stringTemplateAgentInfo;
