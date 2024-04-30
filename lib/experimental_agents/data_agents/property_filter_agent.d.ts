import { AgentFunction } from "../../graphai";
export declare const propertyFilterAgent: AgentFunction<{
    include?: Array<string>;
    exclude?: Array<string>;
}>;
declare const propertyFilterAgentInfo: {
    name: string;
    agent: AgentFunction<{
        include?: string[] | undefined;
        exclude?: string[] | undefined;
    }>;
    mock: AgentFunction<{
        include?: string[] | undefined;
        exclude?: string[] | undefined;
    }>;
    samples: ({
        inputs: {
            color: string;
            model: string;
            type: string;
            maker: string;
            range: number;
        }[];
        params: {
            include: string[];
            exclude?: undefined;
        };
        result: {
            color: string;
            model: string;
            type?: undefined;
            maker?: undefined;
            range?: undefined;
        };
    } | {
        inputs: {
            color: string;
            model: string;
            type: string;
            maker: string;
            range: number;
        }[];
        params: {
            exclude: string[];
            include?: undefined;
        };
        result: {
            type: string;
            maker: string;
            range: number;
            color?: undefined;
            model?: undefined;
        };
    })[];
    description: string;
    category: string[];
    author: string;
    repository: string;
    license: string;
};
export default propertyFilterAgentInfo;
