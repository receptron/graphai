import { AgentFunction } from "../../graphai";
export declare const propertyFilterAgent: AgentFunction<{
    include?: Array<string>;
    exclude?: Array<string>;
    alter?: Record<string, Record<string, string>>;
}>;
declare const propertyFilterAgentInfo: {
    name: string;
    agent: AgentFunction<{
        include?: string[] | undefined;
        exclude?: string[] | undefined;
        alter?: Record<string, Record<string, string>> | undefined;
    }>;
    mock: AgentFunction<{
        include?: string[] | undefined;
        exclude?: string[] | undefined;
        alter?: Record<string, Record<string, string>> | undefined;
    }>;
    samples: ({
        inputs: {
            color: string;
            model: string;
            type: string;
            maker: string;
            range: number;
        }[][];
        params: {
            include: string[];
            exclude?: undefined;
            alter?: undefined;
        };
        result: {
            color: string;
            model: string;
        }[];
    } | {
        inputs: {
            color: string;
            model: string;
            type: string;
            maker: string;
            range: number;
        }[][];
        params: {
            exclude: string[];
            include?: undefined;
            alter?: undefined;
        };
        result: {
            type: string;
            maker: string;
            range: number;
        }[];
    } | {
        inputs: {
            color: string;
            model: string;
            type: string;
            maker: string;
            range: number;
        }[][];
        params: {
            alter: {
                color: {
                    red: string;
                    blue: string;
                };
            };
            include?: undefined;
            exclude?: undefined;
        };
        result: {
            color: string;
            model: string;
            type: string;
            maker: string;
            range: number;
        }[];
    })[];
    description: string;
    category: string[];
    author: string;
    repository: string;
    license: string;
};
export default propertyFilterAgentInfo;
