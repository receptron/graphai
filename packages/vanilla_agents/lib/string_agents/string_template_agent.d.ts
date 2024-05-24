import { AgentFunction } from "graphai";
type StringTemplate = string | Record<string, string>;
type StringTemplateObject = StringTemplate | StringTemplate[] | Record<string, StringTemplate>;
export declare const stringTemplateAgent: AgentFunction<{
    template: StringTemplateObject;
}, StringTemplateObject, string>;
declare const stringTemplateAgentInfo: {
    name: string;
    agent: AgentFunction<{
        template: StringTemplateObject;
    }, StringTemplateObject, string>;
    mock: AgentFunction<{
        template: StringTemplateObject;
    }, StringTemplateObject, string>;
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
    category: string[];
    author: string;
    repository: string;
    license: string;
};
export default stringTemplateAgentInfo;
