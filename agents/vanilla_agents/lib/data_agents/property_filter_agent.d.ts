import { AgentFunction } from "graphai";
export declare const propertyFilterAgent: AgentFunction<{
    include?: Array<string>;
    exclude?: Array<string>;
    alter?: Record<string, Record<string, string>>;
    inject?: Array<Record<string, any>>;
    inspect?: Array<Record<string, any>>;
    swap?: Record<string, string>;
}>;
declare const propertyFilterAgentInfo: {
    name: string;
    agent: AgentFunction<{
        include?: string[] | undefined;
        exclude?: string[] | undefined;
        alter?: Record<string, Record<string, string>> | undefined;
        inject?: Record<string, any>[] | undefined;
        inspect?: Record<string, any>[] | undefined;
        swap?: Record<string, string> | undefined;
    }>;
    mock: AgentFunction<{
        include?: string[] | undefined;
        exclude?: string[] | undefined;
        alter?: Record<string, Record<string, string>> | undefined;
        inject?: Record<string, any>[] | undefined;
        inspect?: Record<string, any>[] | undefined;
        swap?: Record<string, string> | undefined;
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
            swap?: undefined;
            inspect?: undefined;
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
            swap?: undefined;
            inspect?: undefined;
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
            swap?: undefined;
            inspect?: undefined;
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
            swap?: undefined;
            inspect?: undefined;
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
                propId: string;
                from: number;
            }[];
            include?: undefined;
            exclude?: undefined;
            alter?: undefined;
            swap?: undefined;
            inspect?: undefined;
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
                propId: string;
                from: number;
                index: number;
            }[];
            include?: undefined;
            exclude?: undefined;
            alter?: undefined;
            swap?: undefined;
            inspect?: undefined;
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
            swap: {
                maker: string;
            };
            include?: undefined;
            exclude?: undefined;
            alter?: undefined;
            inject?: undefined;
            inspect?: undefined;
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
            inspect: ({
                propId: string;
                equal: string;
                notEqual?: undefined;
                from?: undefined;
            } | {
                propId: string;
                notEqual: string;
                from: number;
                equal?: undefined;
            })[];
            include?: undefined;
            exclude?: undefined;
            alter?: undefined;
            inject?: undefined;
            swap?: undefined;
        };
        result: {
            color: string;
            model: string;
            type: string;
            maker: string;
            range: number;
            isTesla: boolean;
            isGM: boolean;
        }[];
    })[];
    description: string;
    category: string[];
    author: string;
    repository: string;
    license: string;
};
export default propertyFilterAgentInfo;
