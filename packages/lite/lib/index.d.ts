export declare const computed: (nodes: Array<any>, func: any) => Promise<any>;
export declare enum NodeState {
    Executing = "executing",
    Completed = "completed"
}
export type LogData = {
    name?: string;
    time: number;
    state: NodeState;
    duration?: number;
    inputs?: Array<any>;
    output?: any;
};
export type ConductorOptions = {
    verbose?: boolean;
    recordInputs?: boolean;
    recordOutput?: boolean;
    name?: string;
};
export declare class Conductor {
    options: ConductorOptions;
    startTime: number;
    logs: Array<LogData>;
    result: Record<string, any>;
    constructor(options: ConductorOptions);
    computed(nodes: Array<any>, func: any, options?: ConductorOptions): Promise<any>;
}
