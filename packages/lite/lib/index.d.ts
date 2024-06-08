export declare const computed: (nodes: any, func: any) => Promise<any>;
export type LoggerOptions = {
    verbose?: boolean;
    recordInputs?: boolean;
    recordOutput?: boolean;
    name?: string;
};
export declare class Logger {
    options: LoggerOptions;
    startTime: number;
    logs: Array<Record<string, any>>;
    result: Record<string, any>;
    constructor(options: LoggerOptions);
    computed(nodes: any, func: any, options?: LoggerOptions): Promise<any>;
}
