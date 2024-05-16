import { AgentFunction } from "../../index";
export declare const stringTemplateAgent: AgentFunction<{
    template: any;
}, any, string>;
declare const stringTemplateAgentInfo: {
    name: string;
    agent: AgentFunction<{
        template: any;
    }, any, string>;
    mock: AgentFunction<{
        template: any;
    }, any, string>;
    samples: ({
        inputs: string[];
        params: {
            template: string;
        };
        result: string;
    } | {
        inputs: string[];
        params: {
            template: string[];
        };
        result: string[];
    } | {
        inputs: string[];
        params: {
            template: {
                apple: string;
                lemon: string;
            };
        };
        result: {
            apple: string;
            lemon: string;
        };
    } | {
        inputs: string[];
        params: {
            template: {
                apple: string;
                lemon: string;
            }[];
        };
        result: {
            apple: string;
            lemon: string;
        }[];
    } | {
        inputs: string[];
        params: {
            template: {
                apple: string;
                lemon: string[];
            };
        };
        result: {
            apple: string;
            lemon: string[];
        };
    })[];
    description: string;
    category: never[];
    author: string;
    repository: string;
    license: string;
};
export default stringTemplateAgentInfo;
