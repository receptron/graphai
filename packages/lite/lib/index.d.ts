export declare const computed: (nodes: any, func: any) => Promise<any>;
export declare class Logger {
    verbose: boolean;
    startTime: number;
    logs: Array<Record<string, any>>;
    result: Record<string, any>;
    constructor(options: Record<string, any>);
    computed(nodes: any, func: any, options?: Record<string, any>): Promise<any>;
}
