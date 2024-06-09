export declare const computed: (nodes: Array<any>, func: any) => Promise<any>;
export declare enum NodeState {
    Executing = "executing",
    Completed = "completed"
}
export interface LogData {
    name: string;
    time: number;
    state: NodeState;
    waited?: number;
    duration?: number;
    inputs?: Array<any>;
    output?: any;
}
export interface ConductorOptions {
    verbose?: boolean;
    recordInputs?: boolean;
    recordOutput?: boolean;
}
export interface LogOptions extends ConductorOptions {
    name: string;
}
export declare class Conductor {
    options: ConductorOptions;
    startTime: number;
    logs: Array<LogData>;
    result: Record<string, any>;
    constructor(options: ConductorOptions);
    log(log: LogData, verbose: boolean | undefined): void;
    computed(nodes: Array<any>, func: any, options: LogOptions): Promise<any>;
}
