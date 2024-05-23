import { AgentFunction } from "../../index";
export declare const sortByValuesAgent: AgentFunction<{
    assendant?: boolean;
}, Array<any>, Array<any>>;
declare const sortByValuesAgentInfo: {
    name: string;
    agent: AgentFunction<{
        assendant?: boolean | undefined;
    }, any[], any[]>;
    mock: AgentFunction<{
        assendant?: boolean | undefined;
    }, any[], any[]>;
    samples: ({
        inputs: (string[] | number[])[];
        params: {
            assendant?: undefined;
        };
        result: string[];
    } | {
        inputs: (string[] | number[])[];
        params: {
            assendant: boolean;
        };
        result: string[];
    })[];
    description: string;
    category: string[];
    author: string;
    repository: string;
    license: string;
};
export default sortByValuesAgentInfo;
