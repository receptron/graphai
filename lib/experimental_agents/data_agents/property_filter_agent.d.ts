import { AgentFunction } from "../../graphai";
export declare const propertyFilterAgent: AgentFunction<{
    include?: Array<string>;
    exclude?: Array<string>;
    alter?: Record<string, Record<string, string>>;
    inject?: Record<string, Record<string, any>>;
}>;
declare const propertyFilterAgentInfo: {
    name: string;
    agent: AgentFunction<{
        include?: string[] | undefined;
        exclude?: string[] | undefined;
        alter?: Record<string, Record<string, string>> | undefined;
        inject?: Record<string, Record<string, any>> | undefined;
    }>;
    mock: AgentFunction<{
        include?: string[] | undefined;
        exclude?: string[] | undefined;
        alter?: Record<string, Record<string, string>> | undefined;
        inject?: Record<string, Record<string, any>> | undefined;
    }>;
    samples: ({
        inputs: (string | {
            color: string;
            model: string;
            type: string;
            maker: string;
            range: number;
        })[];
        params: {
            include: string[];
            exclude?: undefined;
            alter?: undefined;
            inject?: undefined;
        };
        result: {
            color: string;
            model: string;
        };
    } | {
        inputs: (string | {
            color: string;
            model: string;
            type: string;
            maker: string;
            range: number;
        }[])[];
        params: {
            include: string[];
            exclude?: undefined;
            alter?: undefined;
            inject?: undefined;
        };
        result: {
            color: string;
            model: string;
        }[];
    } | {
        inputs: (string | {
            color: string;
            model: string;
            type: string;
            maker: string;
            range: number;
        }[])[];
        params: {
            exclude: string[];
            include?: undefined;
            alter?: undefined;
            inject?: undefined;
        };
        result: {
            type: string;
            maker: string;
            range: number;
        }[];
    } | {
        inputs: (string | {
            color: string;
            model: string;
            type: string;
            maker: string;
            range: number;
        }[])[];
        params: {
            alter: {
                color: {
                    red: string;
                    blue: string;
                };
            };
            include?: undefined;
            exclude?: undefined;
            inject?: undefined;
        };
        result: {
            color: string;
            model: string;
            type: string;
            maker: string;
            range: number;
        }[];
    } | {
        inputs: (string | {
            color: string;
            model: string;
            type: string;
            maker: string;
            range: number;
        }[])[];
        params: {
            inject: {
                maker: {
                    from: number;
                    index?: undefined;
                };
            };
            include?: undefined;
            exclude?: undefined;
            alter?: undefined;
        };
        result: {
            color: string;
            model: string;
            type: string;
            maker: string;
            range: number;
        }[];
    } | {
        inputs: (string | {
            color: string;
            model: string;
            type: string;
            maker: string;
            range: number;
        }[])[];
        params: {
            inject: {
                maker: {
                    index: number;
                    from: number;
                };
            };
            include?: undefined;
            exclude?: undefined;
            alter?: undefined;
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
